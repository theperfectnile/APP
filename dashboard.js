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
// Auth Helpers
// -------------------------------
function getToken() {
  return localStorage.getItem("token");
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/APP/login.html";
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
// Dashboard Summary Loader
// -------------------------------
async function loadDashboard() {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch("https://backend-qkz7.onrender.com/api/finance/summary", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    animateValue("income", data.monthlyIncome ?? 0);
    animateValue("expenses", data.monthlyExpenses ?? 0);
    animateValue("savings", data.netSavings ?? 0);
    animateValue("portfolio", data.portfolioValue ?? 0);

  } catch (err) {
    console.error("Dashboard summary error:", err);
    showToast("Error loading dashboard summary", "error");
  }
}

// -------------------------------
// Finance History Loader
// -------------------------------
async function loadHistory() {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch("https://backend-qkz7.onrender.com/api/finance/all", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    renderHistory(data);
    renderCharts(data);

  } catch (err) {
    console.error("History load error:", err);
    showToast("Error loading history", "error");
  }
}

// -------------------------------
// Render History Table
// -------------------------------
function renderHistory(data) {
  const table = document.getElementById("history-body");
  if (!table) return;

  table.innerHTML = "";

  data.forEach(entry => {
    const row = `
      <tr>
        <td>${entry.month} ${entry.year}</td>
        <td>$${entry.monthlyIncome}</td>
        <td>$${entry.monthlyExpenses}</td>
        <td>$${entry.portfolioValue}</td>
        <td>$${entry.savingsGoal}</td>
      </tr>
    `;
    table.innerHTML += row;
  });
}

// -------------------------------
// Save Entry
// -------------------------------
async function saveEntry() {
  const token = getToken();
  if (!token) return;

  const payload = {
    month: document.getElementById("month")?.value,
    year: document.getElementById("year")?.value,
    monthlyIncome: document.getElementById("monthlyIncome")?.value,
    monthlyExpenses: document.getElementById("monthlyExpenses")?.value,
    portfolioValue: document.getElementById("portfolioValue")?.value,
    savingsGoal: document.getElementById("savingsGoal")?.value
  };

  try {
    const res = await fetch("https://backend-qkz7.onrender.com/api/finance/add", {
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
// Analyze Insights
// -------------------------------
async function analyzeInsights() {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch("https://backend-qkz7.onrender.com/api/finance/analyze", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });

    const insights = await res.json();
    showToast(insights.message || "No insights returned", "info");

  } catch (err) {
    console.error("Insights error:", err);
    showToast("Error analyzing insights", "error");
  }
}

// -------------------------------
// Charts
// -------------------------------
function renderCharts(data) {
  if (!Array.isArray(data) || data.length === 0) return;

  const incomeCtx = document.getElementById("incomeExpenseChart");
  const savingsCtx = document.getElementById("savingsChart");

  if (!incomeCtx || !savingsCtx) return;

  const months = data.map(e => `${e.month} ${e.year}`);
  const income = data.map(e => e.monthlyIncome);
  const expenses = data.map(e => e.monthlyExpenses);
  const savings = data.map(e => e.monthlyIncome - e.monthlyExpenses);

  new Chart(incomeCtx, {
    type: "line",
    data: {
      labels: months,
      datasets: [
        {
          label: "Income",
          data: income,
          borderColor: "#00eaff",
          backgroundColor: "rgba(0,234,255,0.15)",
          tension: 0.3
        },
        {
          label: "Expenses",
          data: expenses,
          borderColor: "#ff3b3b",
          backgroundColor: "rgba(255,59,59,0.15)",
          tension: 0.3
        }
      ]
    }
  });

  new Chart(savingsCtx, {
    type: "bar",
    data: {
      labels: months,
      datasets: [
        {
          label: "Net Savings",
          data: savings,
          backgroundColor: "#00ffaa"
        }
      ]
    }
  });
}

// -------------------------------
// Page Initialization
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("fade-in");

  if (document.getElementById("income")) loadDashboard();
  if (document.getElementById("history-body")) loadHistory();
});
// -----------------------------
// SURVEY CALCULATION FUNCTION
// -----------------------------
function calculateSurvey() {
  const get = id => Number(document.getElementById(id).value);

  const q1 = get("q1");
  const q2 = get("q2");
  const q3 = get("q3");
  const q4 = get("q4");
  const q5 = get("q5");
  const q6 = get("q6");
  const q7 = get("q7");
  const q8 = get("q8");
  const q9 = get("q9");
  const q10 = get("q10");

  // Reverse scoring for questions where "Very Often" is negative
  const rev = v => 6 - v;

  const mealScore = rev(q1) + q2 + rev(q3) + rev(q4);
  const exerciseScore = q5 + rev(q6);
  const spendingScore = rev(q7) + q8 + rev(q9);
  const kidsScore = rev(q10);

  let advice = "";

  // Meal Planning
  if (mealScore <= 8) advice += "🍽️ You should meal plan more. You're overspending on food and wasting groceries.<br><br>";
  else if (mealScore <= 14) advice += "🍽️ You're doing okay with food habits, but planning 2–3 meals weekly will help.<br><br>";
  else advice += "🍽️ Great job! Your meal planning habits are strong.<br><br>";

  // Exercise
  if (exerciseScore <= 4) advice += "🏋🏾 You should exercise more. Even 10 minutes a day boosts energy and mood.<br><br>";
  else if (exerciseScore <= 7) advice += "🏋🏾 You're doing alright, but more consistency will help.<br><br>";
  else advice += "🏋🏾 Excellent — your activity levels are strong.<br><br>";

  // Spending
  if (spendingScore <= 8) advice += "💸 You should save or invest more and reduce impulse spending.<br><br>";
  else if (spendingScore <= 14) advice += "💸 You're managing money decently, but reviewing statements weekly helps.<br><br>";
  else advice += "💸 Strong financial habits — keep it up.<br><br>";

  // Kids Spending
  if (kidsScore <= 3) advice += "🧒🏾 You're doing well with kid-related spending.<br><br>";
  else if (kidsScore <= 7) advice += "🧒🏾 Consider setting a monthly 'kid fun budget.'<br><br>";
  else advice += "🧒🏾 You may be overspending on non-essentials for your kids.<br><br>";

  document.getElementById("surveyResults").innerHTML = advice;
}
// -----------------------------
// SURVEY CALCULATION FUNCTION
// -----------------------------
function calculateSurvey() {
  const get = id => Number(document.getElementById(id).value);

  const q1 = get("q1");
  const q2 = get("q2");
  const q3 = get("q3");
  const q4 = get("q4");
  const q5 = get("q5");
  const q6 = get("q6");
  const q7 = get("q7");
  const q8 = get("q8");
  const q9 = get("q9");
  const q10 = get("q10");

  const rev = v => 6 - v;

  const mealScore = rev(q1) + q2 + rev(q3) + rev(q4);
  const exerciseScore = q5 + rev(q6);
  const spendingScore = rev(q7) + q8 + rev(q9);
  const kidsScore = rev(q10);

  let advice = "";

  if (mealScore <= 8) advice += "🍽️ You should meal plan more.<br><br>";
  else if (mealScore <= 14) advice += "🍽️ You're doing okay with food habits.<br><br>";
  else advice += "🍽️ Great job! Your meal planning habits are strong.<br><br>";

  if (exerciseScore <= 4) advice += "🏋🏾 You should exercise more.<br><br>";
  else if (exerciseScore <= 7) advice += "🏋🏾 You're doing alright, but more consistency will help.<br><br>";
  else advice += "🏋🏾 Excellent — your activity levels are strong.<br><br>";

  if (spendingScore <= 8) advice += "💸 You should save or invest more and reduce impulse spending.<br><br>";
  else if (spendingScore <= 14) advice += "💸 You're managing money decently.<br><br>";
  else advice += "💸 Strong financial habits — keep it up.<br><br>";

  if (kidsScore <= 3) advice += "🧒🏾 You're doing well with kid-related spending.<br><br>";
  else if (kidsScore <= 7) advice += "🧒🏾 Consider setting a monthly 'kid fun budget.'<br><br>";
  else advice += "🧒🏾 You may be overspending on non-essentials for your kids.<br><br>";

  document.getElementById("surveyResults").innerHTML = advice;
}
function calculateSurvey() { 
  const get = id => Number(document.getElementById(id).value);

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

  // Helper to convert numeric choice to text
  const choiceText = {
    1: "Never",
    2: "Rarely",
    3: "Sometimes",
    4: "Often",
    5: "Very Often"
  };
  // -----------------------------
  // MEAL PLANNING + FOOD HABITS
  // -----------------------------
  if (answers.q1 === 1) advice += "🍽️ You never eat out — that’s budget‑friendly, but make sure you’re not skipping meals or relying on snacks. Try planning 1–2 balanced meals ahead.<br><br>";
  if (answers.q1 === 2) advice += "🍽️ You rarely eat out — great for saving money. Keep a simple meal plan to avoid last‑minute takeout.<br><br>";
  if (answers.q1 === 3) advice += "🍽️ You sometimes eat out — totally normal. Try setting a weekly limit so it stays intentional.<br><br>";
  if (answers.q1 === 4) advice += "🍽️ You often eat out — consider cooking 1–2 meals at home to balance convenience and cost.<br><br>";
  if (answers.q1 === 5) advice += "🍽️ You eat out very often — start with one home‑cooked meal per week to save money and reduce food waste.<br><br>";

  if (answers.q2 === 1) advice += "📝 You never meal plan — start with planning just one dinner for the week. Keep it simple.<br><br>";
  if (answers.q2 === 2) advice += "📝 You rarely meal plan — try planning 2 meals to reduce stress and grocery costs.<br><br>";
  if (answers.q2 === 3) advice += "📝 You sometimes meal plan — adding one more planned meal can help you stay consistent.<br><br>";
  if (answers.q2 === 4) advice += "📝 You often meal plan — keep refining what works for you.<br><br>";
  if (answers.q2 === 5) advice += "📝 You always meal plan — strong habit. Keep using it to stay organized and save money.<br><br>";

  if (answers.q3 === 1) advice += "🥗 You never waste groceries — excellent. Keep buying only what you use.<br><br>";
  if (answers.q3 === 2) advice += "🥗 You rarely waste food — good balance. A quick fridge check before shopping helps even more.<br><br>";
  if (answers.q3 === 3) advice += "🥗 You sometimes waste food — try smaller portions or freezing leftovers.<br><br>";
  if (answers.q3 === 4) advice += "🥗 You often waste food — planning meals around what you already have can help.<br><br>";
  if (answers.q3 === 5) advice += "🥗 You waste food very often — start with buying fewer perishables and using leftovers creatively.<br><br>";

  if (answers.q4 === 1) advice += "🍳 You never choose convenience foods — great, but make sure cooking isn’t stressing you out.<br><br>";
  if (answers.q4 === 2) advice += "🍳 You rarely choose convenience foods — balanced and healthy.<br><br>";
  if (answers.q4 === 3) advice += "🍳 You sometimes choose convenience foods — totally normal. Try prepping ingredients ahead.<br><br>";
  if (answers.q4 === 4) advice += "🍳 You often choose convenience foods — consider cooking simple meals like stir‑fries or sheet‑pan dinners.<br><br>";
  if (answers.q4 === 5) advice += "🍳 You rely heavily on convenience foods — start with one homemade meal per week to build confidence.<br><br>";

  // -----------------------------
  // EXERCISE + ENERGY
  // -----------------------------
  if (answers.q5 === 1) advice += "🏋🏾 You never exercise — start with 5 minutes of walking or stretching daily.<br><br>";
  if (answers.q5 === 2) advice += "🏋🏾 You rarely exercise — aim for 1–2 short sessions per week.<br><br>";
  if (answers.q5 === 3) advice += "🏋🏾 You sometimes exercise — consistency will help you feel better.<br><br>";
  if (answers.q5 === 4) advice += "🏋🏾 You often exercise — great routine. Keep it up.<br><br>";
  if (answers.q5 === 5) advice += "🏋🏾 You exercise very often — strong habit. Just watch for burnout.<br><br>";

  if (answers.q6 === 1) advice += "⚡ You never feel sluggish — great energy levels.<br><br>";
  if (answers.q6 === 2) advice += "⚡ You rarely feel sluggish — keep supporting your energy with sleep and hydration.<br><br>";
  if (answers.q6 === 3) advice += "⚡ You sometimes feel sluggish — try adding light movement or improving sleep.<br><br>";
  if (answers.q6 === 4) advice += "⚡ You often feel sluggish — consider improving sleep routine and adding gentle exercise.<br><br>";
  if (answers.q6 === 5) advice += "⚡ You feel sluggish very often — small daily habits (water, stretching, sleep) can help a lot.<br><br>";

  // -----------------------------
  // MONEY HABITS
  // -----------------------------
  if (answers.q7 === 1) advice += "💳 You never review statements — start with a weekly 2‑minute check‑in.<br><br>";
  if (answers.q7 === 2) advice += "💳 You rarely review statements — try checking once a week to stay aware.<br><br>";
  if (answers.q7 === 3) advice += "💳 You sometimes review statements — good start. Make it a habit.<br><br>";
  if (answers.q7 === 4) advice += "💳 You often review statements — strong awareness.<br><br>";
  if (answers.q7 === 5) advice += "💳 You always review statements — excellent financial awareness.<br><br>";

  if (answers.q8 === 1) advice += "💰 You never save or invest — start with $5–$10 a week to build momentum.<br><br>";
  if (answers.q8 === 2) advice += "💰 You rarely save — try automating a small amount monthly.<br><br>";
  if (answers.q8 === 3) advice += "💰 You sometimes save — consistency will help you grow wealth.<br><br>";
  if (answers.q8 === 4) advice += "💰 You often save — strong habit. Keep going.<br><br>";
  if (answers.q8 === 5) advice += "💰 You save very often — excellent discipline.<br><br>";

  if (answers.q9 === 1) advice += "🛍️ You never impulse buy — disciplined and intentional.<br><br>";
  if (answers.q9 === 2) advice += "🛍️ You rarely impulse buy — healthy balance.<br><br>";
  if (answers.q9 === 3) advice += "🛍️ You sometimes impulse buy — try a 24‑hour pause before purchases.<br><br>";
  if (answers.q9 === 4) advice += "🛍️ You often impulse buy — consider setting a monthly fun budget.<br><br>";
  if (answers.q9 === 5) advice += "🛍️ You impulse buy very often — try tracking triggers and setting spending limits.<br><br>";

  // -----------------------------
  // KID SPENDING
  // -----------------------------
  if (answers.q10 === 1) advice += "🧒🏾 You never buy extras for your kids — disciplined. A small fun budget could add joy without overspending.<br><br>";
  if (answers.q10 === 2) advice += "🧒🏾 You rarely buy extras — balanced approach.<br><br>";
  if (answers.q10 === 3) advice += "🧒🏾 You sometimes buy extras — normal. A monthly limit keeps it predictable.<br><br>";
  if (answers.q10 === 4) advice += "🧒🏾 You often buy extras — consider setting a clear monthly budget.<br><br>";
  if (answers.q10 === 5) advice += "🧒🏾 You very often buy extras — a structured budget can help protect your long‑term goals.<br><br>";

// Update survey results
document.getElementById("surveyResults").innerHTML = advice;

// Step 5: personality engine (corrected)
const personality = getFinancialPersonality(answers);

document.getElementById("personalityType").innerHTML =
  `<strong>${personality.type}</strong><br>${personality.description}`;

  // Step 6: life score
const lifeScore = calculateLifeScore(answers);

document.getElementById("lifeScoreValue").innerHTML =
  `<strong>${lifeScore}</strong> / 100`;
}
// -------------------------------------------
// FINANCIAL PERSONALITY ENGINE
// -------------------------------------------
function getFinancialPersonality(answers) {
  let type = "";
  let description = "";

  // Patterns
  const eatsOutOften = answers.q1 >= 4;
  const noMealPlanning = answers.q2 <= 2;
  const wastesFood = answers.q3 >= 4;
  const convenienceFood = answers.q4 >= 4;

  const noExercise = answers.q5 === 1;
  const lowEnergy = answers.q6 >= 4;

  const neverReviewsMoney = answers.q7 === 1;
  const neverSaves = answers.q8 === 1;
  const impulseBuyer = answers.q9 >= 4;

  const highKidSpending = answers.q10 >= 4;

  // Personality Logic
  if (neverSaves && impulseBuyer) {
    type = "The Improviser";
    description = "You live in the moment. You make quick decisions and enjoy spontaneity, but adding small structure can help you build long-term stability.";
  }
  else if (neverReviewsMoney && noMealPlanning) {
    type = "The Free Spirit";
    description = "You prefer flexibility over structure. A few light routines can help you stay in control without feeling restricted.";
  }
  else if (noExercise && lowEnergy) {
    type = "The Overloaded Achiever";
    description = "You carry a lot on your shoulders. Improving energy and routines will help you feel more balanced and in control.";
  }
  else if (highKidSpending) {
    type = "The Provider";
    description = "You love giving to your family. A clear kid budget helps you support them without sacrificing your own goals.";
  }
  else if (!neverSaves && !impulseBuyer && answers.q2 >= 4) {
    type = "The Planner";
    description = "You value structure and consistency. You’re intentional with your habits and finances, and it shows.";
  }
  else {
    type = "The Builder";
    description = "You’re developing your habits and learning what works for you. Small improvements will create big results over time.";
  }

  return { type, description };
}
// -------------------------------------------
// LIFE SCORE ENGINE
// -------------------------------------------
function calculateLifeScore(answers) {
  let score = 0;

  // Food habits (q1–q4)
  score += (6 - answers.q1) * 2;   // eating out less = better
  score += answers.q2 * 2;         // meal planning = good
  score += (6 - answers.q3) * 2;   // wasting less = good
  score += (6 - answers.q4) * 2;   // less convenience food = good

  // Exercise + Energy (q5–q6)
  score += answers.q5 * 3;         // more exercise = better
  score += (6 - answers.q6) * 2;   // less sluggish = better

  // Money habits (q7–q9)
  score += answers.q7 * 3;         // reviewing statements = good
  score += answers.q8 * 3;         // saving = good
  score += (6 - answers.q9) * 3;   // fewer impulse buys = good

  // Kid spending (q10)
  score += (6 - answers.q10) * 1;  // less overspending = better

  // Normalize to 0–100
  return Math.min(100, Math.max(0, Math.round(score)));
}
