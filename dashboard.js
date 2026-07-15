if (!window.userInfo) window.userInfo = {};

if (window.userInfo.email === "seand667@gmail.com") {
    window.userInfo.subscription = "free";
    window.userInfo.subscriptionStatus = "active";
    console.log("🔓 Developer override applied for Sean (forced FREE mode)");
}
// 🔓 Developer bypass — force PRO inside dashboard.js
if (!window.userInfo) window.userInfo = {};
window.userInfo.subscription = "pro";
window.userInfo.subscriptionStatus = "active";
console.log("🔓 Developer bypass applied inside dashboard.js");
// ======================================================
// XP SYSTEM
// ======================================================
async function loadXP() {
  xpData = await apiGet("https://backend-qkz7.onrender.com/api/xp");

  if (!xpData.log || !Array.isArray(xpData.log)) {
    xpData.log = [];
  }
}

// ======================================================
// STREAKS (placeholder)
// ======================================================
async function loadStreak() {
  streakData = { streak: 0 };
}

// ======================================================
// MOOD (placeholder)
// ======================================================
async function loadMood() {
  moodToday = null;
}

// ======================================================
// FINANCE SUMMARY
// ======================================================
async function loadFinanceSummary() {
  financeSummary = await apiGet("https://backend-qkz7.onrender.com/api/finance/summary");
}

// ======================================================
// DAILY MISSIONS (SYSTEM B)
// ======================================================
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

// ======================================================
// HABIT RINGS (SYSTEM A)
// ======================================================
async function loadMissions() {
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

  container.innerHTML = "";
  Object.keys(habitProgress).forEach(cat => {
    const percent = Number(habitProgress[cat]) || 0;

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

// ======================================================
// HABIT CARDS (SYSTEM C)
// ======================================================
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
        <button onclick="completeHabit('${cat.toLowerCase().trim()}')">Complete</button>
      </div>
    `;
  });
}

// ======================================================
// COMPLETE HABIT ACTION
// ======================================================
async function completeHabit(category) {
  const cards = document.querySelectorAll(".habit-card");
  cards.forEach(card => {
    if (card.querySelector("h3")?.textContent === category.toUpperCase()) {
      card.classList.add("completed");
      setTimeout(() => card.classList.remove("completed"), 600);
    }
  });

  habitProgress[category] = Math.min(100, habitProgress[category] + 25);
  saveHabitProgress();
  saveHabitHistory(habitProgress);
  saveStreakHistory(streakData?.streak || 0);

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

  xpData = await apiGet("https://backend-qkz7.onrender.com/api/xp");
  if (!xpData.log || !Array.isArray(xpData.log)) {
    xpData.log = [];
  }

  xpData.xp += 10;
  saveXPHistory(xpData.xp);
  xpData.log.push({ amount: 10, date: Date.now() });

  apiPost("https://backend-qkz7.onrender.com/api/xp", {
    xp: xpData.xp,
    log: xpData.log
  });
}

// ======================================================
// 3‑QUESTION SURVEY
// ======================================================
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

  saveSurvey3History(answers);

  await apiPost("https://backend-qkz7.onrender.com/api/survey", { answers });

  document.getElementById("survey-container").innerHTML =
    "<p>Thanks for checking in!</p>";
}

// ======================================================
// XP HEADER
// ======================================================
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

// ======================================================
// COACH (SYSTEM D)
// ======================================================
async function renderCoachMessage() {
  const container = document.getElementById("coach");

  const xp = xpData?.xp || 0;
  const level = Math.floor(xp / 100) + 1;
  const nextLevelXP = level * 100;
  const xpToNext = nextLevelXP - xp;

  const completed = Object.values(habitProgress).filter(v => v >= 100).length;

  const weakestCategory = Object.entries(habitProgress)
    .sort((a, b) => a[1] - b[1])[0][0];

  const missions = dailyMissions || {};

  let message = "";

  if (xpToNext <= 20) {
    message = "🔥 You're extremely close to leveling up — finish one more habit!";
  } else if (xpToNext <= 50) {
    message = "⚡ You're making great progress — keep pushing toward the next level.";
  } else if (xp < 100) {
    message = "🌱 You're just getting started — small wins add up fast.";
  }

  if (completed >= 3) {
    message = "💪 You're on fire today — three habits done already!";
  } else if (completed === 1) {
    message = "✨ Nice! You completed your first habit of the day.";
  }

  if (!message && weakestCategory) {
    message = `🎯 Try focusing on your ${weakestCategory} habit — a small win there boosts your whole day.`;
  }

  const missionList = Object.values(missions).filter(Boolean);
  if (!message && missionList.length > 0) {
    const randomMission = missionList[Math.floor(Math.random() * missionList.length)];
    message = `📌 Coach Tip: Try completing this mission today — "${randomMission}".`;
  }

  if (!message) {
    try {
      const coach = await apiGet("https://backend-qkz7.onrender.com/api/coach/message");
      message = coach.message;
    } catch {
      message = "You're doing great — keep going!";
    }
  }

  container.innerHTML = `
    <h2>Vaultwise Coach</h2>
    <p>${message}</p>
  `;
  container.classList.add("loaded");
}
// 🔒 Keep developer override persistent
setInterval(() => {
  if (!window.userInfo) window.userInfo = {};
  window.userInfo.subscription = "pro";
  window.userInfo.subscriptionStatus = "active";
}, 1000);
// ======================================================
// MAIN DASHBOARD RENDER
// ======================================================
async function renderDashboard() {
  await loadXP();
  await loadMissions();

  renderHeader();
  renderHabitRings();
  renderHabitCards();
  renderCoachMessage();
  loadThreeQuestionSurvey();
}
