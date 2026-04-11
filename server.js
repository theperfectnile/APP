import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

/* ------------------ MONGODB CONNECTION ------------------ */

mongoose
  .connect(process.env.MONGO_URI, { dbName: "vaultwise" })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

/* ------------------ USER MODEL ------------------ */

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  plan: { type: String, default: "free" }, // free | trial | pro
  trialStart: { type: Date, default: null }
});

const User = mongoose.model("User", userSchema);

/* ------------------ HELPERS ------------------ */

function issueToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      plan: user.plan,
      trialStart: user.trialStart
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
}

function applyTrialExpiry(user) {
  if (user.plan === "trial" && user.trialStart) {
    const now = new Date();
    const diffDays =
      (now - new Date(user.trialStart)) / (1000 * 60 * 60 * 24);

    if (diffDays > 7) {
      user.plan = "free";
      user.trialStart = null;
    }
  }
}

/* ------------------ AUTH MIDDLEWARE ------------------ */

async function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ error: "User not found" });

    applyTrialExpiry(user);
    await user.save();

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/* ------------------ AUTH ROUTES ------------------ */

app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ error: "Email already exists" });

  const user = await User.create({
    email,
    password,
    plan: "free",
    trialStart: null
  });

  const token = issueToken(user);
  res.json({ token });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  applyTrialExpiry(user);
  await user.save();

  const token = issueToken(user);
  res.json({ token });
});

/* ------------------ PROFILE ------------------ */

app.get("/api/profile", auth, (req, res) => {
  const user = req.user;
  res.json({
    email: user.email,
    plan: user.plan,
    trialStart: user.trialStart
  });
});

/* ------------------ START TRIAL ------------------ */

app.post("/api/start-trial", auth, async (req, res) => {
  const user = req.user;

  if (user.plan === "pro")
    return res.status(400).json({ error: "Already Pro" });

  if (user.plan === "trial")
    return res.status(400).json({ error: "Trial already active" });

  user.plan = "trial";
  user.trialStart = new Date();
  await user.save();

  const token = issueToken(user);

  res.json({
    message: "Trial started",
    plan: user.plan,
    trialStart: user.trialStart,
    token
  });
});

/* ------------------ UPGRADE ------------------ */

app.post("/api/upgrade", auth, async (req, res) => {
  const user = req.user;

  user.plan = "pro";
  user.trialStart = null;
  await user.save();

  const token = issueToken(user);

  res.json({ message: "Upgraded to Pro", plan: user.plan, token });
});

/* ------------------ BUDGET ------------------ */

app.post("/api/budget", auth, (req, res) => {
  const { income, expenses } = req.body;

  if (!income || income <= 0)
    return res.status(400).json({ error: "Valid income required" });

  const totalExpenses = expenses.reduce(
    (sum, e) => sum + (e.amount || 0),
    0
  );

  const savings = income - totalExpenses;
  const savingsRate = ((savings / income) * 100).toFixed(2);

  const categoryMap = {};
  expenses.forEach(e => {
    categoryMap[e.category] =
      (categoryMap[e.category] || 0) + (e.amount || 0);
  });

  const categories = Object.entries(categoryMap).map(([cat, val]) => ({
    category: cat,
    percent: ((val / income) * 100).toFixed(2)
  }));

  const insights = [];
  if (savings < 0) insights.push("You are overspending.");
  if (savingsRate < 10) insights.push("Savings rate is low.");
  if (savingsRate >= 20) insights.push("Strong savings rate.");

  res.json({
    income,
    totalExpenses,
    savings,
    savingsRate,
    categories,
    insights
  });
});

/* ------------------ PORTFOLIO ------------------ */

app.post("/api/analyze", auth, (req, res) => {
  const user = req.user;

  if (user.plan === "free")
    return res.status(403).json({
      error: "Portfolio Analyzer requires Trial or Pro"
    });

  const { portfolio } = req.body;

  const totalValue = portfolio.reduce(
    (sum, a) => sum + (a.value || 0),
    0
  );

  const sectorMap = {};
  const regionMap = {};

  portfolio.forEach(a => {
    sectorMap[a.sector] = (sectorMap[a.sector] || 0) + a.value;
    regionMap[a.region] = (regionMap[a.region] || 0) + a.value;
  });

  const sectors = Object.entries(sectorMap).map(([s, v]) => ({
    sector: s,
    percent: ((v / totalValue) * 100).toFixed(2)
  }));

  const regions = Object.entries(regionMap).map(([r, v]) => ({
    region: r,
    percent: ((v / totalValue) * 100).toFixed(2)
  }));

  const insights = [];
  const largest = Math.max(...portfolio.map(a => a.value));
  if ((largest / totalValue) * 100 > 25)
    insights.push("High concentration risk.");

  res.json({
    totalValue,
    sectors,
    regions,
    insights
  });
});

/* ------------------ ROOT ------------------ */

app.get("/", (req, res) => {
  res.send("Vaultwise backend running with MongoDB");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);