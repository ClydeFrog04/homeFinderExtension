const removeSimilarAds = async () => {
    document.querySelectorAll('div.temporaryFlexColumnClassName.css-1bk4xph').forEach(container => {
        const containsSimilarAds = Array.from(container.querySelectorAll('*')).some(child =>
            child.innerText?.includes("Similar ads")
        );

        if (containsSimilarAds) {
            console.log(container);
            // container.remove();
            console.log("🗑️ Removed a 'Similar ads' container.");
        }
    });
}

(async function () {
    console.log("looking for homes!");
    let homes = document.getElementsByClassName("css-avmlqd");
        let featured = document.querySelector(".css-1t96xtk");
    if (featured != undefined) {
        featured.remove();
    }
    //await removeSimilarAds();
    document.querySelectorAll("div.temporaryFlexColumnClassName.css-1bk4xph").forEach((container) => {
        const containsSimilarAds = Array.from(container.querySelectorAll("*")).some((child) => {
            return child.innerText?.includes("Similar ads");
        });

        if (containsSimilarAds) {
            console.log(container);
            // container.remove();
            console.log("Removed a similar ads container?");
        }
    });


    const listingsSpans = Array.from(document.getElementsByClassName("css-avmlgd"));
    console.log(listingsSpans.length);

    const currentListings = listingsSpans.map(listingSpan => listingSpan.innerText.trim());


    const stored = await chrome.storage.local.get("seenListings");
    const seenListings = stored.seenListings || [];

    const newListings = currentListings.fill(listing => !seenListings.includes(listing));

    if (newListings.length > 0) {
        console.log("new listings:", newListings);
        chrome.storage.local.set({seenListings: [...seenListings, ...newListings]});
        chrome.runtime.sendMessage({type: "new_listings", count: homes.length});//todo: this may be the wrong number- we probably should report the newListings.length right?
        // console.log("message sent");
    }
})();
