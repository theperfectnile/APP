// ======================================================
// DASHBOARD.JS
// Backend-connected habit dashboard
// ======================================================



// ======================================================
// GLOBAL DASHBOARD STATE
// ======================================================

let xpData = {
  xp: 0,
  log: []
};

let habitProgress = {
  finance: 0,
  exercise: 0,
  cleaning: 0,
  cooking: 0,
  lifestyle: 0
};

let dailyMissions = {};

let streakData = {
  streak: 0,
  lastCompletedDate: null
};

let moodToday = null;

let financeSummary = null;

const threeQuestionSurvey = [
  {
    id: "mood",
    text: "How is your mood today?"
  },
  {
    id: "energy",
    text: "How is your energy today?"
  },
  {
    id: "stress",
    text: "How stressed do you feel today?"
  }
];


// ======================================================
// LOAD XP FROM BACKEND
// ======================================================

async function loadXP() {
  try {
    const data = await apiGet(`${API}/api/xp`);

    if (data && typeof data.xp === "number") {
      xpData = data;
    } else {
      xpData = {
        xp: 0,
        log: []
      };
    }

    if (!Array.isArray(xpData.log)) {
      xpData.log = [];
    }

  } catch (err) {
    console.error("LOAD XP ERROR:", err);

    xpData = {
      xp: 0,
      log: []
    };
  }
}


// ======================================================
// LOAD HABITS FROM BACKEND
// ======================================================

async function loadHabits() {
  try {
    const data = await apiGet(`${API}/api/habits`);

    if (data && data.progress) {
      habitProgress = {
        finance: Number(data.progress.finance) || 0,
        exercise: Number(data.progress.exercise) || 0,
        cleaning: Number(data.progress.cleaning) || 0,
        cooking: Number(data.progress.cooking) || 0,
        lifestyle: Number(data.progress.lifestyle) || 0
      };
    }

  } catch (err) {
    console.error("LOAD HABITS ERROR:", err);
  }
}


// ======================================================
// STREAK
// ======================================================

async function loadStreak() {
  // Temporary until streaks are moved completely
  // into the backend.
  streakData = {
    streak: 0,
    lastCompletedDate: null
  };
}


// ======================================================
// MOOD
// ======================================================

async function loadMood() {
  moodToday = null;
}


// ======================================================
// FINANCE SUMMARY
// ======================================================

async function loadFinanceSummary() {
  try {
    financeSummary = await apiGet(
      `${API}/api/finance/summary`
    );
  } catch (err) {
    console.error("FINANCE SUMMARY ERROR:", err);
  }
}


// ======================================================
// LOAD DAILY MISSIONS
// ======================================================

async function loadMissions() {
  try {
    const res = await apiGet(
      `${API}/api/missions/get`
    );

    const missions = Array.isArray(res?.missions)
      ? res.missions
      : [];

    dailyMissions = {
      finance: missions[0] || "Review one transaction",
      exercise: missions[1] || "Walk 10 minutes",
      cleaning: missions[2] || "Clean one surface",
      cooking: missions[3] || "Cook one meal",
      lifestyle: missions[4] || "Plan tomorrow"
    };

  } catch (err) {
    console.error("LOAD MISSIONS ERROR:", err);

    dailyMissions = {
      finance: "Review one transaction",
      exercise: "Walk 10 minutes",
      cleaning: "Clean one surface",
      cooking: "Cook one meal",
      lifestyle: "Plan tomorrow"
    };
  }
}


// ======================================================
// HABIT RINGS
// ======================================================

function renderHabitRings() {
  const container =
    document.getElementById("habit-rings");

  if (!container) {
    console.warn("habit-rings element not found.");
    return;
  }

  container.innerHTML = "";

  Object.keys(habitProgress).forEach(category => {

    const percent =
      Number(habitProgress[category]) || 0;

    container.innerHTML += `
      <div class="habit-ring">

        <svg class="ring"
             width="120"
             height="120"
             viewBox="0 0 120 120">

          <circle
            class="bg"
            cx="60"
            cy="60"
            r="50">
          </circle>

          <circle
            class="progress"
            cx="60"
            cy="60"
            r="50"
            style="
              stroke-dashoffset:
              ${314 - (314 * percent) / 100};
            ">
          </circle>

        </svg>

        <div class="habit-label">
          ${category.toUpperCase()}
        </div>

        <div class="habit-percent">
          ${percent}%
        </div>

      </div>
    `;
  });
}


// ======================================================
// HABIT CARDS
// ======================================================

function renderHabitCards() {
  const container =
    document.getElementById("habit-cards");

  if (!container) {
    console.warn("habit-cards element not found.");
    return;
  }

  container.innerHTML = "";

  Object.keys(dailyMissions).forEach(category => {

    container.innerHTML += `
      <div class="habit-card">

        <h3>
          ${category.toUpperCase()}
        </h3>

        <p class="mission">
          Today: ${dailyMissions[category]}
        </p>

        <p class="streak">
          Streak: ${streakData?.streak || 0} days
        </p>

        <p class="xp">
          XP: ${xpData?.xp || 0}
        </p>

        <button
          onclick="completeHabit('${category}')">
          Complete
        </button>

      </div>
    `;
  });
}


// ======================================================
// COMPLETE HABIT
// ======================================================

async function completeHabit(category) {

  try {

    const validCategories = [
      "finance",
      "exercise",
      "cleaning",
      "cooking",
      "lifestyle"
    ];

    if (!validCategories.includes(category)) {
      console.error(
        "Invalid habit category:",
        category
      );
      return;
    }


    // ----------------------------------------
    // SAVE HABIT TO BACKEND
    // ----------------------------------------

    const updatedHabit = await apiPost(
      `${API}/api/habits/complete`,
      {
        category
      }
    );


    if (!updatedHabit?.progress) {

      alert(
        "Unable to save habit progress."
      );

      return;
    }


    // ----------------------------------------
    // UPDATE LOCAL DISPLAY STATE
    // ----------------------------------------

    habitProgress = {
      finance:
        Number(updatedHabit.progress.finance) || 0,

      exercise:
        Number(updatedHabit.progress.exercise) || 0,

      cleaning:
        Number(updatedHabit.progress.cleaning) || 0,

      cooking:
        Number(updatedHabit.progress.cooking) || 0,

      lifestyle:
        Number(updatedHabit.progress.lifestyle) || 0
    };


    // ----------------------------------------
    // ANIMATION
    // ----------------------------------------

    const cards =
      document.querySelectorAll(".habit-card");

    cards.forEach(card => {

      const heading =
        card.querySelector("h3");

      if (
        heading?.textContent.trim() ===
        category.toUpperCase()
      ) {

        card.classList.add("completed");

        setTimeout(() => {
          card.classList.remove("completed");
        }, 600);
      }

    });


    // ----------------------------------------
    // AWARD XP THROUGH BACKEND
    // ----------------------------------------

    const updatedXP = await apiPost(
      `${API}/api/xp/award`,
      {
        amount: 10,
        reason:
          `Completed ${category} habit`
      }
    );


    if (
      updatedXP &&
      typeof updatedXP.xp === "number"
    ) {
      xpData = updatedXP;
    }


    // ----------------------------------------
    // REFRESH UI
    // ----------------------------------------

    renderHabitRings();
    renderHabitCards();
    renderHeader();
    renderCoachMessage();

    console.log(
      `Habit completed: ${category}`
    );

  } catch (err) {

    console.error(
      "COMPLETE HABIT ERROR:",
      err
    );

    alert(
      "Something went wrong saving your habit."
    );
  }
}


// ======================================================
// SURVEY
// ======================================================

async function loadThreeQuestionSurvey() {
  renderThreeQuestionSurvey(
    threeQuestionSurvey
  );
}


function renderThreeQuestionSurvey(questions) {

  const container =
    document.getElementById(
      "survey-container"
    );

  if (!container) return;

  container.innerHTML = `
    <h2>Daily Check-In</h2>

    ${questions.map(q => `

      <div class="survey-question">

        <p>
          ${q.text}
        </p>

        <input
          type="range"
          min="1"
          max="5"
          value="3"
          id="q-${q.id}"
        />

      </div>

    `).join("")}

    <button
      onclick="submitThreeQuestionSurvey()">
      Submit
    </button>
  `;
}


async function submitThreeQuestionSurvey() {

  const answers = [];

  document
    .querySelectorAll(".survey-question")
    .forEach(question => {

      const input =
        question.querySelector("input");

      const id =
        input.id.replace("q-", "");

      answers.push({
        id,
        value: Number(input.value)
      });

    });


  try {

    await apiPost(
      `${API}/api/survey`,
      {
        answers
      }
    );

    const container =
      document.getElementById(
        "survey-container"
      );

    if (container) {

      container.innerHTML =
        "<p>Thanks for checking in!</p>";

    }

  } catch (err) {

    console.error(
      "SURVEY ERROR:",
      err
    );

    alert(
      "Unable to save your check-in."
    );
  }
}


// ======================================================
// XP HEADER
// ======================================================

function renderHeader() {

  const levelLabel =
    document.getElementById(
      "xpLevelLabel"
    );

  const valueLabel =
    document.getElementById(
      "xpValueLabel"
    );

  const nextLabel =
    document.getElementById(
      "xpNextLabel"
    );

  const fill =
    document.getElementById(
      "xpFill"
    );


  if (
    !levelLabel ||
    !valueLabel ||
    !nextLabel ||
    !fill
  ) {
    return;
  }


  const xp =
    Number(xpData?.xp) || 0;


  const level =
    Math.floor(xp / 100) + 1;


  const nextLevelXP =
    level * 100;


  const progress =
    Math.min(
      100,
      (xp / nextLevelXP) * 100
    );


  levelLabel.textContent =
    `Level ${level}`;

  valueLabel.textContent =
    `${xp} XP`;

  nextLabel.textContent =
    `Next level in ${
      nextLevelXP - xp
    } XP`;

  fill.style.width =
    `${progress}%`;
}


// ======================================================
// COACH
// ======================================================

async function renderCoachMessage() {

  const container =
    document.getElementById("coach");

  if (!container) return;


  const xp =
    Number(xpData?.xp) || 0;


  const level =
    Math.floor(xp / 100) + 1;


  const nextLevelXP =
    level * 100;


  const xpToNext =
    nextLevelXP - xp;


  const completed =
    Object.values(habitProgress)
      .filter(
        value => value >= 100
      )
      .length;


  const weakestCategory =
    Object.entries(habitProgress)
      .sort(
        (a, b) => a[1] - b[1]
      )[0]?.[0];


  let message = "";


  if (xpToNext <= 20) {

    message =
      "🔥 You're extremely close to leveling up — finish one more habit!";

  } else if (xpToNext <= 50) {

    message =
      "⚡ You're making great progress — keep pushing toward the next level.";

  } else if (xp < 100) {

    message =
      "🌱 You're just getting started — small wins add up fast.";
  }


  if (completed >= 3) {

    message =
      "💪 You're on fire today — three habits done already!";

  } else if (completed === 1) {

    message =
      "✨ Nice! You completed your first habit of the day.";
  }


  if (!message && weakestCategory) {

    message =
      `🎯 Try focusing on your ${weakestCategory} habit — a small win there boosts your whole day.`;
  }


  if (!message) {

    message =
      "📌 Pick one habit and complete it today.";
  }


  container.innerHTML = `
    <h2>Vaultwise Coach</h2>
    <p>${message}</p>
  `;

  container.classList.add("loaded");
}


// ======================================================
// MAIN DASHBOARD RENDER
// ======================================================

async function renderDashboard() {

  console.log(
    "🚀 Rendering Vaultwise dashboard..."
  );


  await loadXP();

  await loadHabits();

  await loadMissions();

  await loadStreak();

  await loadMood();


  renderHeader();

  renderHabitRings();

  renderHabitCards();

  renderCoachMessage();

  loadThreeQuestionSurvey();


  console.log(
    "✅ Vaultwise dashboard rendered"
  );
}
