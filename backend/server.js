import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// In‑memory “DB”
const users = [];

// ---------- Auth middleware ----------
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token" });
  const token = header.split(" ")[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// ---------- Auth routes ----------
app.post("/api/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: "Email already exists" });
  }
  const user = {
    id: users.length + 1,
    email,
    password,
    plan: "free" // default plan
  };
  users.push(user);
  const token = jwt.sign(
    { id: user.id, email: user.email, plan: user.plan },
    JWT_SECRET
  );
  res.json({ token });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign(
    { id: user.id, email: user.email, plan: user.plan },
    JWT_SECRET
  );
  res.json({ token });
});

// ---------- Profile route ----------
app.get("/api/profile", auth, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ email: user.email, plan: user.plan });
});

// ---------- Upgrade route (Pro unlock) ----------
app.post("/api/upgrade", auth, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  user.plan = "pro";
  const token = jwt.sign(
    { id: user.id, email: user.email, plan: user.plan },
    JWT_SECRET
  );
  res.json({ message: "Upgraded to Pro", plan: user.plan, token });
});

// ---------- Budgeting route (Free) ----------
app.post("/api/budget", auth, (req, res) => {
  const { income, expenses } = req.body;

  if (typeof income !== "number" || income <= 0) {
    return res.status(400).json({ error: "Valid income is required" });
  }
  if (!Array.isArray(expenses)) {
    return res.status(400).json({ error: "Expenses must be an array" });
  }

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
    insights.push("Your savings rate is below 10%. Increasing savings can improve long‑term security.");
  } else if (savingsRate >= 20) {
    insights.push("Great job! A savings rate above 20% is strong.");
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

// ---------- Portfolio Analyzer route (Pro only) ----------
app.post("/api/analyze", auth, (req, res) => {
  if (req.user.plan !== "pro") {
    return res.status(403).json({ error: "Portfolio Analyzer is a Pro feature. Please upgrade." });
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
    insights.push("Your largest position is reasonably sized; concentration risk looks moderate.");
  }
  if (sectors.length === 1) {
    insights.push("All your assets are in one sector. Diversifying across sectors can reduce risk.");
  }
  if (regions.length === 1) {
    insights.push("All your assets are in one region. Global diversification may improve resilience.");
  }

  res.json({
    totalValue,
    sectors,
    regions,
    insights
  });
});

// ---------- Root route ----------
app.get("/", (req, res) => {
  res.send("Vaultwise backend is running on Render!");
});

// ---------- Start server ----------
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Vaultwise running on port ${PORT}`);
});