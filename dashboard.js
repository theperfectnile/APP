/* ============================================================
   Vaultwise Dashboard — Cleaned Hybrid Version (Part 1)
   Core Helpers • Greeting • Mood • Streak
   ============================================================ */

const API_BASE = "https://backend-qkz7.onrender.com/api";

/* -------------------------------
   Toast Notifications
-------------------------------- */
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => toast.classList.remove("show"), 3000);
  setTimeout(() => toast.remove(), 3500);
}

/* -------------------------------
   Collapsible Groups (cleaned)
-------------------------------- */
window.toggleGroup = function(header, id) {
  const section = document.getElementById(id);
  if (!section) return;

  section.classList.toggle("open");
  header.classList.toggle("active");

  const arrow = header.querySelector(".arrow");
  if (arrow) {
    arrow.style.transform = header.classList.contains("active")
      ? "rotate(90deg)"
      : "rotate(0deg)";
  }
};

/* -------------------------------
   Auth Helpers
-------------------------------- */
function getToken() {
  return localStorage.getItem("token");
}

/* -------------------------------
   Personalized Greeting
-------------------------------- */
function getTimeOfDayGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getLastMood() {
  const history = JSON.parse(localStorage.getItem("moodHistory") || "[]");
  return history[0]?.mood || null;
}

function renderPersonalGreeting() {
  const el = document.getElementById("personalGreeting");
  if (!el) return;

  const base = getTimeOfDayGreeting();
  const mood = getLastMood();

  let message = `${base}.`;

  if (mood === "Happy") {
    message += " You’re on a roll — keep that momentum.";
  } else if (mood === "Neutral") {
    message += " Let’s make one small money win today.";
  } else if (mood === "Sad") {
    message += " One small step is enough for today.";
  }

  el.innerText = message;
}
function getDailySeed() {
  const today = new Date();
  return Number(`${today.getFullYear()}${today.getMonth()+1}${today.getDate()}`);
}
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}
const TEN_QUESTION_BANK = [
   {
    text: "How often do you track your daily spending?",
    options: [
      { label: "Never", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Often", value: 3 },
      { label: "Every day", value: 4 }
    ]
  },
  {
    text: "How confident do you feel about your financial decisions?",
    options: [
      { label: "Not confident", value: 1 },
      { label: "Somewhat confident", value: 2 },
      { label: "Confident", value: 3 },
      { label: "Very confident", value: 4 }
    ]
  },
  {
    text: "How often do you spend impulsively?",
    options: [
      { label: "Very often", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Rarely", value: 3 },
      { label: "Never", value: 4 }
    ]
  },
  {
    text: "How well do you stick to your budget?",
    options: [
      { label: "Not at all", value: 1 },
      { label: "Somewhat", value: 2 },
      { label: "Mostly", value: 3 },
      { label: "Always", value: 4 }
    ]
  },
  {
    text: "How often do you review your bank statements?",
    options: [
      { label: "Never", value: 1 },
      { label: "Monthly", value: 2 },
      { label: "Weekly", value: 3 },
      { label: "Daily", value: 4 }
    ]
  },
  {
    text: "How prepared do you feel for unexpected expenses?",
    options: [
      { label: "Not prepared", value: 1 },
      { label: "Somewhat prepared", value: 2 },
      { label: "Prepared", value: 3 },
      { label: "Very prepared", value: 4 }
    ]
  },
  {
    text: "How often do you cook at home instead of eating out?",
    options: [
      { label: "Never", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Often", value: 3 },
      { label: "Almost always", value: 4 }
    ]
  },
  {
    text: "How often do you save money intentionally?",
    options: [
      { label: "Never", value: 1 },
      { label: "Occasionally", value: 2 },
      { label: "Regularly", value: 3 },
      { label: "Consistently", value: 4 }
    ]
  },
  {
    text: "How stressed do you feel about money?",
    options: [
      { label: "Very stressed", value: 1 },
      { label: "Somewhat stressed", value: 2 },
      { label: "A little stressed", value: 3 },
      { label: "Not stressed", value: 4 }
    ]
  },
  {
    text: "How often do you plan your purchases ahead of time?",
    options: [
      { label: "Never", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Often", value: 3 },
      { label: "Always", value: 4 }
    ]
  },
 {
    text: "How often do you check your credit score?",
    options: [
      { label: "Never", value: 1 },
      { label: "Yearly", value: 2 },
      { label: "Every few months", value: 3 },
      { label: "Monthly", value: 4 }
    ]
  },
  {
    text: "How often do you compare prices before buying?",
    options: [
      { label: "Never", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Often", value: 3 },
      { label: "Always", value: 4 }
    ]
  },
  {
    text: "How often do you set financial goals?",
    options: [
      { label: "Never", value: 1 },
      { label: "Occasionally", value: 2 },
      { label: "Regularly", value: 3 },
      { label: "Consistently", value: 4 }
    ]
  },
  {
    text: "How often do you overspend your budget?",
    options: [
      { label: "Very often", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Rarely", value: 3 },
      { label: "Never", value: 4 }
    ]
  },
  {
    text: "How organized do you feel with your finances?",
    options: [
      { label: "Not organized", value: 1 },
      { label: "Somewhat organized", value: 2 },
      { label: "Organized", value: 3 },
      { label: "Very organized", value: 4 }
    ]
  },
  {
    text: "How often do you think about long‑term financial stability?",
    options: [
      { label: "Never", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Often", value: 3 },
      { label: "Daily", value: 4 }
    ]
  },
  {
    text: "How often do you spend money to cope with emotions?",
    options: [
      { label: "Very often", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Rarely", value: 3 },
      { label: "Never", value: 4 }
    ]
  },
  {
    text: "How often do you review your subscriptions?",
    options: [
      { label: "Never", value: 1 },
      { label: "Yearly", value: 2 },
      { label: "Every few months", value: 3 },
      { label: "Monthly", value: 4 }
    ]
  },
  {
    text: "How often do you set aside money for emergencies?",
    options: [
      { label: "Never", value: 1 },
      { label: "Occasionally", value: 2 },
      { label: "Regularly", value: 3 },
      { label: "Consistently", value: 4 }
    ]
  },
  {
    text: "How often do you avoid unnecessary purchases?",
    options: [
      { label: "Never", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Often", value: 3 },
      { label: "Always", value: 4 }
    {
  text: "How often do you delay purchases to think them through?",
  options: [
    { label: "Never", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Often", value: 3 },
    { label: "Always", value: 4 }
  ]
},
{
  text: "How often do you check your account balances?",
  options: [
    { label: "Never", value: 1 },
    { label: "Weekly", value: 2 },
    { label: "Every few days", value: 3 },
    { label: "Daily", value: 4 }
  ]
},
{
  text: "How often do you spend more than you planned?",
  options: [
    { label: "Very often", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Rarely", value: 3 },
    { label: "Never", value: 4 }
  ]
},
{
  text: "How often do you set aside money for future goals?",
  options: [
    { label: "Never", value: 1 },
    { label: "Occasionally", value: 2 },
    { label: "Regularly", value: 3 },
    { label: "Consistently", value: 4 }
  ]
},
{
  text: "How often do you feel in control of your spending?",
  options: [
    { label: "Never", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Often", value: 3 },
    { label: "Always", value: 4 }
  ]
},
{
  text: "How often do you plan meals to save money?",
  options: [
    { label: "Never", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Often", value: 3 },
    { label: "Always", value: 4 }
  ]
},
{
  text: "How often do you avoid buying things you don’t need?",
  options: [
    { label: "Never", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Often", value: 3 },
    { label: "Always", value: 4 }
  ]
},
{
  text: "How often do you think about improving your financial habits?",
  options: [
    { label: "Never", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Often", value: 3 },
    { label: "Daily", value: 4 }
  ]
},
{
  text: "How often do you use cash instead of cards to control spending?",
  options: [
    { label: "Never", value: 1 },
    { label: "Occasionally", value: 2 },
    { label: "Often", value: 3 },
    { label: "Always", value: 4 }
  ]
},
{
  text: "How often do you review your financial goals?",
  options: [
    { label: "Never", value: 1 },
    { label: "Occasionally", value: 2 },
    { label: "Regularly", value: 3 },
    { label: "Consistently", value: 4 }
  ]
},
{
  text: "How often do you feel overwhelmed by financial decisions?",
  options: [
    { label: "Very often", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Rarely", value: 3 },
    { label: "Never", value: 4 }
  ]
},
{
  text: "How often do you spend money on things you regret later?",
  options: [
    { label: "Very often", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Rarely", value: 3 },
    { label: "Never", value: 4 }
  ]
},
{
  text: "How often do you compare your spending to your income?",
  options: [
    { label: "Never", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Often", value: 3 },
    { label: "Always", value: 4 }
  ]
},
{
  text: "How often do you avoid emotional spending?",
  options: [
    { label: "Never", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Often", value: 3 },
    { label: "Always", value: 4 }
  ]
},
{
  text: "How often do you check for discounts or deals before buying?",
  options: [
    { label: "Never", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Often", value: 3 },
    { label: "Always", value: 4 }
  ]
},
{
  text: "How often do you avoid late fees or penalties?",
  options: [
    { label: "Never", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Often", value: 3 },
    { label: "Always", value: 4 }
  ]
},
{
  text: "How often do you feel confident about your financial future?",
  options: [
    { label: "Never", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Often", value: 3 },
    { label: "Always", value: 4 }
  ]
},
{
  text: "How often do you avoid unnecessary subscriptions?",
  options: [
    { label: "Never", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Often", value: 3 },
    { label: "Always", value: 4 }
  ]
},
{
  text: "How often do you set aside money for fun or leisure?",
  options: [
    { label: "Never", value: 1 },
    { label: "Occasionally", value: 2 },
    { label: "Often", value: 3 },
    { label: "Always", value: 4 }
  ]
},
{
  text: "How often do you feel proud of your financial progress?",
  options: [
    { label: "Never", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Often", value: 3 },
    { label: "Always", value: 4 }
  ]
},
{
  text: "How often do you avoid comparing your finances to others?",
  options: [
    { label: "Never", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Often", value: 3 },
    { label: "Always", value: 4 }
  ]
},
{
  text: "How often do you reflect on your financial habits?",
  options: [
    { label: "Never", value: 1 },
    { label: "Occasionally", value: 2 },
    { label: "Often", value: 3 },
    { label: "Daily", value: 4 }
  ]
},
{
  text: "How often do you avoid impulse purchases?",
  options: [
    { label: "Never", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Often", value: 3 },
    { label: "Always", value: 4 }
  ]
},
{
  text: "How often do you feel motivated to improve your finances?",
  options: [
    { label: "Never", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Often", value: 3 },
    { label: "Always", value: 4 }
  ]
},
{
  text: "How often do you avoid buying things out of boredom?",
  options: [
    { label: "Never", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Often", value: 3 },
    { label: "Always", value: 4 }
  ]
},
{
  text: "How often do you feel financially disciplined?",
  options: [
    { label: "Never", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Often", value: 3 },
    { label: "Always", value: 4 }
  ]
},
{
  text: "How often do you avoid unnecessary upgrades or replacements?",
  options: [
    { label: "Never", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Often", value: 3 },
    { label: "Always", value: 4 }
  ]
},
{
  text: "How often do you feel in control of your financial habits?",
  options: [
    { label: "Never", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Often", value: 3 },
    { label: "Always", value: 4 }
  ]
},
{
  text: "How often do you avoid spending to impress others?",
  options: [
    { label: "Never", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Often", value: 3 },
    { label: "Always", value: 4 }
  ]
},
{
  text: "How often do you feel confident about your money habits?",
  options: [
    { label: "Never", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Often", value: 3 },
    { label: "Always", value: 4 }
  ]
}
  },
];


const THREE_QUESTION_BANK = [
{
    text: "How do you feel about your spending today?",
    options: [
      { label: "Not good", value: 1 },
      { label: "Okay", value: 2 },
      { label: "Good", value: 3 },
      { label: "Great", value: 4 }
    ]
  },
  {
    text: "How motivated do you feel to improve your finances today?",
    options: [
      { label: "Not motivated", value: 1 },
      { label: "Somewhat motivated", value: 2 },
      { label: "Motivated", value: 3 },
      { label: "Very motivated", value: 4 }
    ]
  },
  {
    text: "How much control do you feel over your money today?",
    options: [
      { label: "No control", value: 1 },
      { label: "Some control", value: 2 },
      { label: "Good control", value: 3 },
      { label: "Full control", value: 4 }
    {
  text: "How focused do you feel on your financial goals today?",
  options: [
    { label: "Not focused", value: 1 },
    { label: "Somewhat focused", value: 2 },
    { label: "Focused", value: 3 },
    { label: "Very focused", value: 4 }
  ]
},
{
  text: "How disciplined do you feel with money today?",
  options: [
    { label: "Not disciplined", value: 1 },
    { label: "Somewhat disciplined", value: 2 },
    { label: "Disciplined", value: 3 },
    { label: "Very disciplined", value: 4 }
  ]
},
{
  text: "How much clarity do you feel about your financial situation today?",
  options: [
    { label: "No clarity", value: 1 },
    { label: "Some clarity", value: 2 },
    { label: "Good clarity", value: 3 },
    { label: "Full clarity", value: 4 }
  ]
},
{
  text: "How confident do you feel about making smart money choices today?",
  options: [
    { label: "Not confident", value: 1 },
    { label: "Somewhat confident", value: 2 },
    { label: "Confident", value: 3 },
    { label: "Very confident", value: 4 }
  ]
},
{
  text: "How much control do you feel over your spending impulses today?",
  options: [
    { label: "No control", value: 1 },
    { label: "Some control", value: 2 },
    { label: "Good control", value: 3 },
    { label: "Full control", value: 4 }
  ]
},
{
  text: "How motivated do you feel to avoid unnecessary spending today?",
  options: [
    { label: "Not motivated", value: 1 },
    { label: "Somewhat motivated", value: 2 },
    { label: "Motivated", value: 3 },
    { label: "Very motivated", value: 4 }
  ]
},
{
  text: "How mindful do you feel about your money choices today?",
  options: [
    { label: "Not mindful", value: 1 },
    { label: "Somewhat mindful", value: 2 },
    { label: "Mindful", value: 3 },
    { label: "Very mindful", value: 4 }
  ]
},
{
  text: "How positive do you feel about your financial progress today?",
  options: [
    { label: "Not positive", value: 1 },
    { label: "Somewhat positive", value: 2 },
    { label: "Positive", value: 3 },
    { label: "Very positive", value: 4 }
  ]
},
{
  text: "How intentional do you feel with your spending today?",
  options: [
    { label: "Not intentional", value: 1 },
    { label: "Somewhat intentional", value: 2 },
    { label: "Intentional", value: 3 },
    { label: "Very intentional", value: 4 }
  ]
},
{
  text: "How aware do you feel of your financial habits today?",
  options: [
    { label: "Not aware", value: 1 },
    { label: "Somewhat aware", value: 2 },
    { label: "Aware", value: 3 },
    { label: "Very aware", value: 4 }
  ]
},
{
  text: "How much effort do you feel like putting into your finances today?",
  options: [
    { label: "No effort", value: 1 },
    { label: "Some effort", value: 2 },
    { label: "Good effort", value: 3 },
    { label: "Full effort", value: 4 }
  ]
},
{
  text: "How much clarity do you feel about your financial goals today?",
  options: [
    { label: "No clarity", value: 1 },
    { label: "Some clarity", value: 2 },
    { label: "Clear", value: 3 },
    { label: "Very clear", value: 4 }
  ]
},
{
  text: "How much discipline do you feel around spending today?",
  options: [
    { label: "No discipline", value: 1 },
    { label: "Some discipline", value: 2 },
    { label: "Disciplined", value: 3 },
    { label: "Very disciplined", value: 4 }
  ]
},
{
  text: "How much financial stress do you feel today?",
  options: [
    { label: "A lot", value: 1 },
    { label: "Some", value: 2 },
    { label: "A little", value: 3 },
    { label: "None", value: 4 }
  ]
},
{
  text: "How much confidence do you feel in your money habits today?",
  options: [
    { label: "No confidence", value: 1 },
    { label: "Some confidence", value: 2 },
    { label: "Confident", value: 3 },
    { label: "Very confident", value: 4 }
  ]
},
{
  text: "How much intention do you feel toward saving today?",
  options: [
    { label: "No intention", value: 1 },
    { label: "Some intention", value: 2 },
    { label: "Intentional", value: 3 },
    { label: "Very intentional", value: 4 }
  ]
},
{
  text: "How much control do you feel over your financial habits today?",
  options: [
    { label: "No control", value: 1 },
    { label: "Some control", value: 2 },
    { label: "Good control", value: 3 },
    { label: "Full control", value: 4 }
  ]
  },
];
/* -------------------------------
   Mood Journal
-------------------------------- */
function saveMoodEntry() {
  const mood = document.getElementById("moodSelect")?.value || "Neutral";
  const note = document.getElementById("moodNote")?.value || "";

  const moodHistory = JSON.parse(localStorage.getItem("moodHistory") || "[]");

  moodHistory.unshift({
    mood,
    note,
    date: new Date().toISOString()
  });

  localStorage.setItem("moodHistory", JSON.stringify(moodHistory));

  renderMoodJournal();
  applyMoodTheme();
}

function renderMoodJournal() {
  const list = document.getElementById("moodJournalList");
  if (!list) return;

  const moodHistory = JSON.parse(localStorage.getItem("moodHistory") || "[]");

  list.innerHTML = moodHistory
    .slice(0, 5)
    .map(entry => `
      <li>
        <strong>${entry.mood}</strong> — ${entry.note || "No note"}
        <br><small>${new Date(entry.date).toLocaleString()}</small>
      </li>
    `)
    .join("");
}

/* -------------------------------
   Mood‑Aware Theme
-------------------------------- */
function applyMoodTheme() {
  const history = JSON.parse(localStorage.getItem("moodHistory") || "[]");
  const mood = history[0]?.mood || "Neutral";

  document.body.classList.remove("mood-happy", "mood-neutral", "mood-sad");

  if (mood === "Happy") {
    document.body.classList.add("mood-happy");
  } else if (mood === "Sad") {
    document.body.classList.add("mood-sad");
  } else {
    document.body.classList.add("mood-neutral");
  }
}

/* -------------------------------
   Visit Tracking + Streak System
-------------------------------- */
function trackVisit() {
  const today = new Date().toISOString().slice(0, 10);
  let visits = JSON.parse(localStorage.getItem("visitHistory") || "[]");

  if (!visits.includes(today)) {
    visits.push(today);
    localStorage.setItem("visitHistory", JSON.stringify(visits));
  }
}

function getVisitStreak() {
  const visits = JSON.parse(localStorage.getItem("visitHistory") || "[]")
    .sort()
    .reverse();

  if (visits.length === 0) return 0;

  let streak = 1;
  let last = new Date(visits[0]);

  for (let i = 1; i < visits.length; i++) {
    const d = new Date(visits[i]);
    const diff = (last - d) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
      last = d;
    } else {
      break;
    }
  }

  return streak;
}

function renderStreak() {
  const el = document.getElementById("streakBadge");
  if (!el) return;

  const streak = getVisitStreak();

  if (streak <= 1) {
    el.innerText = "Day 1 • Showing up matters";
  } else {
    el.innerText = `🔥 ${streak}-day streak`;
  }
}
/* ============================================================
   Vaultwise Dashboard — Cleaned Hybrid Version (Part 2)
   XP System • Coach • Finance Summary • Finance History
   ============================================================ */

/* -------------------------------
   XP + Level System
-------------------------------- */
function addXP(amount, reason) {
  const data = JSON.parse(localStorage.getItem("xpData") || '{"xp":0,"log":[]}');
  data.xp += amount;
  data.log.unshift({ amount, reason, time: Date.now() });
  localStorage.setItem("xpData", JSON.stringify(data));
}

function getLevel(xp) {
  return Math.floor(xp / 100) + 1; // 100 XP per level
}

function renderXP() {
  const badgeEl = document.getElementById("xpBadge");
  const levelLabel = document.getElementById("xpLevelLabel");
  const xpValueLabel = document.getElementById("xpValueLabel");
  const xpFill = document.getElementById("xpFill");
  const xpNextLabel = document.getElementById("xpNextLabel");

  const data = JSON.parse(localStorage.getItem("xpData") || '{"xp":0}');
  const xp = data.xp || 0;
  const level = getLevel(xp);

  const nextLevelXP = level * 100;
  const prevLevelXP = (level - 1) * 100;
  const progressInLevel = xp - prevLevelXP;
  const neededThisLevel = nextLevelXP - prevLevelXP;
  const percent = Math.min((progressInLevel / neededThisLevel) * 100, 100);

  if (badgeEl) badgeEl.innerText = `Level ${level} • ${xp} XP`;
  if (levelLabel) levelLabel.textContent = `Level ${level}`;
  if (xpValueLabel) xpValueLabel.textContent = `${xp} XP`;
  if (xpFill) xpFill.style.width = `${percent}%`;
  if (xpNextLabel) xpNextLabel.textContent = `Next level in ${nextLevelXP - xp} XP`;
}

/* -------------------------------
   Vaultwise Coach (Smart Advice)
-------------------------------- */
function renderCoachMessage() {
  const el = document.getElementById("coachMessage");
  if (!el) return;

  const answers = JSON.parse(localStorage.getItem("lastSurveyAnswers") || "null");
  const moodHistory = JSON.parse(localStorage.getItem("moodHistory") || "[]");
  const xpData = JSON.parse(localStorage.getItem("xpData") || '{"xp":0}');
  const streak = getVisitStreak();

  let msg = "";

  // No survey yet
  if (!answers) {
    el.innerHTML = "Start with the 10‑question survey so I can tailor your plan.";
    return;
  }

  // Mood-aware advice
  const lastMood = moodHistory[0]?.mood;
  if (lastMood === "Sad") msg += "Take it slow today. One small financial win is enough.<br>";
  if (lastMood === "Happy") msg += "You're in a great mindset — perfect time to build momentum.<br>";

  // Personalized survey-based advice
  if (answers.q1 >= 4) msg += "Swap one eating‑out meal for a home meal.<br>";
  if (answers.q8 <= 2) msg += "Move $10 into savings — small steps add up.<br>";
  if (answers.q9 >= 4) msg += "Try a 24‑hour pause before purchases.<br>";
  if (answers.q7 <= 2) msg += "Review your bank statements this week.<br>";

  // XP-aware coaching
  const level = getLevel(xpData.xp);
  msg += `You're Level ${level}. Keep completing missions to level up.<br>`;

  // Streak-aware coaching
  if (streak >= 3) msg += `🔥 You're on a ${streak}-day streak — consistency is your superpower.`;

  el.innerHTML = msg;
}

/* -------------------------------
   Animated Number Counter
-------------------------------- */
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

/* -------------------------------
   Finance Fallback Generator
-------------------------------- */
function generateRealisticFinanceFallback() {
  const baseIncome = 4200 + Math.random() * 3800;
  const rent = 1400 + Math.random() * 800;
  const groceries = 450 + Math.random() * 250;
  const gas = 160 + Math.random() * 90;
  const utilities = 180 + Math.random() * 80;
  const subs = 60 + Math.random() * 40;
  const kids = 80 + Math.random() * 120;
  const misc = 200 + Math.random() * 250;

  const totalExpenses = rent + groceries + gas + utilities + subs + kids + misc;
  const savings = Math.max(0, baseIncome - totalExpenses);

  const portfolioBase = 8000 + Math.random() * 22000;
  const portfolioVolatility = (Math.random() - 0.5) * 0.12;
  const totalPortfolio = portfolioBase * (1 + portfolioVolatility);

  return {
    totalIncome: Math.round(baseIncome),
    totalExpenses: Math.round(totalExpenses),
    totalPortfolio: Math.round(totalPortfolio),
    savings: Math.round(savings)
  };
}

/* -------------------------------
   Load Dashboard Summary
-------------------------------- */
async function loadDashboard() {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch(`${API_BASE}/finance/summary`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    let data = await res.json();

    const hasRealData =
      data &&
      (data.totalIncome > 0 ||
       data.totalExpenses > 0 ||
       data.totalPortfolio > 0);

    if (!hasRealData) {
      data = generateRealisticFinanceFallback();
    }

    animateValue("totalIncome", data.totalIncome || 0);
    animateValue("totalExpenses", data.totalExpenses || 0);
    animateValue("totalPortfolio", data.totalPortfolio || 0);

    // ⭐ FIXED: Stat cards moved INSIDE the function
    animateValue("statIncome", data.totalIncome || 0);
    animateValue("statExpenses", data.totalExpenses || 0);
    animateValue("statPortfolio", data.totalPortfolio || 0);
    animateValue("statSavings", data.savings || (data.totalIncome - data.totalExpenses));

  } catch (err) {
    console.error("Dashboard summary error:", err);
    showToast("Error loading dashboard summary", "error");
  }
}

/* -------------------------------
   Load Money Personality
-------------------------------- */
async function loadMoneyPersonality() {
  try {
    const res = await fetch(`${API_BASE}/money-personality/result`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });

    const data = await res.json();

    document.getElementById("moneyPersonalityType").innerText =
      data.personalityType || "No results yet";

  } catch (err) {
    console.error("Money Personality load error:", err);
    document.getElementById("moneyPersonalityType").innerText = "Error loading";
  }
}

/* -------------------------------
   Save Finance Entry
-------------------------------- */
async function saveEntry() {
  const token = getToken();
  if (!token) return;

  const payload = {
    income: Number(document.getElementById("income")?.value || 0),
    expenses: Number(document.getElementById("expenses")?.value || 0),
    portfolio: Number(document.getElementById("portfolio")?.value || 0),
    goal: Number(document.getElementById("goal")?.value || 0)
  };

  try {
    const res = await fetch(`${API_BASE}/finance/add`, {
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

/* -------------------------------
   Load Finance History
-------------------------------- */
async function loadHistory() {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch(`${API_BASE}/finance/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    let data = await res.json();
    const tbody = document.getElementById("history-body");
    if (!tbody) return;

    // Fallback if no real data
    if (!Array.isArray(data) || data.length === 0) {
      const now = new Date();
      const months = [];
      let income = 4200 + Math.random() * 3800;
      let portfolio = 8000 + Math.random() * 22000;

      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const label = d.toLocaleString("default", {
          month: "short",
          year: "2-digit"
        });

        const incomeDrift = (Math.random() - 0.3) * 0.04;
        income = income * (1 + incomeDrift);

        const rent = 1400 + Math.random() * 800;
        const groceries = 450 + Math.random() * 250;
        const gas = 160 + Math.random() * 90;
        const utilities = 180 + Math.random() * 80;
        const subs = 60 + Math.random() * 40;
        const kids = 80 + Math.random() * 120;
        const misc = 200 + Math.random() * 250;
        const expenses = rent + groceries + gas + utilities + subs + kids + misc;

        const goal = income * 0.15;

        const marketMove = (Math.random() - 0.45) * 0.12;
        portfolio = portfolio * (1 + marketMove);

        months.push({
          month: label,
          income: Math.round(income),
          expenses: Math.round(expenses),
          portfolio: Math.round(portfolio),
          goal: Math.round(goal)
        });
      }

      data = months;
    }

    tbody.innerHTML = data
      .map(
        (row) => `
      <tr>
        <td>${row.month}</td>
        <td>$${row.income}</td>
        <td>$${row.expenses}</td>
        <td>$${row.portfolio}</td>
        <td>$${row.goal}</td>
      </tr>`
      )
      .join("");

  } catch (err) {
    console.error("History load error:", err);
    showToast("Error loading history", "error");
  }
}
/* ============================================================
   Vaultwise Dashboard — Cleaned Hybrid Version (Part 3)
   Surveys • Personality • Life Score • Micro‑Habits • Reports
   ============================================================ */

/* -------------------------------
   10‑Question Survey Engine
-------------------------------- */
function calculateSurvey() {
  const get = (id) => Number(document.getElementById(id).value);

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

  // Save answers for personalized missions
  localStorage.setItem("lastSurveyAnswers", JSON.stringify(answers));

  let advice = "";

  if (answers.q1 >= 4)
    advice += "🍽️ Eating out is high — this can add $120–$220/month.<br><br>";
  if (answers.q2 <= 2)
    advice += "📝 Try planning at least one or two meals before shopping.<br><br>";
  if (answers.q3 >= 4)
    advice += "🥗 Food waste is high.<br><br>";
  if (answers.q4 >= 4)
    advice += "🍳 Convenience foods are common.<br><br>";

  if (answers.q5 <= 2)
    advice += "🏋🏾 Exercise is low.<br><br>";
  if (answers.q6 >= 4)
    advice += "⚡ Energy levels are low.<br><br>";

  if (answers.q7 <= 2)
    advice += "💳 You rarely review statements.<br><br>";
  if (answers.q8 <= 2)
    advice += "💰 Saving is inconsistent.<br><br>";
  if (answers.q9 >= 4)
    advice += "🛍️ Impulse spending is high.<br><br>";

  if (answers.q10 >= 4)
    advice += "🧒🏾 Kid spending is high.<br><br>";

  // Economy-aware calculations
  const eatingOutFactor = answers.q1;
  const mealPlanningFactor = 6 - answers.q2;
  const wasteFactor = answers.q3;
  const convenienceFactor = answers.q4;

  const baseFoodCost = 350;
  const inflationMultiplier = 1.25;

  let inflationPenalty =
    (eatingOutFactor * 18 +
      mealPlanningFactor * 10 +
      wasteFactor * 12 +
      convenienceFactor * 14) *
    1.1;

  inflationPenalty = Math.max(0, Math.round(inflationPenalty));

  const currentFoodCost = Math.round(baseFoodCost * inflationMultiplier);
  const realisticFoodSpend = currentFoodCost + inflationPenalty;

  const impulseRisk = answers.q9 * 20;
  const savingsConsistency = answers.q8 * 20;

  const summaryBlock = `
    <hr>
    <strong>Economy‑Aware Snapshot:</strong><br>
    • Estimated monthly food spend: <strong>$${realisticFoodSpend}</strong><br>
    • Impulse‑spending risk: <strong>${impulseRisk}/100</strong><br>
    • Savings consistency: <strong>${savingsConsistency}/100</strong><br><br>
  `;

  document.getElementById("surveyResults").innerHTML =
    advice + summaryBlock;

  // Personality
  const personality = getFinancialPersonality(answers);
  document.getElementById("personalityType").innerHTML =
    `<strong>${personality.type}</strong><br>${personality.description}`;

  // Life Score
  const lifeScore = calculateLifeScore(answers);
  document.getElementById("lifeScoreValue").innerHTML = `${lifeScore} / 100`;

  // Micro‑Habits
  const microHabits = generateMicroHabits(personality, lifeScore, answers);
  document.getElementById("microHabitsList").innerHTML = microHabits
    .map((h) => `<li>${h}</li>`)
    .join("");

  // Weekly Report
  const weeklyReport = generateWeeklyReport(
    answers,
    personality,
    lifeScore
  );
  document.getElementById("weeklyReportText").innerHTML = weeklyReport;

  // Kid Budget
  const kidBudget = calculateKidBudget(answers, lifeScore);
  document.getElementById("kidBudgetValue").innerHTML =
    `Recommended: <strong>$${kidBudget.min} – $${kidBudget.max}</strong>`;

  // Save snapshot
  const surveySnapshot = {
    timestamp: Date.now(),
    lifeScore,
    personality: personality.type,
    impulseRisk,
    savingsConsistency,
    realisticFoodSpend,
    kidBudget
  };

  let history = JSON.parse(localStorage.getItem("surveyHistory") || "[]");
  history.unshift(surveySnapshot);
  localStorage.setItem("surveyHistory", JSON.stringify(history));
}

/* -------------------------------
   Personality Engine
-------------------------------- */
function getFinancialPersonality(a) {
  if (a.q8 === 1 && a.q9 >= 4)
    return {
      type: "The Emotional Spender",
      description: "You often spend to feel better in the moment."
    };

  if (a.q7 === 1 && a.q2 <= 2)
    return {
      type: "The Free Spirit",
      description: "You prefer flexibility over structure."
    };

  if (a.q5 === 1 && a.q6 >= 4)
    return {
      type: "The Overextended Hustler",
      description: "You carry a lot and run low on energy."
    };

  if (a.q10 >= 4)
    return {
      type: "The Stability‑Driven Provider",
      description: "You love giving to your kids."
    };

  if (a.q2 >= 4 && a.q8 >= 3)
    return {
      type: "The Strategic Saver",
      description: "You value structure and consistency."
    };

  return {
    type: "The Cautious Optimizer",
    description: "You’re building solid habits and adjusting as you go."
  };
}

/* -------------------------------
   Life Score Engine
-------------------------------- */
function calculateLifeScore(a) {
  let score = 0;

  score += (6 - a.q1) * 2;
  score += a.q2 * 2;
  score += (6 - a.q3) * 2;
  score += (6 - a.q4) * 2;

  score += a.q5 * 3;
  score += (6 - a.q6) * 2;

  score += a.q7 * 3;
  score += a.q8 * 3;
  score += (6 - a.q9) * 3;

  score += (6 - a.q10);

  score = Math.min(100, Math.max(0, Math.round(score)));

  // Soft caps
  if (score > 90) score = 90 + Math.round((score - 90) * 0.5);
  if (score < 20) score = 20 - Math.round((20 - score) * 0.5);

  return score;
}

/* -------------------------------
   Micro‑Habits Engine
-------------------------------- */
function generateMicroHabits(personality, lifeScore, a) {
  const habits = [];

  if (personality.type === "The Emotional Spender") {
    habits.push("Pause 24 hours before any non‑essential purchase.");
    habits.push("Open your bank app once a day.");
  }

  if (personality.type === "The Free Spirit") {
    habits.push("Plan one dinner this week.");
    habits.push("Clean out one subscription.");
  }

  if (personality.type === "The Overextended Hustler") {
    habits.push("Take a 5‑minute walk.");
    habits.push("Drink water before buying takeout.");
  }

  if (personality.type === "The Stability‑Driven Provider") {
    habits.push("Set a kid fun budget.");
    habits.push("Do one free self‑care activity.");
  }

  if (personality.type === "The Strategic Saver") {
    habits.push("Review your top 3 spending categories.");
    habits.push("Prep ingredients for one meal.");
  }

  if (personality.type === "The Cautious Optimizer") {
    habits.push("Improve one habit by 1% today.");
    habits.push("Track one purchase.");
  }

  // Life score adjustments
  if (lifeScore < 40) habits.push("Drink water and move for 5 minutes.");
  else if (lifeScore < 70) habits.push("Plan one meal for tomorrow.");
  else habits.push("Celebrate one small win.");

  // Survey-based habits
  if (a.q1 >= 4) habits.push("Swap one eating‑out meal for a home meal.");
  if (a.q5 <= 2) habits.push("Do a 3‑minute stretch.");
  if (a.q9 >= 4) habits.push("Unsubscribe from one marketing email.");

  return habits.slice(0, 3);
}

/* -------------------------------
   Kid Budget Engine
-------------------------------- */
function calculateKidBudget(answers, lifeScore) {
  const base = 50 + answers.q10 * 20;
  const min = Math.round(base * 0.8);
  const max = Math.round(base * 1.4);
  return { min, max };
}

/* -------------------------------
   Weekly Report Engine
-------------------------------- */
function generateWeeklyReport(a, personality, lifeScore) {
  let report = `
    <strong>Personality:</strong> ${personality.type}<br>
    <strong>Life Score:</strong> ${lifeScore}/100<br><br>
  `;

  report += `<strong>Key Insights:</strong><br>`;
  if (a.q1 >= 4) report += "• Eating out is high.<br>";
  if (a.q5 <= 2) report += "• Exercise is low.<br>";
  if (a.q9 >= 4) report += "• Impulse spending is high.<br>";

  report += `<br><strong>Summary:</strong><br>`;
  report += `Your habits and personality suggest areas for improvement and opportunities to build stability.`;

  return report;
}

/* -------------------------------
   3‑Question Mini Survey
-------------------------------- */
function handleThreeQSurvey() {
  const form = document.getElementById("surveyForm");
  const q1 = Number(form.q1.value);
  const q2 = Number(form.q2.value);
  const q3 = Number(form.q3.value);

  const score = q1 + q2 + q3;

  let result = "";

  if (score >= 8) result = "You are a Confident Planner.";
  else if (score >= 5) result = "You are a Developing Saver.";
  else result = "You are a Beginner Budgeter.";

  document.getElementById("personalityResult").innerText = result;
}
/* ============================================================
   Vaultwise Dashboard — Cleaned Hybrid Version (Part 4)
   Weekly Missions • Backend Sync (Option B) • Initializer
   ============================================================ */

/* -------------------------------
   Weekly Missions — Personalized Pool
-------------------------------- */
const MISSIONS = [
  "Track your expenses for 3 days",
  "Cook 2 meals at home",
  "Review your bank statements",
  "Avoid impulse purchases for 48 hours",
  "Do a 10‑minute walk 3 times",
  "Plan meals for 2 days",
  "Unsubscribe from 3 marketing emails",
  "Move $10 into savings",
  "Check your credit score",
  "Spend zero on takeout for one day"
];

function generateWeeklyMissions() {
  const answers = JSON.parse(localStorage.getItem("lastSurveyAnswers") || "null");
  const pool = [];

  if (!answers) {
    pool.push(
      "Track your expenses for 3 days",
      "Cook 2 meals at home",
      "Move $10 into savings"
    );
  } else {
    if (answers.q1 >= 4) pool.push("Swap one eating‑out meal for a home meal");
    if (answers.q8 <= 2) pool.push("Move $10 into savings this week");
    if (answers.q5 <= 2) pool.push("Walk 10 minutes 3 times");
    if (answers.q9 >= 4) pool.push("Unsubscribe from 3 marketing emails");
    if (answers.q3 >= 4) pool.push("Plan 2 meals to reduce food waste");
    if (answers.q4 >= 4) pool.push("Cook one meal without convenience foods");
    if (answers.q7 <= 2) pool.push("Review your bank statements this week");

    pool.push("Review your top 3 spending categories");
    pool.push("Prep ingredients for one meal");
  }

  const selected = [];
  while (selected.length < 3 && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    const m = pool.splice(idx, 1)[0];
    selected.push({ text: m, completed: false });
  }

  return selected;
}

/* -------------------------------
   Weekly Missions — Backend Sync (Option B)
   LocalStorage FIRST, Backend SECOND
-------------------------------- */
async function syncMissionsToBackend(missions, timestamp) {
  const token = getToken();
  if (!token) return;

  try {
    await fetch(`${API_BASE}/missions/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ missions, timestamp })
    });
  } catch (err) {
    console.warn("Backend mission sync failed — using local only.");
  }
}

async function loadMissionsFromBackend() {
  const token = getToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE}/missions/get`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data || !data.missions) return null;

    return data;
  } catch (err) {
    return null;
  }
}

/* -------------------------------
   Weekly Missions — Loader
-------------------------------- */
async function loadWeeklyMissions() {
  const now = Date.now();

  // 1. Try backend first
  const backendData = await loadMissionsFromBackend();

  if (backendData && backendData.timestamp) {
    const expired = now - backendData.timestamp > 7 * 24 * 60 * 60 * 1000;

    if (!expired) {
      localStorage.setItem("weeklyMissions", JSON.stringify(backendData));
      return renderWeeklyMissions(backendData.missions, backendData.timestamp);
    }
  }

  // 2. Fallback to localStorage
  let localData = JSON.parse(localStorage.getItem("weeklyMissions"));

  const expiredLocal =
    !localData || now - localData.timestamp > 7 * 24 * 60 * 60 * 1000;

  if (expiredLocal) {
    localData = {
      timestamp: now,
      missions: generateWeeklyMissions()
    };

    localStorage.setItem("weeklyMissions", JSON.stringify(localData));
    syncMissionsToBackend(localData.missions, localData.timestamp);
  }

  renderWeeklyMissions(localData.missions, localData.timestamp);
}

/* -------------------------------
   Weekly Missions — Renderer
-------------------------------- */
function renderWeeklyMissions(missions, timestamp) {
  const grid = document.getElementById("missionsGrid");
  const progressFill = document.getElementById("missionProgressFill");
  const refreshNote = document.getElementById("missionRefreshNote");

  grid.innerHTML = "";

  missions.forEach((m, i) => {
    const card = document.createElement("div");
    card.className = "mission-card";

    card.innerHTML = `
      <div class="mission-title">${m.text}</div>
      <div class="mission-check ${m.completed ? "completed" : ""}" data-index="${i}"></div>
    `;

    grid.appendChild(card);
  });

  // Progress bar
  const completed = missions.filter(m => m.completed).length;
  const percent = (completed / missions.length) * 100;
  progressFill.style.width = percent + "%";

  // Refresh date
  const nextRefresh = new Date(timestamp + 7 * 24 * 60 * 60 * 1000);
  refreshNote.innerText = `New missions arrive on: ${nextRefresh.toDateString()}`;

  // Click handlers
  grid.querySelectorAll(".mission-check").forEach(check => {
    check.addEventListener("click", () => {
      const index = check.dataset.index;
      missions[index].completed = !missions[index].completed;

      const updated = { timestamp, missions };

      // Save locally
      localStorage.setItem("weeklyMissions", JSON.stringify(updated));

      // Sync to backend
      syncMissionsToBackend(missions, timestamp);

      // Re-render
      renderWeeklyMissions(missions, timestamp);
    });
  });
}

/* -------------------------------
   DOMContentLoaded — App Init
-------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  trackVisit();
  renderStreak();
  renderPersonalGreeting();
  renderXP();
  loadWeeklyMissions();
  renderCoachMessage();
  renderMoodJournal();
  applyMoodTheme();
  loadDashboard();
  loadMoneyPersonality();
});
