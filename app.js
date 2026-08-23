// ======================================================
// VAULTWISE APP.JS
// Central API + Authentication + Finance Helpers
// ======================================================

// ======================================================
// BACKEND CONFIG
// ======================================================

// Use ONE global backend URL.
// Other frontend files should use:
// apiGet("/api/xp")
// apiPost("/api/xp/award", data)

window.APP_API = "https://backend-ongn.onrender.com";


// ======================================================
// GLOBAL API HELPERS
// ======================================================

async function apiGet(url) {
  const token = localStorage.getItem("token");

  const fullUrl = url.startsWith("http")
    ? url
    : `${window.APP_API}${url}`;

  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(fullUrl, {
    method: "GET",
    headers
  });

  if (!res.ok) {
    throw new Error(
      `GET ${fullUrl} failed with status ${res.status}`
    );
  }

  return res.json();
}


async function apiPost(url, data) {
  const token = localStorage.getItem("token");

  const fullUrl = url.startsWith("http")
    ? url
    : `${window.APP_API}${url}`;

  const headers = {
    "Content-Type": "application/json"
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(fullUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error(
      `POST ${fullUrl} failed with status ${res.status}`
    );
  }

  return res.json();
}


async function apiPut(url, data) {
  const token = localStorage.getItem("token");

  const fullUrl = url.startsWith("http")
    ? url
    : `${window.APP_API}${url}`;

  const headers = {
    "Content-Type": "application/json"
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(fullUrl, {
    method: "PUT",
    headers,
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error(
      `PUT ${fullUrl} failed with status ${res.status}`
    );
  }

  return res.json();
}


// ======================================================
// AUTH HELPERS
// ======================================================

function saveToken(token) {
  localStorage.setItem("token", token);
}


function getToken() {
  return localStorage.getItem("token");
}


function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userInfo");

  window.location.href = "login.html";
}


// ======================================================
// PREMIUM / TRIAL HELPERS
// ======================================================

function isPremium() {
  return localStorage.getItem("premium") === "true";
}


function isTrialActive() {
  const trialEnd = localStorage.getItem("trialEnd");

  if (!trialEnd) {
    return false;
  }

  return Date.now() < Number(trialEnd);
}


function startTrial() {
  const end =
    Date.now() +
    7 * 24 * 60 * 60 * 1000;

  localStorage.setItem(
    "trialEnd",
    end.toString()
  );
}


// ======================================================
// LOGIN
// ======================================================

async function loginUser(email, password) {
  const res = await fetch(
    `${window.APP_API}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Login failed"
    );
  }

  return data;
}


// ======================================================
// REGISTER
// ======================================================

async function registerUser(email, password) {
  const res = await fetch(
    `${window.APP_API}/api/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Registration failed"
    );
  }

  return data;
}


// ======================================================
// LOAD CURRENT USER
// ======================================================

async function loadUserInfo() {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    const user = await apiGet("/api/auth/user");

    window.userInfo = user;

    // Save a copy for UI use.
    localStorage.setItem(
      "userInfo",
      JSON.stringify(user)
    );

    return user;

  } catch (err) {
    console.error(
      "LOAD USER INFO ERROR:",
      err
    );

    return null;
  }
}


// ======================================================
// FINANCE HELPERS
// ======================================================

async function fetchSummary() {
  return apiGet("/api/finance/summary");
}


async function fetchHistory() {
  return apiGet("/api/finance/history");
}


async function saveEntry() {
  const payload = {
    income: Number(
      document.getElementById(
        "monthlyIncome"
      )?.value || 0
    ),

    expenses: Number(
      document.getElementById(
        "monthlyExpenses"
      )?.value || 0
    ),

    portfolio: Number(
      document.getElementById(
        "portfolioValue"
      )?.value || 0
    ),

    goal: Number(
      document.getElementById(
        "savingsGoal"
      )?.value || 0
    )
  };

  try {
    const result = await apiPost(
      "/api/finance/add",
      payload
    );

    return result;

  } catch (err) {
    console.error(
      "SAVE FINANCE ENTRY ERROR:",
      err
    );

    alert("Failed to save entry.");

    return null;
  }
}


// ======================================================
// DASHBOARD INITIALIZATION
// ======================================================

async function initDashboard() {
  const token = getToken();

  // User is not logged in.
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {

    // ----------------------------------------
    // 1. Load authenticated user
    // ----------------------------------------

    const user = await loadUserInfo();

    if (!user) {
      console.warn(
        "Unable to verify user."
      );

      // Remove invalid token.
      localStorage.removeItem("token");

      window.location.href = "login.html";
      return;
    }


    // ----------------------------------------
    // 2. Load finance information
    // ----------------------------------------

    try {
      await fetchSummary();
      await fetchHistory();

    } catch (err) {

      // Finance failing should NOT prevent
      // the rest of the dashboard from loading.

      console.warn(
        "Finance API unavailable:",
        err
      );
    }


    // ----------------------------------------
    // 3. Render dashboard
    // ----------------------------------------

    if (
      document.body &&
      document.body.id === "dashboard"
    ) {

      if (
        typeof renderDashboard ===
        "function"
      ) {

        await renderDashboard();

      } else {

        console.warn(
          "renderDashboard() is not available yet."
        );
      }
    }

  } catch (err) {

    console.error(
      "DASHBOARD INIT ERROR:",
      err
    );
  }
}


// ======================================================
// REGISTER PAGE
// ======================================================

function initRegisterPage() {

  const registerForm =
    document.getElementById(
      "registerForm"
    );

  if (!registerForm) {
    return;
  }

  registerForm.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();

      const email =
        document.getElementById(
          "email"
        )?.value.trim();

      const password =
        document.getElementById(
          "password"
        )?.value.trim();


      if (!email || !password) {
        alert(
          "Please enter an email and password."
        );
        return;
      }


      try {

        const data =
          await registerUser(
            email,
            password
          );

        if (
          data?.message ===
          "User registered successfully"
        ) {

          alert(
            "Registered successfully!"
          );

          window.location.href =
            "login.html";

        } else {

          alert(
            data?.message ||
            "Registration failed."
          );
        }

      } catch (err) {

        console.error(
          "REGISTER ERROR:",
          err
        );

        alert(
          err.message ||
          "Network error."
        );
      }
    }
  );
}


// ======================================================
// LOGIN PAGE
// ======================================================

function initLoginPage() {

  const loginForm =
    document.querySelector(
      "#loginForm"
    );

  if (!loginForm) {
    return;
  }

  loginForm.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();

      const email =
        document.querySelector(
          "#email"
        )?.value.trim();

      const password =
        document.querySelector(
          "#password"
        )?.value.trim();


      if (!email || !password) {
        alert(
          "Please enter your email and password."
        );
        return;
      }


      try {

        const data =
          await loginUser(
            email,
            password
          );


        // Backend may return any of these.
        const token =
          data?.token ||
          data?.accessToken ||
          data?.jwt;


        if (!token) {

          alert(
            data?.message ||
            "Login failed."
          );

          return;
        }


        // Save authentication token.
        saveToken(token);


        // Go to dashboard.
        window.location.href =
          "dashboard.html";

      } catch (err) {

        console.error(
          "LOGIN ERROR:",
          err
        );

        alert(
          err.message ||
          "Unable to log in."
        );
      }
    }
  );
}


// ======================================================
// PAGE ROUTER
// ======================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    // Register page
    initRegisterPage();

    // Login page
    initLoginPage();

    // Dashboard page
    if (
      document.body &&
      document.body.id === "dashboard"
    ) {

      initDashboard();
    }

  }
);


// ======================================================
// GLOBAL DEBUG MESSAGE
// ======================================================

console.log(
  "✅ Vaultwise app.js loaded"
);

console.log(
  "🌐 Backend:",
  window.APP_API
);
