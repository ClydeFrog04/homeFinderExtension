(async function () {
    console.log("🔍 Looking for homes");

    // Remove featured ad
    const featured = document.querySelector(".css-1t96xtk");
    if (featured) featured.remove();

    // Remove "Similar ads" containers
    document.querySelectorAll("div.temporaryFlexColumnClassName.css-1bk4xph").forEach((container) => {
        const containsSimilarAds = Array.from(container.querySelectorAll("*")).some((child) =>
            child.innerText?.includes("Similar ads")
        );
        if (containsSimilarAds) {
            console.log("🗑️ Would remove:", container);
            container.remove();
        }
    });

    // const listingsSpans = Array.from(document.getElementsByClassName("css-avmlgd"));
    // const currentListings = listingsSpans.map(listingSpan => listingSpan.innerText.trim());
    const currentListings = Array.from(document.querySelectorAll('div.css-krvsu4')).map(card => {
        const anchor = card.querySelector('a');
        return anchor?.href;
    }).filter(Boolean);
    console.log(`📦 Found ${currentListings.length} listings`);

    const stored = await chrome.storage.local.get("seenListings");
    const seenListings = stored.seenListings || [];

    const newListings = currentListings.filter(listing => !seenListings.includes(listing));

    if (newListings.length > 0) {
        console.log("🆕 New listings:", newListings);
        await chrome.storage.local.set({ seenListings: [...seenListings, ...newListings] });
        chrome.runtime.sendMessage({ type: "new_listings", count: newListings.length });
    }
})();
