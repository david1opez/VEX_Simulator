let mode = selectInputs.mode.value;

let population = numberInputs.population.value;
let mutationRate = numberInputs.mutationRate.value;
let hiddenLayers = numberInputs.hiddenLayers.value;
let maxTime = numberInputs.timeToLive.value;

let neuralNetworkinputs = [];
let rewards = [];
let punishments = [];

let drawRobots = true;
let drawDiscs = true;
let drawGoals = true;
let drawField = true;

let showRobots = "allRobots";

let bestRobot = null;
let topScore = 0;

let generation = 1;

ShowHideTitles();
ShowHideAIParams();

// Set Select Input Values
selectInputs.mode.addEventListener("change", (event) => {
    mode = event.target.value;
    ShowHideTitles();
    ShowHideAIParams();
    initialize();
});

ShowHideTopRobotsToShow();

selectInputs.showRobots.addEventListener("change", (event) => {
    showRobots = event.target.value;
    ShowHideTopRobotsToShow();
});

// Set Number Input Values
numberInputs.population.addEventListener("change", (event) => {
    population = event.target.value;
});

numberInputs.mutationRate.addEventListener("change", (event) => {
    mutationRate = event.target.value;
});

numberInputs.hiddenLayers.addEventListener("change", (event) => {
    hiddenLayers = event.target.value;
    initialize();
});

numberInputs.timeToLive.addEventListener("change", (event) => {
    maxTime = event.target.value;
});


// Add an change event listener to each option in the multiselect inputs
for (let input in multiSelectOptions) {
    for (let option in multiSelectOptions[input]) {
        multiSelectOptions[input][option].addEventListener("change", (event) => {
            if (event.target.checked) {
                if (input == "neuralNetworkInputs") {
                    neuralNetworkinputs.push(option);
                } else if (input == "rewards") {
                    rewards.push(option);
                } else if (input == "punishments") {
                    punishments.push(option);
                }
            } else {
                if (input == "neuralNetworkInputs") {
                    neuralNetworkinputs = neuralNetworkinputs.filter((item) => item !== option);
                } else if (input == "rewards") {
                    rewards = rewards.filter((item) => item !== option);
                } else if (input == "punishments") {
                    punishments = punishments.filter((item) => item !== option);
                }
            }
        });
    }
}

// Set Toggle Input Values
toggleInputs.showDiscs.addEventListener("change", (event) => {
    drawDiscs = event.target.checked;
});

toggleInputs.showGoals.addEventListener("change", (event) => {
    drawGoals = event.target.checked;
});

toggleInputs.showField.addEventListener("change", (event) => {
    drawField = event.target.checked;
});
