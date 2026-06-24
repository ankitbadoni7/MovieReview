// search.js
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('#searchInput');
    const searchBtn = document.querySelector('#searchBtn');
    
    if (!searchInput || !searchBtn) {
        console.error("Search elements not found!");
        return;
    }

    
    // "No result found" message
   // "No result found" message
let noResultDiv = document.createElement('div');

noResultDiv.style.display = "none";

    // Normalization function
    function normalize(str) {
        return str
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }


    function isMatch(title, query) {
        const normTitle = normalize(title);
        const words = normalize(query).split(' ').filter(Boolean);
        return words.every(word => normTitle.includes(word));
    }

    async function performSearch() {
        const query = searchInput.value.trim();
        if (!query) return;

        const normQuery = normalize(query);
        let matches = [];

        // 🔹 Helper to extract cards from fetched HTML
        function extractMatches(htmlText, type) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, "text/html");
            const cards = doc.querySelectorAll(".movie-card, .series-card");

            cards.forEach(card => {
                const titleEl = card.querySelector("h1,h2,h3");
                if (titleEl && isMatch(titleEl.textContent, normQuery)) {
                    matches.push({ card, type });
                }
            });
        }

        try {
            // 🔹 Fetch movies.html and series.html content
            const [moviesHtml, seriesHtml] = await Promise.all([
                fetch("movies.html").then(res => res.text()),
                fetch("series.html").then(res => res.text())
            ]);

            extractMatches(moviesHtml, "movie");
            extractMatches(seriesHtml, "series");

            if (matches.length > 0) {
                noResultDiv.style.display = "none";

                // Redirect to the first matched card’s page
                const firstMatch = matches[0].card;
                const dataId = firstMatch.getAttribute("data-id");
                if (matches[0].type === "movie") {
                    window.location.href = `movies.html?movieId=${dataId}`;
                } else {
                    
                    window.location.href = `series.html?seriesId=${dataId}`;
                }
            } else {
                noResultDiv.style.display = "block";
            }
        } catch (err) {
            console.error("Search fetch failed:", err);
            noResultDiv.style.display = "block";
        }
    }

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });
});