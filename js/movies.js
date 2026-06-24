document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // Elements
    // ==========================

    const filterLinks = document.querySelectorAll("[data-filter]");
    const searchInput = document.querySelector(".search-box input");
    const searchButton = document.querySelector(".search-btn");
    const movieGrid = document.querySelector(".movie-grid");
const activeFilters = {
    year: "all",
    genre: "all",
    search: ""
};

    // ==========================
    // No Movies Message
    // ==========================

    const noMovies = document.createElement("div");

    noMovies.textContent = "No movies found";
    noMovies.style.textAlign = "center";
    noMovies.style.fontSize = "1.5rem";
    noMovies.style.margin = "2rem";
    noMovies.style.display = "none";

    movieGrid.appendChild(noMovies);

    // ==========================
    // Toast Notification
    // ==========================

    function showToast(message) {

        const toast = document.getElementById("toast");

        if (!toast) {
            alert(message);
            return;
        }

        toast.textContent = message;
        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }

    // ==========================
    // Skeleton Loader
    // ==========================

    function createSkeletonCards(container, count = 12) {

        for (let i = 0; i < count; i++) {

            const skeleton =
                document.createElement("div");

            skeleton.className =
                "movie-card skeleton";

            skeleton.innerHTML = `
                <div class="movie-poster"></div>

                <div class="movie-info">
                    <h3></h3>
                    <p></p>
                </div>
            `;

            container.appendChild(skeleton);
        }
    }

    // ==========================
    // Filters
    // ==========================

    function applyFilters() {

        const movieCards =
            document.querySelectorAll(".movie-card");

        let anyVisible = false;

        movieCards.forEach(card => {

            if (card.classList.contains("skeleton"))
                return;

            const title =
                card.querySelector("h3").textContent.toLowerCase();

            const year =
                card.dataset.year?.toLowerCase() || "";

            const genres =
                card.dataset.genre?.toLowerCase() || "";

            const searchTerm =
    activeFilters.search;

            let show = true;

            if (
                activeFilters.year !== "all" &&
                year !== activeFilters.year
            ) {
                show = false;
            }

            if (
                activeFilters.genre !== "all" &&
                !genres.includes(activeFilters.genre)
            ) {
                show = false;
            }
if (searchTerm) {

    const cleanTitle = title
        .replace(/[^a-z0-9]/g, "")
        .trim();

    const cleanSearch = searchTerm
        .replace(/[^a-z0-9]/g, "")
        .trim();

    if (!cleanTitle.includes(cleanSearch)) {
        show = false;
    }
}

            card.style.display =
                show ? "block" : "none";

            if (show)
                anyVisible = true;
        });

        noMovies.style.display =
            anyVisible ? "none" : "block";
    }

    // ==========================
    // Filter Events
    // ==========================

    filterLinks.forEach(link => {

        link.addEventListener("click", e => {

            e.preventDefault();

            const type =
                link.dataset.type || "year";

            const value =
                link.dataset.filter.toLowerCase();

            if (type === "year") {

                activeFilters.year = value;
                activeFilters.genre = "all";

            } else {

                activeFilters.genre = value;
                activeFilters.year = "all";
            }

            /* Search reset when user chooses a filter */
searchInput.value = "";
activeFilters.search = "";

applyFilters();
        });
    });

    // ==========================
    // Search
    // ==========================

   searchButton.addEventListener("click", () => {

    activeFilters.genre = "all";
    activeFilters.year = "all";

    activeFilters.search =
        searchInput.value.toLowerCase().trim();

    applyFilters();
});

    searchInput.addEventListener(
        "keypress",
        e => {

         if (e.key === "Enter") {

    activeFilters.genre = "all";
    activeFilters.year = "all";

    activeFilters.search =
        searchInput.value.toLowerCase().trim();

    applyFilters();
}
        }
    );

    // ==========================
    // Newsletter
    // ==========================

    const form =
        document.querySelector(".newsletter-form");

    if (form) {

        form.addEventListener("submit", e => {

            e.preventDefault();

            showToast(
                "📧 Thank you for your interest. Newsletter functionality is not available in this demo version."
            );

            form.reset();
        });
    }

    // ==========================
    // Load Movies
    // ==========================

    loadMovies();

    async function loadMovies() {

        try {

            movieGrid.innerHTML = "";
            movieGrid.appendChild(noMovies);

            // Show skeleton cards
            createSkeletonCards(movieGrid, 12);

            const response = await fetch(
                "https://opensheet.elk.sh/1GboTwysik5I7gh2B9XCBIHEgThYLzUiwi8yqR4LkmmQ/movies"
            );

            const movies =
                await response.json();

            const omdbRequests =
                movies.map(movie =>
                    fetch(
                        `https://www.omdbapi.com/?i=${movie.imdbId}&apikey=81f37cd3`
                    ).then(res => res.json())
                );

            const omdbMovies =
                await Promise.all(omdbRequests);
             omdbMovies.forEach(movie => {
    console.log(movie.Title, movie.Response);
});

            // Remove skeleton cards
            movieGrid.innerHTML = "";
            movieGrid.appendChild(noMovies);

            omdbMovies.forEach(movie => {

                if (
                    movie.Response === "False"
                ) return;

                const card =
                    document.createElement("div");

                card.className =
                    "movie-card";

                card.dataset.id =
                    movie.imdbID;

                card.dataset.year =
                    movie.Year;

                card.dataset.genre =
                    movie.Genre.toLowerCase();

                card.innerHTML = `
                    <div class="movie-poster">
                        <img
                            src="${movie.Poster}"
                            alt="${movie.Title}"
                            loading="lazy"
                            decoding="async"
                        >

                        <div class="movie-rating">
                            ${movie.imdbRating}
                        </div>
                    </div>

                    <div class="movie-info">
                        <h3>${movie.Title}</h3>

                        <p>
                            ${movie.Year} •
                            ${movie.Genre.split(",")[0]} •
                            ${movie.Runtime}
                        </p>
                    </div>
                `;

                card.addEventListener(
                    "click",
                    () => {

                        window.location.href =
                            `movie_review.html?id=${movie.imdbID}`;
                    }
                );

                movieGrid.appendChild(card);
            });

            // Apply URL genre filter

            const urlParams =
    new URLSearchParams(
        window.location.search
    );

const genreParam =
    urlParams.get("genre");

const searchParam =
    urlParams.get("search");

if (genreParam) {

    activeFilters.genre =
        genreParam.toLowerCase();
}

if (searchParam) {

    searchInput.value = "";
    activeFilters.search = "";

}

applyFilters();
        }

        catch (error) {

            console.error(
                "Error loading movies:",
                error
            );
        }
    }

});