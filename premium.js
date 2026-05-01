// premium.js
const PREMIUM_KEY = "vaultwise_premium";

// Check if user is premium
function isPremiumUser() {
  return localStorage.getItem(PREMIUM_KEY) === "true";
}

// Enable premium
function enablePremium() {
  localStorage.setItem(PREMIUM_KEY, "true");
}

// Disable premium
function disablePremium() {
  localStorage.setItem(PREMIUM_KEY, "false");
}
// premium.js

function isPremium() {
    return localStorage.getItem("vaultwise_premium") === "true";
}

function applyPremiumLocks() {
    const premiumSections = document.querySelectorAll(".premium-lock");

    premiumSections.forEach(section => {
        if (!isPremium()) {
            section.classList.add("premium-locked");
        } else {
            section.classList.remove("premium-locked");
        }
    });
}

document.addEventListener("DOMContentLoaded", applyPremiumLocks);
