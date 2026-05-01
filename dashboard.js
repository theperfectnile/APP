// -------------------------------
// Toast Notifications
// -------------------------------
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => toast.classList.remove("show"), 3000);
  setTimeout(() => toast.remove(), 3500);
}

// -------------------------------
// Auth Helpers
// -------------------------------
function logout() {
    localStorage.removeItem("token");
    window.location.href = "/APP/login.html";
}
function getToken() {
  return localStorage.getItem("token");
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/APP/login.html";
}
window.onload = function() {
    renderMoodJournal();
};
// -------------------------------
// Animated Number Counter
// -------------------------------
function animateValue(id, end) {
  const el = document.getElementById(id);
  if (!el) return;

  let start = 0;
  const duration = 800;
  const step = end / (duration / 16);

  const counter = setInterval(() => {
    start += step;
    if (start >= end) {
      start = end;
      clearInterval(counter);
    }
    el.innerText = `$${Math.round(start)}`;
  }, 16);
}

// -------------------------------
// Dashboard Summary Loader
// -------------------------------
async function loadDashboard() {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch("https://backend-qkz7.onrender.com/api/finance/summary", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    
  } catch (err) {
    console.error("Dashboard summary error:", err);
    showToast("Error loading dashboard summary", "error");
  }
}

  
  } catch (err) {
    console.error("Save entry error:", err);
    showToast("Error saving entry", "error");
  }

