const body = document.querySelector("body")
body.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
        window.location.href = "trivia.html"
    }
});