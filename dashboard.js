const API_BASE = "https://backend-qkz7.onrender.com/api";

// -------------------------------
// Toast Notifications
// -------------------------------
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => toast.classList.remove("show"), 3000);
  setTimeout(() => toast.remove(), 3500);
}

// -------------------------------
// Collapsible Sections
// -------------------------------
function toggleSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle("open");
}
function toggleGroup(header, id) {
  const section = document.getElementById(id);
  section.classList.toggle("open");
  header.classList.toggle("open");
}

// -------------------------------
// Auth Helpers
// -------------------------------
function getToken() {
  return localStorage.getItem("token");
}

async function loadUser() {
  try {
    const res = await fetch(`${API}/api/finance/summary`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });

    if (!res.ok) {
      logout(); // token invalid → log out
      return;
    }

    const data = await res.json();
    return data; // user is authenticated
  } catch (err) {
    logout();
  }
}

// -------------------------------
// Animated Number Counter
// -------------------------------
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

// -------------------------------
// Helper: Fallback realistic finance
// -------------------------------
function generateRealisticFinanceFallback() {
  // Rough US‑style ranges, inflation‑aware
  const baseIncome = 4200 + Math.random() * 3800; // 4.2k–8k
  const rent = 1400 + Math.random() * 800;
  const groceries = 450 + Math.random() * 250; // food inflation
  const gas = 160 + Math.random() * 90;
  const utilities = 180 + Math.random() * 80;
  const subs = 60 + Math.random() * 40;
  const kids = 80 + Math.random() * 120;
  const misc = 200 + Math.random() * 250;

  const totalExpenses =
    rent + groceries + gas + utilities + subs + kids + misc;

  const savings = Math.max(0, baseIncome - totalExpenses);
  const portfolioBase = 8000 + Math.random() * 22000;
  const portfolioVolatility = (Math.random() - 0.5) * 0.12; // ±12%
  const totalPortfolio = portfolioBase * (1 + portfolioVolatility);

  return {
    totalIncome: Math.round(baseIncome),
    totalExpenses: Math.round(totalExpenses),
    totalPortfolio: Math.round(totalPortfolio),
    savings: Math.round(savings)
  };
}

// -------------------------------
// Load Dashboard Summary
// -------------------------------
async function loadDashboard() {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch(`${API_BASE}/finance/summary`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    let data = await res.json();

    // If backend has no meaningful data, generate realistic fallback
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

// -------------------------------
// Load Money Personality Result
// -------------------------------
async function loadMoneyPersonality() {
  try {
    const res = await fetch(`${API_BASE}/money-personality/result`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const data = await res.json();

    if (data.personalityType) {
      document.getElementById("moneyPersonalityType").innerText =
        data.personalityType;
    } else {
      document.getElementById("moneyPersonalityType").innerText =
        "No results yet";
    }
  } catch (err) {
    console.error("Money Personality load error:", err);
    document.getElementById("moneyPersonalityType").innerText =
      "Error loading";
  }
}

// -------------------------------
// Save Entry
// -------------------------------
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

// -------------------------------
// Load History
// -------------------------------
async function loadHistory() {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch(`${API_BASE}/finance/all`, {
      headers: { Authorization: { Authorization: `Bearer ${token}` }.Authorization }
    });

    let data = await res.json();
    const tbody = document.getElementById("history-body");
    if (!tbody) return;

    // If no history, generate a realistic 12‑month timeline
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

        // simulate mild growth + inflation
        const incomeDrift = (Math.random() - 0.3) * 0.04; // -3% to +1%
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

        const goal = income * 0.15; // 15% savings goal

        const marketMove = (Math.random() - 0.45) * 0.12; // slight downward bias
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

// -------------------------------
// Survey Engine (10‑Question)
// -------------------------------
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

  // Meal Planning / Food Inflation
  if (answers.q1 >= 4)
    advice +=
      "🍽️ You rely on eating out often. In today’s prices, that can add $120–$220/month vs cooking at home.<br><br>";
  if (answers.q2 <= 2)
    advice +=
      "📝 Try planning at least one or two meals before shopping — this can cut grocery waste by 10–20%.<br><br>";
  if (answers.q3 >= 4)
    advice +=
      "🥗 Food waste is high. With current grocery prices, even $15/week wasted is ~$60/month.<br><br>";
  if (answers.q4 >= 4)
    advice +=
      "🍳 Convenience foods are common. Swapping 2–3 convenience meals for simple home meals can save $80–$150/month.<br><br>";

  // Exercise / Energy
  if (answers.q5 <= 2)
    advice +=
      "🏋🏾 Exercise is low. Even 5–10 minutes of movement can improve energy and reduce stress‑spending.<br><br>";
  if (answers.q6 >= 4)
    advice +=
      "⚡ Energy levels are low. Poor sleep and stress often lead to more takeout and impulse buys.<br><br>";

  // Money Habits / Inflation Pressure
  if (answers.q7 <= 2)
    advice +=
      "💳 You rarely review statements. In a subscription‑heavy world, this is where silent money leaks hide.<br><br>";
  if (answers.q8 <= 2)
    advice +=
      "💰 Saving is inconsistent. Even $10–$25/week builds a small buffer against rising prices.<br><br>";
  if (answers.q9 >= 4)
    advice +=
      "🛍️ Impulse spending is high. With current costs, a few unplanned purchases can erase an entire week of savings.<br><br>";

  // Kid Spending
  if (answers.q10 >= 4)
    advice +=
      "🧒🏾 Kid spending is high. Setting a clear kid fun budget keeps joy without wrecking your month.<br><br>";

  // Inflation‑aware summary metrics
  const eatingOutFactor = answers.q1; // 1–5
  const mealPlanningFactor = 6 - answers.q2; // low planning → higher cost
  const wasteFactor = answers.q3;
  const convenienceFactor = answers.q4;

  const baseFoodCost = 350; // baseline older‑economy monthly food
  const inflationMultiplier = 1.25; // rough 25% higher vs pre‑inflation
  let inflationPenalty =
    (eatingOutFactor * 18 +
      mealPlanningFactor * 10 +
      wasteFactor * 12 +
      convenienceFactor * 14) *
    1.1;

  inflationPenalty = Math.max(0, Math.round(inflationPenalty));
  const currentFoodCost = Math.round(baseFoodCost * inflationMultiplier);
  const realisticFoodSpend = currentFoodCost + inflationPenalty;

  const impulseRisk = answers.q9 * 20; // 20–100
  const savingsConsistency = answers.q8 * 20; // 20–100

  const summaryBlock = `
    <hr>
    <strong>Economy‑Aware Snapshot:</strong><br>
    • Estimated monthly food spend in today’s prices: <strong>$${realisticFoodSpend}</strong><br>
    • Extra cost vs older prices: <strong>~$${Math.max(
      0,
      realisticFoodSpend - baseFoodCost
    )}/month</strong><br>
    • Impulse‑spending risk: <strong>${impulseRisk}/100</strong><br>
    • Savings consistency: <strong>${savingsConsistency}/100</strong><br><br>
    <em>Small habit shifts (meal planning, fewer takeout orders, canceling 1–2 subscriptions) can free up $100–$250/month in this economy.</em>
  `;

  document.getElementById("surveyResults").innerHTML = advice + summaryBlock;

  const personality = getFinancialPersonality(answers);
  document.getElementById("personalityType").innerHTML =
    `<strong>${personality.type}</strong><br>${personality.description}`;

  const lifeScore = calculateLifeScore(answers);
  document.getElementById("lifeScoreValue").innerHTML = `${lifeScore} / 100`;

  const microHabits = generateMicroHabits(personality, lifeScore, answers);
  document.getElementById("microHabitsList").innerHTML = microHabits
    .map((h) => `<li>${h}</li>`)
    .join("");

  const weeklyReport = generateWeeklyReport(answers, personality, lifeScore);
  document.getElementById("weeklyReportText").innerHTML = weeklyReport;

  const kidBudget = calculateKidBudget(answers, lifeScore);
  document.getElementById(
    "kidBudgetValue"
  ).innerHTML = `Recommended: <strong>$${kidBudget.min} – $${kidBudget.max}</strong>`;
}
// -------------------------------
// SAVE SURVEY HISTORY FOR REPORTS
// -------------------------------
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
// -------------------------------
// Personality Engine
// -------------------------------
function getFinancialPersonality(a) {
  // Re‑framed to feel more like real‑world financial personas
  if (a.q8 === 1 && a.q9 >= 4)
    return {
      type: "The Emotional Spender",
      description:
        "You often spend to feel better in the moment. In a high‑cost economy, small guardrails protect you from regret."
    };

  if (a.q7 === 1 && a.q2 <= 2)
    return {
      type: "The Free Spirit",
      description:
        "You prefer flexibility over structure. Light routines around bills and food can keep inflation from sneaking up on you."
    };

  if (a.q5 === 1 && a.q6 >= 4)
    return {
      type: "The Overextended Hustler",
      description:
        "You carry a lot and run low on energy. When you’re exhausted, convenience spending and takeout quietly climb."
    };

  if (a.q10 >= 4)
    return {
      type: "The Stability‑Driven Provider",
      description:
        "You love giving to your kids. A clear kid budget keeps generosity strong without sacrificing long‑term stability."
    };

  if (a.q2 >= 4 && a.q8 >= 3)
    return {
      type: "The Strategic Saver",
      description:
        "You value structure and consistency. With rising prices, your planning mindset is a real advantage."
    };

  return {
    type: "The Cautious Optimizer",
    description:
      "You’re building solid habits and adjusting as you go. In this economy, steady, realistic progress beats perfection."
  };
}

// -------------------------------
// Life Score Engine
// -------------------------------
function calculateLifeScore(a) {
  let score = 0;

  // Food + planning (higher eating out / waste lowers score)
  score += (6 - a.q1) * 2;
  score += a.q2 * 2;
  score += (6 - a.q3) * 2;
  score += (6 - a.q4) * 2;

  // Health / energy
  score += a.q5 * 3;
  score += (6 - a.q6) * 2;

  // Money habits
  score += a.q7 * 3;
  score += a.q8 * 3;
  score += (6 - a.q9) * 3;

  // Kid spending pressure
  score += (6 - a.q10);

  // Slightly compress extremes to feel more realistic
  score = Math.min(100, Math.max(0, Math.round(score)));
  if (score > 90) score = 90 + Math.round((score - 90) * 0.5);
  if (score < 20) score = 20 - Math.round((20 - score) * 0.5);

  return score;
}

// -------------------------------
// Micro‑Habits Engine
// -------------------------------
function generateMicroHabits(personality, lifeScore, a) {
  const habits = [];

  if (personality.type === "The Emotional Spender") {
    habits.push("Pause 24 hours before any non‑essential purchase.");
    habits.push("Open your bank app once a day and just look, no judgment.");
  }

  if (personality.type === "The Free Spirit") {
    habits.push("Plan just one dinner this week before you shop.");
    habits.push("Do a 2‑minute wallet or email subscription clean‑out.");
  }

  if (personality.type === "The Overextended Hustler") {
    habits.push("Take a 5‑minute walk away from screens.");
    habits.push("Drink a full glass of water before buying takeout.");
  }

  if (personality.type === "The Stability‑Driven Provider") {
    habits.push("Set a clear kid fun budget for this week (even $15–$25).");
    habits.push("Do one small act of self‑care that costs $0.");
  }

  if (personality.type === "The Strategic Saver") {
    habits.push("Review your top 3 spending categories for the week.");
    habits.push("Prep ingredients for one home‑cooked meal tomorrow.");
  }

  if (personality.type === "The Cautious Optimizer") {
    habits.push("Improve one habit by 1% today (one less swipe, one more check‑in).");
    habits.push("Track just one purchase in a note or app.");
  }

  if (lifeScore < 40) {
    habits.push("Drink one bottle of water and do 5 minutes of movement.");
    habits.push("Open your bank app and look at your balance without judgment.");
  } else if (lifeScore < 70) {
    habits.push("Plan one meal for tomorrow to dodge last‑minute takeout.");
    habits.push("Review your last 3 transactions.");
  } else {
    habits.push("Celebrate one small win from this week.");
    habits.push("Prep tomorrow’s breakfast or lunch at home.");
  }

  if (a.q1 >= 4) habits.push("Swap one eating‑out meal for a simple home meal this week.");
  if (a.q5 <= 2) habits.push("Do a 3‑minute stretch before bed.");
  if (a.q9 >= 4) habits.push("Unsubscribe from one marketing email that tempts you to spend.");

  return habits.slice(0, 3);
}

// -------------------------------
// Weekly Report Engine
// -------------------------------
function generateWeeklyReport(a, personality, lifeScore) {
  let report = `<strong>Personality:</strong> ${personality.type}<br>${personality.description}<br><br>`;

  if (lifeScore < 40)
    report +=
      "You're in a rebuilding phase. In this economy, small, repeatable habits matter more than big, perfect changes.<br><br>";
  else if (lifeScore < 70)
    report +=
      "You're making progress. Tightening a few key habits can free up real money each month.<br><br>";
  else
    report +=
      "Your habits are strong. Focus on protecting your progress against rising costs and lifestyle creep.<br><br>";

  report += "<strong>Behavior Patterns:</strong><br>";

  if (a.q1 >= 4) report += "• You rely on eating out often, which is expensive with current prices.<br>";
  if (a.q2 <= 2) report += "• Meal planning is inconsistent, which raises grocery and takeout costs.<br>";
  if (a.q3 >= 4) report += "• Food waste is high, meaning money is literally going in the trash.<br>";
  if (a.q4 >= 4) report += "• Convenience foods are common, trading time for higher prices.<br>";
  if (a.q5 <= 2) report += "• Exercise is low, which can increase stress and emotional spending.<br>";
  if (a.q6 >= 4) report += "• Energy levels are low, making convenience spending more tempting.<br>";
  if (a.q7 <= 2) report += "• You rarely review statements, so subscriptions and small charges can slip by.<br>";
  if (a.q8 <= 2) report += "• Saving is inconsistent, leaving less buffer against inflation and surprises.<br>";
  if (a.q9 >= 4) report += "• Impulse spending is high, which hits harder when everything costs more.<br>";
  if (a.q10 >= 4) report += "• Kid spending is high, which can squeeze your own stability.<br>";

  return report;
}

// -------------------------------
// Kid Budget Engine
// -------------------------------
function calculateKidBudget(a, lifeScore) {
  // Start with a more realistic modern range
  let min = 20;
  let max = 60;

  // Adjust based on kid spending answer
  if (a.q10 === 1) {
    // low kid spending → you can afford a bit more fun
    min += 10;
    max += 20;
  }
  if (a.q10 === 2) {
    min += 5;
    max += 10;
  }
  if (a.q10 === 4) {
    min -= 5;
    max -= 10;
  }
  if (a.q10 === 5) {
    min -= 10;
    max -= 20;
  }

  // Adjust based on overall life score (financial health)
  if (lifeScore < 40) {
    min -= 5;
    max -= 15;
  }
  if (lifeScore > 70) {
    min += 5;
    max += 10;
  }

  min = Math.max(0, Math.round(min));
  max = Math.max(min, Math.round(max));

  return { min, max };
}

// -------------------------------
// Mood Journal
// -------------------------------
function saveMoodEntry() {
  const mood = document.getElementById("moodSelect").value;
  const note = document.getElementById("moodNote").value.trim();

  if (!mood && !note) return;

  const entry = {
    mood,
    note,
    timestamp: new Date().toLocaleString()
  };

  let journal = JSON.parse(localStorage.getItem("moodJournal") || "[]");
  journal.unshift(entry);
  localStorage.setItem("moodJournal", JSON.stringify(journal));

  renderMoodJournal();
}

function renderMoodJournal() {
  const journal = JSON.parse(localStorage.getItem("moodJournal") || "[]");

  document.getElementById("moodJournalList").innerHTML = journal
    .slice(0, 5)
    .map(
      (entry) => `
           <li data-mood="${entry.mood}">
        <strong>${entry.timestamp}</strong><br>
        Mood: ${entry.mood} ${
        entry.mood === "Happy"
          ? "😊"
          : entry.mood === "Neutral"
          ? "😐"
          : "😢"
      }<br>
        ${entry.note ? `Note: ${entry.note}` : ""}
      </li>
    `
    )
    .join("");
}

// -------------------------------
// Page Initialization
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
  loadUser();
  if (document.getElementById("totalIncome")) loadDashboard();
  if (document.getElementById("history-body")) loadHistory();
  renderMoodJournal();

  // ===============================
  // SURVEY + PERSONALITY LOGIC (3‑Question)
  // ===============================
  const surveyForm = document.getElementById("surveyForm");
  const personalityResult = document.getElementById("personalityResult");

  if (surveyForm) {
    surveyForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const q1 = parseInt(surveyForm.q1.value);
      const q2 = parseInt(surveyForm.q2.value);
      const q3 = parseInt(surveyForm.q3.value);

      const total = q1 + q2 + q3;
      let personality = "";

      if (total >= 8) {
        personality =
          "💎 The Investor — disciplined, confident, and focused on long‑term growth even when markets are choppy.";
      } else if (total >= 5) {
        personality =
          "💰 The Saver — cautious, steady, and focused on security as prices and rates move around you.";
      } else {
        personality =
          "🌀 The Spender — spontaneous, enjoys life now, but needs better planning in a high‑cost world.";
      }

      localStorage.setItem("moneyPersonality", personality);
      personalityResult.innerHTML = `<h3>Your Money Personality:</h3><p>${personality}</p>`;
    });

    // Load saved result if it exists
    const savedPersonality = localStorage.getItem("moneyPersonality");
    if (savedPersonality) {
      personalityResult.innerHTML = `<h3>Your Money Personality:</h3><p>${savedPersonality}</p>`;
    }
  }
});

// -------------------------------
// Money Personality Survey (API)
// -------------------------------
function openMoneyPersonalitySurvey() {
  const modal = document.getElementById("moneyPersonalityModal");
  if (modal) modal.style.display = "block";
}

function closeMoneyPersonalitySurvey() {
  const modal = document.getElementById("moneyPersonalityModal");
  if (modal) modal.style.display = "none";
}

async function submitMoneyPersonalitySurvey() {
  const answers = [
    document.getElementById("mp_q1").value,
    document.getElementById("mp_q2").value,
    document.getElementById("mp_q3").value,
    document.getElementById("mp_q4").value
  ];

  try {
    const res = await fetch(`${API_BASE}/money-personality/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ answers })
    });

    const data = await res.json();

    if (data.personalityType) {
      alert(`Your Money Personality: ${data.personalityType}`);
      closeMoneyPersonalitySurvey();
      loadMoneyPersonality();
    } else {
      alert("There was an issue saving your result.");
    }
  } catch (err) {
    console.error("Money Personality submit error:", err);
    alert("Error submitting survey.");
  }
}
function handleThreeQSurvey() {
  const form = document.getElementById("surveyForm");
  const q1 = parseInt(form.q1.value);
  const q2 = parseInt(form.q2.value);
  const q3 = parseInt(form.q3.value);

  // Simple quick score
  const quickLifeScore = q1 + q2 + q3;

  const surveySnapshot = {
    timestamp: Date.now(),
    lifeScore: quickLifeScore,
    personality: "Quick Survey",
    impulseRisk: q1,
    savingsConsistency: q2,
    realisticFoodSpend: q3,
    kidBudget: { min: 0, max: 0 }
  };

  let history = JSON.parse(localStorage.getItem("surveyHistory") || "[]");
  history.unshift(surveySnapshot);
  localStorage.setItem("surveyHistory", JSON.stringify(history));

  showToast("Quick Survey Saved!");
  loadWeeklyMissions();
}
function toggleGroup(header, groupId) {
  const section = document.getElementById(groupId);

  if (!section) return;

  // Toggle open/closed
  section.classList.toggle("open");

  // Optional: rotate arrow if you add one later
  header.classList.toggle("active");
}
// -------------------------------
// WEEKLY MISSIONS ENGINE
// -------------------------------

// Get Monday of the current week
function getWeekStart() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday start
  return new Date(now.setDate(diff)).toDateString();
}

// Generate missions based on latest survey snapshot
function generateWeeklyMissions(latestSurvey) {
  const missionPool = new Set();


  // Personality-based missions
  if (latestSurvey.personality === "The Emotional Spender") {
    missions.push("Pause 24 hours before any non-essential purchase.");
  }
  if (latestSurvey.personality === "The Strategic Saver") {
    missions.push("Review your top 3 spending categories this week.");
  }

  // Impulse risk missions
  if (latestSurvey.impulseRisk >= 60) {
    missions.push("Unsubscribe from 1 marketing email that tempts you.");
  }

  // Savings consistency missions
  if (latestSurvey.savingsConsistency <= 40) {
    missions.push("Move $10 into savings this week.");
  }

  // Food inflation missions
  if (latestSurvey.realisticFoodSpend >= 500) {
    missions.push("Cook 1 meal at home instead of eating out.");
  }

  // Always ensure 3 missions
  while (missions.length < 3) {
    missions.push("Track one purchase this week.");
  }

  return missions.slice(0, 3);
}

// Load or regenerate missions
function loadWeeklyMissions() {
  const weekStart = getWeekStart();
  let data = JSON.parse(localStorage.getItem("weeklyMissions") || "null");

  // If no missions or new week → regenerate
  if (!data || data.weekStart !== weekStart) {
    const history = JSON.parse(localStorage.getItem("surveyHistory") || "[]");
    const latest = history[0];

    if (!latest) {
      document.getElementById("missionsList").innerHTML =
        "<li>Complete a survey to unlock weekly missions.</li>";
      return;
    }

    const missions = generateWeeklyMissions(latest);

    data = {
      weekStart,
      missions: missions.map((m) => ({ text: m, completed: false }))
    };

    localStorage.setItem("weeklyMissions", JSON.stringify(data));
  }

  // Render missions
  const list = document.getElementById("missionsList");
  list.innerHTML = data.missions
    .map(
      (m, i) => `
      <li>
        <input type="checkbox" data-index="${i}" ${m.completed ? "checked" : ""}>
        ${m.text}
      </li>
    `
    )
    .join("");

  document.getElementById(
    "missionRefreshNote"
  ).innerText = `New missions arrive next Monday.`;
}

// Handle checkbox clicks
function updateMissionProgress() {
  const data = JSON.parse(localStorage.getItem("weeklyMissions") || "{}");
  if (!data.missions) return;

  const total = data.missions.length;
  const completed = data.missions.filter(m => m.completed).length;
  const percent = (completed / total) * 100;

  document.getElementById("missionProgressFill").style.width = percent + "%";

  // 100% completion badge
  if (percent === 100) {
    awardBadge("Weekly Completion");
    showToast("🔥 All Missions Completed!");
    confettiBurst();
  }
}
document.addEventListener("change", (e) => {
  if (e.target.matches("#missionsList input[type='checkbox']")) {
    const index = e.target.dataset.index;
    let data = JSON.parse(localStorage.getItem("weeklyMissions"));
    data.missions[index].completed = e.target.checked;
    localStorage.setItem("weeklyMissions", JSON.stringify(data));
 updateMissionProgress();

    if (e.target.checked) {
      confettiBurst();
      showToast("Mission Completed!");

      // Award badges
      if (index == 0) awardBadge("Momentum Starter");
      if (index == 1) awardBadge("Consistency Builder");
      if (index == 2) awardBadge("Mission Master");
    }
  }
});

// Initialize missions on dashboard load
document.addEventListener("DOMContentLoaded", loadWeeklyMissions);
// -------------------------------
// BADGES + TOAST + CONFETTI
// -------------------------------

// Save earned badges
function awardBadge(name) {
  let badges = JSON.parse(localStorage.getItem("vaultBadges") || "[]");
  if (!badges.includes(name)) {
    badges.push(name);
    localStorage.setItem("vaultBadges", JSON.stringify(badges));
    showToast(`🏅 New Badge Earned: ${name}`);
  }
}

// Toast popup
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "vault-toast";
  toast.innerText = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => toast.classList.remove("show"), 2500);
  setTimeout(() => toast.remove(), 3000);
}

// Confetti burst
function confettiBurst() {
  for (let i = 0; i < 20; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "%";
    piece.style.animationDelay = Math.random() * 0.5 + "s";
    document.body.appendChild(piece);

    setTimeout(() => piece.remove(), 1500);
  }
}
