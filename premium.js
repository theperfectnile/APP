// ======================================================
// VAULTWISE PREMIUM / ACCESS CONTROL
// ======================================================

const PREMIUM_API = "https://backend-qkz7.onrender.com";


// ======================================================
// GET LOGGED-IN USER
// ======================================================

async function getCurrentUser() {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
   const res = await fetch(`${PREMIUM_API}/api/auth/user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();

  } catch (err) {
    console.error("GET USER ERROR:", err);
    return null;
  }
}


// ======================================================
// CHECK WHETHER USER IS DEVELOPER
// ======================================================

function isDeveloper(user) {
  return user?.email === "seand667@gmail.com";
}


// ======================================================
// CHECK WHETHER USER HAS PRO ACCESS
// ======================================================

function hasProAccess(user) {

  // Developer access during development
  if (isDeveloper(user)) {
    return true;
  }

  return (
    user?.subscription === "pro" &&
    user?.subscriptionStatus === "active"
  );
}


// ======================================================
// REQUIRE PRO
// ======================================================

async function requirePro() {

  const token = localStorage.getItem("token");

  // Not logged in
  if (!token) {
    window.location.href = "login.html";
    return false;
  }

  const user = await getCurrentUser();

  // Backend couldn't verify user
  if (!user) {
    window.location.href = "login.html";
    return false;
  }

  // Developer access
  if (isDeveloper(user)) {
    console.log("🔓 Developer access enabled");
    window.userInfo = user;
    return true;
  }

  // Normal Pro access
  if (hasProAccess(user)) {
    window.userInfo = user;
    return true;
  }

  // Not Pro
  window.location.href = "subscribe.html";
  return false;
}


// ======================================================
// OPTIONAL HELPER
// ======================================================

function userHasProAccess() {
  return hasProAccess(window.userInfo);
}
