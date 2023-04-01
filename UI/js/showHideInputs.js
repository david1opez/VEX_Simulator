titles.generation.style.display = "block";
titles.topScore.style.display = "block";

titles.currentScore.style.display = "none";

titles.blueScore.style.display = "none";
titles.redScore.style.display = "none";

selectInputs.mode.addEventListener("change", (event) => {
    let value = event.target.value;

    if (value === "driving") {
        titles.currentScore.style.display = "block";

        titles.generation.style.display = "none";
        titles.topScore.style.display = "none";
        titles.blueScore.style.display = "none";
        titles.redScore.style.display = "none";
    }
    else if (value === "competition") {
        titles.blueScore.style.display = "block";
        titles.redScore.style.display = "block";

        titles.generation.style.display = "none";
        titles.topScore.style.display = "none";
        titles.currentScore.style.display = "none";
    }
    else {
        titles.generation.style.display = "block";
        titles.topScore.style.display = "block";

        titles.currentScore.style.display = "none";
        titles.blueScore.style.display = "none";
        titles.redScore.style.display = "none";
    }
});