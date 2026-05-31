// ========================================
// PREMIUM.JS — CLEAN MODERN VERSION
// Supports:
// - Premium status
// - Trial status
// - UI indicators (optional)
// ========================================

const PREMIUM_KEY = "vaultwise_premium";
const TRIAL_KEY = "vaultwise_trial_end";

// -------------------------------
// CHECK PREMIUM
// -------------------------------
function isPremiumUser() {
  return localStorage.getItem(PREMIUM_KEY) === "true";
}

// -------------------------------
// ENABLE / DISABLE PREMIUM
// -------------------------------
function enablePremium() {
  localStorage.setItem(PREMIUM_KEY, "true");
}

function disablePremium() {
  localStorage.setItem(PREMIUM_KEY, "false");
}

// -------------------------------
// TRIAL LOGIC
// -------------------------------
function isTrialActive() {
  const end = localStorage.getItem(TRIAL_KEY);
  if (!end) return false;
  return Date.now() < Number(end);
}

function startTrial() {
  const end = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  localStorage.setItem(TRIAL_KEY, end.toString());
}

// -------------------------------
// APPLY PREMIUM LOCKS (OPTIONAL)
// Only used if a page includes .premium-lock
// -------------------------------
function applyPremiumLocks() {
  const lockedSections = document.querySelectorAll(".premium-lock");

  lockedSections.forEach(section => {
    if (!isPremiumUser() && !isTrialActive()) {
      section.classList.add("premium-locked");
    } else {
      section.classList.remove("premium-locked");
    }
  });
}

document.addEventListener("DOMContentLoaded", applyPremiumLocks);
