// Load survey history from localStorage
function getSurveyHistory() {
  return JSON.parse(localStorage.getItem("surveyHistory") || "[]");
}

// Render simple bar charts
function renderChart(containerId, values, labelFormatter = v => v) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (values.length === 0) {
    container.innerHTML = "<p>No data yet. Complete a survey to begin tracking.</p>";
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

// Render personality timeline
function renderPersonalityTimeline(history) {
  const list = document.getElementById("personalityTimeline");
  if (!list) return;

  if (history.length === 0) {
    list.innerHTML = "<p>No personality data yet.</p>";
    return;
  }

  list.innerHTML = history
    .map(entry => `
      <li>
        <strong>${new Date(entry.timestamp).toLocaleDateString()}</strong><br>
        ${entry.personality}
      </li>
    `)
    .join("");
}

// Render weekly summaries
function renderWeeklySummaries(history) {
  const container = document.getElementById("weeklySummaries");
  if (!container) return;

  if (history.length === 0) {
    container.innerHTML = "<p>No weekly summaries yet.</p>";
    return;
  }

  container.innerHTML = history
    .map(entry => `
      <div class="summary-card">
        <h3>${new Date(entry.timestamp).toLocaleDateString()}</h3>
        <p><strong>Life Score:</strong> ${entry.lifeScore}</p>
        <p><strong>Impulse Risk:</strong> ${entry.impulseRisk}</p>
        <p><strong>Savings Consistency:</strong> ${entry.savingsConsistency}</p>
        <p><strong>Food Cost:</strong> $${entry.realisticFoodSpend}</p>
        <p><strong>Kid Budget:</strong> $${entry.kidBudget.min} – $${entry.kidBudget.max}</p>
      </div>
    `)
    .join("");
}

// Initialize Reports Page
document.addEventListener("DOMContentLoaded", () => {
  const history = getSurveyHistory();

  renderChart(
    "lifeScoreChart",
    history.map(h => h.lifeScore),
    v => `${v}`
  );

  renderChart(
    "impulseChart",
    history.map(h => h.impulseRisk),
    v => `${v}`
  );

  renderChart(
    "savingsChart",
    history.map(h => h.savingsConsistency),
    v => `${v}`
  );

  renderChart(
    "foodChart",
    history.map(h => h.realisticFoodSpend),
    v => `$${v}`
  );

  renderPersonalityTimeline(history);
  renderWeeklySummaries(history);
});