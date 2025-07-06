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
    // console.log("looking for homes");
    window.location.reload();
    let homes = document.getElementsByClassName("css-avmlqd");
    // console.log("Homes:", homes.length);
    // homes.forEach((homeSpan) => {
    //     console.log("home:",homeSpan.innerHTML);
    // });
    // for (let i = 0; i < homes.length; i++) {
    //     let homeSpan = homes[i];
    //     console.log("home:",homeSpan.innerText.trim());
    // }
    let featured = document.querySelector(".css-1t96xtk");
    featured.remove();
    // await removeSimilarAds();
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



    const listingsSpans = Array.from(document.getElementsByClassName("css-avmlqd"));
    console.log(listingsSpans.length);

    const currentListings = listingsSpans.map(listingSpan => listingSpan.innerText.trim());


    const stored = await chrome.storage.local.get("seenListings");
    const seenListings = stored.seenListings || [];

    const newListings = currentListings.filter(listing => !seenListings.includes(listing));

    if(newListings.length > 0){
        console.log("new listings:", newListings);
        chrome.storage.local.set({seenListings: [...seenListings, ...newListings]});
        chrome.runtime.sendMessage({ type: "new_listings", count: homes.length });
        // console.log("message sent");
    }


    // chrome.runtime.sendMessage({ type: "new_listings", count: homes.length });
    // console.log("message sent");
    // window.location.reload();
    // const listings = Array.from(document.querySelectorAll('[data-testid="search-result-card"]'));
    // const currentHomes = listings.map(card => card.innerText.trim());
    //
    // const stored = await chrome.storage.local.get("seenHomes");
    // const seenHomes = stored.seenHomes || [];
    //
    // const newHomes = currentHomes.filter(home => !seenHomes.includes(home));
    //
    // if (newHomes.length > 0) {
    //     chrome.storage.local.set({ seenHomes: [...seenHomes, ...newHomes] });
    //
    //     chrome.runtime.sendMessage({ type: "new_listings", count: newHomes.length });
    // }
})();
