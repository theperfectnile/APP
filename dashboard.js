// -------------------------------
// Auth helpers
// -------------------------------
function getToken() {
  return localStorage.getItem("token");
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// -------------------------------
// Load Dashboard Summary
// -------------------------------
async function loadDashboard() {
  const token = getToken();

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("https://backend-qkz7.onrender.com/api/finance/summary", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    document.getElementById("income").innerText = `$${data.monthlyIncome ?? 0}`;
    document.getElementById("expenses").innerText = `$${data.monthlyExpenses ?? 0}`;
    document.getElementById("savings").innerText = `$${data.netSavings ?? 0}`;
    document.getElementById("portfolio").innerText = `$${data.portfolioValue ?? 0}`;

  } catch (err) {
    console.error("Dashboard summary error:", err);
    alert("Error loading dashboard summary");
  }
}

// -------------------------------
// Load Finance History
// -------------------------------
async function loadHistory() {
  const token = getToken();

  try {
    const res = await fetch("https://backend-qkz7.onrender.com/api/finance/all", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    renderHistory(data);
    renderCharts(data);

  } catch (err) {
    console.error("History load error:", err);
  }
}

// -------------------------------
// Render History Table
// -------------------------------
function renderHistory(data) {
  const table = document.getElementById("history-body");
  table.innerHTML = "";

  data.forEach(entry => {
    const row = `
      <tr>
        <td>${entry.month} ${entry.year}</td>
        <td>$${entry.income}</td>
        <td>$${entry.expenses}</td>
        <td>$${entry.portfolio}</td>
        <td>$${entry.goal}</td>
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

  const payload = {
    month: document.getElementById("month").value,
    year: document.getElementById("year").value,
    income: document.getElementById("monthlyIncome").value,
    expenses: document.getElementById("monthlyExpenses").value,
    portfolio: document.getElementById("portfolioValue").value,
    goal: document.getElementById("savingsGoal").value
  };

  try {
    const res = await fetch("https://backend-qkz7.onrender.com/api/finance/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      location.reload();
    } else {
      alert("Failed to save entry");
    }

  } catch (err) {
    console.error("Save entry error:", err);
    alert("Error saving entry");
  }
}

// -------------------------------
// Analyze Insights
// -------------------------------
async function analyzeInsights() {
  const token = getToken();

  try {
    const res = await fetch("https://backend-qkz7.onrender.com/api/finance/analyze", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });

    const insights = await res.json();
    alert(insights.message || "No insights returned");

  } catch (err) {
    console.error("Insights error:", err);
    alert("Error analyzing insights");
  }
}

// -------------------------------
// Charts
// -------------------------------
function renderCharts(data) {
  if (!Array.isArray(data) || data.length === 0) return;

  const months = data.map(e => `${e.month} ${e.year}`);
  const income = data.map(e => e.income);
  const expenses = data.map(e => e.expenses);
  const savings = data.map(e => e.income - e.expenses);

  const incomeCtx = document.getElementById("incomeExpenseChart");
  const savingsCtx = document.getElementById("savingsChart");

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
    },
    options: {
      plugins: { legend: { labels: { color: "#e0e0e0" } } },
      scales: {
        x: { ticks: { color: "#bfbfbf" } },
        y: { ticks: { color: "#bfbfbf" } }
      }
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
    },
    options: {
      plugins: { legend: { labels: { color: "#e0e0e0" } } },
      scales: {
        x: { ticks: { color: "#bfbfbf" } },
        y: { ticks: { color: "#bfbfbf" } }
      }
    }
  });
}

// -------------------------------
// Initialize Dashboard
// -------------------------------
loadDashboard();
loadHistory();
