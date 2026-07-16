if (!window.userInfo) window.userInfo = {};

if (window.userInfo.email === "seand667@gmail.com") {
    window.userInfo.subscription = "free";
    window.userInfo.subscriptionStatus = "active";
    console.log("🔓 Developer override applied for Sean (forced FREE mode)");
}
// ===============================
// CONFIG
// ===============================
const API = "https://backend-qkz7.onrender.com";

// ===============================
// GLOBAL API HELPERS
// ===============================
async function apiGet(url) {
  const token = localStorage.getItem("token");
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

async function apiPost(url, data) {
  const token = localStorage.getItem("token");
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

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
// PREMIUM LOGIC (Optional)
// ===============================
function isPremium() {
  return localStorage.getItem("premium") === "true";
}

function isTrialActive() {
  const trialEnd = localStorage.getItem("trialEnd");
  if (!trialEnd) return false;
  return Date.now() < Number(trialEnd);
}

function startTrial() {
  const end = Date.now() + 7 * 24 * 60 * 60 * 1000;
  localStorage.setItem("trialEnd", end.toString());
}

// ===============================
// LOGIN FUNCTION
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
// REGISTER FUNCTION
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

  if (!res.ok) {
    alert("Failed to save entry");
  }
}

// ===============================
// ⭐ LOAD USER INFO (Developer bypass applied here)
// ===============================
async function loadUserInfo() {
  const token = getToken();

  try {
    const res = await fetch(`${API}/api/auth/user`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const user = await res.json();

   // Developer bypass — Sean always loads as FREE
if (user.email === "seand667@gmail.com") {
  user.subscription = "free";
  user.subscriptionStatus = "active";
  console.log("🔓 Developer override applied inside loadUserInfo() — forced FREE for Sean");
}

    window.userInfo = user;
  } catch (err) {
    console.warn("Backend unreachable — using developer bypass");

    // ⭐ Fallback: keep your FREE override
if (!window.userInfo) window.userInfo = {};
window.userInfo.email = "seand667@gmail.com";
window.userInfo.subscription = "free";
window.userInfo.subscriptionStatus = "active";
console.log("🔓 Fallback override — Sean forced FREE");


// ===============================
// DASHBOARD INIT
// ===============================
async function initDashboard() {
  const token = getToken();
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // Load user info FIRST (with override)
  await loadUserInfo();

  // Finance data still loads for backend support
  try {
    await fetchSummary();
    await fetchHistory();
  } catch (err) {
    console.warn("Finance API unavailable or not needed on this page.");
  }
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
        const data = await registerUser(email, password);

        if (data?.message === "User registered successfully") {
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

      const token = data.token || data.accessToken || data.jwt;
      if (!token) {
        alert(data.message || "Login failed");
        return;
      }

      saveToken(token);
      window.location.href = "dashboard.html";
    });
  }

  // DASHBOARD PAGE
  if (document.body.id === "dashboard") {
    initDashboard();
  }
});

console.log("app.js loaded");
