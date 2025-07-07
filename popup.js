//todo: can be renamed to menu.js probably
const savedSpan = document.querySelector("#saved");

document.addEventListener("DOMContentLoaded", () => {
    const enabledToggle = document.getElementById("enabledToggle");
    const intervalInput = document.getElementById("intervalInput");
    const saveButton = document.getElementById("saveSettings");

    // Load current settings
    chrome.storage.local.get(["enabled", "interval"], (data) => {
        enabledToggle.checked = data.enabled ?? false;
        intervalInput.value = data.interval ?? 60;
    });

    saveButton.addEventListener("click", () => {
        const enabled = enabledToggle.checked;
        const interval = parseInt(intervalInput.value, 10);

        chrome.storage.local.set({ enabled, interval });

        //notify background script to apply changes immediately
        chrome.runtime.sendMessage({ type: "toggle", running: enabled });
        chrome.runtime.sendMessage({ type: "setInterval", intervalMs: interval * 1000 });

        //show saved confirmation
        savedSpan.classList.add("show");
        setTimeout(() => {
            savedSpan.classList.remove("show");
        }, 5000);
    });
});
