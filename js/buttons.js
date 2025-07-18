document.addEventListener("click", function (e) {
    // Prüfen, ob Klick auf einen Button mit Klasse go-to-games (oder darin)
    if (e.target.closest(".go-to-games")) {
        e.preventDefault();

        const el = document.getElementById("machines");
        if (el) {
            smoothScrollWithOffset(el);
        }
    }

    // Prüfen, ob Klick auf einen Button mit Klasse go-to-events (oder darin)
    if (e.target.closest(".go-to-events")) {
        e.preventDefault();
        window.location.href = "index.html?scrollToEvents=true";
    }

    if (e.target.closest(".scroll-to-top")) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
});
