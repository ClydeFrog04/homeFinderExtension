let timer = null;

async function checkTabs() {
    console.log("looking for things");
    const { enabled, interval } = await chrome.storage.local.get(["enabled", "interval"]);
    if (!enabled) return;

    const tabs = await chrome.tabs.query({ url: "*://www.boligportal.dk/*" });
    for (const tab of tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"]
        });
    }

    timer = setTimeout(checkTabs, (interval ?? 60) * 1000);
}

chrome.runtime.onStartup.addListener(checkTabs);
chrome.runtime.onInstalled.addListener(checkTabs);
chrome.storage.onChanged.addListener((changes) => {
    if (changes.enabled || changes.interval) {
        console.log("YAY!", changes);
        clearTimeout(timer);
        checkTabs();
    }
});


//notification manager
chrome.runtime.onMessage.addListener((message) => {
    console.log("message received");
    if (message.type === "new_listings") {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "icons/icon128.png",
            title: "New Homes Found!",
            message: `${message.count} new listings found on BoligPortal.`
        });
    }

    return true;
});

/*
//notification manager
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "new_listings") {
        console.log("🔔 New listings received in background:", message.count);

        chrome.notifications.create({
            type: "basic",
            iconUrl: "icons/icon128.png",
            title: "New Homes Found!",
            message: `${message.count} new listings found on BoligPortal.`
        });
    }

    // Required to keep the service worker alive (even if not using sendResponse)
    return true;
});
 */