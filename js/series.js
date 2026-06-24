document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // Elements
    // ==========================

    const filterLinks = document.querySelectorAll("[data-filter]");
    const searchInput = document.querySelector(".search-box input");
    const searchButton = document.querySelector(".search-btn");
    const seriesGrid = document.querySelector(".series-grid");

    const activeFilters = {
        genre: "all"
    };

    // ==========================
    // No Series Message
    // ==========================

    const noSeries = document.createElement("div");

    noSeries.textContent = "No series found";
    noSeries.style.textAlign = "center";
    noSeries.style.fontSize = "1.5rem";
    noSeries.style.margin = "2rem";
    noSeries.style.display = "none";

    seriesGrid.appendChild(noSeries);


    // ==========================
    // Toast Notification
    // ==========================

    function showToast(message) {

        const toast =
            document.getElementById("toast");

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
                "series-card skeleton";

            skeleton.innerHTML = `
                <div class="series-poster"></div>

                <div class="series-info">
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

    const seriesCards =
        document.querySelectorAll(".series-card");

    let anyVisible = false;

    seriesCards.forEach(card => {

        if (
            card.classList.contains("skeleton")
        ) return;

        const title =
            card.querySelector("h3")
                .textContent
                .toLowerCase();

        const genres =
            card.dataset.genre?.toLowerCase() || "";

        const searchTerm =
            activeFilters.search;

        let show = true;

        if (
            activeFilters.genre !== "all" &&
            !genres.includes(activeFilters.genre)
        ) {
            show = false;
        }

        if (searchTerm) {

            const cleanTitle =
                title.replace(/[^a-z0-9]/g, "");

            const cleanSearch =
                searchTerm.replace(/[^a-z0-9]/g, "");

            if (
                !cleanTitle.includes(cleanSearch)
            ) {
                show = false;
            }
        }

        card.style.display =
            show ? "block" : "none";

        if (show)
            anyVisible = true;

    });

    noSeries.style.display =
        anyVisible ? "none" : "block";
}

    // ==========================
// Genre Filters
// ==========================

filterLinks.forEach(link => {

    link.addEventListener("click", e => {

        e.preventDefault();

        activeFilters.genre =
            link.dataset.filter.toLowerCase();

        /* Reset previous search */
        searchInput.value = "";
        activeFilters.search = "";

        applyFilters();

    });

});


   // ==========================
// Search
// ==========================

searchButton.addEventListener("click", () => {

    activeFilters.search =
        searchInput.value.toLowerCase().trim();

    /* Reset previous genre filter */
    activeFilters.genre = "all";

    applyFilters();
});


searchInput.addEventListener(
    "keypress",
    e => {

        if (e.key === "Enter") {

            activeFilters.search =
                searchInput.value.toLowerCase().trim();

            /* Reset previous genre filter */
            activeFilters.genre = "all";

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
    // Load Series
    // ==========================


    loadSeries();



    async function loadSeries() {


        try {


            seriesGrid.innerHTML = "";
            seriesGrid.appendChild(noSeries);


            createSkeletonCards(seriesGrid, 12);



            const response = await fetch(
                "https://opensheet.elk.sh/1GboTwysik5I7gh2B9XCBIHEgThYLzUiwi8yqR4LkmmQ/series"
            );


            const series =
                await response.json();



            const omdbRequests =
                series.map(item =>
                    fetch(
                        `https://www.omdbapi.com/?i=${item.imdbId}&apikey=81f37cd3`
                    ).then(res => res.json())
                );



            const omdbSeries =
                await Promise.all(omdbRequests);



            seriesGrid.innerHTML = "";
            seriesGrid.appendChild(noSeries);



            omdbSeries.forEach(show => {


                if (
                    show.Response === "False"
                ) return;



                const card =
                    document.createElement("div");



                card.className =
                    "series-card";



                card.dataset.id =
                    show.imdbID;



                card.dataset.genre =
                    show.Genre;



                card.innerHTML = `
                    <div class="series-poster">

                        <img
                            src="${show.Poster}"
                            alt="${show.Title}"
                            loading="lazy"
                            decoding="async"
                        >

                        <div class="movie-rating">
                            ${show.imdbRating}
                        </div>

                    </div>


                    <div class="series-info">

                        <h3>${show.Title}</h3>


                        <p>
                            ${show.Year} •
                            ${show.Genre.split(",")[0]} •
                            ${show.totalSeasons
                                ? `S${show.totalSeasons}`
                                : "Series"}
                        </p>

                    </div>
                `;



                card.addEventListener(
                    "click",
                    () => {

                        window.location.href =
                            `movie_review.html?id=${show.imdbID}`;

                    }
                );


                seriesGrid.appendChild(card);

            });



            // ==========================
            // URL Search + Genre Filter
            // ==========================


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

                searchInput.value =
                    searchParam;

            }



            applyFilters();



        }


        catch (error) {

            console.error(
                "Error loading series:",
                error
            );

        }

    }

});