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
    await loadStreak();
    await loadMood();
    await loadFinanceSummary();
    generateDailyMissions();
    renderDashboard();
    renderCoachMessage();
});

// -------------------------------
// API HELPERS
// -------------------------------
async function apiGet(url) {
    const res = await fetch(url);
    return res.json();
}

async function apiPost(url, body) {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    return res.json();
}

// -------------------------------
// LOADERS
// -------------------------------
async function loadUserInfo() {
    userInfo = await apiGet("/user/info");
}

async function loadXP() {
    xpData = await apiGet("/xp/get");
}

async function loadStreak() {
    streakData = await apiGet("/streaks/get");
}

async function loadMood() {
    moodToday = await apiGet("/mood/today");
}

async function loadFinanceSummary() {
    financeSummary = await apiGet("/finance/summary");
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
function renderHabitRings() {
    const container = document.getElementById("habit-rings");
    container.innerHTML = "";

    Object.keys(habitProgress).forEach(cat => {
        const percent = habitProgress[cat];

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
                <button onclick="completeHabit('${cat}')">Complete</button>
            </div>
        `;
    });
}

// -------------------------------
// COMPLETE HABIT ACTION
// -------------------------------
async function completeHabit(category) {
    habitProgress[category] = Math.min(100, habitProgress[category] + 25);

    await apiPost("/xp/add", { amount: 10 });
    xpData = await apiGet("/xp/get");

    renderDashboard();
    renderCoachMessage();
}

// -------------------------------
// 3‑QUESTION SURVEY ONLY
// -------------------------------
async function loadThreeQuestionSurvey() {
    const survey = await apiGet("/survey/3-question");
    renderThreeQuestionSurvey(survey.questions);
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

    await apiPost("/survey/3-question/submit", { answers });
    document.getElementById("survey-container").innerHTML = "<p>Thanks for checking in!</p>";
}

// -------------------------------
// COACH (SYSTEM D)
// -------------------------------
async function renderCoachMessage() {
    const coach = await apiGet("/coach/message");

    const container = document.getElementById("coach");
    container.innerHTML = `
        <h2>Your Coach</h2>
        <p>${coach.message}</p>
    `;
}

// -------------------------------
// MAIN DASHBOARD RENDER
// -------------------------------
function renderDashboard() {
    renderHabitRings();
    renderHabitCards();
    loadThreeQuestionSurvey();
}
