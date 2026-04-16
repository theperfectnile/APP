// -------------------------------
// Load Dashboard Summary
// -------------------------------
async function loadDashboard() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("https://backend-qkz7.onrender.com/api/finance/summary", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    document.getElementById("income").innerText = `$${data.monthlyIncome}`;
    document.getElementById("expenses").innerText = `$${data.monthlyExpenses}`;
    document.getElementById("savings").innerText = `$${data.netSavings}`;
    document.getElementById("portfolio").innerText = `$${data.portfolioValue || 0}`;

  } catch (err) {
    console.error("Dashboard summary error:", err);
    alert("Error loading dashboard summary");
  }
}



// -------------------------------
// Load Finance History
// -------------------------------
async function loadHistory() {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("https://backend-qkz7.onrender.com/api/finance/all", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    renderHistory(data);

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
  const token = localStorage.getItem("token");

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
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("https://backend-qkz7.onrender.com/api/finance/analyze", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });

    const insights = await res.json();
    alert(insights.message);

  } catch (err) {
    console.error("Insights error:", err);
    alert("Error analyzing insights");
  }
}



// -------------------------------
// Initialize Dashboard
// -------------------------------
loadDashboard();
loadHistory();
