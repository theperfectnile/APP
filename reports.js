// ========================================
// REPORTS.JS — NEW HABIT SYSTEM VERSION
// Tracks:
// - Habit progress history
// - 3-question survey trends
// - XP timeline
// - Streak history
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
// GENERIC BAR CHART RENDERER
// -------------------------------
function renderChart(containerId, values, labelFormatter = v => v) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (values.length === 0) {
    container.innerHTML = "<p>No data yet.</p>";
    return;
  }

  const max = Math.max(...values);

  container.innerHTML = values
    .map(v => `
      <div class="chart-bar">
        <div class="bar" style="height:${(v / max) * 100}%"></div>
        <span class="bar-label">${labelFormatter(v)}</span>
      </div>
    `)
    .join("");
}

// -------------------------------
// HABIT HISTORY TIMELINE
// -------------------------------
function renderHabitTimeline(history) {
  const container = document.getElementById("habitTimeline");
  if (!container) return;

  if (history.length === 0) {
    container.innerHTML = "<p>No habit data yet.</p>";
    return;
  }

  container.innerHTML = history
    .map(entry => `
      <li>
        <strong>${new Date(entry.timestamp).toLocaleDateString()}</strong><br>
        Finance: ${entry.finance}%<br>
        Exercise: ${entry.exercise}%<br>
        Cleaning: ${entry.cleaning}%<br>
        Cooking: ${entry.cooking}%<br>
        Lifestyle: ${entry.lifestyle}%
      </li>
    `)
    .join("");
}

// -------------------------------
// SURVEY (3-QUESTION) TRENDS
// -------------------------------
function renderSurvey3Charts(history) {
  renderChart(
    "surveyMoodChart",
    history.map(h => h.mood),
    v => v
  );

  renderChart(
    "surveyEnergyChart",
    history.map(h => h.energy),
    v => v
  );

  renderChart(
    "surveyStressChart",
    history.map(h => h.stress),
    v => v
  );
}

// -------------------------------
// XP TIMELINE
// -------------------------------
function renderXPTimeline(history) {
  renderChart(
    "xpChart",
    history.map(h => h.xp),
    v => `${v} XP`
  );
}

// -------------------------------
// STREAK TIMELINE
// -------------------------------
function renderStreakTimeline(history) {
  renderChart(
    "streakChart",
    history.map(h => h.streak),
    v => `${v} days`
  );
}

// -------------------------------
// INITIALIZE REPORTS PAGE
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const habitHistory = getHabitHistory();
  const survey3History = getSurvey3History();
  const xpHistory = getXPHistory();
  const streakHistory = getStreakHistory();

  renderHabitTimeline(habitHistory);
  renderSurvey3Charts(survey3History);
  renderXPTimeline(xpHistory);
  renderStreakTimeline(streakHistory);
});
