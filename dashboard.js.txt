// dashboard.js
const API_BASE = "https://your-backend.onrender.com/api"; // <-- set to your Render URL

function requireAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
  }
  return token;
}

const token = requireAuth();

// month/year dropdowns
const monthSelect = document.getElementById("monthSelect");
const yearSelect = document.getElementById("yearSelect");

const now = new Date();
const currentYear = now.getFullYear();

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

monthNames.forEach((name, index) => {
  const opt = document.createElement("option");
  opt.value = index + 1;
  opt.textContent = name;
  if (index === now.getMonth()) opt.selected = true;
  monthSelect.appendChild(opt);
});

for (let y = currentYear - 3; y <= currentYear + 1; y++) {
  const opt = document.createElement("option");
  opt.value = y;
  opt.textContent = y;
  if (y === currentYear) opt.selected = true;
  yearSelect.appendChild(opt);
}

// sign out
document.getElementById("signOutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

// trial
async function loadTrialStatus() {
  try {
    const res = await fetch(`${API_BASE}/finance/trial-status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    const el = document.getElementById("trialStatus");
    if (data.trialActive) {
      el.textContent = `Trial active: ${data.daysLeft} day(s) left`;
    } else {
      el.textContent = `No active trial`;
    }
  } catch (e) {
    console.error(e);
  }
}

document.getElementById("trialBtn").addEventListener("click", async () => {
  try {
    const res = await fetch(`${API_BASE}/finance/start-trial`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    alert(data.message || "Trial started");
    loadTrialStatus();
  } catch (e) {
    console.error(e);
  }
});

// save entry
document.getElementById("saveEntryBtn").addEventListener("click", async () => {
  const body = {
    month: Number(monthSelect.value),
    year: Number(yearSelect.value),
    income: Number(document.getElementById("incomeInput").value),
    expenses: Number(document.getElementById("expensesInput").value),
    portfolio: Number(document.getElementById("portfolioInput").value),
    goal: Number(document.getElementById("goalInput").value),
  };

  if (!body.income || !body.expenses || !body.portfolio || !body.goal) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/finance/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "Error saving entry");
      return;
    }

    await loadEntries();
    alert("Entry saved.");
  } catch (e) {
    console.error(e);
  }
});

// analyze
document.getElementById("analyzeBtn").addEventListener("click", async () => {
  try {
    const res = await fetch(`${API_BASE}/finance/analyze`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    if (!data.latest) {
      document.getElementById("insightsText").textContent = data.insights;
      return;
    }

    document.getElementById("incomeValue").textContent = `$${data.latest.income}`;
    document.getElementById("expensesValue").textContent = `$${data.latest.expenses}`;
    document.getElementById("savingsValue").textContent = `$${data.netSavings}`;
    document.getElementById("portfolioValue").textContent = `$${data.latest.portfolio}`;
    document.getElementById("insightsText").textContent = data.insights;
  } catch (e) {
    console.error(e);
  }
});

// load entries into history table
async function loadEntries() {
  try {
    const res = await fetch(`${API_BASE}/finance/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const entries = await res.json();
    const tbody = document.getElementById("historyBody");
    tbody.innerHTML = "";

    entries.forEach((e) => {
      const tr = document.createElement("tr");
      const monthLabel = `${monthNames[e.month - 1]} ${e.year}`;
      tr.innerHTML = `
        <td>${monthLabel}</td>
        <td>$${e.income}</td>
        <td>$${e.expenses}</td>
        <td>$${e.portfolio}</td>
        <td>$${e.goal}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    console.error(e);
  }
}

// initial load
loadEntries();
loadTrialStatus();
