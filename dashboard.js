async function loadDashboard() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("https://backend-qkz7.onrender.com/api/finance/summary", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    document.getElementById("income").innerText = `$${data.monthlyIncome}`;
    document.getElementById("expenses").innerText = `$${data.monthlyExpenses}`;
    document.getElementById("savings").innerText = `$${data.netSavings}`;

  } catch (err) {
    alert("Error loading dashboard");
  }
}

loadDashboard();
