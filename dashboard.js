const API_BASE = "https://backend-qkz7.onrender.com/api";

/* -------------------------------
   Toast Notifications
-------------------------------- */
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => toast.classList.remove("show"), 3000);
  setTimeout(() => toast.remove(), 3500);
}

/* -------------------------------
   Collapsible Sections
-------------------------------- */
function toggleSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle("open");
}

window.toggleGroup = function(header, id) {
  const section = document.getElementById(id);
  if (!section) return;
  section.classList.toggle("open");
  header.classList.toggle("active");
};

/* -------------------------------
   Auth Helpers
-------------------------------- */
function getToken() {
  return localStorage.getItem("token");
}

async function loadUser() {
  try {
    const res = await fetch(`${API_BASE}/finance/summary`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });

    if (!res.ok) {
      logout();
      return;
    }

    return await res.json();
  } catch (err) {
    logout();
  }
}

/* -------------------------------
   Animated Number Counter
-------------------------------- */
function animateValue(id, end) {
  const el = document.getElementById(id);
  if (!el) return;

  let start = 0;
  const duration = 800;
  const step = end / (duration / 16);

  const counter = setInterval(() => {
    start += step;
    if (start >= end) {
      start = end;
      clearInterval(counter);
    }
    el.innerText = `$${Math.round(start)}`;
  }, 16);
}

/* -------------------------------
   Fallback Finance Generator
-------------------------------- */
function generateRealisticFinanceFallback() {
  const baseIncome = 4200 + Math.random() * 3800;
  const rent = 1400 + Math.random() * 800;
  const groceries = 450 + Math.random() * 250;
  const gas = 160 + Math.random() * 90;
  const utilities = 180 + Math.random() * 80;
  const subs = 60 + Math.random() * 40;
  const kids = 80 + Math.random() * 120;
  const misc = 200 + Math.random() * 250;

  const totalExpenses =
    rent + groceries + gas + utilities + subs + kids + misc;

  const savings = Math.max(0, baseIncome - totalExpenses);
  const portfolioBase = 8000 + Math.random() * 22000;
  const portfolioVolatility = (Math.random() - 0.5) * 0.12;
  const totalPortfolio = portfolioBase * (1 + portfolioVolatility);

  return {
    totalIncome: Math.round(baseIncome),
    totalExpenses: Math.round(totalExpenses),
    totalPortfolio: Math.round(totalPortfolio),
    savings: Math.round(savings)
  };
}

/* -------------------------------
   Load Dashboard Summary
-------------------------------- */
async function loadDashboard() {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch(`${API_BASE}/finance/summary`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    let data = await res.json();

    const hasRealData =
      data &&
      (data.totalIncome > 0 ||
        data.totalExpenses > 0 ||
        data.totalPortfolio > 0);

    if (!hasRealData) {
      data = generateRealisticFinanceFallback();
    }

    animateValue("totalIncome", data.totalIncome || 0);
    animateValue("totalExpenses", data.totalExpenses || 0);
    animateValue("totalPortfolio", data.totalPortfolio || 0);
  } catch (err) {
    console.error("Dashboard summary error:", err);
    showToast("Error loading dashboard summary", "error");
  }
}

/* -------------------------------
   Load Money Personality
-------------------------------- */
async function loadMoneyPersonality() {
  try {
    const res = await fetch(`${API_BASE}/money-personality/result`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const data = await res.json();

    document.getElementById("moneyPersonalityType").innerText =
      data.personalityType || "No results yet";
  } catch (err) {
    console.error("Money Personality load error:", err);
    document.getElementById("moneyPersonalityType").innerText =
      "Error loading";
  }
}

/* -------------------------------
   Save Entry
-------------------------------- */
async function saveEntry() {
  const token = getToken();
  if (!token) return;

  const payload = {
    income: Number(document.getElementById("income")?.value || 0),
    expenses: Number(document.getElementById("expenses")?.value || 0),
    portfolio: Number(document.getElementById("portfolio")?.value || 0),
    goal: Number(document.getElementById("goal")?.value || 0)
  };

  try {
    const res = await fetch(`${API_BASE}/finance/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      showToast("Entry saved!", "success");
      location.reload();
    } else {
      showToast("Failed to save entry", "error");
    }
  } catch (err) {
    console.error("Save entry error:", err);
    showToast("Error saving entry", "error");
  }
}

/* -------------------------------
   Load History
-------------------------------- */
async function loadHistory() {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch(`${API_BASE}/finance/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    let data = await res.json();
    const tbody = document.getElementById("history-body");
    if (!tbody) return;

    if (!Array.isArray(data) || data.length === 0) {
      const now = new Date();
      const months = [];
      let income = 4200 + Math.random() * 3800;
      let portfolio = 8000 + Math.random() * 22000;

      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const label = d.toLocaleString("default", {
          month: "short",
          year: "2-digit"
        });

        const incomeDrift = (Math.random() - 0.3) * 0.04;
        income = income * (1 + incomeDrift);

        const rent = 1400 + Math.random() * 800;
        const groceries = 450 + Math.random() * 250;
        const gas = 160 + Math.random() * 90;
        const utilities = 180 + Math.random() * 80;
        const subs = 60 + Math.random() * 40;
        const kids = 80 + Math.random() * 120;
        const misc = 200 + Math.random() * 250;
        const expenses =
          rent + groceries + gas + utilities + subs + kids + misc;

        const goal = income * 0.15;

        const marketMove = (Math.random() - 0.45) * 0.12;
        portfolio = portfolio * (1 + marketMove);

        months.push({
          month: label,
          income: Math.round(income),
          expenses: Math.round(expenses),
          portfolio: Math.round(portfolio),
          goal: Math.round(goal)
        });
      }

      data = months;
    }

    tbody.innerHTML = data
      .map(
        (row) => `
      <tr>
        <td>${row.month}</td>
        <td>$${row.income}</td>
        <td>$${row.expenses}</td>
        <td>$${row.portfolio}</td>
        <td>$${row.goal}</td>
      </tr>`
      )
      .join("");
  } catch (err) {
    console.error("History load error:", err);
    showToast("Error loading history", "error");
  }
}

/* -------------------------------
   10‑Question Survey Engine
-------------------------------- */
function calculateSurvey() {
  const get = (id) => Number(document.getElementById(id).value);

  const answers = {
    q1: get("q1"),
    q2: get("q2"),
    q3: get("q3"),
    q4: get("q4"),
    q5: get("q5"),
    q6: get("q6"),
    q7: get("q7"),
    q8: get("q8"),
    q9: get("q9"),
    q10: get("q10")
  };

  let advice = "";

  if (answers.q1 >= 4)
    advice +=
      "🍽️ You rely on eating out often. In today’s prices, that can add $120–$220/month.<br><br>";
  if (answers.q2 <= 2)
    advice +=
      "📝 Try planning at least one or two meals before shopping.<br><br>";
  if (answers.q3 >= 4)
    advice += "🥗 Food waste is high.<br><br>";
  if (answers.q4 >= 4)
    advice += "🍳 Convenience foods are common.<br><br>";

  if (answers.q5 <= 2)
    advice += "🏋🏾 Exercise is low.<br><br>";
  if (answers.q6 >= 4)
    advice += "⚡ Energy levels are low.<br><br>";

  if (answers.q7 <= 2)
    advice += "💳 You rarely review statements.<br><br>";
  if (answers.q8 <= 2)
    advice += "💰 Saving is inconsistent.<br><br>";
  if (answers.q9 >= 4)
    advice += "🛍️ Impulse spending is high.<br><br>";

  if (answers.q10 >= 4)
    advice += "🧒🏾 Kid spending is high.<br><br>";

  const eatingOutFactor = answers.q1;
  const mealPlanningFactor = 6 - answers.q2;
  const wasteFactor = answers.q3;
  const convenienceFactor = answers.q4;

  const baseFoodCost = 350;
  const inflationMultiplier = 1.25;
  let inflationPenalty =
    (eatingOutFactor * 18 +
      mealPlanningFactor * 10 +
      wasteFactor * 12 +
      convenienceFactor * 14) *
    1.1;

  inflationPenalty = Math.max(0, Math.round(inflationPenalty));
  const currentFoodCost = Math.round(baseFoodCost * inflationMultiplier);
  const realisticFoodSpend = currentFoodCost + inflationPenalty;

  const impulseRisk = answers.q9 * 20;
  const savingsConsistency = answers.q8 * 20;

  const summaryBlock = `
    <hr>
    <strong>Economy‑Aware Snapshot:</strong><br>
    • Estimated monthly food spend: <strong>$${realisticFoodSpend}</strong><br>
    • Impulse‑spending risk: <strong>${impulseRisk}/100</strong><br>
    • Savings consistency: <strong>${savingsConsistency}/100</strong><br><br>
  `;

  document.getElementById("surveyResults").innerHTML =
    advice + summaryBlock;

  const personality = getFinancialPersonality(answers);
  document.getElementById("personalityType").innerHTML =
    `<strong>${personality.type}</strong><br>${personality.description}`;

  const lifeScore = calculateLifeScore(answers);
  document.getElementById("lifeScoreValue").innerHTML = `${lifeScore} / 100`;

  const microHabits = generateMicroHabits(personality, lifeScore, answers);
  document.getElementById("microHabitsList").innerHTML = microHabits
    .map((h) => `<li>${h}</li>`)
    .join("");

  const weeklyReport = generateWeeklyReport(
    answers,
    personality,
    lifeScore
  );
  document.getElementById("weeklyReportText").innerHTML = weeklyReport;

  const kidBudget = calculateKidBudget(answers, lifeScore);
  document.getElementById(
    "kidBudgetValue"
  ).innerHTML = `Recommended: <strong>$${kidBudget.min} – $${kidBudget.max}</strong>`;

  const surveySnapshot = {
    timestamp: Date.now(),
    lifeScore,
    personality: personality.type,
    impulseRisk,
    savingsConsistency,
    realisticFoodSpend,
    kidBudget
  };

  let history = JSON.parse(localStorage.getItem("surveyHistory") || "[]");
  history.unshift(surveySnapshot);
  localStorage.setItem("surveyHistory", JSON.stringify(history));
}

/* -------------------------------
   Personality Engine
-------------------------------- */
function getFinancialPersonality(a) {
  if (a.q8 === 1 && a.q9 >= 4)
    return {
      type: "The Emotional Spender",
      description:
        "You often spend to feel better in the moment."
    };

  if (a.q7 === 1 && a.q2 <= 2)
    return {
      type: "The Free Spirit",
      description:
        "You prefer flexibility over structure."
    };

  if (a.q5 === 1 && a.q6 >= 4)
    return {
      type: "The Overextended Hustler",
      description:
        "You carry a lot and run low on energy."
    };

  if (a.q10 >= 4)
    return {
      type: "The Stability‑Driven Provider",
      description:
        "You love giving to your kids."
    };

  if (a.q2 >= 4 && a.q8 >= 3)
    return {
      type: "The Strategic Saver",
      description:
        "You value structure and consistency."
    };

  return {
    type: "The Cautious Optimizer",
    description:
      "You’re building solid habits and adjusting as you go."
  };
}

/* -------------------------------
   Life Score Engine
-------------------------------- */
function calculateLifeScore(a) {
  let score = 0;

  score += (6 - a.q1) * 2;
  score += a.q2 * 2;
  score += (6 - a.q3) * 2;
  score += (6 - a.q4) * 2;

  score += a.q5 * 3;
  score += (6 - a.q6) * 2;

  score += a.q7 * 3;
  score += a.q8 * 3;
  score += (6 - a.q9) * 3;

  score += (6 - a.q10);

  score = Math.min(100, Math.max(0, Math.round(score)));
  if (score > 90) score = 90 + Math.round((score - 90) * 0.5);
  if (score < 20) score = 20 - Math.round((20 - score) * 0.5);

  return score;
}

/* -------------------------------
   Micro‑Habits Engine
-------------------------------- */
function generateMicroHabits(personality, lifeScore, a) {
  const habits = [];

  if (personality.type === "The Emotional Spender") {
    habits.push("Pause 24 hours before any non‑essential purchase.");
    habits.push("Open your bank app once a day.");
  }

  if (personality.type === "The Free Spirit") {
    habits.push("Plan one dinner this week.");
    habits.push("Clean out one subscription.");
  }

  if (personality.type === "The Overextended Hustler") {
    habits.push("Take a 5‑minute walk.");
    habits.push("Drink water before buying takeout.");
  }

  if (personality.type === "The Stability‑Driven Provider") {
    habits.push("Set a kid fun budget.");
    habits.push("Do one free self‑care activity.");
  }

  if (personality.type === "The Strategic Saver") {
    habits.push("Review your top 3 spending categories.");
    habits.push("Prep ingredients for one meal.");
  }

  if (personality.type === "The Cautious Optimizer") {
    habits.push("Improve one habit by 1% today.");
    habits.push("Track one purchase.");
  }

  if (lifeScore < 40) {
    habits.push("Drink water and move for 5 minutes.");
  } else if (lifeScore < 70) {
    habits.push("Plan one meal for tomorrow.");
  } else {
    habits.push("Celebrate one small win.");
  }

  if (a.q1 >= 4) habits.push("Swap one eating‑out meal for a home meal.");
  if (a.q5 <= 2) habits.push("Do a 3‑minute stretch.");
  if (a.q9 >= 4) habits.push("Unsubscribe from one marketing email.");

  return habits.slice(0, 3);
}

/* -------------------------------
   Weekly Report Engine
-------------------------------- */
function generateWeeklyReport(a, personality, lifeScore) {
  let report = `<strong>Personality:</strong> ${personality.type}`;
