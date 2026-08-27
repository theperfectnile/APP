
// ======================================================
// VAULTWISE COACH — FREE MOCK AI
// ======================================================
// Five core categories:
// 1. Finance
// 2. Cooking
// 3. Cleaning
// 4. Lifestyle
// 5. Exercise
//
// This FREE version does NOT call the backend.
// It uses local topic detection, conversation memory,
// practical rules, calculations, routines, and varied
// responses to make the demo feel intelligent.
//
// Later, your PRO version can use the same chat UI and
// replace generateCoachReply() with your real AI API.
// ======================================================

const coachHistory = [];

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
// CHAT UI
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
// HELPERS
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

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
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
// CATEGORY DETECTION
// ======================================================

function detectCategory(message) {
  const text = message.toLowerCase();

  const scores = {
    finance: 0,
    cooking: 0,
    cleaning: 0,
    lifestyle: 0,
    exercise: 0
  };

  const keywords = {
    finance: [
      "money", "budget", "budgeting", "spend", "spending", "expense",
      "expenses", "income", "salary", "savings", "save", "saved",
      "debt", "loan", "credit", "credit score", "credit card", "apr",
      "interest", "invest", "investing", "stock", "stocks", "roth",
      "ira", "401k", "retirement", "rent", "mortgage", "bill", "bills",
      "car payment", "financial", "finance", "afford", "affordability"
    ],

    cooking: [
      "cook", "cooking", "recipe", "food", "meal", "meals", "dinner",
      "lunch", "breakfast", "eat", "eating", "chicken", "beef", "rice",
      "pasta", "eggs", "vegetables", "vegetable", "oven", "stove",
      "air fryer", "fridge", "refrigerator", "ingredients", "grocery",
      "groceries", "protein", "calories", "leftovers"
    ],

    cleaning: [
      "clean", "cleaning", "dirty", "mess", "messy", "laundry", "dishes",
      "bathroom", "kitchen", "bedroom", "vacuum", "mop", "dust", "dusting",
      "organize", "organization", "clutter", "trash", "toilet", "shower",
      "sink", "counter", "cleaning schedule", "chore", "chores"
    ],

    lifestyle: [
      "routine", "routines", "habit", "habits", "daily", "day", "morning",
      "night", "evening", "sleep", "sleeping", "wake", "wakeup", "stress",
      "productive", "productivity", "procrastinate", "procrastination",
      "focus", "focused", "phone", "screen time", "self care", "self-care",
      "life", "lifestyle", "goal", "goals", "discipline", "motivation",
      "time management", "schedule"
    ],

    exercise: [
      "exercise", "workout", "work out", "gym", "fitness", "muscle",
      "muscles", "strength", "cardio", "run", "running", "walk", "walking",
      "pushup", "pushups", "pullup", "pullups", "squat", "squats",
      "weight", "weights", "lifting", "stretch", "stretching", "yoga",
      "core", "abs", "calories burned", "training", "recovery"
    ]
  };

  for (const category of Object.keys(keywords)) {
    for (const word of keywords[category]) {
      if (text.includes(word)) scores[category]++;
    }
  }

  const best = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])[0];

  if (best[1] === 0) {
    return coachMemory.category || "lifestyle";
  }

  return best[0];
}


// ======================================================
// MEMORY EXTRACTION
// ======================================================

function updateMemory(message, category) {
  const text = message.toLowerCase();
  const amount = numberFromText(message);
  const percent = percentFromText(message);

  coachMemory.category = category;

  // ---------- FINANCE ----------
  if (category === "finance") {
    if (
      text.includes("income") ||
      text.includes("salary") ||
      text.includes("make ") ||
      text.includes("earn ")
    ) {
      if (amount) coachMemory.finance.income = amount;
    }

    if (
      text.includes("saving") ||
      text.includes("savings") ||
      text.includes("saved")
    ) {
      if (amount) coachMemory.finance.savings = amount;
    }

    if (
      text.includes("debt") ||
      text.includes("owe") ||
      text.includes("loan")
    ) {
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

    if (text.includes("healthy")) {
      coachMemory.cooking.goal = "healthy";
    }

    if (text.includes("cheap") || text.includes("budget")) {
      coachMemory.cooking.goal = "budget";
    }

    if (text.includes("quick") || text.includes("fast")) {
      coachMemory.cooking.goal = "quick";
    }
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

    if (text.includes("daily")) {
      coachMemory.cleaning.frequency = "daily";
    } else if (text.includes("weekly")) {
      coachMemory.cleaning.frequency = "weekly";
    }
  }

  // ---------- LIFESTYLE ----------
  if (category === "lifestyle") {
    if (
      text.includes("sleep") ||
      text.includes("routine") ||
      text.includes("productive")
    ) {
      coachMemory.lifestyle.goal = message;
    }
  }

  // ---------- EXERCISE ----------
  if (category === "exercise") {
    if (
      text.includes("muscle") ||
      text.includes("strength")
    ) {
      coachMemory.exercise.goal = "strength";
    } else if (
      text.includes("lose weight") ||
      text.includes("weight loss") ||
      text.includes("fat loss")
    ) {
      coachMemory.exercise.goal = "weight loss";
    } else if (
      text.includes("cardio") ||
      text.includes("running")
    ) {
      coachMemory.exercise.goal = "cardio";
    }

    const days = message.match(/\b([1-7])\s*(?:days?|x)\b/i);
    if (days) {
      coachMemory.exercise.daysPerWeek = parseInt(days[1]);
    }
  }
}


// ======================================================
// FINANCE COACH
// ======================================================

function financeCoach(message) {
  const text = message.toLowerCase();
  const amount = numberFromText(message);

  if (text.includes("credit score")) {
    if (coachMemory.finance.creditScore) {
      const score = coachMemory.finance.creditScore;

      return `${score} is already a strong credit score. At that level, I'd focus less on chasing a higher number and more on protecting it: pay on time, keep revolving utilization under control, avoid unnecessary applications, and manage your total debt. If you're planning a car or home purchase, tell me what you're trying to do and I'll help you think through it.`;
    }

    return `I can help with that. Tell me your approximate credit score, your card balances, and your total credit limits. Then I can explain what is likely helping or hurting your score.`;
  }

  if (
    text.includes("budget") ||
    text.includes("spending") ||
    text.includes("expense")
  ) {
    return `Let's make your budget around your actual life rather than giving you a generic percentage. Start with monthly take-home income, housing, transportation, food, debt payments, subscriptions, and other recurring bills. Once we have those numbers, we can find the spending that can realistically be reduced without making your routine miserable.`;
  }

  if (
    text.includes("save") ||
    text.includes("savings")
  ) {
    if (amount) {
      return `If ${money(amount)} is your current savings amount, the next question is what that money needs to do. I'd separate money for emergencies, near-term purchases, and long-term wealth building. Tell me what you're saving for and when you expect to need it, and we can decide how much should stay accessible.`;
    }

    return `Saving works better when every dollar has a purpose. I'd think in three buckets: emergency cash, short-term goals, and long-term investing. Tell me how much you have saved and what you're working toward, and I'll help you create a plan.`;
  }

  if (
    text.includes("debt") ||
    text.includes("loan") ||
    text.includes("apr")
  ) {
    return `For debt, I want four numbers: balance, APR, minimum payment, and the amount you can pay above the minimum. High-interest debt deserves special attention because interest can quietly work against your other goals. Give me those numbers and I can compare payoff approaches.`;
  }

  if (
    text.includes("invest") ||
    text.includes("roth") ||
    text.includes("ira") ||
    text.includes("401k")
  ) {
    return `For investing, let's first identify the account, time horizon, and purpose. A retirement account and money you need in two years should not automatically be treated the same way. Once I know the account and when you need the money, I can walk you through the main options and tradeoffs.`;
  }

  if (amount && (text.includes("monthly") || text.includes("month"))) {
    const yearly = amount * 12;

    return `${money(amount)} per month is ${money(yearly)} per year. That's a useful way to look at recurring spending because small monthly decisions become much larger over a year. If you're deciding whether to cut that expense, tell me what it is and I'll help you weigh the tradeoff.`;
  }

  return `Let's look at the actual numbers. I can help you with budgeting, saving, debt, credit, investing, major purchases, and financial goals. Tell me what you're trying to accomplish and give me the numbers that matter.`;
}


// ======================================================
// COOKING COACH
// ======================================================

function cookingCoach(message) {
  const text = message.toLowerCase();
  const ingredients = coachMemory.cooking.ingredients;

  if (
    text.includes("what can i make") ||
    text.includes("what should i cook") ||
    text.includes("recipe")
  ) {
    if (ingredients.length) {
      return `Based on what you've mentioned — ${ingredients.join(", ")} — I'd build the meal around the protein or main ingredient first, then add a simple carbohydrate and a vegetable. If you tell me how many people you're cooking for and what equipment you have, I can turn those ingredients into a specific meal with steps.`;
    }

    return `Tell me 3–5 ingredients you already have, and I'll create a meal around them. I can also optimize it for cheap, healthy, high-protein, quick, or beginner-friendly cooking.`;
  }

  if (
    text.includes("healthy") ||
    text.includes("nutrition") ||
    text.includes("protein")
  ) {
    return `A simple healthy meal doesn't need to be complicated. Try building it around a protein source, a fruit or vegetable, a carbohydrate that fits your needs, and a reasonable amount of fat. If you tell me what foods you like and your goal, I can suggest meals that are realistic enough to repeat during the week.`;
  }

  if (
    text.includes("cheap") ||
    text.includes("budget") ||
    text.includes("affordable")
  ) {
    return `For inexpensive meals, repeatable ingredients are your friend. Rice, potatoes, beans, eggs, oats, pasta, frozen vegetables, and whatever protein is reasonably priced can become several different meals. If you give me your grocery budget, I can design a simple weekly meal strategy around it.`;
  }

  if (
    text.includes("chicken") ||
    text.includes("rice") ||
    text.includes("pasta") ||
    ingredients.length
  ) {
    return `You already have enough information to start building a meal. I'd keep it simple: choose one main ingredient, season it well, cook it safely, then add a carbohydrate and vegetable. Tell me exactly what ingredients you have and I'll give you a step-by-step recipe instead of making you guess what to do next.`;
  }

  return `I can help you decide what to cook, use ingredients you already have, make meals cheaper, build healthier meals, plan groceries, or create simple recipes. What are you working with?`;
}


// ======================================================
// CLEANING COACH
// ======================================================

function cleaningCoach(message) {
  const text = message.toLowerCase();

  const area =
    coachMemory.cleaning.problemArea;

  if (
    text.includes("schedule") ||
    text.includes("routine") ||
    text.includes("chores")
  ) {
    return `Don't try to deep-clean your entire home every day. A better routine is to give each task a frequency. Daily: dishes, trash, quick reset. A few times a week: laundry and surfaces. Weekly: bathroom, floors, bedding, and a more complete reset. Tell me how much time you have each day and I'll turn that into a realistic routine.`;
  }

  if (area) {
    return `Let's make ${area} manageable instead of waiting until it becomes a huge project. Start by removing obvious clutter, then clean from higher surfaces downward, and finish with the floor. If you give me 10, 20, or 30 minutes, I can give you a timed cleaning checklist.`;
  }

  if (
    text.includes("messy") ||
    text.includes("overwhelmed") ||
    text.includes("don't know where to start")
  ) {
    return `Don't start by trying to clean everything. Start with a reset: throw away trash, collect dishes, put obvious items back where they belong, then choose one surface or area. A clean environment is easier to maintain when you create small repeatable habits instead of relying on one giant cleaning day.`;
  }

  return `I can help you build cleaning routines, organize a messy room, divide chores across the week, or create a 10–30 minute cleaning sprint. Tell me what area you're dealing with and how much time you have.`;
}


// ======================================================
// LIFESTYLE COACH
// ======================================================

function lifestyleCoach(message) {
  const text = message.toLowerCase();

  if (
    text.includes("procrast") ||
    text.includes("can't focus") ||
    text.includes("distracted")
  ) {
    return `Don't make the goal "be productive all day." Pick one task, define the smallest useful next action, and work on it for 10 minutes without switching tasks. Once you start, continuing is usually easier than starting. If your phone is the main distraction, put physical distance between you and it during the first work block.`;
  }

  if (
    text.includes("morning") ||
    text.includes("wake")
  ) {
    return `A good morning routine should make the rest of your day easier, not give you ten more chores. Try: wake up, water, hygiene, make the bed, quick movement, then identify your most important task. Keep it short enough that you can actually repeat it.`;
  }

  if (
    text.includes("sleep") ||
    text.includes("night") ||
    text.includes("bed")
  ) {
    return `For a better sleep routine, consistency usually matters more than creating a complicated ritual. Keep your wake time reasonably consistent, reduce stimulating activities before bed, and give yourself a predictable wind-down period. If you tell me your current sleep and wake times, I can help you build a realistic evening routine.`;
  }

  if (
    text.includes("habit") ||
    text.includes("habits")
  ) {
    return `The best habit is one you can repeat. Start with a version so small that skipping it feels harder than doing it. Then attach it to something you already do: after brushing your teeth, after breakfast, or when you get home. Once the behavior becomes automatic, increase it gradually.`;
  }

  return `Lifestyle improvement is really about making your day easier to repeat. I can help with morning routines, evening routines, habits, productivity, sleep, time management, procrastination, and daily planning. Tell me what part of your day keeps going off track.`;
}


// ======================================================
// EXERCISE COACH
// ======================================================

function exerciseCoach(message) {
  const text = message.toLowerCase();

  if (
    text.includes("beginner") ||
    text.includes("starting") ||
    text.includes("new to")
  ) {
    return `If you're new to exercise, don't start with an extreme program. Start with a routine you can recover from and repeat. A simple foundation is walking or light cardio plus basic strength movements such as squats, pushes, pulls, and core work. If you tell me your goal, available equipment, and how many days you can train, I can build a beginner routine around that.`;
  }

  if (
    text.includes("muscle") ||
    text.includes("strength")
  ) {
    return `For building strength or muscle, consistency and progressive overload matter more than constantly changing exercises. Build your routine around major movement patterns, train them regularly, recover adequately, and gradually increase reps, resistance, or difficulty. Tell me whether you train at home or in a gym and how many days you have available.`;
  }

  if (
    text.includes("lose weight") ||
    text.includes("weight loss") ||
    text.includes("fat loss")
  ) {
    return `For fat loss, exercise helps, but your overall energy balance and eating habits matter too. A sustainable approach is usually better than trying to burn yourself out with cardio. Combine regular movement with strength training and an eating pattern you can maintain. If you tell me your current activity level and goal, I can help you structure a routine.`;
  }

  if (
    text.includes("cardio") ||
    text.includes("running") ||
    text.includes("run")
  ) {
    return `For cardio, build gradually instead of trying to maximize every workout. Walking, jogging, cycling, swimming, or other activities can work. If you're starting from low fitness, alternating easier and harder periods can make training more manageable. Tell me what activity you prefer and your current level.`;
  }

  if (
    text.includes("stretch") ||
    text.includes("mobility")
  ) {
    return `A useful mobility routine doesn't need to be long. Focus on the areas that actually limit your movement, move through comfortable ranges, and avoid forcing painful positions. If you tell me where you feel stiff, I can suggest a short routine.`;
  }

  return `I can help with workouts, strength, cardio, mobility, beginner fitness, habit-building around exercise, and training schedules. Tell me your goal, where you train, what equipment you have, and how many days per week you can realistically commit.`;
}


// ======================================================
// CROSS-CATEGORY DAILY ROUTINE COACH
// ======================================================

function routineCoach(message) {
  return `Let's turn that into a routine instead of another thing you have to remember.

A strong Vaultwise routine can combine your five areas:

Morning
• Hygiene
• Quick room reset
• Breakfast
• Review today's priorities

Day
• Work/school responsibilities
• Movement
• Food and hydration

Evening
• Clean-up reset
• Prepare tomorrow
• Review spending if needed
• Wind down for sleep

Tell me what your typical day looks like and I can build a routine around your actual schedule.`;
}


// ======================================================
// GENERAL COACH
// ======================================================

function generalCoach(message) {
  const text = message.toLowerCase();

  if (
    text.includes("hello") ||
    text.includes("hi") ||
    text.includes("hey")
  ) {
    return `Hey! I'm your Vaultwise Coach. I can help you improve five parts of your everyday life: finances, cooking, cleaning, lifestyle, and exercise. You can ask me something specific or tell me what you're struggling with today.`;
  }

  if (
    text.includes("what can you do") ||
    text.includes("help me")
  ) {
    return `I can help you with five areas:

💰 Finance — budgets, saving, debt, credit, investing and spending

🍳 Cooking — recipes, groceries, meal planning and using what you already have

🧹 Cleaning — chores, organization, cleaning schedules and quick resets

🌱 Lifestyle — routines, habits, sleep, productivity and procrastination

💪 Exercise — workouts, strength, cardio, mobility and consistency

You can also combine them. For example: "Build me a routine that includes cooking dinner, cleaning my apartment and working out."`;
  }

  return `I'm here to help with the everyday things that are easy to put off. Try asking about your money, what to cook, how to clean something, how to improve your routine, or what workout you should do. You can also give me a real situation and we'll work through it together.`;
}


// ======================================================
// MAIN RESPONSE ENGINE
// ======================================================

function generateCoachReply(message) {
  const category = detectCategory(message);

  updateMemory(message, category);

  // Cross-category requests
  const text = message.toLowerCase();

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
// SEND MESSAGE — FREE MOCK
// ======================================================

async function sendCoachMessage(message) {
  // Simulate thinking so the free demo feels natural.
  await new Promise(resolve => setTimeout(resolve, 450));

  return generateCoachReply(message);
}


// ======================================================
// INITIALIZE CHAT
// ======================================================

function initCoachChat() {
  const form = document.getElementById("ai-chat-form");
  const input = document.getElementById("ai-chat-input");

  if (!form || !input) return;

  form.addEventListener("submit", async event => {
    event.preventDefault();

    const message = input.value.trim();
    if (!message) return;

    addCoachMessage("user", message);

    coachHistory.push({
      role: "user",
      content: message
    });

    input.value = "";

    addCoachMessage("assistant", "Thinking...");

    try {
      const reply = await sendCoachMessage(message);

      const messages =
        document.getElementById("ai-chat-messages");

      const lastMessage =
        messages.lastElementChild;

      if (lastMessage) {
        lastMessage.remove();
      }

      addCoachMessage("assistant", reply);

      coachHistory.push({
        role: "assistant",
        content: reply
      });

    } catch (error) {
      console.error("VAULTWISE COACH ERROR:", error);

      const messages =
        document.getElementById("ai-chat-messages");

      const lastMessage =
        messages.lastElementChild;

      if (lastMessage) {
        lastMessage.remove();
      }

      addCoachMessage(
        "assistant",
        "I couldn't process that. Try asking me another way."
      );
    }
  });
}


// ======================================================
// START
// ======================================================

document.addEventListener(
  "DOMContentLoaded",
  initCoachChat
);


out = Path("/mnt/data/Vaultwise_Free_Coach_5_Categories.js")
out.write_text(js)
print(f"Created {out}")
print(f"{len(js.splitlines())} lines")
