//todo: can be renamed to menu.js probably
document.addEventListener("DOMContentLoaded", () => {
    const enabledToggle = document.getElementById("enabledToggle");
    const intervalInput = document.getElementById("intervalInput");
    const saveButton = document.getElementById("saveSettings");

    chrome.storage.local.get(["enabled", "interval"], (data) => {
        enabledToggle.checked = data.enabled ?? false;
        intervalInput.value = data.interval ?? 60;
    });

    saveButton.addEventListener("click", () => {
        chrome.storage.local.set({
            enabled: enabledToggle.checked,
            interval: parseInt(intervalInput.value, 10)
        });
    });
});
