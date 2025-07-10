// Funktion: n-ter Wochentag im Monat finden
function nthWeekday(year, month, weekday, n) {
    const jsWeekday = (weekday % 7); // 7 (So) -> 0, 1 (Mo) -> 1, etc.

    const firstDay = new Date(year, month, 1);
    const firstDayWeekday = firstDay.getDay();

    const diff = (7 + jsWeekday - firstDayWeekday) % 7;

    return new Date(year, month, 1 + diff + (n - 1) * 7);
}

function getNextEventDates(now, weekday, ns) {
    let candidateDates = [];

    ns.forEach(n => {
        candidateDates.push(nthWeekday(now.getFullYear(), now.getMonth(), weekday, n));
    });

    let nextMonth = now.getMonth() + 1;
    let nextYear = now.getFullYear();
    if (nextMonth > 11) {
        nextMonth = 0;
        nextYear++;
    }
    ns.forEach(n => {
        candidateDates.push(nthWeekday(nextYear, nextMonth, weekday, n));
    });

    candidateDates.sort((a, b) => a - b);

    return candidateDates;
}

// Hilfsfunktion: erstelle ein Date-Objekt mit der festen Uhrzeit in der festen Zeitzone
// Wir brauchen dafür Intl API und bauen die UTC Zeit passend.
// Da JS Date nicht direkt Zeitzonen unterstützt, bauen wir die UTC Zeit "manuell" aus dem gewünschten Datum + Uhrzeit + Zeitzone
function getEventDateInTimeZone(dateWithoutTime, hour, minute, timeZone) {
    // Datum in Zeitzone formatieren und UTC Teile auslesen
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false,
    }).formatToParts(dateWithoutTime);

    // Extrahiere Jahr, Monat, Tag, Stunde, Minute
    let year, month, day;
    for (const part of parts) {
        if (part.type === 'year') year = part.value;
        else if (part.type === 'month') month = part.value;
        else if (part.type === 'day') day = part.value;
    }

    // Baue Datum mit gewünschter Uhrzeit als UTC (ohne Zeitzonenverschiebung)
    // Achtung: Monat in JS Date ist 0-basiert
    const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));

    return utcDate;
}

document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll("[data-weekday]");

    elements.forEach(el => {
        const parent = el;

        const weekday = parent?.getAttribute("data-weekday") ?? "1";
        const weekdayNum = parseInt(weekday, 10);

        const nthAttr = parent?.getAttribute("data-nth") ?? "1,3";
        const nthDays = nthAttr.split(",").map(x => parseInt(x.trim(), 10));

        const hourAttr = parent?.getAttribute("data-hour") ?? "18";
        const minuteAttr = parent?.getAttribute("data-minute") ?? "0";
        const eventHour = parseInt(hourAttr, 10);
        const eventMinute = parseInt(minuteAttr, 10);

        const now = new Date();

        const nextDates = getNextEventDates(now, weekdayNum, nthDays);

        const timeZone = "Europe/Berlin"; // hier definierst du die feste Zeitzone

        // Erstelle eventDate mit fester Uhrzeit in fester Zeitzone als UTC Date
        let foundEvent = null;

        for (const dateWithoutTime of nextDates) {
            // Erstelle Event Datum mit fester Zeit in fester Zeitzone
            const eventDate = getEventDateInTimeZone(dateWithoutTime, eventHour, eventMinute, timeZone);

            // Event Endzeit + 1h
            const eventEnd = new Date(eventDate.getTime() + 60 * 60 * 1000);

            if (now < eventDate) {
                foundEvent = { status: "upcoming", date: eventDate };
                break;
            } else if (now >= eventDate && now < eventEnd) {
                foundEvent = { status: "ongoing", date: eventDate };
                break;
            }
        }

        if (foundEvent) {
            const options = {
                weekday: "long",
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone // lokale Zeitzone des Nutzers
            };

            if (foundEvent.status === "upcoming") {
                el.textContent = "📅 " + foundEvent.date.toLocaleString("en-US", options) + " (Placeholders)";
            } else if (foundEvent.status === "ongoing") {
                el.textContent = "🎉 Right now";
            }
        } else {
            el.textContent = "No upcoming events found.";
        }
    });
});