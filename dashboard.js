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
// Auth Helpers
// -------------------------------
function getToken() {
  return localStorage.getItem("token");
  async function loadUser() {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });

    const data = await res.json();

    if (!data || data.message === "Unauthorized") {
      logout();
    }
  } catch (err) {
    console.error("User load error:", err);
    logout();
  }
}
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
// Load Dashboard Summary
// -------------------------------
async function loadDashboard() {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch(`${API_BASE}/finance/summary`)
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    animateValue("totalIncome", data.totalIncome || 0);
    animateValue("totalExpenses", data.totalExpenses || 0);
    animateValue("totalPortfolio", data.totalPortfolio || 0);

  } catch (err) {
    console.error("Dashboard summary error:", err);
    showToast("Error loading dashboard summary", "error");
  }
}
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
// Load History
// -------------------------------
async function loadHistory() {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch(`${API_BASE}/finance/all`)
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    const tbody = document.getElementById("history-body");

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
// Survey Engine
// -------------------------------
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

  // Meal Planning
  if (answers.q1 >= 4) advice += "🍽️ Try cooking 1–2 meals at home weekly.<br><br>";
  if (answers.q2 <= 2) advice += "📝 Try planning at least one meal before shopping.<br><br>";
  if (answers.q3 >= 4) advice += "🥗 Reduce food waste by buying smaller portions.<br><br>";
  if (answers.q4 >= 4) advice += "🍳 Try simple home meals like stir‑fries.<br><br>";

  // Exercise
  if (answers.q5 <= 2) advice += "🏋🏾 Add 5 minutes of movement daily.<br><br>";
  if (answers.q6 >= 4) advice += "⚡ Improve sleep and hydration for more energy.<br><br>";

  // Money Habits
  if (answers.q7 <= 2) advice += "💳 Review statements weekly.<br><br>";
  if (answers.q8 <= 2) advice += "💰 Start saving $5–$10 weekly.<br><br>";
  if (answers.q9 >= 4) advice += "🛍️ Use a 24‑hour pause before purchases.<br><br>";

  // Kid Spending
  if (answers.q10 >= 4) advice += "🧒🏾 Set a weekly kid fun budget.<br><br>";

  document.getElementById("surveyResults").innerHTML = advice;

  const personality = getFinancialPersonality(answers);
  document.getElementById("personalityType").innerHTML =
    `<strong>${personality.type}</strong><br>${personality.description}`;

  const lifeScore = calculateLifeScore(answers);
  document.getElementById("lifeScoreValue").innerHTML = `${lifeScore} / 100`;

  const microHabits = generateMicroHabits(personality, lifeScore, answers);
  document.getElementById("microHabitsList").innerHTML =
    microHabits.map(h => `<li>${h}</li>`).join("");

  const weeklyReport = generateWeeklyReport(answers, personality, lifeScore);
  document.getElementById("weeklyReportText").innerHTML = weeklyReport;

  const kidBudget = calculateKidBudget(answers, lifeScore);
  document.getElementById("kidBudgetValue").innerHTML =
    `Recommended: <strong>$${kidBudget.min} – $${kidBudget.max}</strong>`;
}

// -------------------------------
// Personality Engine
// -------------------------------
function getFinancialPersonality(a) {
  if (a.q8 === 1 && a.q9 >= 4)
    return { type: "The Improviser", description: "You live in the moment. Add small structure to build stability." };

  if (a.q7 === 1 && a.q2 <= 2)
    return { type: "The Free Spirit", description: "You prefer flexibility. Light routines help you stay in control." };

  if (a.q5 === 1 && a.q6 >= 4)
    return { type: "The Overloaded Achiever", description: "You carry a lot. Improve energy and routines for balance." };

  if (a.q10 >= 4)
    return { type: "The Provider", description: "You love giving. A clear kid budget helps you stay on track." };

  if (a.q2 >= 4 && a.q8 >= 3)
    return { type: "The Planner", description: "You value structure and consistency." };

  return { type: "The Builder", description: "You're developing strong habits. Small improvements create big results." };
}

// -------------------------------
// Life Score Engine
// -------------------------------
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

  return Math.min(100, Math.max(0, Math.round(score)));
}

// -------------------------------
// Micro‑Habits Engine
// -------------------------------
function generateMicroHabits(personality, lifeScore, a) {
  const habits = [];

  if (personality.type === "The Improviser") {
    habits.push("Pause 24 hours before purchases.");
    habits.push("Review yesterday’s spending.");
  }

  if (personality.type === "The Free Spirit") {
    habits.push("Plan one meal this week.");
    habits.push("Do a 2‑minute wallet clean‑out.");
  }

  if (personality.type === "The Overloaded Achiever") {
    habits.push("Take a 5‑minute walk.");
    habits.push("Drink a full glass of water.");
  }

  if (personality.type === "The Provider") {
    habits.push("Set a $5–$10 kid fun budget.");
    habits.push("Do one act of self‑care.");
  }

  if (personality.type === "The Planner") {
    habits.push("Review your budget categories.");
    habits.push("Prep ingredients for one meal.");
  }

  if (personality.type === "The Builder") {
    habits.push("Improve one habit by 1% today.");
    habits.push("Track one purchase.");
  }

  if (lifeScore < 40) {
    habits.push("Drink one bottle of water.");
    habits.push("Do 5 minutes of movement.");
  } else if (lifeScore < 70) {
    habits.push("Plan one meal for tomorrow.");
    habits.push("Review your bank app.");
  } else {
    habits.push("Celebrate one win.");
    habits.push("Prep tomorrow’s breakfast.");
  }

  if (a.q1 >= 4) habits.push("Cook one meal at home.");
  if (a.q5 <= 2) habits.push("Do a 3‑minute stretch.");
  if (a.q9 >= 4) habits.push("Unsubscribe from one marketing email.");

  return habits.slice(0, 3);
}

// -------------------------------
// Weekly Report Engine
// -------------------------------
function generateWeeklyReport(a, personality, lifeScore) {
  let report = `<strong>Personality:</strong> ${personality.type}<br>${personality.description}<br><br>`;

  if (lifeScore < 40)
    report += "You're in a rebuilding phase. Focus on small, consistent habits.<br><br>";
  else if (lifeScore < 70)
    report += "You're making progress. Strengthen what’s working.<br><br>";
  else
    report += "Your habits are strong. Maintain your routines.<br><br>";

  report += "<strong>Behavior Patterns:</strong><br>";

  if (a.q1 >= 4) report += "• You rely on eating out often.<br>";
  if (a.q2 <= 2) report += "• Meal planning is inconsistent.<br>";
  if (a.q3 >= 4) report += "• Food waste is high.<br>";
  if (a.q4 >= 4) report += "• Convenience foods are common.<br>";
  if (a.q5 <= 2) report += "• Exercise is low.<br>";
  if (a.q6 >= 4) report += "• Energy levels are low.<br>";
  if (a.q7 <= 2) report += "• You rarely review statements.<br>";
  if (a.q8 <= 2) report += "• Saving is inconsistent.<br>";
  if (a.q9 >= 4) report += "• Impulse spending is high.<br>";
  if (a.q10 >= 4) report += "• Kid spending is high.<br>";

  return report;
}

// -------------------------------
// Kid Budget Engine
// -------------------------------
function calculateKidBudget(a, lifeScore) {
  let min = 5, max = 25;

  if (a.q10 === 1) { min += 5; max += 10; }
  if (a.q10 === 2) { min += 3; max += 5; }
  if (a.q10 === 4) { min -= 2; max -= 5; }
  if (a.q10 === 5) { min -= 5; max -= 10; }

  if (lifeScore < 40) { min -= 2; max -= 5; }
  if (lifeScore > 70) { min += 2; max += 5; }

  min = Math.max(0, min);
  max = Math.max(min, max);

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
    .map(entry => `
      <li>
        <strong>${entry.timestamp}</strong><br>
        Mood: ${entry.mood}<br>
        ${entry.note ? `Note: ${entry.note}` : ""}
      </li>
    `)
    .join("");
}

// -------------------------------
// Page Initialization
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("totalIncome")) loadDashboard();
  if (document.getElementById("history-body")) loadHistory();
  renderMoodJournal();
});
function openMoneyPersonalitySurvey() {
  const modal = document.getElementById("moneyPersonalityModal");
  modal.style.display = "block";
}

function closeMoneyPersonalitySurvey() {
  const modal = document.getElementById("moneyPersonalityModal");
  modal.style.display = "none";
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
