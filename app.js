// ===============================
// CONFIG
// ===============================
const API = "https://backend-qkz7.onrender.com";

// Save logged-in user
function saveUser(user) {
  localStorage.setItem("vaultwiseUser", JSON.stringify(user));
}

// Get logged-in user
function getUser() {
  return JSON.parse(localStorage.getItem("vaultwiseUser"));
}

// Logout
function logout() {
  localStorage.removeItem("vaultwiseUser");
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

if (document.querySelector("#registerForm")) {
  document.querySelector("#registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    const data = await registerUser(email, password);

    if (data.success) {
      alert("Account created!");
      window.location.href = "login.html";
    } else {
      alert(data.message || "Registration failed");
    }
  });
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

if (document.querySelector("#loginForm")) {
  document.querySelector("#loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    const data = await loginUser(email, password);

    if (!data.success) {
      alert(data.message || "Login failed");
      return;
    }

    saveUser(data.user);
    window.location.href = "dashboard.html";
  });
}

// ===============================
// PROTECT DASHBOARD
// ===============================
async function loadDashboard() {
  const user = getUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  document.querySelector("#user-email").textContent = user.email;
  document.querySelector("#user-plan").textContent = user.plan || "Free";
  document.querySelector("#trial-start").textContent = user.trialStart || "N/A";
}

if (document.body.id === "dashboard") {
  loadDashboard();
}

// ===============================
// FORGOT PASSWORD
// ===============================
async function sendReset(event) {
  event.preventDefault();

  const email = document.querySelector("#email").value.trim();

  const res = await fetch(`${API}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Email not found");
    return;
  }

  localStorage.setItem("resetEmail", email);
  alert("Reset link sent!");
  window.location.href = "reset-password.html";
}

// ===============================
// RESET PASSWORD
// ===============================
async function resetPassword(event) {
  event.preventDefault();

  const newPassword = document.querySelector("#password").value.trim();
  const email = localStorage.getItem("resetEmail");

  if (!email) {
    alert("No reset request found");
    return;
  }

  const res = await fetch(`${API}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Reset failed");
    return;
  }

  localStorage.removeItem("resetEmail");
  alert("Password updated!");
  window.location.href = "login.html";
}
// ===============================
// FINANCE API HELPERS
// ===============================
async function fetchFinanceSummary() {
  const res = await fetch(`${API}/api/finance/summary`, {
    credentials: "include",
  });
  return res.json();
}

async function fetchPortfolio() {
  const res = await fetch(`${API}/api/finance/portfolio`, {
    credentials: "include",
  });
  return res.json();
}

// ===============================
// DASHBOARD INIT
// ===============================
async function initDashboard() {
  const user = getUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Basic user info
  document.querySelector("#user-email").textContent = user.email;
  document.querySelector("#user-plan").textContent = user.plan || "Free";
  document.querySelector("#trial-start").textContent = user.trialStart || "N/A";

  try {
    const summary = await fetchFinanceSummary();
    const portfolio = await fetchPortfolio();

    // Cards
    document.querySelector("#card-income").textContent =
      `$${(summary.monthlyIncome || 0).toLocaleString()}`;
    document.querySelector("#card-expenses").textContent =
      `$${(summary.monthlyExpenses || 0).toLocaleString()}`;
    document.querySelector("#card-savings").textContent =
      `$${(summary.netSavings || 0).toLocaleString()}`;
    document.querySelector("#card-portfolio").textContent =
      `$${(portfolio.totalValue || 0).toLocaleString()}`;

    // Insights
    const insightsEl = document.querySelector("#insights");
    insightsEl.innerHTML = "";
    (summary.insights || []).forEach(text => {
      const div = document.createElement("div");
      div.className = "insight-item";
      div.textContent = text;
      insightsEl.appendChild(div);
    });
    if (!summary.insights || summary.insights.length === 0) {
      insightsEl.innerHTML = "<div class='insight-item'>No insights yet. Add income and expenses to see analysis.</div>";
    }

    // Spending chart
    const spendCtx = document.getElementById("spendingChart");
    if (spendCtx && summary.spendingByCategory) {
      new Chart(spendCtx, {
        type: "pie",
        data: {
          labels: Object.keys(summary.spendingByCategory),
          datasets: [{
            data: Object.values(summary.spendingByCategory),
            backgroundColor: ["#00eaff", "#7b2ff7", "#00ffbf", "#f97316", "#e11d48", "#a855f7"],
          }]
        },
        options: { plugins: { legend: { labels: { color: "#e5e7eb" } } } }
      });
    }

    // Portfolio chart
    const portCtx = document.getElementById("portfolioChart");
    if (portCtx && portfolio.assets) {
      new Chart(portCtx, {
        type: "bar",
        data: {
          labels: portfolio.assets.map(a => a.asset),
          datasets: [{
            label: "Value",
            data: portfolio.assets.map(a => a.value),
            backgroundColor: "#00eaff",
          }]
        },
        options: {
          scales: {
            x: { ticks: { color: "#e5e7eb" } },
            y: { ticks: { color: "#e5e7eb" } }
          },
          plugins: { legend: { labels: { color: "#e5e7eb" } } }
        }
      });
    }

  } catch (err) {
    console.error(err);
    document.querySelector("#insights").innerHTML =
      "<div class='insight-item'>Unable to load financial data. Check backend /api/finance routes.</div>";
  }
}

// ===============================
// PAGE ROUTER HOOK
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  if (document.body.id === "dashboard") {
    initDashboard();
  }
});
