const API = "https://backend-ongn.onrender.com";
// ======================================================
// VAULTWISE AI CHAT COACH
// ======================================================

const coachHistory = [];

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
// SEND MESSAGE
// ======================================================

async function sendCoachMessage(message) {

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const response = await fetch(
    `${API}/api/coach/chat`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },

      body: JSON.stringify({
        message,
        history: coachHistory
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Coach request failed."
    );
  }

  return data.reply;
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

    const message = input.value.trim();

    if (!message) return;

    // ----------------------------------------
    // Display user message
    // ----------------------------------------

    addCoachMessage("user", message);

    coachHistory.push({
      role: "user",
      content: message
    });

    input.value = "";

    // ----------------------------------------
    // Loading message
    // ----------------------------------------

    addCoachMessage(
      "assistant",
      "Thinking..."
    );

    try {

      const reply =
        await sendCoachMessage(message);

      // Remove "Thinking..."
      const messages =
        document.getElementById(
          "ai-chat-messages"
        );

      const lastMessage =
        messages.lastElementChild;

      if (lastMessage) {
        lastMessage.remove();
      }

      // Display response
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
        "AI CHAT ERROR:",
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
        "Sorry, I couldn't connect to the AI coach right now."
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
