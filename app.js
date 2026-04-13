const API_BASE = "/api/auth";

// Helpers
function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  localStorage.setItem("token", token);
}

function clearToken() {
  localStorage.removeItem("token");
}

// Protect dashboard
if (location.pathname.endsWith("dashboard.html")) {
  if (!getToken()) {
    location.href = "login.html";
  } else {
    renderSampleActivity();
  }
}

// Login
const loginForm = document.querySelector("#loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.querySelector("#loginEmail").value.trim();
    const password = document.querySelector("#loginPassword").value.trim();
    const errorEl = document.querySelector("#loginError");

    errorEl.textContent = "";

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        errorEl.textContent = data.error || "Login failed";
        return;
      }

      setToken(data.token);
      location.href = "dashboard.html";
    } catch {
      errorEl.textContent = "Network error. Try again.";
    }
  });
}

// Register
const registerForm = document.querySelector("#registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.querySelector("#registerEmail").value.trim();
    const password = document.querySelector("#registerPassword").value.trim();
    const errorEl = document.querySelector("#registerError");

    errorEl.textContent = "";

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        errorEl.textContent = data.error || "Registration failed";
        return;
      }

      // Auto-login or redirect to login
      location.href = "login.html";
    } catch {
      errorEl.textContent = "Network error. Try again.";
    }
  });
}

// Forgot password (placeholder – wire to your backend route)
const forgotForm = document.querySelector("#forgotForm");
if (forgotForm) {
  forgotForm.addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.querySelector("#forgotEmail").value.trim();
    const msgEl = document.querySelector("#forgotMessage");

    msgEl.textContent = "If this email exists, a reset link will be sent.";
    // Call your backend route here when implemented
  });
}

// Reset password (placeholder – expects token in query string)
const resetForm = document.querySelector("#resetForm");
if (resetForm) {
  resetForm.addEventListener("submit", async e => {
    e.preventDefault();
    const password = document.querySelector("#resetPassword").value.trim();
    const msgEl = document.querySelector("#resetMessage");

    msgEl.textContent = "Password updated (demo only).";
    // Call your backend reset route with token + new password
  });
}

// Logout
const logoutBtn = document.querySelector("#logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    clearToken();
    location.href = "login.html";
  });
}

// Sample dashboard activity
function renderSampleActivity() {
  const list = document.querySelector("#activityList");
  if (!list) return;

  const items = [
    { label: "Transfer to Savings", amount: "-$500.00", time: "Today • 2:14 PM" },
    { label: "Dividend payout", amount: "+$42.18", time: "Yesterday • 4:03 PM" },
    { label: "Card payment", amount: "-$120.49", time: "Apr 10 • 11:27 AM" },
    { label: "Deposit", amount: "+$2,000.00", time: "Apr 9 • 9:02 AM" }
  ];

  list.innerHTML = "";
  items.forEach(item => {
    const row = document.createElement("div");
    row.className = "activity-item";
    row.innerHTML = `
      <div>
        <div>${item.label}</div>
        <div style="font-size:0.75rem;color:var(--muted);">${item.time}</div>
      </div>
      <div style="font-weight:500;">${item.amount}</div>
    `;
    list.appendChild(row);
  });
}
