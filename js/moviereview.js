// ==========================
// Modal functionality
// ==========================

const modal = document.getElementById("trailerModal");
const btn = document.getElementById("trailerBtn");
const closeBtn = document.querySelector(".close-btn");
const video = document.getElementById("youtubeTrailer");

let trailerId = null;

// Toast Notification
function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

btn.addEventListener("click", () => {
    if (!trailerId) {
        showToast("🎬 Trailer is not available for this title.");
        return;
    }

    modal.style.display = "flex";
    video.src = `https://www.youtube.com/embed/${trailerId}?autoplay=1`;
    document.body.style.overflow = "hidden";
});

closeBtn.addEventListener("click", closeModal);

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

function closeModal() {
    modal.style.display = "none";
    video.src = "";
    document.body.style.overflow = "auto";
}
// ==========================
// Get Movie ID
// ==========================

const movieId = new URLSearchParams(window.location.search).get("id");

// ==========================
// Fetch Movie from OMDb
// ==========================

async function fetchMovie() {

    if (!movieId) {
        document.getElementById("error").textContent =
            "Movie ID missing in URL";
        return;
    }

    try {

      const apiKey = "81f37cd3";

        const response = await fetch(
            `https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`
        );

        const movie = await response.json();

        if (movie.Response === "False") {
            document.getElementById("error").textContent =
                movie.Error || "Movie not found";
            return;
        }

        document.getElementById("title").textContent =
            `${movie.Title} (${movie.Year})`;

        document.getElementById("year").textContent =
            movie.Year || "";

        document.getElementById("genre").textContent =
            movie.Genre || "";

        document.getElementById("plot").textContent =
            movie.Plot || "";

        document.getElementById("actors").innerHTML =
    movie.Actors || "";

        document.getElementById("rating").textContent =
            movie.imdbRating
                ? `⭐ ${movie.imdbRating}/10`
                : "⭐ N/A";

        document.getElementById("poster").src =
            movie.Poster && movie.Poster !== "N/A"
                ? movie.Poster
                : "img/no-poster.png";

    } catch (error) {

        console.error(error);

        document.getElementById("error").textContent =
            "Failed to load movie information.";
    }
}

// ==========================
// Fetch Custom Review
// ==========================

async function fetchReview() {

    const reviewParagraph =
        document.querySelector(".movRev p");

    try {

        const response = await fetch(
    "https://opensheet.elk.sh/1GboTwysik5I7gh2B9XCBIHEgThYLzUiwi8yqR4LkmmQ/review!A1:E500"
);

        const reviews = await response.json();


        const review = reviews.find(
            item =>
                item.imdbId?.trim() === movieId?.trim()
        );


        if (!review) {

            reviewParagraph.textContent =
                "Review not available yet.";

            return;
        }


        reviewParagraph.innerHTML =
            review["review"] || "Review not added yet.";


        trailerId =
            review.trailerId || null;


    } catch (error) {

        console.error("Review Error:", error);

        reviewParagraph.textContent =
            "Failed to load review.";
    }
}
// ==========================
// Newsletter Form
// ==========================

const form = document.querySelector(".newsletter-form");

if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        showToast(
            "📧 Thank you for your interest. Newsletter functionality is not available in this demo version."
        );

        form.reset();
    });
}

// ==========================
// Initialize Page
// ==========================

document.addEventListener("DOMContentLoaded", () => {
    console.log("Movie ID:", movieId);

    fetchMovie();
    fetchReview();
});