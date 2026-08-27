// ======================================================
// VAULTWISE AI CHAT COACH — FREE MOCK VERSION
// ======================================================
// No backend.
// No API key.
// No external AI service.
//
// This version uses:
// - conversation memory
// - topic detection
// - follow-up awareness
// - financial calculations
// - personalized mock responses
// - clarification questions
// ======================================================


// ======================================================
// CHAT MEMORY
// ======================================================

const coachHistory = [];


// ======================================================
// USER PROFILE MEMORY
// ======================================================

const coachMemory = {
  income: null,
  savings: null,
  debt: null,
  creditScore: null,
  monthlyExpenses: null,
  age: null,
  goal: null,
  topic: null
};


// ======================================================
// ADD MESSAGE TO CHAT
// ======================================================

function addCoachMessage(role, content) {

  const container =
    document.getElementById("ai-chat-messages");

  if (!container) return;

  const message = document.createElement("div");

  message.className =
    role === "user"
      ? "user-message"
      : "ai-message";

  const label =
    role === "user"
      ? "You"
      : "Vaultwise Coach";

  message.innerHTML = `
    <strong>${label}:</strong>
    <p></p>
  `;

  message.querySelector("p").textContent = content;

  container.appendChild(message);

  container.scrollTop = container.scrollHeight;
}


// ======================================================
// FORMAT MONEY
// ======================================================

function formatMoney(amount) {

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);
}


// ======================================================
// EXTRACT NUMBERS
// ======================================================

function extractMoney(message) {

  const match =
    message.match(
      /\$?\s*([\d,]+(?:\.\d+)?)\s*(k|thousand)?/i
    );

  if (!match) return null;

  let amount =
    parseFloat(match[1].replace(/,/g, ""));

  if (match[2]) {
    amount *= 1000;
  }

  return amount;
}


// ======================================================
// REMEMBER USER INFORMATION
// ======================================================

function updateCoachMemory(message) {

  const lower = message.toLowerCase();

  const money = extractMoney(message);

  // Income
  if (
    lower.includes("income") ||
    lower.includes("make") ||
    lower.includes("salary") ||
    lower.includes("earn")
  ) {
    if (money) {
      coachMemory.income = money;
    }
  }

  // Savings
  if (
    lower.includes("savings") ||
    lower.includes("saved") ||
    lower.includes("save")
  ) {
    if (money) {
      coachMemory.savings = money;
    }
  }

  // Debt
  if (
    lower.includes("debt") ||
    lower.includes("owe") ||
    lower.includes("loan")
  ) {
    if (money) {
      coachMemory.debt = money;
    }
  }

  // Credit score
  const creditMatch =
    message.match(/\b([4-8]\d{2})\b/);

  if (
    lower.includes("credit") &&
    creditMatch
  ) {
    coachMemory.creditScore =
      parseInt(creditMatch[1]);
  }

  // Age
  const ageMatch =
    lower.match(
      /\b(?:i'm|im|i am|age)\s*(\d{2})\b/
    );

  if (ageMatch) {
    coachMemory.age =
      parseInt(ageMatch[1]);
  }
}


// ======================================================
// DETECT TOPIC
// ======================================================

function detectTopic(message) {

  const text =
    message.toLowerCase();

  if (
    /budget|spend|spending|expense|expenses|money.*left|cut back|cutting/i
      .test(text)
  ) {
    return "budget";
  }

  if (
    /save|saving|savings|emergency fund|cash reserve/i
      .test(text)
  ) {
    return "savings";
  }

  if (
    /credit score|credit card|utilization|credit limit|fico/i
      .test(text)
  ) {
    return "credit";
  }

  if (
    /debt|loan|apr|interest|pay off|payment/i
      .test(text)
  ) {
    return "debt";
  }

  if (
    /invest|investing|stock|stocks|etf|index fund|mutual fund|roth|ira|401k|retirement/i
      .test(text)
  ) {
    return "investing";
  }

  if (
    /income|salary|raise|job|career|side hustle|business/i
      .test(text)
  ) {
    return "income";
  }

  if (
    /car|vehicle|auto loan|car payment/i
      .test(text)
  ) {
    return "car";
  }

  if (
    /house|home|mortgage|down payment/i
      .test(text)
  ) {
    return "housing";
  }

  if (
    /goal|goals|financial freedom|wealth|future/i
      .test(text)
  ) {
    return "goals";
  }

  return coachMemory.topic || "general";
}


// ======================================================
// SIMPLE FINANCIAL CALCULATIONS
// ======================================================

function calculateSavingsFromMonthly(amount) {

  return {
    monthly: amount,
    yearly: amount * 12
  };
}


function calculatePercentage(amount, percentage) {

  return amount * (percentage / 100);
}


// ======================================================
// CHECK FOR FOLLOW-UP QUESTIONS
// ======================================================

function isFollowUp(message) {

  const text =
    message.toLowerCase().trim();

  if (
    /^(what about|what if|how about|and if|then what|why|how|okay|ok|yes|yeah|no|really|why not)/i
      .test(text)
  ) {
    return true;
  }

  if (
    text.length < 35 &&
    coachHistory.length > 1
  ) {
    return true;
  }

  return false;
}


// ======================================================
// GENERATE BUDGET RESPONSE
// ======================================================

function budgetResponse(message) {

  const amount =
    extractMoney(message);

  if (amount) {

    const yearly =
      calculateSavingsFromMonthly(amount);

    return `
If that's a monthly amount, you're looking at about ${formatMoney(yearly.yearly)} per year.

I wouldn't automatically tell you to eliminate it. The better question is whether that spending is actually hurting one of your goals.

For example, cutting ${formatMoney(amount * 0.20)} per month would free up about ${formatMoney(amount * 0.20 * 12)} per year while still allowing you to keep 80% of the spending.

If you give me your monthly income and your major expenses, I can help you figure out whether this is actually too much.
    `.trim();
  }

  return `
Let's make this practical instead of just telling you to "spend less."

Start with four categories:

1. Housing
2. Transportation
3. Food
4. Everything else

Then compare your monthly spending against your income.

If you tell me your monthly take-home income and roughly what you spend on housing, transportation, food and debt, I can help you build a realistic budget.
  `.trim();
}


// ======================================================
// SAVINGS RESPONSE
// ======================================================

function savingsResponse(message) {

  const amount =
    extractMoney(message);

  if (amount) {

    return `
That's useful information.

If you currently have ${formatMoney(amount)} saved, the next question is what job that money is supposed to do.

I'd separate your savings into:

• Emergency cash
• Near-term purchases
• Long-term investing

You generally don't want money you'll need soon exposed to large market swings.

If you tell me what you're saving the money for and roughly when you'll need it, I can help you decide how much should stay in cash versus be invested.
    `.trim();
  }

  return `
The goal isn't simply to have a large savings balance. Your money should have a purpose.

I'd normally think about savings in three layers:

1. Money for emergencies
2. Money for purchases in the next few years
3. Money for long-term wealth building

Tell me how much you currently have saved and what you're saving for, and we'll work from there.
  `.trim();
}


// ======================================================
// CREDIT RESPONSE
// ======================================================

function creditResponse(message) {

  if (coachMemory.creditScore) {

    const score =
      coachMemory.creditScore;

    return `
A ${score} credit score is already strong.

At that level, the goal usually isn't to obsess over gaining another 20 points. I'd focus on protecting the score while improving your overall financial position.

The biggest things to watch are:

• Never missing payments
• Keeping revolving utilization reasonable
• Avoiding unnecessary new accounts
• Keeping older accounts open when appropriate
• Paying attention to your total debt

If you're trying to qualify for a car, mortgage, or another loan, tell me what you're trying to do and I can explain what matters most.
    `.trim();
  }

  return `
Credit scores are only one part of your financial picture.

The biggest factors I'd watch are:

• Payment history
• Credit utilization
• Age of accounts
• New credit applications
• Credit mix

If you tell me your approximate score, card balances and credit limits, I can explain what is likely affecting your score.
  `.trim();
}


// ======================================================
// DEBT RESPONSE
// ======================================================

function debtResponse(message) {

  const amount =
    extractMoney(message);

  if (amount) {

    return `
If ${formatMoney(amount)} is the amount you're dealing with, don't just focus on the balance.

I'd want to know:

• Interest rate
• Minimum payment
• Monthly cash flow
• Whether you have an emergency fund

High-interest debt is usually a priority because the interest can work against you every month.

If you give me the balance, APR and minimum payment, I can compare different payoff strategies for you.
    `.trim();
  }

  return `
Let's look at debt mathematically rather than emotionally.

The most important numbers are:

1. Balance
2. APR
3. Minimum payment
4. Extra amount you can afford each month

Give me those four numbers and I can show you how aggressively you could pay it down.
  `.trim();
}


// ======================================================
// INVESTING RESPONSE
// ======================================================

function investingResponse(message) {

  return `
For investing, I want to separate two questions:

"Should I invest?"

and

"What should I invest in?"

Those aren't the same question.

Before choosing an investment, I'd look at:

• Emergency savings
• High-interest debt
• Time horizon
• Risk tolerance
• Account type, such as a Roth IRA or taxable brokerage

For long-term investing, diversified low-cost funds are often a much simpler starting point than trying to pick individual stocks.

If you tell me which account you're talking about and when you expect to need the money, I can walk you through the options.
  `.trim();
}


// ======================================================
// CAR RESPONSE
// ======================================================

function carResponse(message) {

  const amount =
    extractMoney(message);

  if (amount) {

    return `
A ${formatMoney(amount)} vehicle isn't just a ${formatMoney(amount)} purchase.

I'd look at the total monthly cost:

• Loan payment
• Insurance
• Gas
• Maintenance
• Registration
• Depreciation

The important question is whether the total cost fits comfortably into your budget, not simply whether you can get approved for the loan.

If you give me the purchase price, down payment, APR and loan term, I can calculate the payment and total interest.
    `.trim();
  }

  return `
When you're evaluating a car, don't judge affordability only by the monthly payment.

A dealer can make almost any payment look reasonable by extending the loan term.

Give me the car price, down payment, APR and loan length and I'll break down the real cost.
  `.trim();
}


// ======================================================
// INCOME RESPONSE
// ======================================================

function incomeResponse(message) {

  return `
Increasing income can be more powerful than trying to optimize every small expense.

I'd look at three paths:

1. Increase your current income
2. Build a valuable skill that raises your earning potential
3. Create an additional income source

The best option depends on your current job, skills and how much time you have available.

Tell me what you currently do for work and what skills you're building, and I'll help you compare realistic paths.
  `.trim();
}


// ======================================================
// GOALS RESPONSE
// ======================================================

function goalsResponse(message) {

  return `
Let's turn the goal into numbers.

A useful financial goal has:

• A target amount
• A deadline
• A current starting point
• A monthly contribution

For example, instead of saying "I want to save more," we could say:

"I want $20,000 by December 2027."

Then we can calculate exactly what monthly contribution would be required.

Tell me your goal and deadline and I'll break it down.
  `.trim();
}


// ======================================================
// GENERAL RESPONSE
// ======================================================

function generalResponse(message) {

  const lower =
    message.toLowerCase();

  if (
    lower.includes("hello") ||
    lower.includes("hi") ||
    lower.includes("hey")
  ) {
    return `
Hey — I'm your Vaultwise Coach.

I can help you think through budgeting, saving, debt, credit, investing, major purchases and financial goals.

What's on your mind?
    `.trim();
  }

  if (
    lower.includes("thank")
  ) {
    return `
You're welcome.

Keep giving me the actual numbers and I'll help you work through the decision instead of giving you generic financial advice.
    `.trim();
  }

  return `
I want to give you an answer that actually fits your situation rather than guessing.

Tell me a little more about what you're trying to accomplish, and include any numbers that matter — income, balance, payment, savings, price, APR, or deadline.

I'll work through it with you.
  `.trim();
}


// ======================================================
// MAIN MOCK AI ENGINE
// ======================================================

function generateMockCoachReply(message) {

  updateCoachMemory(message);

  const topic =
    detectTopic(message);

  coachMemory.topic = topic;

  // ----------------------------------------
  // Follow-up awareness
  // ----------------------------------------

  if (isFollowUp(message)) {

    const previousTopic =
      coachMemory.topic;

    if (previousTopic === "budget") {
      return budgetResponse(message);
    }

    if (previousTopic === "savings") {
      return savingsResponse(message);
    }

    if (previousTopic === "credit") {
      return creditResponse(message);
    }

    if (previousTopic === "debt") {
      return debtResponse(message);
    }

    if (previousTopic === "investing") {
      return investingResponse(message);
    }
  }

  // ----------------------------------------
  // Topic routing
  // ----------------------------------------

  switch (topic) {

    case "budget":
      return budgetResponse(message);

    case "savings":
      return savingsResponse(message);

    case "credit":
      return creditResponse(message);

    case "debt":
      return debtResponse(message);

    case "investing":
      return investingResponse(message);

    case "car":
      return carResponse(message);

    case "income":
      return incomeResponse(message);

    case "goals":
      return goalsResponse(message);

    default:
      return generalResponse(message);
  }
}


// ======================================================
// SEND MESSAGE
// ======================================================

async function sendCoachMessage(message) {

  // ----------------------------------------
  // FREE MOCK MODE
  // ----------------------------------------
  // There is deliberately NO backend call here.
  // ----------------------------------------

  await new Promise(resolve =>
    setTimeout(resolve, 500)
  );

  return generateMockCoachReply(message);
}


// ======================================================
// INITIALIZE CHAT
// ======================================================

function initCoachChat() {

  const form =
    document.getElementById("ai-chat-form");

  const input =
    document.getElementById("ai-chat-input");

  if (!form || !input) return;

  form.addEventListener("submit", async event => {

    event.preventDefault();

    const message =
      input.value.trim();

    if (!message) return;

    // ----------------------------------------
    // Display user message
    // ----------------------------------------

    addCoachMessage(
      "user",
      message
    );

    coachHistory.push({
      role: "user",
      content: message
    });

    input.value = "";

    // ----------------------------------------
    // Loading
    // ----------------------------------------

    addCoachMessage(
      "assistant",
      "Thinking..."
    );

    try {

      const reply =
        await sendCoachMessage(message);

      // ----------------------------------------
      // Remove thinking message
      // ----------------------------------------

      const messages =
        document.getElementById(
          "ai-chat-messages"
        );

      const lastMessage =
        messages.lastElementChild;

      if (lastMessage) {
        lastMessage.remove();
      }

      // ----------------------------------------
      // Display response
      // ----------------------------------------

      addCoachMessage(
        "assistant",
        reply
      );

      coachHistory.push({
        role: "assistant",
        content: reply
      });

    } catch (err) {

      console.error(
        "VAULTWISE COACH ERROR:",
        err
      );

      const messages =
        document.getElementById(
          "ai-chat-messages"
        );

      const lastMessage =
        messages.lastElementChild;

      if (lastMessage) {
        lastMessage.remove();
      }

      addCoachMessage(
        "assistant",
        "Something went wrong. Try asking me again."
      );
    }
  });
}


// ======================================================
// START CHAT
// ======================================================

document.addEventListener(
  "DOMContentLoaded",
  initCoachChat
);
