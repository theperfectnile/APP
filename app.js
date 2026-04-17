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
// FORGOT PASSWORD (TEMP VERSION)
// ===============================
async function sendReset(event) {
  event.preventDefault();

  const email = document.querySelector("#forgotEmail").value.trim();
  const msg = document.querySelector("#forgotMessage");

  try {
    const res = await fetch(`${API}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (res.ok) {
      msg.textContent = data.message || "Reset link sent!";
      msg.style.color = "#00ffaa";
    } else {
      msg.textContent = data.message || "Email not found";
      msg.style.color = "#ff4d4d";
    }
  } catch (err) {
    msg.textContent = "Network error — try again later.";
    msg.style.color = "#ff4d4d";
  }
}

// ===============================
// RESET PASSWORD (TEMP VERSION)
// ===============================
async function resetPassword(event) {
  event.preventDefault();
  alert("Reset password is not implemented yet.");
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
  const res = await fetch(`${API}/api/finance/all`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

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

async function analyzeInsights() {
  const token = getToken();
  const res = await fetch(`${API}/api/finance/analyze`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  alert(data.message || "No insights returned");
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

  document.getElementById("income").innerText = `$${summary.monthlyIncome ?? 0}`;
  document.getElementById("expenses").innerText = `$${summary.monthlyExpenses ?? 0}`;
  document.getElementById("savings").innerText = `$${summary.netSavings ?? 0}`;
  document.getElementById("portfolio").innerText = `$${summary.portfolioValue ?? 0}`;

  const table = document.getElementById("history-body");
  table.innerHTML = "";

  history.forEach(entry => {
    table.innerHTML += `
      <tr>
        <td>${entry.month} ${entry.year}</td>
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
  // Register page
  const registerForm = document.querySelector("#registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.querySelector("#email").value.trim();
      const password = document.querySelector("#password").value.trim();
      const data = await registerUser(email, password);
      if (data.message === "Registered successfully") {
        alert("Account created!");
        window.location.href = "login.html";
      } else {
        alert(data.message || "Registration failed");
      }
    });
  }

  // Login page
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

  // Dashboard page
  if (document.body.id === "dashboard") {
    initDashboard();
  }
});

