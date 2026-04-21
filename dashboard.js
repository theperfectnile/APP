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

  try {
    const res = await fetch("https://backend-qkz7.onrender.com/api/finance/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      showToast("Entry saved!", "success");
      location.reload();
    } else {
      showToast("Failed to save entry", "error");
    }

  } catch (err) {
    console.error("Save entry error:", err);
    showToast("Error saving entry", "error");
  }
}

// -------------------------------
// Analyze Insights
// -------------------------------
async function analyzeInsights() {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch("https://backend-qkz7.onrender.com/api/finance/analyze", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });

    const insights = await res.json();
    showToast(insights.message || "No insights returned", "info");

  } catch (err) {
    console.error("Insights error:", err);
    showToast("Error analyzing insights", "error");
  }
}
// -------------------------------
// Page Initialization
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("fade-in");

  if (document.getElementById("income")) loadDashboard();
  if (document.getElementById("history-body")) loadHistory();
});
// -----------------------------
// SURVEY CALCULATION FUNCTION
// -----------------------------
function calculateSurvey() {
  const get = id => Number(document.getElementById(id).value);

  const q1 = get("q1");
  const q2 = get("q2");
  const q3 = get("q3");
  const q4 = get("q4");
  const q5 = get("q5");
  const q6 = get("q6");
  const q7 = get("q7");
  const q8 = get("q8");
  const q9 = get("q9");
  const q10 = get("q10");

  // Reverse scoring for questions where "Very Often" is negative
  const rev = v => 6 - v;

  const mealScore = rev(q1) + q2 + rev(q3) + rev(q4);
  const exerciseScore = q5 + rev(q6);
  const spendingScore = rev(q7) + q8 + rev(q9);
  const kidsScore = rev(q10);

  let advice = "";

  // Meal Planning
  if (mealScore <= 8) advice += "🍽️ You should meal plan more. You're overspending on food and wasting groceries.<br><br>";
  else if (mealScore <= 14) advice += "🍽️ You're doing okay with food habits, but planning 2–3 meals weekly will help.<br><br>";
  else advice += "🍽️ Great job! Your meal planning habits are strong.<br><br>";

  // Exercise
  if (exerciseScore <= 4) advice += "🏋🏾 You should exercise more. Even 10 minutes a day boosts energy and mood.<br><br>";
  else if (exerciseScore <= 7) advice += "🏋🏾 You're doing alright, but more consistency will help.<br><br>";
  else advice += "🏋🏾 Excellent — your activity levels are strong.<br><br>";

  // Spending
  if (spendingScore <= 8) advice += "💸 You should save or invest more and reduce impulse spending.<br><br>";
  else if (spendingScore <= 14) advice += "💸 You're managing money decently, but reviewing statements weekly helps.<br><br>";
  else advice += "💸 Strong financial habits — keep it up.<br><br>";

  // Kids Spending
  if (kidsScore <= 3) advice += "🧒🏾 You're doing well with kid-related spending.<br><br>";
  else if (kidsScore <= 7) advice += "🧒🏾 Consider setting a monthly 'kid fun budget.'<br><br>";
  else advice += "🧒🏾 You may be overspending on non-essentials for your kids.<br><br>";

  document.getElementById("surveyResults").innerHTML = advice;
}
// -----------------------------
// SURVEY CALCULATION FUNCTION
// -----------------------------
function calculateSurvey() {
  const get = id => Number(document.getElementById(id).value);

  const q1 = get("q1");
  const q2 = get("q2");
  const q3 = get("q3");
  const q4 = get("q4");
  const q5 = get("q5");
  const q6 = get("q6");
  const q7 = get("q7");
  const q8 = get("q8");
  const q9 = get("q9");
  const q10 = get("q10");

  const rev = v => 6 - v;

  const mealScore = rev(q1) + q2 + rev(q3) + rev(q4);
  const exerciseScore = q5 + rev(q6);
  const spendingScore = rev(q7) + q8 + rev(q9);
  const kidsScore = rev(q10);

  let advice = "";

  if (mealScore <= 8) advice += "🍽️ You should meal plan more.<br><br>";
  else if (mealScore <= 14) advice += "🍽️ You're doing okay with food habits.<br><br>";
  else advice += "🍽️ Great job! Your meal planning habits are strong.<br><br>";

  if (exerciseScore <= 4) advice += "🏋🏾 You should exercise more.<br><br>";
  else if (exerciseScore <= 7) advice += "🏋🏾 You're doing alright, but more consistency will help.<br><br>";
  else advice += "🏋🏾 Excellent — your activity levels are strong.<br><br>";

  if (spendingScore <= 8) advice += "💸 You should save or invest more and reduce impulse spending.<br><br>";
  else if (spendingScore <= 14) advice += "💸 You're managing money decently.<br><br>";
  else advice += "💸 Strong financial habits — keep it up.<br><br>";

  if (kidsScore <= 3) advice += "🧒🏾 You're doing well with kid-related spending.<br><br>";
  else if (kidsScore <= 7) advice += "🧒🏾 Consider setting a monthly 'kid fun budget.'<br><br>";
  else advice += "🧒🏾 You may be overspending on non-essentials for your kids.<br><br>";

  document.getElementById("surveyResults").innerHTML = advice;
}
function calculateSurvey() { 
  const get = id => Number(document.getElementById(id).value);

  const answers = {
    q1: get("q1"),
    q2: get("q2"),
    q3: get("q3"),
    q4: get("q4"),
    q5: get("q5"),
    q6: get("q6"),
    q7: get("q7"),
    q8: get("q8"),
    q9: get("q9"),
    q10: get("q10")
  };

  let advice = "";

  // Helper to convert numeric choice to text
  const choiceText = {
    1: "Never",
    2: "Rarely",
    3: "Sometimes",
    4: "Often",
    5: "Very Often"
  };
  // -----------------------------
  // MEAL PLANNING + FOOD HABITS
  // -----------------------------
  if (answers.q1 === 1) advice += "🍽️ You never eat out — that’s budget‑friendly, but make sure you’re not skipping meals or relying on snacks. Try planning 1–2 balanced meals ahead.<br><br>";
  if (answers.q1 === 2) advice += "🍽️ You rarely eat out — great for saving money. Keep a simple meal plan to avoid last‑minute takeout.<br><br>";
  if (answers.q1 === 3) advice += "🍽️ You sometimes eat out — totally normal. Try setting a weekly limit so it stays intentional.<br><br>";
  if (answers.q1 === 4) advice += "🍽️ You often eat out — consider cooking 1–2 meals at home to balance convenience and cost.<br><br>";
  if (answers.q1 === 5) advice += "🍽️ You eat out very often — start with one home‑cooked meal per week to save money and reduce food waste.<br><br>";

  if (answers.q2 === 1) advice += "📝 You never meal plan — start with planning just one dinner for the week. Keep it simple.<br><br>";
  if (answers.q2 === 2) advice += "📝 You rarely meal plan — try planning 2 meals to reduce stress and grocery costs.<br><br>";
  if (answers.q2 === 3) advice += "📝 You sometimes meal plan — adding one more planned meal can help you stay consistent.<br><br>";
  if (answers.q2 === 4) advice += "📝 You often meal plan — keep refining what works for you.<br><br>";
  if (answers.q2 === 5) advice += "📝 You always meal plan — strong habit. Keep using it to stay organized and save money.<br><br>";

  if (answers.q3 === 1) advice += "🥗 You never waste groceries — excellent. Keep buying only what you use.<br><br>";
  if (answers.q3 === 2) advice += "🥗 You rarely waste food — good balance. A quick fridge check before shopping helps even more.<br><br>";
  if (answers.q3 === 3) advice += "🥗 You sometimes waste food — try smaller portions or freezing leftovers.<br><br>";
  if (answers.q3 === 4) advice += "🥗 You often waste food — planning meals around what you already have can help.<br><br>";
  if (answers.q3 === 5) advice += "🥗 You waste food very often — start with buying fewer perishables and using leftovers creatively.<br><br>";

  if (answers.q4 === 1) advice += "🍳 You never choose convenience foods — great, but make sure cooking isn’t stressing you out.<br><br>";
  if (answers.q4 === 2) advice += "🍳 You rarely choose convenience foods — balanced and healthy.<br><br>";
  if (answers.q4 === 3) advice += "🍳 You sometimes choose convenience foods — totally normal. Try prepping ingredients ahead.<br><br>";
  if (answers.q4 === 4) advice += "🍳 You often choose convenience foods — consider cooking simple meals like stir‑fries or sheet‑pan dinners.<br><br>";
  if (answers.q4 === 5) advice += "🍳 You rely heavily on convenience foods — start with one homemade meal per week to build confidence.<br><br>";

  // -----------------------------
  // EXERCISE + ENERGY
  // -----------------------------
  if (answers.q5 === 1) advice += "🏋🏾 You never exercise — start with 5 minutes of walking or stretching daily.<br><br>";
  if (answers.q5 === 2) advice += "🏋🏾 You rarely exercise — aim for 1–2 short sessions per week.<br><br>";
  if (answers.q5 === 3) advice += "🏋🏾 You sometimes exercise — consistency will help you feel better.<br><br>";
  if (answers.q5 === 4) advice += "🏋🏾 You often exercise — great routine. Keep it up.<br><br>";
  if (answers.q5 === 5) advice += "🏋🏾 You exercise very often — strong habit. Just watch for burnout.<br><br>";

  if (answers.q6 === 1) advice += "⚡ You never feel sluggish — great energy levels.<br><br>";
  if (answers.q6 === 2) advice += "⚡ You rarely feel sluggish — keep supporting your energy with sleep and hydration.<br><br>";
  if (answers.q6 === 3) advice += "⚡ You sometimes feel sluggish — try adding light movement or improving sleep.<br><br>";
  if (answers.q6 === 4) advice += "⚡ You often feel sluggish — consider improving sleep routine and adding gentle exercise.<br><br>";
  if (answers.q6 === 5) advice += "⚡ You feel sluggish very often — small daily habits (water, stretching, sleep) can help a lot.<br><br>";

  // -----------------------------
  // MONEY HABITS
  // -----------------------------
  if (answers.q7 === 1) advice += "💳 You never review statements — start with a weekly 2‑minute check‑in.<br><br>";
  if (answers.q7 === 2) advice += "💳 You rarely review statements — try checking once a week to stay aware.<br><br>";
  if (answers.q7 === 3) advice += "💳 You sometimes review statements — good start. Make it a habit.<br><br>";
  if (answers.q7 === 4) advice += "💳 You often review statements — strong awareness.<br><br>";
  if (answers.q7 === 5) advice += "💳 You always review statements — excellent financial awareness.<br><br>";

  if (answers.q8 === 1) advice += "💰 You never save or invest — start with $5–$10 a week to build momentum.<br><br>";
  if (answers.q8 === 2) advice += "💰 You rarely save — try automating a small amount monthly.<br><br>";
  if (answers.q8 === 3) advice += "💰 You sometimes save — consistency will help you grow wealth.<br><br>";
  if (answers.q8 === 4) advice += "💰 You often save — strong habit. Keep going.<br><br>";
  if (answers.q8 === 5) advice += "💰 You save very often — excellent discipline.<br><br>";

  if (answers.q9 === 1) advice += "🛍️ You never impulse buy — disciplined and intentional.<br><br>";
  if (answers.q9 === 2) advice += "🛍️ You rarely impulse buy — healthy balance.<br><br>";
  if (answers.q9 === 3) advice += "🛍️ You sometimes impulse buy — try a 24‑hour pause before purchases.<br><br>";
  if (answers.q9 === 4) advice += "🛍️ You often impulse buy — consider setting a monthly fun budget.<br><br>";
  if (answers.q9 === 5) advice += "🛍️ You impulse buy very often — try tracking triggers and setting spending limits.<br><br>";

  // -----------------------------
  // KID SPENDING
  // -----------------------------
  if (answers.q10 === 1) advice += "🧒🏾 You never buy extras for your kids — disciplined. A small fun budget could add joy without overspending.<br><br>";
  if (answers.q10 === 2) advice += "🧒🏾 You rarely buy extras — balanced approach.<br><br>";
  if (answers.q10 === 3) advice += "🧒🏾 You sometimes buy extras — normal. A monthly limit keeps it predictable.<br><br>";
  if (answers.q10 === 4) advice += "🧒🏾 You often buy extras — consider setting a clear monthly budget.<br><br>";
  if (answers.q10 === 5) advice += "🧒🏾 You very often buy extras — a structured budget can help protect your long‑term goals.<br><br>";

// Update survey results
document.getElementById("surveyResults").innerHTML = advice;

// Step 5: personality engine (corrected)
const personality = getFinancialPersonality(answers);

document.getElementById("personalityType").innerHTML =
  `<strong>${personality.type}</strong><br>${personality.description}`;

  // Step 6: life score
const lifeScore = calculateLifeScore(answers);

document.getElementById("lifeScoreValue").innerHTML =
  `<strong>${lifeScore}</strong> / 100`;

  // Step 7: micro‑habits
const microHabits = generateMicroHabits(personality, lifeScore, answers);

document.getElementById("microHabitsList").innerHTML =
  microHabits.map(habit => `<li>${habit}</li>`).join("");
 
  // Step 8: weekly report
const weeklyReport = generateWeeklyReport(answers, personality, lifeScore);

document.getElementById("weeklyReportText").innerHTML = weeklyReport;
This updates the weekly report every time the 
 
  // Step 9: kid budget recommendation
const kidBudget = calculateKidBudget(answers, lifeScore);

document.getElementById("kidBudgetValue").innerHTML =
  `Recommended weekly kid fun budget: <strong>$${kidBudget.min} – $${kidBudget.max}</strong>`;
}
// -------------------------------------------
// FINANCIAL PERSONALITY ENGINE
// -------------------------------------------
function getFinancialPersonality(answers) {
  let type = "";
  let description = "";

  // Patterns
  const eatsOutOften = answers.q1 >= 4;
  const noMealPlanning = answers.q2 <= 2;
  const wastesFood = answers.q3 >= 4;
  const convenienceFood = answers.q4 >= 4;

  const noExercise = answers.q5 === 1;
  const lowEnergy = answers.q6 >= 4;

  const neverReviewsMoney = answers.q7 === 1;
  const neverSaves = answers.q8 === 1;
  const impulseBuyer = answers.q9 >= 4;

  const highKidSpending = answers.q10 >= 4;

  // Personality Logic
  if (neverSaves && impulseBuyer) {
    type = "The Improviser";
    description = "You live in the moment. You make quick decisions and enjoy spontaneity, but adding small structure can help you build long-term stability.";
  }
  else if (neverReviewsMoney && noMealPlanning) {
    type = "The Free Spirit";
    description = "You prefer flexibility over structure. A few light routines can help you stay in control without feeling restricted.";
  }
  else if (noExercise && lowEnergy) {
    type = "The Overloaded Achiever";
    description = "You carry a lot on your shoulders. Improving energy and routines will help you feel more balanced and in control.";
  }
  else if (highKidSpending) {
    type = "The Provider";
    description = "You love giving to your family. A clear kid budget helps you support them without sacrificing your own goals.";
  }
  else if (!neverSaves && !impulseBuyer && answers.q2 >= 4) {
    type = "The Planner";
    description = "You value structure and consistency. You’re intentional with your habits and finances, and it shows.";
  }
  else {
    type = "The Builder";
    description = "You’re developing your habits and learning what works for you. Small improvements will create big results over time.";
  }

  return { type, description };
}
// -------------------------------------------
// LIFE SCORE ENGINE
// -------------------------------------------
function calculateLifeScore(answers) {
  let score = 0;

  // Food habits (q1–q4)
  score += (6 - answers.q1) * 2;   // eating out less = better
  score += answers.q2 * 2;         // meal planning = good
  score += (6 - answers.q3) * 2;   // wasting less = good
  score += (6 - answers.q4) * 2;   // less convenience food = good

  // Exercise + Energy (q5–q6)
  score += answers.q5 * 3;         // more exercise = better
  score += (6 - answers.q6) * 2;   // less sluggish = better

  // Money habits (q7–q9)
  score += answers.q7 * 3;         // reviewing statements = good
  score += answers.q8 * 3;         // saving = good
  score += (6 - answers.q9) * 3;   // fewer impulse buys = good

  // Kid spending (q10)
  score += (6 - answers.q10) * 1;  // less overspending = better

  // Normalize to 0–100
  return Math.min(100, Math.max(0, Math.round(score)));
}
// -------------------------------------------
// MICRO‑HABITS ENGINE
// -------------------------------------------
function generateMicroHabits(personality, lifeScore, answers) {
  const habits = [];

  // Personality‑based habits
  if (personality.type === "The Improviser") {
    habits.push("Pause 24 hours before any non‑essential purchase.");
    habits.push("Review yesterday’s spending for 2 minutes.");
  }

  if (personality.type === "The Free Spirit") {
    habits.push("Plan just one meal for the week.");
    habits.push("Do a 2‑minute wallet or purse clean‑out.");
  }

  if (personality.type === "The Overloaded Achiever") {
    habits.push("Take a 5‑minute walk or stretch break.");
    habits.push("Drink one full glass of water this morning.");
  }

  if (personality.type === "The Provider") {
    habits.push("Set a $5–$10 kid fun budget for the week.");
    habits.push("Do one small act of self‑care today.");
  }

  if (personality.type === "The Planner") {
    habits.push("Review your budget categories for 3 minutes.");
    habits.push("Prep ingredients for one meal ahead of time.");
  }

  if (personality.type === "The Builder") {
    habits.push("Choose one habit to improve by 1% today.");
    habits.push("Track one purchase you make today.");
  }

  // Life Score‑based habits
  if (lifeScore < 40) {
    habits.push("Drink one bottle of water before noon.");
    habits.push("Do 5 minutes of movement today.");
  } else if (lifeScore < 70) {
    habits.push("Plan one meal for tomorrow.");
    habits.push("Review your bank app for 2 minutes.");
  } else {
    habits.push("Celebrate one win from this week.");
    habits.push("Prep tomorrow’s breakfast or lunch.");
  }

  // Behavior‑based habits (survey answers)
  if (answers.q1 >= 4) habits.push("Cook one meal at home this week.");
  if (answers.q5 <= 2) habits.push("Do a 3‑minute stretch session.");
  if (answers.q9 >= 4) habits.push("Unsubscribe from one marketing email.");

  // Return 3 habits max
  return habits.slice(0, 3);
}
// -------------------------------------------
// WEEKLY REPORT ENGINE
// -------------------------------------------
function generateWeeklyReport(answers, personality, lifeScore) {
  let report = "";

  // Personality summary
  report += `<strong>Personality:</strong> ${personality.type}<br>${personality.description}<br><br>`;

  // Life score summary
  if (lifeScore < 40) {
    report += "Your Life Score shows you're in a rebuilding phase. Focus on small, consistent habits to regain momentum.<br><br>";
  } else if (lifeScore < 70) {
    report += "Your Life Score shows you're making progress. Keep strengthening the habits that are working.<br><br>";
  } else {
    report += "Your Life Score is strong. Maintain your routines and celebrate your wins.<br><br>";
  }

  // Behavior patterns
  report += "<strong>Behavior Patterns:</strong><br>";

  if (answers.q1 >= 4) report += "• You rely on eating out often — planning 1–2 meals at home could help.<br>";
  if (answers.q2 <= 2) report += "• Meal planning is inconsistent — try planning just one meal ahead.<br>";
  if (answers.q3 >= 4) report += "• Food waste is high — buy smaller quantities or freeze leftovers.<br>";
  if (answers.q4 >= 4) report += "• Convenience foods are common — prepping ingredients can help.<br>";
  if (answers.q5 <= 2) report += "• Exercise is low — even 5 minutes a day makes a difference.<br>";
  if (answers.q6 >= 4) report += "• Energy levels are low — hydration and sleep routines may help.<br>";
  if (answers.q7 <= 2) report += "• You rarely review statements — try a weekly 2‑minute check‑in.<br>";
  if (answers.q8 <= 2) report += "• Saving is inconsistent — automate a small amount weekly.<br>";
  if (answers.q9 >= 4) report += "• Impulse spending is high — try a 24‑hour pause rule.<br>";
  if (answers.q10 >= 4) report += "• Kid spending is high — consider a small weekly kid fun budget.<br>";

  report += "<br>";

  // Focus for next week
  report += "<strong>Focus for Next Week:</strong><br>";

  if (lifeScore < 40) {
    report += "Choose ONE habit to improve by 1% — small wins matter most right now.";
  } else if (lifeScore < 70) {
    report += "Strengthen the habits that are already working and add one new micro‑habit.";
  } else {
    report += "Maintain your strong habits and celebrate your consistency.";
  }

  return report;
}
// -------------------------------------------
// KID BUDGET ENGINE
// -------------------------------------------
function calculateKidBudget(answers, lifeScore) {
  // Base budget range (weekly)
  let baseMin = 5;
  let baseMax = 25;

  // Adjust based on spending behavior (q10)
  if (answers.q10 === 1) { 
    baseMin += 5; 
    baseMax += 10; 
  }
  if (answers.q10 === 2) { 
    baseMin += 3; 
    baseMax += 5; 
  }
  if (answers.q10 === 3) { 
    baseMin += 0; 
    baseMax += 0; 
  }
  if (answers.q10 === 4) { 
    baseMin -= 2; 
    baseMax -= 5; 
  }
  if (answers.q10 === 5) { 
    baseMin -= 5; 
    baseMax -= 10; 
  }

  // Adjust based on life score
  if (lifeScore < 40) {
    baseMin -= 2;
    baseMax -= 5;
  } else if (lifeScore > 70) {
    baseMin += 2;
    baseMax += 5;
  }

  // Ensure values never go negative
  baseMin = Math.max(0, baseMin);
  baseMax = Math.max(baseMin, baseMax);

  return { min: baseMin, max: baseMax };
}
// -------------------------------------------
// MOOD + MONEY JOURNAL ENGINE
// -------------------------------------------
function saveMoodEntry() {
  const mood = document.getElementById("moodSelect").value;
  const note = document.getElementById("moodNote").value.trim();

  if (!mood && !note) return;

  const entry = {
    mood,
    note,
    timestamp: new Date().toLocaleString()
  };

  // Load existing entries
  let journal = JSON.parse(localStorage.getItem("moodJournal") || "[]");

  // Add new entry to the top
  journal.unshift(entry);

  // Save back to localStorage
  localStorage.setItem("moodJournal", JSON.stringify(journal));

  // Update UI
  renderMoodJournal();

  // Clear inputs
  document.getElementById("moodSelect").value = "";
  document.getElementById("moodNote").value = "";
}

function renderMoodJournal() {
  const journal = JSON.parse(localStorage.getItem("moodJournal") || "[]");

  document.getElementById("moodJournalList").innerHTML = journal
    .slice(0, 5) // show last 5 entries
    .map(entry => `
      <li>
        <strong>${entry.timestamp}</strong><br>
        Mood: ${entry.mood}<br>
        ${entry.note ? `Note: ${entry.note}` : ""}
      </li>
    `)
    .join("");
}
