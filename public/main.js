const formContainer = document.getElementById("formContainer");
const resultContainer = document.getElementById("resultContainer");
const actionDropdown = document.getElementById("actionDropdown");

const API_BASE = "/api/monitor";

actionDropdown.addEventListener("change", () => {
  const action = actionDropdown.value;
  formContainer.innerHTML = "";
  resultContainer.innerHTML = "";

  resultContainer.classList.add("is-hidden");

  if (action === "add") {
    formContainer.innerHTML = `
      <form id="addForm">
        <label class="label">URL to Monitor:</label>
        <input class="input is-dark" type="text" id="urlInput" placeholder="Enter URL" required>
        <button class="button is-success mt-2" type="submit">Add URL</button>
      </form>
    `;
    formContainer.classList.remove("is-hidden");
  } else if (action === "get") {
    fetchMonitoredURLs();
  } else if (action === "trigger") {
    formContainer.innerHTML = `
      <form id="triggerForm">
        <label class="label">URL to Trigger Check:</label>
        <input class="input is-dark" type="text" id="triggerInput" placeholder="Enter URL" required>
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
    
    if (!url) {
      displayNotification("URL cannot be empty.", "danger");
      return;
    }

    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/;
    if (!urlPattern.test(url)) {
      displayNotification("Invalid URL format. Please enter a valid URL.", "danger");
      return;
    }

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
    
    if (!url) {
      displayNotification("URL cannot be empty.", "danger");
      return;
    }

    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/;
    if (!urlPattern.test(url)) {
      displayNotification("Invalid URL format. Please enter a valid URL.", "danger");
      return;
    }

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

async function fetchMonitoredURLs() {
  try {
    const response = await fetch(API_BASE);
    const result = await response.json();
    displayResult(result.data);
  } catch (error) {
    displayNotification("Failed to fetch monitored URLs.", "danger");
  }
}

function displayResult(result) {
  resultContainer.innerHTML = `<div class="mt-6"><pre>${JSON.stringify(result, null, 2)}</pre></div>`;
  resultContainer.classList.remove("is-hidden");
}

function displayNotification(message, type = "info") {
  resultContainer.innerHTML = `
    <div class="notification is-${type}">
      ${message}
    </div>
  `;
  resultContainer.classList.remove("is-hidden");
}
