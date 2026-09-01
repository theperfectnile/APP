// ========================================
// REPORTS.JS — ENHANCED + SAFE VERSION
// ========================================

// -------------------------------
// LOCAL STORAGE HELPERS
// -------------------------------
function getHabitHistory() {
  return JSON.parse(localStorage.getItem("habitHistory") || "[]");
}

function getSurvey3History() {
  return JSON.parse(localStorage.getItem("survey3History") || "[]");
}

function getXPHistory() {
  return JSON.parse(localStorage.getItem("xpHistory") || "[]");
}

function getStreakHistory() {
  return JSON.parse(localStorage.getItem("streakHistory") || "[]");
}

// -------------------------------
// BACKEND HELPERS
// -------------------------------
async function getBackendWeekly() {
  try {
    const [
      weeklyHabits,
      weeklyXP,
      weeklyStreak,
      missions,
      finance
    ] = await Promise.all([
      apiGet("/api/habits/weekly"),
      apiGet("/api/xp/weekly"),
      apiGet("/api/streak"),
      apiGet("/api/missions/get"),
      apiGet("/api/finance/summary")
    ]);

    return { weeklyHabits, weeklyXP, weeklyStreak, missions, finance };

  } catch (err) {
    console.error("BACKEND WEEKLY ERROR:", err);
    return null;
  }
}

// -------------------------------
// GENERIC BAR CHART RENDERER
// -------------------------------
function renderChart(containerId, values, labelFormatter = v => v) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!values || values.length === 0) {
    container.innerHTML = "<p>No data yet.</p>";
    return;
  }

  const max = Math.max(...values);

  const colors = {
    surveyMoodChart: "#4caf50",
    surveyEnergyChart: "#2196f3",
    surveyStressChart: "#f44336",
    xpChart: "#9c27b0",
    streakChart: "#ff9800"
  };

  const color = colors[containerId] || "#4a90e2";

  container.innerHTML = values.map(v => `
    <div class="chart-bar">
      <div class="bar" style="height:${(v / max) * 100}%; background:${color};"></div>
      <span class="bar-label">${labelFormatter(v)}</span>
    </div>
  `).join("");
}

// -------------------------------
// HABIT HISTORY TIMELINE
// -------------------------------
function renderHabitTimeline(history) {
  const container = document.getElementById("habitTimeline");
  if (!container) return;

  if (!history || history.length === 0) {
    container.innerHTML = "<p>No habit data yet.</p>";
    return;
  }

  container.innerHTML = history.map(entry => `
    <li class="timeline-entry">
      <strong>${new Date(entry.timestamp).toLocaleDateString()}</strong>
      <div class="timeline-tags">
        <span class="tag finance">Finance: ${entry.finance}%</span>
        <span class="tag exercise">Exercise: ${entry.exercise}%</span>
        <span class="tag cleaning">Cleaning: ${entry.cleaning}%</span>
        <span class="tag cooking">Cooking: ${entry.cooking}%</span>
        <span class="tag lifestyle">Lifestyle: ${entry.lifestyle}%</span>
      </div>
    </li>
  `).join("");
}

// -------------------------------
// SURVEY (3-QUESTION) TRENDS
// -------------------------------
function renderSurvey3Charts(history) {
  const mood = history.map(h => h.mood);
  const energy = history.map(h => h.energy);
  const stress = history.map(h => h.stress);

  renderChart("surveyMoodChart", mood.length ? mood : [3,4,5,4,3], v => v);
  renderChart("surveyEnergyChart", energy.length ? energy : [2,3,4,3,2], v => v);
  renderChart("surveyStressChart", stress.length ? stress : [5,4,3,4,5], v => v);
}

// -------------------------------
// XP TIMELINE
// -------------------------------
function renderXPTimeline(history) {
  const xp = history.map(h => h.xp);
  renderChart("xpChart", xp.length ? xp : [10,20,30,40], v => `${v} XP`);
}

// -------------------------------
// STREAK TIMELINE
// -------------------------------
function renderStreakTimeline(history) {
  const streak = history.map(h => h.streak);
  renderChart("streakChart", streak.length ? streak : [1,2,3,4], v => `${v} days`);
}

// -------------------------------
// WEEKLY BACKEND SUMMARY
// -------------------------------
function renderWeeklyBackend(data) {
  if (!data) return;

  const { weeklyHabits, weeklyXP, weeklyStreak, missions, finance } = data;

  const habitsCompleted = weeklyHabits?.completed ?? weeklyHabits?.total ?? 0;
  const xpEarned = weeklyXP?.earned ?? weeklyXP?.total ?? 0;
  const streakDays = weeklyStreak?.days ?? weeklyStreak?.current ?? 0;

  document.getElementById("weeklyHabits").textContent = habitsCompleted;
  document.getElementById("weeklyXP").textContent = xpEarned + " XP";
  document.getElementById("weeklyStreak").textContent = streakDays + " Days";

  document.getElementById("weeklyHabitsChange").textContent =
    weeklyHabits?.change ?? "0%";

  document.getElementById("weeklyXPChange").textContent =
    weeklyXP?.change ?? "0%";

  const summary = document.getElementById("weeklySummary");
  summary.textContent = `
    You completed ${habitsCompleted} habits this week.
    XP earned: ${xpEarned}.
    Streak: ${streakDays} days.
    Mission example: "${missions?.missions?.[0] ?? "None"}".
    Weekly spending: $${finance?.weeklySpending ?? 0}.
  `;
}

// -------------------------------
// INITIALIZE REPORTS PAGE
// -------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  const habitHistory = getHabitHistory();
  const survey3History = getSurvey3History();
  const xpHistory = getXPHistory();
  const streakHistory = getStreakHistory();

  renderHabitTimeline(habitHistory);
  renderSurvey3Charts(survey3History);
  renderXPTimeline(xpHistory);
  renderStreakTimeline(streakHistory);

  const backendData = await getBackendWeekly();
  renderWeeklyBackend(backendData);

  console.log("✅ Reports page fully loaded");
});
