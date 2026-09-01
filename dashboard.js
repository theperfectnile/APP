// ======================================================
// VAULTWISE DASHBOARD
// Backend-connected dashboard
// ======================================================

// IMPORTANT:
// API requests are handled by apiGet() and apiPost()
// from app.js.
//
// app.js defines:
// APP_API
// apiGet()
// apiPost()
// getToken()
// logout()
//
// Do NOT declare another const API here.


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

let dailyMissions = {
  finance: "Loading...",
  exercise: "Loading...",
  cleaning: "Loading...",
  cooking: "Loading...",
  lifestyle: "Loading..."
};

let streakData = {
  streak: 0,
  lastCompletedDate: null
};

let moodToday = null;

let financeSummary = null;


// ======================================================
// SURVEY QUESTIONS
// ======================================================

const threeQuestionSurvey = [
  {
    id: "mood",
    text: "How is your mood today?"
  },
  {
    id: "energy",
    text: "How is your energy level today?"
  },
  {
    id: "stress",
    text: "How stressed do you feel today?"
  }
];


// ======================================================
// LOAD XP
// ======================================================

async function loadXP() {
  try {

    const data = await apiGet("/api/xp");

    xpData = {
      xp: Number(data?.xp) || 0,
      log: Array.isArray(data?.log)
        ? data.log
        : []
    };

    console.log("✅ XP loaded:", xpData);

  } catch (err) {

    console.error(
      "LOAD XP ERROR:",
      err
    );

    xpData = {
      xp: 0,
      log: []
    };
  }
}


// ======================================================
// LOAD HABIT PROGRESS
// ======================================================

async function loadHabits() {
  try {

    const data = await apiGet("/api/habits");

    if (data?.progress) {

      habitProgress = {
        finance:
          Number(data.progress.finance) || 0,

        exercise:
          Number(data.progress.exercise) || 0,

        cleaning:
          Number(data.progress.cleaning) || 0,

        cooking:
          Number(data.progress.cooking) || 0,

        lifestyle:
          Number(data.progress.lifestyle) || 0
      };

    }

    console.log(
      "✅ Habit progress loaded:",
      habitProgress
    );

  } catch (err) {

    console.error(
      "LOAD HABITS ERROR:",
      err
    );
  }
}


// ======================================================
// LOAD STREAK
// ======================================================

// Your current backend Habit route does not yet provide
// a dedicated streak endpoint.
//
// For now we keep the dashboard safe and display 0
// until we build the proper backend streak system.

async function loadStreak() {

  streakData = {
    streak: 0,
    lastCompletedDate: null
  };
}


// ======================================================
// LOAD MOOD
// ======================================================

async function loadMood() {

  moodToday = null;
}


// ======================================================
// LOAD FINANCE SUMMARY
// ======================================================

async function loadFinanceSummary() {

  try {

    financeSummary =
      await apiGet(
        "/api/finance/summary"
      );

  } catch (err) {

    console.warn(
      "Finance summary unavailable:",
      err.message
    );

    financeSummary = null;
  }
}


// ======================================================
// LOAD DAILY MISSIONS
// ======================================================

async function loadMissions() {

  try {

    const res =
      await apiGet(
        "/api/missions/get"
      );

    const missions =
      Array.isArray(res?.missions)
        ? res.missions
        : [];

    dailyMissions = {

      finance:
        missions[0] ||
        "No mission",

      exercise:
        missions[1] ||
        "No mission",

      cleaning:
        missions[2] ||
        "No mission",

      cooking:
        missions[3] ||
        "No mission",

      lifestyle:
        missions[4] ||
        "No mission"

    };

    console.log(
      "✅ Missions loaded:",
      dailyMissions
    );

  } catch (err) {

    console.error(
      "LOAD MISSIONS ERROR:",
      err
    );

    dailyMissions = {

      finance: "Review one transaction",

      exercise: "Walk for 10 minutes",

      cleaning: "Clean one surface",

      cooking: "Prepare a meal",

      lifestyle: "Plan tomorrow"

    };
  }
}


// ======================================================
// HABIT RINGS
// ======================================================

function renderHabitRings() {

  const container =
    document.getElementById(
      "habit-rings"
    );

  if (!container) {
    return;
  }

  container.innerHTML = "";

  Object.keys(habitProgress)
    .forEach(category => {

      const percent =
        Math.max(
          0,
          Math.min(
            100,
            Number(
              habitProgress[category]
            ) || 0
          )
        );

      const circumference = 314;

      const offset =
        circumference -
        (
          circumference *
          percent
        ) /
        100;

      container.innerHTML += `

        <div class="habit-ring">

          <svg
            class="ring"
            width="120"
            height="120"
            viewBox="0 0 120 120"
          >

            <circle
              class="bg"
              cx="60"
              cy="60"
              r="50"
            ></circle>

            <circle
              class="progress"
              cx="60"
              cy="60"
              r="50"
              style="
                stroke-dasharray:${circumference};
                stroke-dashoffset:${offset};
              "
            ></circle>

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
// HABIT CARDS / DAILY MISSIONS
// ======================================================

function renderHabitCards() {

  const container =
    document.getElementById(
      "habit-cards"
    );

  if (!container) {
    return;
  }

  container.innerHTML = "";

  Object.keys(dailyMissions)
    .forEach(category => {

      const mission =
        dailyMissions[category];

      const progress =
        Number(
          habitProgress[category]
        ) || 0;

      container.innerHTML += `

        <div class="habit-card">

          <h3>
            ${category.toUpperCase()}
          </h3>

          <p class="mission">
            Today: ${mission}
          </p>

          <p class="streak">
            Progress: ${progress}%
          </p>

          <p class="xp">
            XP: ${xpData?.xp || 0}
          </p>

          <button
            onclick="completeHabit('${category}')"
            ${progress >= 100 ? "disabled" : ""}
          >
            ${
              progress >= 100
                ? "Completed"
                : "Complete"
            }
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

    // ----------------------------------------
    // Validate category
    // ----------------------------------------

    const validCategories = [
      "finance",
      "exercise",
      "cleaning",
      "cooking",
      "lifestyle"
    ];

    if (
      !validCategories.includes(
        category
      )
    ) {

      console.error(
        "Invalid habit category:",
        category
      );

      return;
    }


    // ----------------------------------------
    // Prevent duplicate completion
    // ----------------------------------------

    if (
      Number(
        habitProgress[category]
      ) >= 100
    ) {

      console.log(
        `${category} already completed.`
      );

      return;
    }


    // ----------------------------------------
    // Disable button immediately
    // ----------------------------------------

    const buttons =
      document.querySelectorAll(
        ".habit-card button"
      );

    buttons.forEach(button => {

      const card =
        button.closest(
          ".habit-card"
        );

      const title =
        card
          ?.querySelector("h3")
          ?.textContent
          ?.trim()
          ?.toLowerCase();

      if (title === category) {
        button.disabled = true;
      }

    });


    // ----------------------------------------
    // Save habit to MongoDB
    // ----------------------------------------

    const updatedHabit =
      await apiPost(
        "/api/habits/complete",
        {
          category
        }
      );


    if (
      !updatedHabit ||
      !updatedHabit.progress
    ) {

      throw new Error(
        "Backend did not return habit progress."
      );
    }


    // ----------------------------------------
    // Update local dashboard state
    // ----------------------------------------

    habitProgress = {

      finance:
        Number(
          updatedHabit.progress.finance
        ) || 0,

      exercise:
        Number(
          updatedHabit.progress.exercise
        ) || 0,

      cleaning:
        Number(
          updatedHabit.progress.cleaning
        ) || 0,

      cooking:
        Number(
          updatedHabit.progress.cooking
        ) || 0,

      lifestyle:
        Number(
          updatedHabit.progress.lifestyle
        ) || 0

    };

    // ----------------------------------------
// Auto-reset habit rings at 100%
// ----------------------------------------
if (habitProgress[category] >= 100) {
  habitProgress[category] = 0; // reset ring

  // Re-enable mission button
  const missionCard = document.querySelector(
    `.habit-card h3:nth-child(1)`
  );

  const cards = document.querySelectorAll(".habit-card");
  cards.forEach(card => {
    const title = card.querySelector("h3")?.textContent?.trim().toLowerCase();
    if (title === category) {
      const btn = card.querySelector("button");
      if (btn) btn.disabled = false;
      card.classList.remove("completed");
    }
  });
}
    // ----------------------------------------
    // Animation
    // ----------------------------------------

    const cards =
      document.querySelectorAll(
        ".habit-card"
      );

    cards.forEach(card => {

      const title =
        card
          .querySelector("h3")
          ?.textContent
          ?.trim()
          ?.toLowerCase();

      if (
        title === category
      ) {

        card.classList.add(
          "completed"
        );

        setTimeout(() => {

          card.classList.remove(
            "completed"
          );

        }, 600);
      }
    });


    // ----------------------------------------
    // Award XP through backend
    // ----------------------------------------

    const updatedXP =
      await apiPost(
        "/api/xp/award",
        {
          amount: 10,
          reason:
            `Completed ${category} habit`
        }
      );


    if (
      updatedXP &&
      updatedXP.xp !== undefined
    ) {

      xpData = {

        xp:
          Number(
            updatedXP.xp
          ) || 0,

        log:
          Array.isArray(
            updatedXP.log
          )
            ? updatedXP.log
            : []

      };
    }


    // ----------------------------------------
    // Update streak
    // ----------------------------------------

    await loadStreak();


    // ----------------------------------------
    // Refresh dashboard
    // ----------------------------------------

    renderHabitRings();

    renderHabitCards();

    renderHeader();

    await renderCoachMessage();


    console.log(
      `✅ ${category} habit completed`
    );

  } catch (err) {

    console.error(
      "COMPLETE HABIT ERROR:",
      err
    );

    alert(
      err.message ||
      "Something went wrong saving your habit."
    );

    // Re-enable buttons
    renderHabitCards();
  }
}


// ======================================================
// THREE QUESTION SURVEY
// ======================================================

async function loadThreeQuestionSurvey() {

  const container =
    document.getElementById(
      "survey-container"
    );

  if (!container) {
    return;
  }

  renderThreeQuestionSurvey(
    threeQuestionSurvey
  );
}


function renderThreeQuestionSurvey(
  questions
) {

  const container =
    document.getElementById(
      "survey-container"
    );

  if (!container) {
    return;
  }

  container.innerHTML = `

    <h2>Daily Check-In</h2>

    ${questions
      .map(
        question => `

          <div
            class="survey-question"
          >

            <p>
              ${question.text}
            </p>

            <input
              type="range"
              min="1"
              max="5"
              value="3"
              id="q-${question.id}"
            />

            <div class="survey-scale">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>

          </div>

        `
      )
      .join("")}

    <button
      onclick="submitThreeQuestionSurvey()"
    >
      Submit
    </button>

  `;
}


// ======================================================
// SUBMIT SURVEY
// ======================================================

async function submitThreeQuestionSurvey() {

  try {

    const answers = [];

    document
      .querySelectorAll(
        ".survey-question"
      )
      .forEach(question => {

        const input =
          question.querySelector(
            "input"
          );

        if (!input) {
          return;
        }

        const id =
          input.id.replace(
            "q-",
            ""
          );

        const value =
          Number(input.value);

        answers.push({
          id,
          value
        });

      });


    if (
      answers.length !==
      3
    ) {

      throw new Error(
        "Please answer all three questions."
      );
    }


    // ----------------------------------------
    // SAVE TO BACKEND
    // ----------------------------------------

    await apiPost(
      "/api/survey",
      {
        answers
      }
    );


    // ----------------------------------------
    // Success message
    // ----------------------------------------

    const container =
      document.getElementById(
        "survey-container"
      );

    if (container) {

      container.innerHTML = `

        <div class="survey-success">

          <h2>Check-In Saved ✓</h2>

          <p>
            Thanks for checking in!
            Your responses were saved.
          </p>

        </div>

      `;
    }


    console.log(
      "✅ Survey saved:",
      answers
    );

  } catch (err) {

    console.error(
      "SURVEY ERROR:",
      err
    );

    alert(
      err.message ||
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
    Number(
      xpData?.xp
    ) || 0;


  const level =
    Math.floor(
      xp / 100
    ) + 1;


  const nextLevelXP =
    level * 100;


  const previousLevelXP =
    (level - 1) * 100;


  const levelProgress =
    Math.min(
      100,
      Math.max(
        0,
        (
          (xp - previousLevelXP) /
          (
            nextLevelXP -
            previousLevelXP
          )
        ) * 100
      )
    );


  const xpNeeded =
    Math.max(
      0,
      nextLevelXP - xp
    );


  levelLabel.textContent =
    `Level ${level}`;


  valueLabel.textContent =
    `${xp} XP`;


  nextLabel.textContent =
    `Next level in ${xpNeeded} XP`;


  fill.style.width =
    `${levelProgress}%`;
}


// ======================================================
// COACH MESSAGE
// ======================================================

async function renderCoachMessage() {

  const container =
    document.getElementById(
      "coach"
    );

  if (!container) {
    return;
  }


  const xp =
    Number(
      xpData?.xp
    ) || 0;


  const level =
    Math.floor(
      xp / 100
    ) + 1;


  const nextLevelXP =
    level * 100;


  const xpToNext =
    nextLevelXP - xp;


  const completed =
    Object.values(
      habitProgress
    )
    .filter(
      value =>
        Number(value) >= 100
    )
    .length;


  const entries =
    Object.entries(
      habitProgress
    );


  const weakestCategory =
    entries.length > 0
      ? entries.sort(
          (a, b) =>
            Number(a[1]) -
            Number(b[1])
        )[0][0]
      : null;


  let message = "";


  // ----------------------------------------
  // Local intelligent coaching
  // ----------------------------------------

  if (
    xpToNext <= 20 &&
    xpToNext > 0
  ) {

    message =
      "🔥 You're extremely close to leveling up — finish one more habit!";

  } else if (
    xpToNext <= 50
  ) {

    message =
      "⚡ You're making great progress — keep pushing toward the next level.";

  } else if (
    xp < 100
  ) {

    message =
      "🌱 You're just getting started — small wins add up fast.";
  }


  if (
    completed >= 3
  ) {

    message =
      "💪 You're on fire today — three habits done already!";

  } else if (
    completed === 1
  ) {

    message =
      "✨ Nice! You completed your first habit of the day.";
  }


  if (
    !message &&
    weakestCategory
  ) {

    message =
      `🎯 Try focusing on your ${weakestCategory} habit — a small win there boosts your whole day.`;
  }


  // ----------------------------------------
  // Mission coaching
  // ----------------------------------------

  if (!message) {

    const missionList =
      Object.values(
        dailyMissions
      )
      .filter(
        mission =>
          mission &&
          mission !== "No mission" &&
          mission !== "Loading..."
      );


    if (
      missionList.length > 0
    ) {

      const randomMission =
        missionList[
          Math.floor(
            Math.random() *
            missionList.length
          )
        ];


      message =
        `📌 Coach Tip: Try completing this mission today — "${randomMission}".`;
    }
  }


  // ----------------------------------------
  // AI Coach fallback
  // ----------------------------------------

  if (!message) {

    try {

      const coach =
        await apiGet(
          "/api/coach/message"
        );


      if (
        coach?.message
      ) {

        message =
          coach.message;
      }

    } catch (err) {

      console.warn(
        "AI coach unavailable:",
        err.message
      );

      message =
        "You're doing great — keep going!";
    }
  }


  container.innerHTML = `

    <h2>Vaultwise Coach</h2>

    <p>
      ${message}
    </p>

  `;


  container.classList.add(
    "loaded"
  );
}


// ======================================================
// MAIN DASHBOARD RENDER
// ======================================================

async function renderDashboard() {

  try {

    console.log(
      "🚀 Loading Vaultwise dashboard..."
    );


    // ----------------------------------------
    // Load backend data
    // ----------------------------------------

    await Promise.all([
      loadXP(),
      loadHabits(),
      loadMissions(),
      loadStreak(),
      loadMood(),
      loadFinanceSummary()
    ]);


    // ----------------------------------------
    // Render UI
    // ----------------------------------------

    renderHeader();

    renderHabitRings();

    renderHabitCards();

    await renderCoachMessage();

    await loadThreeQuestionSurvey();


    console.log(
      "✅ Dashboard loaded successfully"
    );

  } catch (err) {

    console.error(
      "DASHBOARD RENDER ERROR:",
      err
    );
  }
}
