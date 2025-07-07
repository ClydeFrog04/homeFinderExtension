let timer = null;

const isHomePage = (url) => {
    const isHome = url === "https://www.boligportal.dk/" || url === "https://www.boligportal.dk/en/";
    console.log("isHome:", isHome, url);
    return isHome;
};

async function checkTabs() {
    console.log("looking for things");
    const { enabled, interval } = await chrome.storage.local.get(["enabled", "interval"]);
    if (!enabled) return;

    const tabs = await chrome.tabs.query({ url: "*://www.boligportal.dk/*" });
    for (const tab of tabs) {
        if (isHomePage(tab.url)) continue;
        //refresh the tab
        chrome.tabs.reload(tab.id, () => {
            // Inject script *after* reload completes
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["content.js"]
            });
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
        // chrome.notifications.create({
        //     type: "basic",
        //     iconUrl: "icons/icon128.png",
        //     title: "New Homes Found!",
        //     message: `${message.count} new listings found on BoligPortal.`
        // });
        chrome.notifications.create(`listing-${Date.now()}`, {
            type: "basic",
            iconUrl: "icons/icon128.png",
            title: "New Homes Found!",
            message: `${message.count} new listings found on BoligPortal.\n${message.firstListing}`,
            requireInteraction: true
        });
    }

    return true;
});

chrome.notifications.onClicked.addListener((notificationId) => {
    if (notificationId.startsWith("listing-"))  {
        chrome.tabs.query({ url: "*://www.boligportal.dk/*" }, (tabs) => {
            if (tabs.length > 0) {
                // Focus the first matching tab
                chrome.tabs.update(tabs[0].id, { active: true });
                chrome.windows.update(tabs[0].windowId, { focused: true });
            } else {
                // No tab open — open a new one
                chrome.tabs.create({ url: "https://www.boligportal.dk/en/" });
            }
        });
    }
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