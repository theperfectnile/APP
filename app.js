// ===============================
// CONFIG
// ===============================
const API = "YOUR_BACKEND_URL_HERE/api";

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
async function registerUser(event) {
  event.preventDefault();

  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value.trim();

  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Registration failed");
    return;
  }

  alert("Account created successfully");
  window.location.href = "login.html";
}

// ===============================
// LOGIN
// ===============================
async function loginUser(event) {
  event.preventDefault();

  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value.trim();

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Login failed");
    return;
  }

  saveUser(data);
  window.location.href = "dashboard.html";
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
  document.querySelector("#user-plan").textContent = user.plan;
  document.querySelector("#trial-start").textContent = user.trialStart;
}

// ===============================
// FORGOT PASSWORD
// ===============================
async function sendReset(event) {
  event.preventDefault();

  const email = document.querySelector("#email").value.trim();

  const res = await fetch(`${API}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Email not found");
    return;
  }

  localStorage.setItem("resetEmail", email);
  alert("Reset request accepted");
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

  const res = await fetch(`${API}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Reset failed");
    return;
  }

  localStorage.removeItem("resetEmail");
  alert("Password updated");
  window.location.href = "login.html";
}
