const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./authRoutes.js");
const financeRoutes = require("./financeRoutes");

dotenv.config();

const app = express();   // ✅ MUST come before any app.use()

// CORS FIX
app.use(
  cors({
    origin: "https://theperfectnile.github.io",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.static("public")); // serves your frontend

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/finance", financeRoutes);   // ✅ now safe

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Test routes (optional)
app.get("/api/finance/summary", (req, res) => {
  res.json({
    monthlyIncome: 5000,
    monthlyExpenses: 3200,
    netSavings: 1800,
    spendingByCategory: {
      Housing: 1500,
      Food: 600,
      Transport: 300,
      Subscriptions: 200,
      Shopping: 400,
      Other: 200
    },
    insights: [
      "Your spending increased 8% compared to last month.",
      "Subscriptions make up 6% of your total expenses.",
      "You are on track to hit your savings goal in 5 months."
    ]
  });
});

app.get("/api/finance/portfolio", (req, res) => {
  res.json({
    totalValue: 24500,
    assets: [
      { asset: "AAPL", value: 8000 },
      { asset: "TSLA", value: 6000 },
      { asset: "BTC", value: 7000 },
      { asset: "Cash", value: 3500 }
    ]
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
