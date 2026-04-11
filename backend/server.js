import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ---------- Root route ----------
app.get("/", (req, res) => {
  res.send("Backend is running on Render!");
});

// ---------- Analyze portfolio (no auth) ----------
app.post("/api/analyze", (req, res) => {
  const { portfolio } = req.body;

  if (!Array.isArray(portfolio) || portfolio.length === 0) {
    return res.status(400).json({ error: "Portfolio array is required" });
  }

  const assets = portfolio;
  const totalValue = assets.reduce((sum, a) => sum + (a.value || 0), 0);

  // Sector & region allocation
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
    insights.push(
      "Your largest position is over 25% of your portfolio. Consider reducing concentration risk."
    );
  } else {
    insights.push(
      "Your largest position is reasonably sized; concentration risk looks moderate."
    );
  }
  if (sectors.length === 1) {
    insights.push(
      "All your assets are in one sector. Diversifying across sectors can reduce risk."
    );
  }
  if (regions.length === 1) {
    insights.push(
      "All your assets are in one region. Global diversification may improve resilience."
    );
  }

  res.json({
    totalValue,
    sectors,
    regions,
    insights
  });
});

// ---------- Start server (Render-compatible) ----------
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Portfolio Analyzer running on port ${PORT}`);
});
