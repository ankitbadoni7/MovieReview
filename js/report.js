// saving report data to google sheet using google apps script web app

document.getElementById("reportForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const reportTitle =
        document.getElementById("reportTitle").value;

    const email =
        document.getElementById("email").value;

    const category =
        document.getElementById("category").value;

    const details =
        document.getElementById("details").value;

    try {

        const res = await fetch(
            "https://script.google.com/macros/s/AKfycbz6J191YP4sGLAhaFsnwDHscMflnF5pXCgbCHrJjgkumbN8y56CrYGHhMhHD8PB_D4w/exec",
            {
                method: "POST",
                body: JSON.stringify({
                    reportTitle,
                    email,
                    category,
                    details,
                    submittedAt:
                        new Date().toLocaleString()
                })
            }
        );

        const data = await res.json();

        showToast(
            data.message ||
            "Report submitted successfully!"
        );

        document
            .getElementById("reportForm")
            .reset();

    }

    catch (error) {

        console.error(error);

        showToast(
            "Could not submit report. Please try later.",
            "error"
        );
    }
});


function showToast(message, type = "success") {

    const toast =
        document.getElementById("toast");

    if (!toast) {
        alert(message);
        return;
    }

    toast.textContent = message;

    toast.className =
        `show ${type}`;

    setTimeout(() => {

        toast.className = "";

    }, 3000);
}