(async function () {
    console.log("Looking for homes");

    // Remove featured ad
    const featured = document.querySelector(".css-1t96xtk");
    if (featured) featured.remove();

    // Remove "Similar ads" containers
    document.querySelectorAll("div.temporaryFlexColumnClassName.css-1bk4xph").forEach((container) => {
        const containsSimilarAds = Array.from(container.querySelectorAll("*")).some((child) =>
            child.innerText?.includes("Similar ads")
        );
        if (containsSimilarAds) {
            container.remove();
        }
    });

    //less stable query since the css class is auto generated this will only work until they release a new version
    // const currentListings = Array.from(document.querySelectorAll('div.css-krvsu4')).map(card => {
    //     const anchor = card.querySelector('a');
    //     return anchor?.href;
    // }).filter(Boolean);
    // console.log(`Found ${currentListings.length} total listings`);
    //
    // const stored = await chrome.storage.local.get("seenListings");
    // const seenListings = stored.seenListings || [];
    //
    // const newListings = currentListings.filter(listing => !seenListings.includes(listing));
    //
    // if (newListings.length > 0) {
    //     console.log("New listings:", newListings);
    //     await chrome.storage.local.set({seenListings: [...seenListings, ...newListings]});
    //     chrome.runtime.sendMessage({type: "new_listings", count: newListings.length});
    // }

    //much more stable selector hopefully!
    const currentListings = Array.from(document.querySelectorAll('a.AdCardSrp__Link'))
        .map(anchor => anchor.href);
    console.log(`Found ${currentListings.length} total listings`);

    const stored = await chrome.storage.local.get("seenListings");
    const seenListings = stored.seenListings || [];

    const newListings = currentListings.filter(url => !seenListings.includes(url));
    console.log(`Found ${newListings.length} total listings`);

    if (newListings.length > 0) {
        console.log("New listings:", newListings);
        await chrome.storage.local.set({seenListings: [...seenListings, ...newListings]});
        chrome.runtime.sendMessage({type: "new_listings", count: newListings.length});
    }
})();
