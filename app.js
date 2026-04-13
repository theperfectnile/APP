/* ============================
   SIMPLE AUTH SYSTEM (LOCALSTORAGE)
   Works with: login.html, register.html,
   forgot-password.html, reset-password.html,
   dashboard.html
============================ */

// Utility: get users from storage
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

// Utility: save users
function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

/* ============================
   REGISTER USER
============================ */
function registerUser(event) {
    event.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    const users = getUsers();

    if (users.find(u => u.email === email)) {
        alert("Account already exists");
        return;
    }

    users.push({ email, password });
    saveUsers(users);

    alert("Registration successful");
    window.location.href = "login.html";
}

/* ============================
   LOGIN USER
============================ */
function loginUser(event) {
    event.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        alert("Invalid email or password");
        return;
    }

    localStorage.setItem("loggedInUser", email);
    window.location.href = "dashboard.html";
}

/* ============================
   PROTECT DASHBOARD
============================ */
function checkAuth() {
    const user = localStorage.getItem("loggedInUser");
    if (!user) {
        window.location.href = "login.html";
    }
}

/* ============================
   LOGOUT
============================ */
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}

/* ============================
   FORGOT PASSWORD
============================ */
function sendResetLink(event) {
    event.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const users = getUsers();

    if (!users.find(u => u.email === email)) {
        alert("Email not found");
        return;
    }

    localStorage.setItem("resetEmail", email);
    window.location.href = "reset-password.html";
}

/* ============================
   RESET PASSWORD
============================ */
function resetPassword(event) {
    event.preventDefault();

    const newPassword = document.querySelector("#password").value.trim();
    const email = localStorage.getItem("resetEmail");

    if (!email) {
        alert("No reset request found");
        return;
    }

    let users = getUsers();
    users = users.map(u => {
        if (u.email === email) {
            return { email, password: newPassword };
        }
        return u;
    });

    saveUsers(users);
    localStorage.removeItem("resetEmail");

    alert("Password updated successfully");
    window.location.href = "login.html";
}