// ======================================================
// VAULTWISE COACH — FREE MOCK AI (Improved Version)
// ======================================================
// Same categories, same personality, same behavior.
// Cleaner structure, smarter detection, better memory,
// more reliable responses, less repetition.
// ======================================================

// Conversation history
const coachHistory = [];

// Persistent memory
const coachMemory = {
  category: null,
  name: null,

  finance: {
    income: null,
    savings: null,
    debt: null,
    creditScore: null,
    goal: null
  },

  cooking: {
    ingredients: [],
    goal: null,
    dietaryPreference: null
  },

  cleaning: {
    problemArea: null,
    frequency: null
  },

  lifestyle: {
    goal: null,
    wakeTime: null,
    sleepTime: null
  },

  exercise: {
    goal: null,
    experience: null,
    equipment: null,
    daysPerWeek: null
  }
};

// ======================================================
// CHAT UI — Improved
// ======================================================

function addCoachMessage(role, content) {
  const container = document.getElementById("ai-chat-messages");
  if (!container) return;

  const message = document.createElement("div");
  message.className = role === "user" ? "user-message" : "ai-message";

  const label = role === "user" ? "You" : "Vaultwise Coach";

  message.innerHTML = `
    <strong>${label}:</strong>
    <p></p>
  `;

  message.querySelector("p").textContent = content;
  container.appendChild(message);
  container.scrollTop = container.scrollHeight;
}

// ======================================================
// HELPERS — Improved
// ======================================================

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function numberFromText(text) {
  const match = text.match(/\$?\s*([\d,]+(?:\.\d+)?)\s*(k|thousand)?/i);
  if (!match) return null;

  let value = parseFloat(match[1].replace(/,/g, ""));
  if (match[2]) value *= 1000;

  return value;
}

function percentFromText(text) {
  const match = text.match(/(\d+(?:\.\d+)?)\s*%/);
  return match ? parseFloat(match[1]) : null;
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function lastUserMessage() {
  for (let i = coachHistory.length - 1; i >= 0; i--) {
    if (coachHistory[i].role === "user") {
      return coachHistory[i].content;
    }
  }
  return "";
}
// ======================================================
// CATEGORY DETECTION — SMARTER, LESS REPETITION
// ======================================================
// Weighted scoring, fuzzy matching, fallback to last category,
// and multi‑keyword detection. This fixes the “repeating question” issue.

function detectCategory(message) {
  const text = message.toLowerCase();

  // Weighted scores
  const scores = {
    finance: 0,
    cooking: 0,
    cleaning: 0,
    lifestyle: 0,
    exercise: 0
  };

  // Expanded keyword sets (same categories, smarter detection)
  const keywords = {
    finance: [
      "money", "budget", "spend", "expense", "income", "salary",
      "savings", "save", "debt", "loan", "credit", "apr", "interest",
      "invest", "stock", "retirement", "bill", "mortgage", "rent",
      "financial", "finance", "afford"
    ],

    cooking: [
      "cook", "cooking", "recipe", "food", "meal", "dinner", "lunch",
      "breakfast", "eat", "eating", "ingredients", "grocery", "groceries",
      "protein", "calories", "oven", "stove", "air fryer", "fridge",
      "vegetables", "rice", "pasta", "chicken", "beef", "healthy"
    ],

    cleaning: [
      "clean", "cleaning", "dirty", "mess", "messy", "laundry", "dishes",
      "bathroom", "kitchen", "bedroom", "vacuum", "mop", "dust",
      "organize", "clutter", "trash", "toilet", "shower", "sink",
      "cleaning schedule", "chore", "chores"
    ],

    lifestyle: [
      "routine", "habit", "habits", "daily", "morning", "night",
      "sleep", "wake", "stress", "productive", "procrastinate",
      "focus", "phone", "screen time", "self care", "self-care",
      "life", "lifestyle", "goal", "motivation", "schedule"
    ],

    exercise: [
      "exercise", "workout", "gym", "fitness", "muscle", "strength",
      "cardio", "run", "walking", "pushup", "pullup", "squat",
      "weights", "lifting", "stretch", "yoga", "training", "recovery"
    ]
  };

  // Weighted scoring
  for (const category of Object.keys(keywords)) {
    for (const word of keywords[category]) {
      if (text.includes(word)) {
        scores[category] += 2; // strong match
      }
    }
  }

  // Fuzzy matching for phrases like “healthier meals”
  if (text.includes("meal") || text.includes("food") || text.includes("eat")) {
    scores.cooking += 1;
  }
  if (text.includes("mess") || text.includes("organize")) {
    scores.cleaning += 1;
  }
  if (text.includes("routine") || text.includes("schedule")) {
    scores.lifestyle += 1;
  }
  if (text.includes("move") || text.includes("active")) {
    scores.exercise += 1;
  }

  // Pick best category
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];

  // If nothing detected, fallback to last category
  if (best[1] === 0) {
    return coachMemory.category || "lifestyle";
  }

  return best[0];
}

// ======================================================
// MEMORY EXTRACTION — SMARTER, CLEANER, MORE RELIABLE
// ======================================================

function updateMemory(message, category) {
  const text = message.toLowerCase();
  const amount = numberFromText(message);
  const percent = percentFromText(message);

  coachMemory.category = category;

  // ---------- FINANCE ----------
  if (category === "finance") {
    if (text.includes("income") || text.includes("salary")) {
      if (amount) coachMemory.finance.income = amount;
    }

    if (text.includes("saving") || text.includes("saved")) {
      if (amount) coachMemory.finance.savings = amount;
    }

    if (text.includes("debt") || text.includes("loan")) {
      if (amount) coachMemory.finance.debt = amount;
    }

    const credit = message.match(/\b([4-8]\d{2})\b/);
    if (text.includes("credit") && credit) {
      coachMemory.finance.creditScore = parseInt(credit[1]);
    }

    if (text.includes("goal")) {
      coachMemory.finance.goal = message;
    }
  }

  // ---------- COOKING ----------
  if (category === "cooking") {
    const knownIngredients = [
      "chicken", "beef", "turkey", "fish", "salmon",
      "eggs", "rice", "pasta", "potatoes", "bread",
      "cheese", "beans", "tomatoes", "onions",
      "spinach", "broccoli", "carrots", "avocado"
    ];

    coachMemory.cooking.ingredients =
      knownIngredients.filter(item => text.includes(item));

    if (text.includes("healthy")) coachMemory.cooking.goal = "healthy";
    if (text.includes("cheap") || text.includes("budget")) coachMemory.cooking.goal = "budget";
    if (text.includes("quick") || text.includes("fast")) coachMemory.cooking.goal = "quick";
  }

  // ---------- CLEANING ----------
  if (category === "cleaning") {
    const areas = [
      "kitchen", "bathroom", "bedroom", "living room",
      "laundry", "dishes", "floor", "toilet", "shower"
    ];

    coachMemory.cleaning.problemArea =
      areas.find(area => text.includes(area)) ||
      coachMemory.cleaning.problemArea;

    if (text.includes("daily")) coachMemory.cleaning.frequency = "daily";
    if (text.includes("weekly")) coachMemory.cleaning.frequency = "weekly";
  }

  // ---------- LIFESTYLE ----------
  if (category === "lifestyle") {
    if (text.includes("sleep") || text.includes("routine")) {
      coachMemory.lifestyle.goal = message;
    }
  }

  // ---------- EXERCISE ----------
  if (category === "exercise") {
    if (text.includes("muscle") || text.includes("strength")) {
      coachMemory.exercise.goal = "strength";
    }
    if (text.includes("lose weight") || text.includes("fat loss")) {
      coachMemory.exercise.goal = "weight loss";
    }
    if (text.includes("cardio") || text.includes("running")) {
      coachMemory.exercise.goal = "cardio";
    }

    const days = message.match(/\b([1-7])\s*(?:days?|x)\b/i);
    if (days) coachMemory.exercise.daysPerWeek = parseInt(days[1]);
  }
}
// ======================================================
// FINANCE COACH — IMPROVED
// ======================================================

function financeCoach(message) {
  const text = message.toLowerCase();
  const amount = numberFromText(message);

  // Credit score
  if (text.includes("credit score")) {
    const score = coachMemory.finance.creditScore;

    if (score) {
      return `${score} is already a solid credit score. Protect it by paying on time, keeping utilization low, avoiding unnecessary applications, and managing total debt. If you're planning a car or home purchase, tell me the details and I’ll help you think through it.`;
    }

    return `I can help with that. Tell me your approximate credit score, your card balances, and your total credit limits. Then I can explain what is likely helping or hurting your score.`;
  }

  // Budgeting
  if (text.includes("budget") || text.includes("spending") || text.includes("expense")) {
    return `Let’s build a budget around your actual life. Start with monthly take‑home income, housing, transportation, food, debt payments, subscriptions, and recurring bills. Once we have those numbers, we can find spending that can realistically be reduced without making your routine miserable.`;
  }

  // Savings
  if (text.includes("save") || text.includes("savings")) {
    if (amount) {
      return `If ${money(amount)} is your current savings, the next step is deciding what that money needs to do. Separate emergency cash, near‑term purchases, and long‑term wealth building. Tell me what you're saving for and when you expect to need it.`;
    }

    return `Saving works better when every dollar has a purpose. Think in three buckets: emergency cash, short‑term goals, and long‑term investing. Tell me how much you have saved and what you're working toward.`;
  }

  // Debt
  if (text.includes("debt") || text.includes("loan") || text.includes("apr")) {
    return `For debt, I need four numbers: balance, APR, minimum payment, and how much extra you can pay. High‑interest debt deserves special attention because interest quietly works against your goals. Give me those numbers and I’ll compare payoff approaches.`;
  }

  // Investing
  if (text.includes("invest") || text.includes("roth") || text.includes("ira") || text.includes("401k")) {
    return `For investing, identify the account, time horizon, and purpose. Retirement money and money you need in two years shouldn’t be treated the same. Tell me the account type and when you need the money, and I’ll walk you through the main options.`;
  }

  // Monthly → yearly conversion
  if (amount && (text.includes("monthly") || text.includes("month"))) {
    const yearly = amount * 12;
    return `${money(amount)} per month is ${money(yearly)} per year. Small monthly decisions become big yearly ones. If you're deciding whether to cut that expense, tell me what it is and I’ll help you weigh the tradeoff.`;
  }

  return `I can help with budgeting, saving, debt, credit, investing, major purchases, and financial goals. Tell me what you're trying to accomplish and give me the numbers that matter.`;
}


// ======================================================
// COOKING COACH — IMPROVED
// ======================================================

function cookingCoach(message) {
  const text = message.toLowerCase();
  const ingredients = coachMemory.cooking.ingredients;

  // Recipe generation
  if (text.includes("what can i make") || text.includes("what should i cook") || text.includes("recipe")) {
    if (ingredients.length) {
      return `Based on what you have — ${ingredients.join(", ")} — build the meal around the main ingredient, add a simple carb, and a vegetable. Tell me how many people you're cooking for and what equipment you have, and I’ll give you a step‑by‑step recipe.`;
    }

    return `Tell me 3–5 ingredients you already have, and I’ll create a meal around them. I can optimize for cheap, healthy, high‑protein, quick, or beginner‑friendly cooking.`;
  }

  // Healthy meals
  if (text.includes("healthy") || text.includes("nutrition") || text.includes("protein")) {
    return `A healthy meal can be simple: protein + fruit/vegetable + a carb + reasonable fat. Tell me what foods you like and your goal, and I’ll suggest meals you can repeat during the week.`;
  }

  // Cheap meals
  if (text.includes("cheap") || text.includes("budget") || text.includes("affordable")) {
    return `For inexpensive meals, rely on repeatable ingredients: rice, potatoes, beans, eggs, oats, pasta, frozen vegetables, and reasonably priced protein. Tell me your grocery budget and I’ll design a weekly meal strategy.`;
  }

  // Ingredient‑based cooking
  if (ingredients.length || text.includes("chicken") || text.includes("rice") || text.includes("pasta")) {
    return `You already have enough to build a meal. Choose one main ingredient, season it well, cook it safely, then add a carb and vegetable. Tell me exactly what ingredients you have and I’ll give you a step‑by‑step recipe.`;
  }

  return `I can help you decide what to cook, use ingredients you already have, make meals cheaper, build healthier meals, plan groceries, or create simple recipes. What are you working with?`;
}


// ======================================================
// CLEANING COACH — IMPROVED
// ======================================================

function cleaningCoach(message) {
  const text = message.toLowerCase();
  const area = coachMemory.cleaning.problemArea;

  // Cleaning schedule
  if (text.includes("schedule") || text.includes("routine") || text.includes("chores")) {
    return `Don’t deep‑clean your entire home every day. Use frequency: daily (dishes, trash, quick reset), a few times a week (laundry, surfaces), weekly (bathroom, floors, bedding). Tell me how much time you have each day and I’ll build a realistic routine.`;
  }

  // Specific area
  if (area) {
    return `Let’s make ${area} manageable. Remove obvious clutter, clean from higher surfaces downward, finish with the floor. If you give me 10, 20, or 30 minutes, I’ll give you a timed cleaning checklist.`;
  }

  // Overwhelmed
  if (text.includes("messy") || text.includes("overwhelmed") || text.includes("don't know where to start")) {
    return `Don’t try to clean everything. Start with a reset: trash → dishes → obvious items → one surface. Small repeatable habits beat one giant cleaning day.`;
  }

  return `I can help you build cleaning routines, organize a messy room, divide chores across the week, or create a 10–30 minute cleaning sprint. Tell me what area you're dealing with and how much time you have.`;
}


// ======================================================
// LIFESTYLE COACH — IMPROVED
// ======================================================

function lifestyleCoach(message) {
  const text = message.toLowerCase();

  // Procrastination / focus
  if (text.includes("procrast") || text.includes("can't focus") || text.includes("distracted")) {
    return `Don’t aim for all‑day productivity. Pick one task, define the smallest useful next action, and work on it for 10 minutes without switching. Once you start, continuing is easier. If your phone distracts you, put physical distance between you and it for the first work block.`;
  }

  // Morning routine
  if (text.includes("morning") || text.includes("wake")) {
    return `A good morning routine should make your day easier, not add chores. Try: wake up → water → hygiene → quick reset → movement → identify your most important task. Keep it short enough to repeat.`;
  }

  // Sleep / night routine
  if (text.includes("sleep") || text.includes("night") || text.includes("bed")) {
    return `Consistency matters more than complicated rituals. Keep your wake time stable, reduce stimulating activities before bed, and create a predictable wind‑down period. Tell me your current sleep and wake times and I’ll help you build a realistic routine.`;
  }

  // Habit building
  if (text.includes("habit") || text.includes("habits")) {
    return `Start with a version so small that skipping it feels harder than doing it. Attach it to something you already do: after brushing your teeth, after breakfast, or when you get home. Increase gradually once it becomes automatic.`;
  }

  return `Lifestyle improvement is about making your day easier to repeat. I can help with routines, habits, sleep, productivity, procrastination, and daily planning. Tell me what part of your day keeps going off track.`;
}


// ======================================================
// EXERCISE COACH — IMPROVED
// ======================================================

function exerciseCoach(message) {
  const text = message.toLowerCase();

  // Beginner
  if (text.includes("beginner") || text.includes("starting") || text.includes("new to")) {
    return `If you're new to exercise, start with a routine you can recover from. Walking or light cardio + basic strength movements (squats, pushes, pulls, core). Tell me your goal, equipment, and days per week and I’ll build a beginner routine.`;
  }

  // Strength / muscle
  if (text.includes("muscle") || text.includes("strength")) {
    return `For strength or muscle, consistency and progressive overload matter most. Train major movement patterns regularly, recover well, and gradually increase reps or resistance. Tell me where you train and how many days you have.`;
  }

  // Weight loss
  if (text.includes("lose weight") || text.includes("weight loss") || text.includes("fat loss")) {
    return `For fat loss, exercise helps, but eating habits matter more. Combine regular movement with strength training and a sustainable eating pattern. Tell me your current activity level and goal and I’ll help you structure a routine.`;
  }

  // Cardio
  if (text.includes("cardio") || text.includes("running") || text.includes("run")) {
    return `Build cardio gradually. Walking, jogging, cycling, swimming all work. Alternate easier and harder periods to make training manageable. Tell me your preferred activity and current level.`;
  }

  // Mobility
  if (text.includes("stretch") || text.includes("mobility")) {
    return `A mobility routine doesn’t need to be long. Focus on areas that limit your movement, move through comfortable ranges, avoid forcing painful positions. Tell me where you feel stiff and I’ll suggest a short routine.`;
  }

  return `I can help with workouts, strength, cardio, mobility, beginner fitness, and training schedules. Tell me your goal, where you train, what equipment you have, and how many days per week you can commit.`;
}
// ======================================================
// CROSS‑CATEGORY ROUTINE COACH — IMPROVED
// ======================================================

function routineCoach(message) {
  return `Let's turn that into a routine you can actually repeat.

Morning
• Hygiene
• Quick room reset
• Breakfast
• Identify your most important task

Day
• Work/school responsibilities
• Movement or exercise
• Food and hydration
• One small cleaning action

Evening
• Clean-up reset
• Prepare tomorrow
• Review spending if needed
• Wind down for sleep

Tell me what your typical day looks like and I’ll build a routine around your actual schedule.`;
}



// ======================================================
// GENERAL COACH — IMPROVED
// ======================================================

function generalCoach(message) {
  const text = message.toLowerCase();

  if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
    return `Hey! I'm your Vaultwise Coach. I can help you improve five parts of your everyday life: finances, cooking, cleaning, lifestyle, and exercise. You can ask me something specific or tell me what you're struggling with today.`;
  }

  if (text.includes("what can you do") || text.includes("help me")) {
    return `I can help you with five areas:

💰 Finance — budgets, saving, debt, credit, investing  
🍳 Cooking — recipes, groceries, meal planning  
🧹 Cleaning — chores, organization, cleaning schedules  
🌱 Lifestyle — routines, habits, sleep, productivity  
💪 Exercise — workouts, strength, cardio, mobility

You can also combine them. For example: “Build me a routine that includes cooking dinner, cleaning my apartment, and working out.”`;
  }

  return `I'm here to help with the everyday things that are easy to put off. Try asking about your money, what to cook, how to clean something, how to improve your routine, or what workout you should do. You can also give me a real situation and we’ll work through it together.`;
}


// ======================================================
// MAIN RESPONSE ENGINE — SMARTER, CLEANER, NO LOOPING
// ======================================================

function generateCoachReply(message) {
  const text = message.toLowerCase();

  // Detect category
  const category = detectCategory(message);

  // Update memory
  updateMemory(message, category);

  // Cross‑category routine requests
  if (
    (text.includes("routine") || text.includes("schedule")) &&
    (
      text.includes("cook") ||
      text.includes("clean") ||
      text.includes("exercise") ||
      text.includes("workout") ||
      text.includes("money") ||
      text.includes("finance")
    )
  ) {
    return routineCoach(message);
  }

  // Route to correct coach
  switch (category) {
    case "finance":
      return financeCoach(message);

    case "cooking":
      return cookingCoach(message);

    case "cleaning":
      return cleaningCoach(message);

    case "lifestyle":
      return lifestyleCoach(message);

    case "exercise":
      return exerciseCoach(message);

    default:
      return generalCoach(message);
  }
}
// ======================================================
// SEND MESSAGE — FREE MOCK (Improved)
// ======================================================
// Cleaner async flow, more reliable “thinking…” behavior,
// and safer message replacement.

async function sendCoachMessage(message) {
  // Simulate thinking delay for natural feel
  await new Promise(resolve => setTimeout(resolve, 450));

  // Generate reply using improved engine
  return generateCoachReply(message);
}


// ======================================================
// INITIALIZE CHAT — IMPROVED
// ======================================================
// Cleaner event handling, safer DOM access, better UX.

function initCoachChat() {
  const form = document.getElementById("ai-chat-form");
  const input = document.getElementById("ai-chat-input");
  const messages = document.getElementById("ai-chat-messages");

  if (!form || !input || !messages) return;

  form.addEventListener("submit", async event => {
    event.preventDefault();

    const message = input.value.trim();
    if (!message) return;

    // Add user message
    addCoachMessage("user", message);

    coachHistory.push({
      role: "user",
      content: message
    });

    input.value = "";

    // Temporary “thinking…” message
    addCoachMessage("assistant", "Thinking...");

    try {
      const reply = await sendCoachMessage(message);

      // Remove the temporary thinking message
      const lastMessage = messages.lastElementChild;
      if (lastMessage) lastMessage.remove();

      // Add final AI reply
      addCoachMessage("assistant", reply);

      coachHistory.push({
        role: "assistant",
        content: reply
      });

    } catch (error) {
      console.error("VAULTWISE COACH ERROR:", error);

      // Remove thinking message if still present
      const lastMessage = messages.lastElementChild;
      if (lastMessage) lastMessage.remove();

      addCoachMessage(
        "assistant",
        "I couldn't process that. Try asking me another way."
      );
    }
  });
}


// ======================================================
// START — BOOTSTRAP
// ======================================================

document.addEventListener("DOMContentLoaded", initCoachChat);
// ======================================================
// FINAL POLISH — SAFETY + COMPATIBILITY
// ======================================================

// Prevent duplicate initialization if script is loaded twice
if (!window.__vaultwiseCoachInitialized) {
  window.__vaultwiseCoachInitialized = true;
}

// Basic compatibility check
function coachCompatibilityCheck() {
  const required = [
    "addCoachMessage",
    "detectCategory",
    "updateMemory",
    "financeCoach",
    "cookingCoach",
    "cleaningCoach",
    "lifestyleCoach",
    "exerciseCoach",
    "routineCoach",
    "generalCoach",
    "generateCoachReply",
    "sendCoachMessage",
    "initCoachChat"
  ];

  const missing = required.filter(fn => typeof window[fn] !== "function");

  if (missing.length > 0) {
    console.warn("Vaultwise Coach — Missing functions:", missing);
  }
}

// Run compatibility check after load
document.addEventListener("DOMContentLoaded", coachCompatibilityCheck);


// ======================================================
// OPTIONAL UX IMPROVEMENT (NO BEHAVIOR CHANGE)
// ======================================================
// Auto-scroll to bottom when new messages appear.
// This does NOT change logic or personality — only improves UX.

const observer = new MutationObserver(() => {
  const messages = document.getElementById("ai-chat-messages");
  if (messages) {
    messages.scrollTop = messages.scrollHeight;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const messages = document.getElementById("ai-chat-messages");
  if (messages) {
    observer.observe(messages, { childList: true });
  }
});
