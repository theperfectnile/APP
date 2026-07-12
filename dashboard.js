// ===============================
// DASHBOARD.JS — FULL REWRITE
// Habit Improvement Dashboard
// Finance • Exercise • Cleaning • Cooking • Lifestyle
// Dark Mode • Habit Rings • Daily Missions • Coach
// ===============================
// 🔓 Dashboard unlocked for all users (temporary)
async function checkSubscription() {
  console.log("🔓 Dashboard unlocked for testing.");
  return; // Skip all subscription checks
}

// -------------------------------
// GLOBAL STATE
// -------------------------------
let userInfo = null;
let xpData = null;
let streakData = { streak: 0, lastCompletedDate: null };
let moodToday = null;
let financeSummary = null;
let dailyMissions = {};
let habitProgress = {
  finance: 0,
  exercise: 0,
  cleaning: 0,
  cooking: 0,
  lifestyle: 0
};
// -------------------------------
// LOCAL PERSISTENCE HELPERS
// -------------------------------
function saveHabitProgress() {
  localStorage.setItem("habitProgress", JSON.stringify(habitProgress));
}

function loadHabitProgress() {
  const saved = JSON.parse(localStorage.getItem("habitProgress"));
  if (saved) habitProgress = saved;
}

function saveStreak() {
  localStorage.setItem("streakData", JSON.stringify(streakData));
}

function loadStreakFromStorage() {
  const saved = JSON.parse(localStorage.getItem("streakData"));

  // If nothing saved yet, initialize cleanly
  if (!saved) {
    streakData = { streak: 0, lastCompletedDate: null };
    return;
  }

  streakData = saved;

  // If user has never completed a habit, do nothing
  if (!streakData.lastCompletedDate) return;

  const last = new Date(streakData.lastCompletedDate).toDateString();
  const today = new Date().toDateString();

  // If the user missed a day, ONLY reset streak — NOT habit progress
  if (last !== today) {
    streakData.streak = 0;
  }
}
// -------------------------------
// LOCAL STORAGE SAVE HELPERS
// -------------------------------
function saveXPHistory(xp) {
  const history = JSON.parse(localStorage.getItem("xpHistory") || "[]");
  history.push({
    xp,
    timestamp: Date.now()
  });
  localStorage.setItem("xpHistory", JSON.stringify(history));
}

function saveHabitHistory(progress) {
  const history = JSON.parse(localStorage.getItem("habitHistory") || "[]");
  history.push({
    ...progress,
    timestamp: Date.now()
  });
  localStorage.setItem("habitHistory", JSON.stringify(history));
}

function saveSurvey3History(answers) {
  const history = JSON.parse(localStorage.getItem("survey3History") || "[]");

  history.push({
    mood: Number(answers[0].value),
    energy: Number(answers[1].value),
    stress: Number(answers[2].value),
    timestamp: Date.now()
  });

  localStorage.setItem("survey3History", JSON.stringify(history));
}

function saveStreakHistory(streak) {
  const history = JSON.parse(localStorage.getItem("streakHistory") || "[]");
  history.push({
    streak,
    timestamp: Date.now()
  });
  localStorage.setItem("streakHistory", JSON.stringify(history));
}

// -------------------------------
// INITIAL LOAD
// -------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  loadHabitProgress();
  loadStreakFromStorage();
  await loadUserInfo();
  await loadXP();
  await loadFinanceSummary();
  await loadMissions();
setTimeout(renderDashboard, 500);
  renderCoachMessage();
});

// -------------------------------
// LOADERS
// -------------------------------

// USER INFO
async function loadUserInfo() {
  userInfo = await apiGet("https://backend-qkz7.onrender.com/api/auth/user");
}

// XP
async function loadXP() {
  // Free users: disable XP system
  if (userInfo.subscription !== "pro") {
    xpData = { xp: 0, log: [] };
    return;
  }

  // Pro users: load XP normally
  xpData = await apiGet("https://backend-qkz7.onrender.com/api/xp");

  if (!xpData.log || !Array.isArray(xpData.log)) {
    xpData.log = [];
  }
}

// STREAKS — your backend does NOT have this route
async function loadStreak() {
  streakData = { streak: 0 }; // placeholder so dashboard doesn't break
}

// MOOD — your backend does NOT have this route
async function loadMood() {
  moodToday = null; // placeholder
}

// FINANCE SUMMARY
async function loadFinanceSummary() {
  // Free users: disable finance summary
  if (userInfo.subscription !== "pro") {
    financeSummary = null;
    return;
  }

  financeSummary = await apiGet("https://backend-qkz7.onrender.com/api/finance/summary");
}

// -------------------------------
// DAILY MISSIONS (SYSTEM B)
// -------------------------------
function generateDailyMissions() {
  const categories = ["finance", "exercise", "cleaning", "cooking", "lifestyle"];

  const missionTemplates = {
    finance: ["Review one transaction", "Add an expense", "Check your budget"],
    exercise: ["Walk 10 minutes", "Stretch 5 minutes", "Do 10 pushups"],
    cleaning: ["Clean one surface", "5‑minute tidy", "Organize one item"],
    cooking: ["Cook one meal", "Prep ingredients", "Try a new recipe"],
    lifestyle: ["Drink water", "Plan tomorrow", "Read 5 minutes"]
  };

  categories.forEach(cat => {
    dailyMissions[cat] = missionTemplates[cat][Math.floor(Math.random() * missionTemplates[cat].length)];
  });
}

// -------------------------------
// HABIT RINGS (SYSTEM A)
// -------------------------------
async function loadMissions() {
  // Free users: disable missions
  if (userInfo.subscription !== "pro") {
    dailyMissions = {
      finance: "Upgrade to Pro",
      exercise: "Upgrade to Pro",
      cleaning: "Upgrade to Pro",
      cooking: "Upgrade to Pro",
      lifestyle: "Upgrade to Pro"
    };
    return;
  }

  // Pro users: load missions normally
  const res = await apiGet("https://backend-qkz7.onrender.com/api/missions/get");

  dailyMissions = {
    finance: res.missions[0] || "No mission",
    exercise: res.missions[1] || "No mission",
    cleaning: res.missions[2] || "No mission",
    cooking: res.missions[3] || "No mission",
    lifestyle: res.missions[4] || "No mission"
  };
}
function renderHabitRings() {
 const container = document.getElementById("habit-rings");

// Free users: lock habit rings
if (userInfo.subscription !== "pro") {
  container.innerHTML = "<p>Upgrade to Pro to unlock Habit Rings.</p>";
  return;
}

container.innerHTML = "";
  Object.keys(habitProgress).forEach(cat => {
    const percent = Number(habitProgress[cat]) || 0; // FIX: fallback to 0 if undefined

    container.innerHTML += `
      <div class="habit-ring">
        <svg class="ring" width="120" height="120">
          <circle class="bg" cx="60" cy="60" r="50"></circle>
          <circle class="progress" cx="60" cy="60" r="50"
            style="stroke-dashoffset:${314 - (314 * percent) / 100}">
          </circle>
        </svg>
        <div class="habit-label">${cat.toUpperCase()}</div>
        <div class="habit-percent">${percent}%</div>
      </div>
    `;
  });
}

// -------------------------------
// HABIT CARDS (SYSTEM C)
// -------------------------------
function renderHabitCards() {
  const container = document.getElementById("habit-cards");

  // Free users: lock habit cards
  if (userInfo.subscription !== "pro") {
    container.innerHTML = "<p>Upgrade to Pro to unlock Daily Missions.</p>";
    return;
  }

  container.innerHTML = "";
  Object.keys(dailyMissions).forEach(cat => {
    container.innerHTML += `
      <div class="habit-card">
        <h3>${cat.toUpperCase()}</h3>
        <p class="mission">Today: ${dailyMissions[cat]}</p>
        <p class="streak">Streak: ${streakData?.streak || 0} days</p>
        <p class="xp">XP: ${xpData?.xp || 0}</p>
        <button onclick="completeHabit('${cat.toLowerCase().trim()}')">Complete</button>
      </div>
    `;
  });
}

// -------------------------------
// COMPLETE HABIT ACTION
// -------------------------------
async function completeHabit(category) {
  // Free users cannot complete habits
  if (userInfo.subscription !== "pro") {
    alert("Upgrade to Pro to complete habits.");
    return;
  }
  // Highlight card animation
  const cards = document.querySelectorAll(".habit-card");
  cards.forEach(card => {
    if (card.querySelector("h3")?.textContent === category.toUpperCase()) {
      card.classList.add("completed");
      setTimeout(() => card.classList.remove("completed"), 600);
    }
  });

  // Update local progress
  habitProgress[category] = Math.min(100, habitProgress[category] + 25);
  saveHabitProgress();
  saveHabitHistory(habitProgress);
  saveStreakHistory(streakData?.streak || 0);
// -------------------------------
// STREAK LOGIC
// -------------------------------
const today = new Date().toDateString();

if (!streakData.lastCompletedDate) {
  streakData = { streak: 1, lastCompletedDate: today };
} else {
  const last = new Date(streakData.lastCompletedDate).toDateString();

  if (last !== today) {
    streakData.streak += 1;
    streakData.lastCompletedDate = today;
  }
}

saveStreak();
  // Refresh XP once
  xpData = await apiGet("https://backend-qkz7.onrender.com/api/xp");
  if (!xpData.log || !Array.isArray(xpData.log)) {
    xpData.log = [];
  }

  // Update XP locally for instant UI
  xpData.xp += 10;
  saveXPHistory(xpData.xp);
  xpData.log.push({ amount: 10, date: Date.now() });

  // Save XP in background
  apiPost("https://backend-qkz7.onrender.com/api/xp", {
    xp: xpData.xp,
    log: xpData.log
  });
}

// -------------------------------
// 3‑QUESTION SURVEY ONLY
// -------------------------------
const threeQuestionSurvey = [
  { id: 1, text: "How stressed do you feel today?" },
  { id: 2, text: "How motivated are you today?" },
  { id: 3, text: "How productive do you feel today?" }
];

async function loadThreeQuestionSurvey() {
  renderThreeQuestionSurvey(threeQuestionSurvey);
}

function renderThreeQuestionSurvey(questions) {
  const container = document.getElementById("survey-container");
   // Free users: lock survey
  if (userInfo.subscription !== "pro") {
    container.innerHTML = "<p>Upgrade to Pro to unlock Daily Check‑In.</p>";
    return;
  }
  container.innerHTML = `
    <h2>Daily Check‑In</h2>
    ${questions
      .map(
        q => `
        <div class="survey-question">
          <p>${q.text}</p>
          <input type="range" min="1" max="5" id="q-${q.id}">
        </div>
      `
      )
      .join("")}
    <button onclick="submitThreeQuestionSurvey()">Submit</button>
  `;
}

async function submitThreeQuestionSurvey() {
  const answers = [];

  document.querySelectorAll(".survey-question").forEach(q => {
    const id = q.querySelector("input").id.replace("q-", "");
    const value = q.querySelector("input").value;
    answers.push({ id, value });
  });

  saveSurvey3History(answers);

  await apiPost("https://backend-qkz7.onrender.com/api/survey", { answers });

  document.getElementById("survey-container").innerHTML =
    "<p>Thanks for checking in!</p>";
}

// -------------------------------
// XP HEADER RENDER
// -------------------------------
function renderHeader() {
  const levelLabel = document.getElementById("xpLevelLabel");
  const valueLabel = document.getElementById("xpValueLabel");
  const nextLabel = document.getElementById("xpNextLabel");
  const fill = document.getElementById("xpFill");

  const xp = xpData?.xp || 0;
  const level = Math.floor(xp / 100) + 1;
  const nextLevelXP = level * 100;
  const progress = Math.min(100, (xp / nextLevelXP) * 100);

  levelLabel.textContent = `Level ${level}`;
  valueLabel.textContent = `${xp} XP`;
  nextLabel.textContent = `Next level in ${nextLevelXP - xp} XP`;

  fill.style.width = `${progress}%`;
}

// -------------------------------
// XP LEVEL-UP POPUP
// -------------------------------
function showLevelUp() {
  const el = document.getElementById("xp-level-up");
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 1500);
}

// -------------------------------
// COACH (SYSTEM D)
// -------------------------------
async function renderCoachMessage() {
  const container = document.getElementById("coach");
  // Free users: lock coach
  if (userInfo.subscription !== "pro") {
    container.innerHTML = "<p>Upgrade to Pro to unlock Vaultwise Coach.</p>";
    return;
  }

  const xp = xpData?.xp || 0;
  const level = Math.floor(xp / 100) + 1;
  const nextLevelXP = level * 100;
  const xpToNext = nextLevelXP - xp;

  // Habit progress
  const completed = Object.values(habitProgress).filter(v => v >= 100).length;

  // Category-specific progress
  const weakestCategory = Object.entries(habitProgress)
    .sort((a, b) => a[1] - b[1])[0][0];

  // Missions (first 5 mapped)
  const missions = dailyMissions || {};

  let message = "";

  // XP-BASED COACHING
  if (xpToNext <= 20) {
    message = "🔥 You're extremely close to leveling up — finish one more habit!";
  } else if (xpToNext <= 50) {
    message = "⚡ You're making great progress — keep pushing toward the next level.";
  } else if (xp < 100) {
    message = "🌱 You're just getting started — small wins add up fast.";
  }

  // HABIT-BASED COACHING
  if (completed >= 3) {
    message = "💪 You're on fire today — three habits done already!";
  } else if (completed === 1) {
    message = "✨ Nice! You completed your first habit of the day.";
  }

  // CATEGORY-SPECIFIC COACHING
  if (!message && weakestCategory) {
    message = `🎯 Try focusing on your ${weakestCategory} habit — a small win there boosts your whole day.`;
  }

  // MISSION-BASED COACHING
  const missionList = Object.values(missions).filter(Boolean);
  if (!message && missionList.length > 0) {
    const randomMission = missionList[Math.floor(Math.random() * missionList.length)];
    message = `📌 Coach Tip: Try completing this mission today — "${randomMission}".`;
  }

  // BACKEND FALLBACK
  if (!message) {
    try {
      const coach = await apiGet("https://backend-qkz7.onrender.com/api/coach/message");
      message = coach.message;
    } catch {
      message = "You're doing great — keep going!";
    }
  }

  // RENDER
  container.innerHTML = `
    <h2>Vaultwise Coach</h2>
    <p>${message}</p>
  `;
  container.classList.add("loaded");
}

// -------------------------------
// MAIN DASHBOARD RENDER
// -------------------------------
async function renderDashboard() {
  await loadXP();
  await loadMissions();

  renderHeader();
  renderHabitRings();
  renderHabitCards();
  renderCoachMessage();
  loadThreeQuestionSurvey();
}
