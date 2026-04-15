import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./authRoutes.js";
dotenv.config();
const app = express();

const express = require("express");
const cors = require("cors");

app.use(
  cors({
    origin: "https://theperfectnile.github.io",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const app = express();
const cors = require("cors");

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

app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));
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

app.listen(5000, () => console.log("Server running on port 5000"));
