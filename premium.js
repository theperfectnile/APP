// ⭐ Developer bypass — force PRO for your account
async function requirePro() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const res = await fetch("https://backend-qkz7.onrender.com/api/auth/user", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const user = await res.json();

  // ⭐ If it's YOU → force subscription to PRO
  if (user.email === "theperfectnile@gmail.com") {
    console.log("🔓 Developer bypass active — forced PRO mode.");
    userInfo = user;            // ensure userInfo exists
    userInfo.subscription = "pro"; // override subscription
    return;
  }

  // ⭐ Normal users → enforce subscription
  if (user.subscription !== "pro") {
    window.location.href = "subscribe.html";
  }
}
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
  if (user.email === "seand667@gmail.com") {
    console.log("🔓 Developer bypass active — premium unlocked.");
    return; // Skip subscription checks
  }

  // ⭐ Normal premium enforcement for all other users
  if (user.subscription !== "pro") {
    return window.location.href = "subscribe.html";
  }
}
