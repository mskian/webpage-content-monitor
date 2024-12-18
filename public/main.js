const formContainer = document.getElementById("formContainer");
const resultContainer = document.getElementById("resultContainer");
const actionDropdown = document.getElementById("actionDropdown");

const API_BASE = "/api/monitor";

function showDefaultMessage() {
  resultContainer.innerHTML = `
    <pre class="has-text-danger mt-5">Please select an action to proceed.</pre>
  `;
  resultContainer.classList.remove("is-hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  const savedAction = localStorage.getItem("selectedAction");
  if (savedAction) {
    actionDropdown.value = savedAction;
    actionDropdown.dispatchEvent(new Event("change"));
  } else {
    showDefaultMessage();
  }
});

actionDropdown.addEventListener("change", () => {
  const action = actionDropdown.value;

  localStorage.setItem("selectedAction", action);

  formContainer.innerHTML = "";
  resultContainer.innerHTML = "";
  resultContainer.classList.add("is-hidden");

  if (action === "add") {
    formContainer.innerHTML = `
      <form id="addForm">
        <label class="label text-all">URL to Monitor:</label>
        <input class="input is-success" type="text" id="urlInput" placeholder="Enter URL" required>
        <button class="button is-info mt-2" type="submit">Add URL</button>
      </form>
    `;
    formContainer.classList.remove("is-hidden");
  } else if (action === "get") {
    fetchMonitoredURLs();
  } else if (action === "trigger") {
    formContainer.innerHTML = `
      <form id="triggerForm">
        <label class="label text-all">URL to Trigger Check:</label>
        <input class="input is-success" type="text" id="triggerInput" placeholder="Enter URL" required>
        <button class="button is-warning mt-2" type="submit">Trigger Check</button>
      </form>
    `;
    formContainer.classList.remove("is-hidden");
  }
});

formContainer.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (e.target.id === "addForm") {
    const url = document.getElementById("urlInput").value.trim();
    if (!validateURL(url)) return;

    try {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const result = await response.json();
      displayResult(result);
    } catch (error) {
      displayNotification("Failed to add URL.", "danger");
    }
  }

  if (e.target.id === "triggerForm") {
    const url = document.getElementById("triggerInput").value.trim();
    if (!validateURL(url)) return;

    try {
      const response = await fetch(`${API_BASE}/trigger`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const result = await response.json();
      displayResult(result);
    } catch (error) {
      displayNotification("Failed to trigger URL check.", "danger");
    }
  }
});

function validateURL(url) {
  if (!url) {
    displayNotification("URL cannot be empty.", "danger");
    return false;
  }

  const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/;
  if (!urlPattern.test(url)) {
    displayNotification("Invalid URL format. Please enter a valid URL.", "danger");
    return false;
  }
  return true;
}

async function fetchMonitoredURLs() {
  try {
    const response = await fetch(API_BASE);
    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      const urls = result.data.map((item) => item.url);
      displayResult(urls);
    } else {
      displayNotification("No monitored URLs found.", "info");
    }
  } catch (error) {
    console.error("Error fetching monitored URLs:", error);
    displayNotification("Failed to fetch monitored URLs.", "danger");
  }
}

function displayResult(result) {
  const CurrrentTime = getCurrentDateTime();
  resultContainer.innerHTML = `<div class="mt-6"><P class="text-all">Logged at: ${CurrrentTime}</P><br><pre>${JSON.stringify(result, null, 2)}</pre></div>`;
  resultContainer.classList.remove("is-hidden");
}

function getCurrentDateTime() {
  const options = {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
  };

  const now = new Date();
  const date = now.toLocaleDateString("en-US", options);

  return `${date}`;
}

function displayNotification(message, type = "info") {
  resultContainer.innerHTML = `
    <div class="notification is-${type}">
      ${message}
    </div>
  `;
  resultContainer.classList.remove("is-hidden");
}
