// ===============================
// DASHBOARD.JS — FULL REWRITE
// Habit Improvement Dashboard
// Finance • Exercise • Cleaning • Cooking • Lifestyle
// Dark Mode • Habit Rings • Daily Missions • Coach
// ===============================

// -------------------------------
// GLOBAL STATE
// -------------------------------
let userInfo = null;
let xpData = null;
let streakData = null;
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
// INITIAL LOAD
// -------------------------------
document.addEventListener("DOMContentLoaded", async () => {
    await loadUserInfo();
    await loadXP();
    await loadFinanceSummary();
    await loadMissions();
    renderDashboard();
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
  xpData = await apiGet("https://backend-qkz7.onrender.com/api/xp");
  // SAFETY FIX — always ensure log exists
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
  const res = await apiGet("https://backend-qkz7.onrender.com/api/missions/get");

  // FIX: Normalize category keys to lowercase so they match habitProgress
  dailyMissions = Object.fromEntries(
    Object.entries(res.missions).map(([k, v]) => [k.toLowerCase(), v])
  );
}

function renderHabitRings() {
    const container = document.getElementById("habit-rings");
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
    container.innerHTML = "";

    Object.keys(dailyMissions).forEach(cat => {
        container.innerHTML += `
            <div class="habit-card">
                <h3>${cat.toUpperCase()}</h3>
                <p class="mission">Today: ${dailyMissions[cat]}</p>
                <p class="streak">Streak: ${streakData?.streak || 0} days</p>
                <p class="xp">XP: ${xpData?.xp || 0}</p>
<button onclick="completeHabit('${cat.toLowerCase()}')">Complete</button>
            </div>
        `;
    });
}

// -------------------------------
// COMPLETE HABIT ACTION
// -------------------------------
async function completeHabit(category) {
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

// Refresh XP once
xpData = await apiGet("https://backend-qkz7.onrender.com/api/xp");
if (!xpData.log || !Array.isArray(xpData.log)) {
  xpData.log = [];
}

// Update XP locally for instant UI
xpData.xp += 10;
xpData.log.push({ amount: 10, date: Date.now() });

// Save XP in background
apiPost("https://backend-qkz7.onrender.com/api/xp", {
  xp: xpData.xp,
  log: xpData.log
});

// Re-render UI instantly
renderDashboard();
renderCoachMessage();
}
// -------------------------------
// 3‑QUESTION SURVEY ONLY
// -------------------------------

// Define the questions (backend does NOT provide them)
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

  await apiPost("https://backend-qkz7.onrender.com/api/survey", { answers });

  document.getElementById("survey-container").innerHTML =
    "<p>Thanks for checking in!</p>";
}

// -------------------------------
// COACH (SYSTEM D)
// -------------------------------
async function renderCoachMessage() {
  const container = document.getElementById("coach");
  container.innerHTML = `
    <h2>Your Coach</h2>
    <p>You're doing great — keep going!</p>
  `;
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
// MAIN DASHBOARD RENDER
// -------------------------------
async function renderDashboard() {
                            // reload XP
    renderHabitRings();
    renderHabitCards();
    loadThreeQuestionSurvey();
}
