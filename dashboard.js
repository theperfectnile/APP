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
