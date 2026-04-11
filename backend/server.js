import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// In-memory “DB”
const users = [];
const portfolios = [];

// ---------- Auth middleware ----------
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ---------- Auth routes ----------
app.post('/api/register', (req, res) => {
  const { email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  const user = { id: users.length + 1, email, password, plan: 'free' };
  users.push(user);
  const token = jwt.sign({ id: user.id, email: user.email, plan: user.plan }, JWT_SECRET);
  res.json({ token });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email, plan: user.plan }, JWT_SECRET);
  res.json({ token });
});

// ---------- Portfolio routes ----------

// Save / replace current portfolio
app.post('/api/portfolio', auth, (req, res) => {
  const { assets } = req.body;
  if (!Array.isArray(assets) || assets.length === 0) {
    return res.status(400).json({ error: 'Assets array required' });
  }

  // Remove old portfolios for this user (simple version)
  for (let i = portfolios.length - 1; i >= 0; i--) {
    if (portfolios[i].userId === req.user.id) portfolios.splice(i, 1);
  }

  const portfolio = {
    id: portfolios.length + 1,
    userId: req.user.id,
    assets,
    createdAt: new Date()
  };
  portfolios.push(portfolio);
  res.json({ message: 'Portfolio saved', portfolio });
});

// Analyze portfolio
app.get('/api/analyze', auth, (req, res) => {
  const portfolio = portfolios.find(p => p.userId === req.user.id);
  if (!portfolio) return res.status(404).json({ error: 'No portfolio found' });

  const assets = portfolio.assets;
  const totalValue = assets.reduce((sum, a) => sum + (a.value || 0), 0);

  // Sector allocation
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

  // Simple concentration metric
  const largest = Math.max(...assets.map(a => a.value || 0));
  const largestPct = totalValue ? (largest / totalValue * 100) : 0;

  const insights = [];
  if (largestPct > 25) {
    insights.push('Your largest position is over 25% of your portfolio. Consider reducing concentration risk.');
  } else {
    insights.push('Your largest position is reasonably sized; concentration risk looks moderate.');
  }
  if (sectors.length === 1) {
    insights.push('All your assets are in one sector. Diversifying across sectors can reduce risk.');
  }
  if (regions.length === 1) {
    insights.push('All your assets are in one region. Global diversification may improve resilience.');
  }

  res.json({
    totalValue,
    sectors,
    regions,
    insights
  });
});

// Placeholder upgrade route (connect Stripe later)
app.post('/api/upgrade', auth, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  user.plan = 'pro';
  res.json({ message: 'Upgraded to Pro (placeholder)', plan: user.plan });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Portfolio Analyzer running on port 4000`));