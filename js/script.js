// ----------------------
// 🔹 DOMContentLoaded - All Events
// ----------------------
document.addEventListener("DOMContentLoaded", () => {
  

  // ----------------------
  // 🔹 Slider
  // ----------------------
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  let index = 0;
  let intervalId;

  function showSlide(i) {
    slides.forEach(slide => slide.classList.remove("active"));
    dots.forEach(dot => dot.classList.remove("active"));
    if (i >= slides.length) i = 0;
    if (i < 0) i = slides.length - 1;
    slides[i].classList.add("active");
    dots[i].classList.add("active");
    index = i;
  }

  function startSlideshow() {
    clearInterval(intervalId);
    intervalId = setInterval(() => showSlide(index + 1), 8000);
  }

  dots.forEach((dot, i) => dot.addEventListener("click", () => { showSlide(i); startSlideshow(); }));
  if (slides.length > 0) startSlideshow();

  // ----------------------
  // 🔹 Movie Card Click
  // ----------------------
  document.querySelectorAll(".movie-card").forEach(card => {
    card.addEventListener("click", () => {
      const movieId = card.getAttribute("data-id");
      if (movieId) window.location.href = `movie_review.html?id=${movieId}`;
    });
  });

  // ----------------------
  // 🔹 Trailer Modal
  // ----------------------
  const trailerButtons = document.querySelectorAll("[data-video]");
  trailerButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      const videoId = this.getAttribute("data-video");
      if (!videoId) return;
      const modal = document.createElement("div");
      modal.classList.add("modal");
      modal.innerHTML = `
        <div class="modal-content">
          <span class="close">&times;</span>
          <iframe width="560" height="315"
              src="https://www.youtube.com/embed/${videoId}?autoplay=1"
              frameborder="0"
              allow="autoplay; encrypted-media"
              allowfullscreen>
          </iframe>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector(".close").addEventListener("click", () => modal.remove());
      modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });
    });
  });

  // ----------------------
  // 🔹 Newsletter Form
  // ----------------------
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

// ----------------------
// 🔹 Global Search
// ----------------------

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

if (searchBtn && searchInput) {

    searchBtn.addEventListener("click", searchMovie);

    searchInput.addEventListener("keypress", (e) => {

        if (e.key === "Enter") {
            searchMovie();
        }
    });

 async function searchMovie() {

    const query =
        searchInput.value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]/g, "");

    if (!query) return;

    try {

        const [moviesRes, seriesRes] =
            await Promise.all([
                fetch("https://opensheet.elk.sh/1GboTwysik5I7gh2B9XCBIHEgThYLzUiwi8yqR4LkmmQ/movies"),
                fetch("https://opensheet.elk.sh/1GboTwysik5I7gh2B9XCBIHEgThYLzUiwi8yqR4LkmmQ/series")
            ]);

        const movies =
            await moviesRes.json();

        const series =
            await seriesRes.json();

        const allTitles = [
            ...movies.map(item => ({
                title: item.title,
                type: "movie"
            })),
            ...series.map(item => ({
                title: item.title,
                type: "series"
            }))
        ];

        const match =
            allTitles.find(item => {

                const title =
                    item.title
                        ?.toLowerCase()
                        .replace(/[^a-z0-9]/g, "");

                return title.includes(query);
            });

        if (!match) {

            showToast("🎬 No movie or series found.");
            return;
        }

        if (match.type === "movie") {

            window.location.href =
                `movies.html?search=${encodeURIComponent(searchInput.value)}`;

        } else {

            window.location.href =
                `series.html?search=${encodeURIComponent(searchInput.value)}`;
        }

    } catch (error) {

        console.error(error);

        showToast("Search failed.");
    }
}
}

  // ----------------------
  // 🔹 Review Button
  // ----------------------
  document.querySelectorAll(".reviewBtn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const movieCard = btn.closest(".hero-content");
      if (!movieCard) return;
      const title = movieCard.querySelector("h1")?.innerText;
      if (!title) return;

      try {
        const res = await fetch(`${baseURL}/api/reviews/title/${encodeURIComponent(title)}`);
        const data = await res.json();
        if (data.movieId) window.location.href = `movie_review.html?id=${data.movieId}`;
        else alert("Movie ID not found for " + title);
      } catch (err) {
        console.error(err);
        alert("Movie review not added yet.");
      }
    });
  });

  // ----------------------
  // 🔹 View All Button
  // ----------------------
  const viewAllBtn = document.getElementById("viewAllBtn");
  if (viewAllBtn) viewAllBtn.addEventListener("click", () => window.location.href = "movies.html");

  

  // ----------------------
  // 🔹 Hamburger Menu
  // ----------------------
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', hamburger.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
    });
  }

  // ----------------------
  // 🔹 Smooth Scroll for Anchor Links
  // ----------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
        if (mobileMenu?.classList.contains('active')) mobileMenu.classList.remove('active');
        hamburger?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // ----------------------
  // 🔹 Scroll Animations
  // ----------------------
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('section, .movie-card, .review-card').forEach(el => observer.observe(el));
});

// ----------------------
// 🔹 Mobile Menu Search
// ----------------------
const searchInputMobile = document.getElementById("searchInputMobile");
const searchButtonMobile = document.getElementById("searchBtnMobile");

if (searchInputMobile && searchButtonMobile) {
  searchButtonMobile.addEventListener("click", () => {
    const query = searchInputMobile.value.toLowerCase().trim();
    let anyVisible = false;

    document.querySelectorAll(".movie-card").forEach(card => {
      const title = card.querySelector("h1")?.textContent.toLowerCase() || "";
      if (title.includes(query)) {
        card.style.display = "block";
        anyVisible = true;
      } else card.style.display = "none";
    });

    const noMovies = document.getElementById("noMovies");
    if (noMovies) noMovies.style.display = anyVisible ? "none" : "block";
  });

  searchInputMobile.addEventListener("keypress", e => { 
    if (e.key === "Enter") searchButtonMobile.click(); 
  });
}


document.addEventListener("DOMContentLoaded", loadHomepageMovies);
function createSkeletonCards(container, count = 5) {
    for (let i = 0; i < count; i++) {

        const skeleton = document.createElement("div");

        skeleton.className = "movie-card skeleton";

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
async function loadHomepageMovies() {

    const trendingContainer =
        document.getElementById("trendingMovies");

    const moviesContainer =
        document.getElementById("moviesGrid");

    const seriesContainer =
        document.getElementById("seriesSection");

    if (
        !trendingContainer &&
        !moviesContainer &&
        !seriesContainer
    ) return;
    if (trendingContainer)
    createSkeletonCards(trendingContainer, 5);

if (moviesContainer)
    createSkeletonCards(moviesContainer, 5);

if (seriesContainer)
    createSkeletonCards(seriesContainer, 5);

    try {

        const sheetRes = await fetch(
            "https://opensheet.elk.sh/1GboTwysik5I7gh2B9XCBIHEgThYLzUiwi8yqR4LkmmQ/homepage"
        );

        const sheetData =
            await sheetRes.json();

        const omdbRequests =
            sheetData.map(item =>
                fetch(
                    `https://www.omdbapi.com/?i=${item.imdbId}&apikey=81f37cd3`
                ).then(res => res.json())
            );

        const movies =
            await Promise.all(omdbRequests);
            trendingContainer?.replaceChildren();
moviesContainer?.replaceChildren();
seriesContainer?.replaceChildren();

        movies.forEach((movie, index) => {

            if (movie.Response === "False")
                return;

            const section =
                sheetData[index].section.toLowerCase();

            const card =
                document.createElement("div");

            card.className = "movie-card";

            card.setAttribute(
                "data-id",
                movie.imdbID
            );

            card.innerHTML = `
                <div class="movie-poster">
                  <img 
    src="${movie.Poster}" 
    alt="${movie.Title}"
    loading="lazy"
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

            card.addEventListener("click", () => {

                window.location.href =
                    `movie_review.html?id=${movie.imdbID}`;
            });

            if (
                section === "trending" &&
                trendingContainer
            ) {
                trendingContainer.appendChild(card);
            }

            else if (
                section === "movies" &&
                moviesContainer
            ) {
                moviesContainer.appendChild(card);
            }

            else if (
                section === "series" &&
                seriesContainer
            ) {
                seriesContainer.appendChild(card);
            }

        });

    }

    catch (error) {

        console.error(
            "Homepage Load Error:",
            error
        );
    }
}


//homepage slider review button
document.querySelectorAll(".reviewBtn").forEach(btn => {

    btn.addEventListener("click", () => {

        const id = btn.dataset.id;

        window.location.href =
            `movie_review.html?id=${id}`;

    });

});

function showToast(message) {
  const toast = document.getElementById("toast");

  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}