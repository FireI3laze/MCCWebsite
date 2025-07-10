document.addEventListener("DOMContentLoaded", () => {
    function smoothScrollWithOffset(target) {
        const headerHeight = document.querySelector("header")?.offsetHeight || 0;
        const extraOffset = 50; // probiere hier mal einen sichtbaren Wert
        const y = target.getBoundingClientRect().top + window.scrollY - headerHeight - extraOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
    }

    // NEU: Scroll mit Offset bei vorhandenem Hash in URL (z.B. events.html#lottery)
    if (window.location.hash) {
        // Warten, bis alles gerendert ist
        setTimeout(() => {
            const hash = window.location.hash.substring(1);
            const el = document.getElementById(hash);
            if (el) {
                smoothScrollWithOffset(el);
            }
        }, 100); // 100ms Delay kann ggf. angepasst werden
    }

    // 2. Scrollen bei URL-Parameter ?scrollToEvents=true
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("scrollToEvents") === "true") {
        const el = document.getElementById("events");
        if (el) {
            window.scrollTo(0, 0);
            setTimeout(() => smoothScrollWithOffset(el), 100);
        }
    }
});
