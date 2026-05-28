/* ============================================================
   Vaultwise Dashboard — Cleaned Hybrid Version
   Core Helpers • Greeting • Mood • Streak • XP • Surveys
   ============================================================ */

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
   Collapsible Groups
   (used with: onclick="toggleGroup(this, 'sectionId')")
-------------------------------- */
window.toggleGroup = function (header, id) {
  const section = document.getElementById(id);
  if (!section) return;

  section.classList.toggle("open");
  header.classList.toggle("active");

  const arrow = header.querySelector(".arrow");
  if (arrow) {
    arrow.style.transform = header.classList.contains("active")
      ? "rotate(90deg)"
      : "rotate(0deg)";
  }
};

/* -------------------------------
   Auth Helpers
-------------------------------- */
function getToken() {
  return localStorage.getItem("token");
}

/* -------------------------------
   Personalized Greeting
-------------------------------- */
function getTimeOfDayGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getLastMood() {
  const history = JSON.parse(localStorage.getItem("moodHistory") || "[]");
  return history[0]?.mood || null;
}

function renderPersonalGreeting() {
  const el = document.getElementById("personalGreeting");
  if (!el) return;

  const base = getTimeOfDayGreeting();
  const mood = getLastMood();

  let message = `${base}.`;

  if (mood === "Happy") {
    message += " You’re on a roll — keep that momentum.";
  } else if (mood === "Neutral") {
    message += " Let’s make one small money win today.";
  } else if (mood === "Sad") {
    message += " One small step is enough for today.";
  }

  el.innerText = message;
}

/* -------------------------------
   Daily Seed + Random
-------------------------------- */
function getDailySeed() {
  const today = new Date();
  return Number(
    `${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}`
  );
}

function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/* -------------------------------
   Question Banks
-------------------------------- */

const TEN_QUESTION_BANK = [
  // 🟦 SPENDING
  {
    text: "How often do you avoid buying things you don’t need?",
    options: [
      { label: "Never", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Often", value: 3 },
      { label: "Always", value: 4 }
    ]
  },
  {
    text: "How often do you avoid impulse purchases?",
    options: [
      { label: "Never", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Often", value: 3 },
      { label: "Always", value: 4 }
    ]
  },
  {
    text: "How often do you avoid unnecessary purchases?",
    options: [
      { label: "Never", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Often", value: 3 },
      { label: "Always", value: 4 }
    ]
  },
  {
    text: "How often do you delay purchases to think them through?",
    options: [
      { label: "Never", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Often", value: 3 },
      { label: "Always", value: 4 }
    ]
  },
  {
    text: "How often do you overspend your budget?",
    options: [
      { label: "Very often", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Rarely", value: 3 },
      { label: "Never", value: 4 }
    ]
  },
  {
    text: "How often do you spend impulsively?",
    options: [
      { label: "Very often", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Rarely", value: 3 },
      { label: "Never", value: 4 }
    ]
  },
  {
    text: "How often do you spend more than you planned?",
    options: [
      { label: "Very often", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Rarely", value: 3 },
      { label: "Never", value: 4 }
    ]
  },

  // 🟩 SAVING
  {
    text: "How often do you save money intentionally?",
    options: [
      { label: "Never", value: 1 },
      { label: "Occasionally", value: 2 },
      { label: "Regularly", value: 3 },
      { label: "Consistently", value: 4 }
    ]
  },
  {
    text: "How often do you set aside money for emergencies?",
    options: [
      { label: "Never", value: 1 },
      { label: "Occasionally", value: 2 },
      { label: "Regularly", value: 3 },
      { label: "Consistently", value: 4 }
    ]
  },
  {
    text: "How often do you set aside money for future goals?",
    options: [
      { label: "Never", value: 1 },
      { label: "Occasionally", value: 2 },
      { label: "Regularly", value: 3 },
      { label: "Consistently", value: 4 }
    ]
  },
  {
    text: "How prepared do you feel for unexpected expenses?",
    options: [
      { label: "Not prepared", value: 1 },
      { label: "Somewhat prepared", value: 2 },
      { label: "Prepared", value: 3 },
      { label: "Very prepared", value: 4 }
    ]
  },

  // 🟧 PLANNING
  {
    text: "How often do you compare prices before buying?",
    options: [
      { label: "Never", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Often", value: 3 },
      { label: "Always", value: 4 }
    ]
  },
  {
    text: "How often do you cook at home instead of eating out?",
    options: [
      { label: "Never", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Often", value: 3 },
      { label: "Almost always", value: 4 }
    ]
  },
  {
    text: "How often do you plan meals to save money?",
    options: [
      { label: "Never", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Often", value: 3 },
      { label: "Always", value: 4 }
    ]
  },
  {
    text: "How often do you plan your purchases ahead of time?",
    options: [
      { label: "Never", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Often", value: 3 },
      { label: "Always", value: 4 }
    ]
  },
  {
    text: "How often do you review your subscriptions?",
    options: [
      { label: "Never", value: 1 },
      { label: "Yearly", value: 2 },
      { label: "Every few months", value: 3 },
      { label: "Monthly", value: 4 }
    ]
  },
  {
    text: "How often do you review your financial goals?",
    options: [
      { label: "Never", value: 1 },
      { label: "Occasionally", value: 2 },
      { label: "Regularly", value: 3 },
      { label: "Consistently", value: 4 }
    ]
  },
  {
    text: "How well do you stick to your budget?",
    options: [
      { label: "Not at all", value: 1 },
      { label: "Somewhat", value: 2 },
      { label: "Mostly", value: 3 },
      { label: "Always", value: 4 }
    ]
  },

  // 🟪 MINDSET
  {
    text: "How confident do you feel about your financial decisions?",
    options: [
      { label: "Not confident", value: 1 },
      { label: "Somewhat confident", value: 2 },
      { label: "Confident", value: 3 },
      { label: "Very confident", value: 4 }
    ]
  },
  {
    text: "How confident do you feel about your financial future?",
    options: [
      { label: "Never", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Often", value: 3 },
      { label: "Always", value: 4 }
    ]
  },
  {
    text: "How organized do you feel with your finances?",
    options: [
      { label: "Not organized", value: 1 },
      { label: "Somewhat organized", value: 2 },
      { label: "Organized", value: 3 },
      { label: "Very organized", value: 4 }
    ]
  },
  {
    text: "How stressed do you feel about money?",
    options: [
      { label: "Very stressed", value: 1 },
      { label: "Somewhat stressed", value: 2 },
      { label: "A little stressed", value: 3 },
      { label: "Not stressed", value: 4 }
    ]
  },
  {
    text: "How often do you think about long‑term financial stability?",
    options: [
      { label: "Never", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Often", value: 3 },
      { label: "Daily", value: 4 }
    ]
  }
];

const THREE_QUESTION_BANK = [
  // 🟦 SPENDING
  {
    text: "How much control do you feel over your spending impulses today?",
    options: [
      { label: "No control", value: 1 },
      { label: "Some control", value: 2 },
      { label: "Good control", value: 3 },
      { label: "Full control", value: 4 }
    ]
  },
  // 🟩 SAVING
  {
    text: "How much intention do you feel toward saving today?",
    options: [
      { label: "No intention", value: 1 },
      { label: "Some intention", value: 2 },
      { label: "Intentional", value: 3 },
      { label: "Very intentional", value: 4 }
    ]
  },
  // 🟧 PLANNING
  {
    text: "How focused do you feel on your financial goals today?",
    options: [
      { label: "Not focused", value: 1 },
      { label: "Somewhat focused", value: 2 },
      { label: "Focused", value: 3 },
      { label: "Very focused", value: 4 }
    ]
  },
  // 🟪 MINDSET
  {
    text: "How confident do you feel about making smart money choices today?",
    options: [
      { label: "Not confident", value: 1 },
      { label: "Somewhat confident", value: 2 },
      { label: "Confident", value: 3 },
      { label: "Very confident", value: 4 }
    ]
  },
  {
    text: "How positive do you feel about your financial progress today?",
    options: [
      { label: "Not positive", value: 1 },
      { label: "Somewhat positive", value: 2 },
      { label: "Positive", value: 3 },
      { label: "Very positive", value: 4 }
    ]
  }
];

/* -------------------------------
   Daily Survey Loader
-------------------------------- */
function getDailyTenQuestions() {
  const seed = getDailySeed();
  const questions = [...TEN_QUESTION_BANK];
  const selected = [];

  for (let i = 0; i < 10; i++) {
    const index = Math.floor(seededRandom(seed + i) * questions.length);
    selected.push(questions.splice(index, 1)[0]);
  }

  return selected;
}

function getDailyThreeQuestions() {
  const seed = getDailySeed() + 999;
  const questions = [...THREE_QUESTION_BANK];
  const selected = [];

  for (let i = 0; i < 3; i++) {
    const index = Math.floor(seededRandom(seed + i) * questions.length);
    selected.push(questions.splice(index, 1)[0]);
  }

  return selected;
}

function loadDailySurvey() {
  const seed = getDailySeed();
  const saved = JSON.parse(localStorage.getItem("dailySurvey"));

  if (saved && saved.seed === seed) {
    return saved;
  }

  const data = {
    seed,
    ten: getDailyTenQuestions(),
    three: getDailyThreeQuestions()
  };

  localStorage.setItem("dailySurvey", JSON.stringify(data));
  return data;
}

/* -------------------------------
   Personality Insights
-------------------------------- */
function loadPersonalityInsights() {
  const result = JSON.parse(localStorage.getItem("tenSurveyResult"));
  const container = document.getElementById("personalityInsights");

  if (!container) return;

  container.innerHTML = "";

  if (!result) {
    container.innerHTML =
      "<p>No insights yet — complete today’s survey to unlock them.</p>";
    return;
  }

  const score = result.score;
  const max = result.max;
  const percent = Math.round((score / max) * 100);

  let insight = "";

  if (percent >= 85)
    insight = "You’re showing strong financial discipline and confidence.";
  else if (percent >= 70)
    insight = "You’re consistent with good habits — keep refining your goals.";
  else if (percent >= 50)
    insight = "You’re building awareness — focus on saving and planning.";
  else
    insight =
      "You’re in reflection mode — small daily actions will boost your progress.";

  container.innerHTML = `
    <h3>💡 Personality Insights</h3>
    <p><strong>Score:</strong> ${percent}%</p>
    <p>${insight}</p>
  `;
}

/* -------------------------------
   10‑Question Survey (Daily)
-------------------------------- */
function submitTenQuestionSurvey() {
  const daily = loadDailySurvey();
  const questions = daily.ten;

  let total = 0;
  let answered = 0;

  questions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="ten_q_${i}"]:checked`);
    if (selected) {
      total += Number(selected.value);
      answered++;
    }
  });

  if (answered < questions.length) {
    alert("Please answer all 10 questions before submitting.");
    return;
  }

  const result = {
    date: getDailySeed(),
    score: total,
    max: questions.length * 4
  };

  localStorage.setItem("tenSurveyResult", JSON.stringify(result));
  alert("Survey submitted! Your insights will update.");
  loadPersonalityInsights();
}

function renderTenQuestionSurvey() {
  const daily = loadDailySurvey();
  const questions = daily.ten;
  const container = document.getElementById("tenQuestionSurvey");

  if (!container) return;

  container.innerHTML = "";

  questions.forEach((q, i) => {
    const block = document.createElement("div");
    block.className = "survey-question-block";

    const label = document.createElement("p");
    label.className = "survey-question-text";
    label.innerText = `${i + 1}. ${q.text}`;
    block.appendChild(label);

    q.options.forEach((opt) => {
      const row = document.createElement("label");
      row.className = "survey-option-row";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `ten_q_${i}`;
      input.value = opt.value;

      const span = document.createElement("span");
      span.innerText = opt.label;

      row.appendChild(input);
      row.appendChild(span);
      block.appendChild(row);
    });

    container.appendChild(block);
  });
}

/* -------------------------------
   3‑Question Survey (Daily)
-------------------------------- */
function renderThreeQuestionSurvey() {
  const daily = loadDailySurvey();
  const questions = daily.three;
  const container = document.getElementById("threeQuestionSurvey");

  if (!container) return;

  container.innerHTML = "";

  questions.forEach((q, i) => {
    const block = document.createElement("div");
    block.className = "survey-question-block";

    const label = document.createElement("p");
    label.className = "survey-question-text";
    label.innerText = `${i + 1}. ${q.text}`;
    block.appendChild(label);

    q.options.forEach((opt) => {
      const row = document.createElement("label");
      row.className = "survey-option-row";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `three_q_${i}`;
      input.value = opt.value;

      const span = document.createElement("span");
      span.innerText = opt.label;

      row.appendChild(input);
      row.appendChild(span);
      block.appendChild(row);
    });

    container.appendChild(block);
  });
}

/* -------------------------------
   Ten Survey Submit Button
-------------------------------- */
function renderTenSurveySubmitButton() {
  const container = document.getElementById("tenSurveySubmitContainer");

  if (!container) return;

  container.innerHTML = `
    <button id="submitTenSurvey" class="survey-submit-btn">
      Submit Survey
    </button>
  `;

  const btn = document.getElementById("submitTenSurvey");
  if (btn) {
    btn.addEventListener("click", submitTenQuestionSurvey);
  }
}

/* -------------------------------
   Mood Journal
-------------------------------- */
function saveMoodEntry() {
  const mood = document.getElementById("moodSelect")?.value || "Neutral";
  const note = document.getElementById("moodNote")?.value || "";

  const moodHistory = JSON.parse(localStorage.getItem("moodHistory") || "[]");

  moodHistory.unshift({
    mood,
    note,
    date: new Date().toISOString()
  });

  localStorage.setItem("moodHistory", JSON.stringify(moodHistory));

  renderMoodJournal();
  applyMoodTheme();
}

function renderMoodJournal() {
  const list = document.getElementById("moodJournalList");
  if (!list) return;

  const moodHistory = JSON.parse(localStorage.getItem("moodHistory") || "[]");

  list.innerHTML = moodHistory
    .slice(0, 5)
    .map(
      (entry) => `
      <li>
        <strong>${entry.mood}</strong> — ${entry.note || "No note"}
        <br><small>${new Date(entry.date).toLocaleString()}</small>
      </li>
    `
    )
    .join("");
}

/* -------------------------------
   Mood‑Aware Theme
-------------------------------- */
function applyMoodTheme() {
  const history = JSON.parse(localStorage.getItem("moodHistory") || "[]");
  const mood = history[0]?.mood || "Neutral";

  document.body.classList.remove("mood-happy", "mood-neutral", "mood-sad");

  if (mood === "Happy") {
    document.body.classList.add("mood-happy");
  } else if (mood === "Sad") {
    document.body.classList.add("mood-sad");
  } else {
    document.body.classList.add("mood-neutral");
  }
}

/* -------------------------------
   Visit Tracking + Streak System
-------------------------------- */
function trackVisit() {
  const today = new Date().toISOString().slice(0, 10);
  let visits = JSON.parse(localStorage.getItem("visitHistory") || "[]");

  if (!visits.includes(today)) {
    visits.push(today);
    localStorage.setItem("visitHistory", JSON.stringify(visits));
  }
}

function getVisitStreak() {
  const visits = JSON.parse(localStorage.getItem("visitHistory") || "[]")
    .sort()
    .reverse();

  if (visits.length === 0) return 0;

  let streak = 1;
  let last = new Date(visits[0]);

  for (let i = 1; i < visits.length; i++) {
    const d = new Date(visits[i]);
    const diff = (last - d) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
      last = d;
    } else {
      break;
    }
  }

  return streak;
}

function renderStreak() {
  const el = document.getElementById("streakBadge");
  if (!el) return;

  const streak = getVisitStreak();

  if (streak <= 1) {
    el.innerText = "Day 1 • Showing up matters";
  } else {
    el.innerText = `🔥 ${streak}-day streak`;
  }
}

/* -------------------------------
   XP + Level System
-------------------------------- */
function addXP(amount, reason) {
  const data = JSON.parse(
    localStorage.getItem("xpData") || '{"xp":0,"log":[]}'
  );
  data.xp += amount;
  data.log.unshift({ amount, reason, time: Date.now() });
  localStorage.setItem("xpData", JSON.stringify(data));
}

function getLevel(xp) {
  return Math.floor(xp / 100) + 1;
}

function renderXP() {
  const badgeEl = document.getElementById("xpBadge");
  const levelLabel = document.getElementById("xpLevelLabel");
  const xpValueLabel = document.getElementById("xpValueLabel");
  const xpFill = document.getElementById("xpFill");
  const xpNextLabel = document.getElementById("xpNextLabel");

  const data = JSON.parse(localStorage.getItem("xpData") || '{"xp":0}');
  const xp = data.xp || 0;
  const level = getLevel(xp);

  const nextLevelXP = level * 100;
  const prevLevelXP = (level - 1) * 100;
  const progressInLevel = xp - prevLevelXP;
  const neededThisLevel = nextLevelXP - prevLevelXP;
  const percent = Math.min((progressInLevel / neededThisLevel) * 100, 100);

  if (badgeEl) badgeEl.innerText = `Level ${level} • ${xp} XP`;
  if (levelLabel) levelLabel.textContent = `Level ${level}`;
  if (xpValueLabel) xpValueLabel.textContent = `${xp} XP`;
  if (xpFill) xpFill.style.width = `${percent}%`;
  if (xpNextLabel)
    xpNextLabel.textContent = `Next level in ${nextLevelXP - xp} XP`;
}

/* -------------------------------
   Vaultwise Coach (Smart Advice)
-------------------------------- */
function renderCoachMessage() {
  const el = document.getElementById("coachMessage");
  if (!el) return;

  const answers = JSON.parse(
    localStorage.getItem("lastSurveyAnswers") || "null"
  );
  const moodHistory = JSON.parse(localStorage.getItem("moodHistory") || "[]");
  const xpData = JSON.parse(localStorage.getItem("xpData") || '{"xp":0}');
  const streak = getVisitStreak();

  let msg = "";

  if (!answers) {
    el.innerHTML = "Start with the 10‑question survey so I can tailor your plan.";
    return;
  }

  const lastMood = moodHistory[0]?.mood;
  if (lastMood === "Sad")
    msg += "Take it slow today. One small financial win is enough.<br>";
  if (lastMood === "Happy")
    msg += "You're in a great mindset — perfect time to build momentum.<br>";

  if (answers.q1 >= 4)
    msg += "Swap one eating‑out meal for a home meal.<br>";
  if (answers.q8 <= 2)
    msg += "Move $10 into savings — small steps add up.<br>";
  if (answers.q9 >= 4)
    msg += "Try a 24‑hour pause before purchases.<br>";
  if (answers.q7 <= 2)
    msg += "Review your bank statements this week.<br>";

  const level = getLevel(xpData.xp);
  msg += `You're Level ${level}. Keep completing missions to level up.<br>`;

  if (streak >= 3)
    msg += `🔥 You're on a ${streak}-day streak — consistency is your superpower.`;

  el.innerHTML = msg;
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
   Finance Fallback Generator
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

    animateValue("statIncome", data.totalIncome || 0);
    animateValue("statExpenses", data.totalExpenses || 0);
    animateValue("statPortfolio", data.totalPortfolio || 0);
    animateValue(
      "statSavings",
      data.savings || (data.totalIncome - data.totalExpenses)
    );
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
      headers: { Authorization: `Bearer ${getToken()}` }
    });

    const data = await res.json();

    const el = document.getElementById("moneyPersonalityType");
    if (el) {
      el.innerText = data.personalityType || "No results yet";
    }
  } catch (err) {
    console.error("Money Personality load error:", err);
    const el = document.getElementById("moneyPersonalityType");
    if (el) el.innerText = "Error loading";
  }
}

/* -------------------------------
   Save Finance Entry
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
   Load Finance History
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
   Init
-------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderPersonalGreeting();
  trackVisit();
  renderStreak();
  renderXP();
  renderCoachMessage();
  applyMoodTheme();

  loadDashboard();
  loadMoneyPersonality();
  loadHistory();

  renderTenQuestionSurvey();
  renderThreeQuestionSurvey();
  renderTenSurveySubmitButton();
  loadPersonalityInsights();
});
