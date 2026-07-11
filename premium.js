// ⭐ Developer Bypass — YOU get full access
async function requirePro() {
  const token = localStorage.getItem("token");

  // If no token, user is not logged in → redirect
  if (!token) {
    return window.location.href = "login.html";
  }

  // Fetch user info
  const res = await fetch("https://backend-qkz7.onrender.com/api/auth/user", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const user = await res.json();

  // ⭐ YOUR EMAIL — full unlock for developer
  if (user.email === "seand667@@gmail.com") {
    console.log("🔓 Developer bypass active — premium unlocked.");
    return; // Skip subscription checks
  }

  // ⭐ Normal premium enforcement for all other users
  if (user.subscription !== "pro") {
    return window.location.href = "subscribe.html";
  }
}
