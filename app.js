// ===============================
// CONFIG
// ===============================
const API = "https://backend-qkz7.onrender.com";

// ===============================
// AUTH HELPERS
// ===============================
function saveToken(token) {
  localStorage.setItem("token", token);
}

function getToken() {
  return localStorage.getItem("token");
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// ===============================
// REGISTER
// ===============================
async function registerUser(email, password) {
  const res = await fetch(`${API}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

// ===============================
// LOGIN
// ===============================
async function loginUser(email, password) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

// ===============================
// FINANCE HELPERS
// ===============================
async function fetchSummary() {
  const token = getToken();
  const res = await fetch(`${API}/api/finance/summary`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

async function fetchHistory() {
  const token = getToken();
  const res = await fetch(`${API}/api/finance/history`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

// ===============================
// SAVE ENTRY
// ===============================
async function saveEntry() {
  const token = getToken();

  const payload = {
    income: Number(document.getElementById("monthlyIncome")?.value || 0),
    expenses: Number(document.getElementById("monthlyExpenses")?.value || 0),
    portfolio: Number(document.getElementById("portfolioValue")?.value || 0),
    goal: Number(document.getElementById("savingsGoal")?.value || 0)
  };

  const res = await fetch(`${API}/api/finance/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (res.ok) {
    location.reload();
  } else {
    alert("Failed to save entry");
  }
}

// ===============================
// DASHBOARD INIT
// ===============================
async function initDashboard() {
  const token = getToken();
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const summary = await fetchSummary();
  const history = await fetchHistory();

  // MATCHES YOUR HTML IDs
  document.getElementById("totalIncome").innerText = `$${summary.totalIncome ?? 0}`;
  document.getElementById("totalExpenses").innerText = `$${summary.totalExpenses ?? 0}`;
  document.getElementById("totalPortfolio").innerText = `$${summary.totalPortfolio ?? 0}`;

  const table = document.getElementById("history-body");
  table.innerHTML = "";

  history.forEach(entry => {
    table.innerHTML += `
      <tr>
        <td>${entry.month}</td>
        <td>$${entry.income}</td>
        <td>$${entry.expenses}</td>
        <td>$${entry.portfolio}</td>
        <td>$${entry.goal}</td>
      </tr>
    `;
  });
}

// ===============================
// DOMContentLoaded ROUTER
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  // REGISTER PAGE
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const res = await fetch(`${API}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          alert("Registered successfully");
          window.location.href = "login.html";
        } else {
          alert(data.message || "Registration failed");
        }
      } catch (err) {
        alert("Network error");
      }
    });
  }

  // LOGIN PAGE
  const loginForm = document.querySelector("#loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.querySelector("#email").value.trim();
      const password = document.querySelector("#password").value.trim();
      const data = await loginUser(email, password);
      if (!data.token) {
        alert(data.message || "Login failed");
        return;
      }
      saveToken(data.token);
      window.location.href = "dashboard.html";
    });
  }

  // DASHBOARD PAGE
  if (document.body.id === "dashboard") {
    initDashboard();
  }

});
