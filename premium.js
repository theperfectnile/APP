// ===============================
// PREMIUM.JS — GLOBAL SUBSCRIPTION CHECKER
// Enforces backend subscription status
// ===============================

async function requirePro() {
  const token = localStorage.getItem("token");

  // If no token → user is not logged in
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // Fetch user info from backend
  const res = await fetch("https://backend-qkz7.onrender.com/api/auth/user", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const user = await res.json();

  // If user is NOT Pro → redirect to subscribe page
  if (user.subscription !== "pro") {
    window.location.href = "subscribe.html";
  }
}
