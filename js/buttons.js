document.addEventListener("click", function(e) {
    // Prüfen, ob Klick auf einen Button mit Klasse go-to-games (oder darin)
    if (e.target.closest(".go-to-games")) {
        e.preventDefault();
        window.location.href = "index.html?scrollToGames=true";
    }

    // Prüfen, ob Klick auf einen Button mit Klasse go-to-events (oder darin)
    if (e.target.closest(".go-to-events")) {
        e.preventDefault();
        window.location.href = "index.html?scrollToEvents=true";
    }
});