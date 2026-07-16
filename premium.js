if (!window.userInfo) window.userInfo = {};

if (window.userInfo.email === "seand667@gmail.com") {
    window.userInfo.subscription = "free";
    window.userInfo.subscriptionStatus = "active";
    console.log("🔓 Developer override applied for Sean (forced FREE mode)");
}
// ⭐ GLOBAL DEVELOPER OVERRIDE — runs BEFORE dashboard.js
(function() {
  const token = localStorage.getItem("token");
  if (!token) return;

  fetch("https://backend-qkz7.onrender.com/api/auth/user", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(user => {
     if (user.email === "seand667@gmail.com") {
  console.log("🔓 GLOBAL DEV OVERRIDE — forced FREE for Sean");
  window.userInfo = user;
  window.userInfo.subscription = "free"; // override BEFORE dashboard loads
  window.userInfo.subscriptionStatus = "active";
}
async function requirePro() {
  const token = localStorage.getItem("token");

  if (!token) {
    return window.location.href = "login.html";
  }

  const res = await fetch("https://backend-qkz7.onrender.com/api/auth/user", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const user = await res.json();

  // 🔓 Developer bypass — Sean always unlocked
  if (user.email === "seand667@gmail.com") {
    console.log("🔓 Developer bypass active — Sean forced FREE mode");
    return; // Skip subscription checks entirely
  }

  // Normal premium enforcement for everyone else
  if (user.subscription !== "pro") {
    return window.location.href = "subscribe.html";
        }
      }

    }); 

})(); 
