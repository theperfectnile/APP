import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// In‑memory “DB” (for demo)
const users = [];

/* ---------- Helpers ---------- */

function issueToken(user) {
  // Token valid for 24 hours
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      plan: user.plan,          // "free" | "trial" | "pro"
      trialStart: user.trialStart || null
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
}

function applyTrialExpiry(user) {
  if (user.plan === "trial" && user.trialStart) {
    const start = new Date(user.trialStart);
    const now = new Date();
    const diffDays = (now - start) / (1000 * 60 * 60 * 24);
    if (diffDays > 7) {
      user.plan = "free";
      user.trialStart = null;
    }
  }
}

/* ---------- Auth middleware ---------- */

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token" });

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.id);
    if (!user) return res.status(401).json({ error: "User not found" });

    applyTrialExpiry(user);
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/* ---------- Auth routes ---------- */

app.post("/api/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  if (users.find(u => u.email === email))
    return res.status(400).json({ error: "Email already exists" });

  const user = {
    id: users.length + 1,
    email,
    password,
    plan: "free",       // default
    trialStart: null
  };

  users.push(user);
  const token = issueToken(user);
  res.json({ token });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  applyTrialExpiry(user);
  const token = issueToken(user);
  res.json({ token });
});

/* ---------- Profile ---------- */

app.get("/api/profile", auth, (req, res) => {
  const user = req.user;
  res.json({
    email: user.email,
    plan: user.plan,
    trialStart: user.trialStart
  });
});

/* ---------- Start 7‑day trial (no billing yet) ---------- */

app.post("/api/start-trial", auth, (req, res) => {
  const user = req.user;
  applyTrialExpiry(user);

  if (user.plan === "pro") {
    return res.status(400).json({ error: "You are already Pro." });
  }
  if (user.plan === "trial") {
    return res.status(400).json({ error: "Trial already active." });
  }

  user.plan = "trial";
  user.trialStart = new Date().toISOString();

  const token = issueToken(user);
  res.json({
    message: "7‑day trial started.",
    plan: user.plan,
    trialStart: user.trialStart,
    token
  });
});

/* ---------- Upgrade to Pro (manual for now) ---------- */

app.post("/api/upgrade", auth, (req, res) => {
  const user = req.user;
  user.plan = "pro";
  user.trialStart = null;

  const token = issueToken(user);
  res.json({ message: "Upgraded to Pro", plan: user.plan, token });
});

/* ---------- Budget route (Free) ---------- */

app.post("/api/budget", auth, (req, res) => {
  const { income, expenses } = req.body;

  if (typeof income !== "number" || income <= 0)
    return res.status(400).json({ error: "Valid income is required" });

  if (!Array.isArray(expenses))
    return res.status(400).json({ error: "Expenses must be an array" });

  const totalExpenses = expenses.reduce(
    (sum, e) => sum + (e.amount || 0),
    0
  );
  const savings = income - totalExpenses;
  const savingsRate = income ? (savings / income) * 100 : 0;

  const categoryMap = {};
  expenses.forEach(e => {
    const v = e.amount || 0;
    categoryMap[e.category] = (categoryMap[e.category] || 0) + v;
  });

  const categories = Object.entries(categoryMap).map(([category, value]) => ({
    category,
    percent: income ? (value / income * 100).toFixed(2) : 0
  }));

  const insights = [];
  if (savings < 0) {
    insights.push("You are spending more than you earn. Consider cutting discretionary expenses.");
  } else if (savingsRate < 10) {
    insights.push("Your savings rate is below 10%. Aim for at least 15–20% over time.");
  } else if (savingsRate >= 20) {
    insights.push("Strong savings rate. You’re building a solid financial cushion.");
  }

  const bigSpenders = categories
    .filter(c => c.percent > 20)
    .map(c => c.category);

  if (bigSpenders.length > 0) {
    insights.push(
      `You spend heavily on: ${bigSpenders.join(
        ", "
      )}. Review these categories for potential cuts.`
    );
  }

  res.json({
    income,
    totalExpenses,
    savings,
    savingsRate: savingsRate.toFixed(2),
    categories,
    insights
  });
});

/* ---------- Portfolio Analyzer (Trial + Pro only) ---------- */

app.post("/api/analyze", auth, (req, res) => {
  const user = req.user;
  applyTrialExpiry(user);

  if (user.plan !== "pro" && user.plan !== "trial") {
    return res.status(403).json({
      error: "Portfolio Analyzer is available only during trial or with Pro. Start a trial or upgrade."
    });
  }

  const { portfolio } = req.body;
  if (!Array.isArray(portfolio) || portfolio.length === 0) {
    return res.status(400).json({ error: "Portfolio array is required" });
  }

  const assets = portfolio;
  const totalValue = assets.reduce((sum, a) => sum + (a.value || 0), 0);

  const sectorMap = {};
  const regionMap = {};
  assets.forEach(a => {
    const v = a.value || 0;
    sectorMap[a.sector] = (sectorMap[a.sector] || 0) + v;
    regionMap[a.region] = (regionMap[a.region] || 0) + v;
  });

  const sectors = Object.entries(sectorMap).map(([sector, value]) => ({
    sector,
    percent: totalValue ? (value / totalValue * 100).toFixed(2) : 0
  }));

  const regions = Object.entries(regionMap).map(([region, value]) => ({
    region,
    percent: totalValue ? (value / totalValue * 100).toFixed(2) : 0
  }));

  const largest = Math.max(...assets.map(a => a.value || 0));
  const largestPct = totalValue ? (largest / totalValue * 100) : 0;

  const insights = [];
  if (largestPct > 25) {
    insights.push("Your largest position is over 25% of your portfolio. Consider reducing concentration risk.");
  } else {
    insights.push("Your largest position size looks reasonable; concentration risk is moderate.");
  }
  if (sectors.length === 1) {
    insights.push("All assets are in one sector. Diversifying across sectors can reduce risk.");
  }
  if (regions.length === 1) {
    insights.push("All assets are in one region. Adding global exposure can improve resilience.");
  }

  res.json({
    totalValue,
    sectors,
    regions,
    insights
  });
});

/* ---------- Root ---------- */

app.get("/", (req, res) => {
  res.send("Vaultwise backend is running.");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Vaultwise running on port ${PORT}`);
});
