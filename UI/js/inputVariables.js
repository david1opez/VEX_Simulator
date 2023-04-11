const titles = {
    generation: document.querySelector(".title.generation"),
    topScore: document.querySelector(".title.topScore"),
    currentScore: document.querySelector(".title.currentScore"),
    blueScore: document.querySelector(".title.blueScore"),
    redScore: document.querySelector(".title.redScore")
};

const selectInputs = {
    mode: document.querySelector(".selectInput.mode"),
    showRobots: document.querySelector(".selectInput.showRobots"),
};

const numberInputs = {
    population: document.querySelector(".numberInput.population"),
    mutationRate: document.querySelector(".numberInput.mutationRate"),
    timeToLive: document.querySelector(".numberInput.timeToLive"),
    topRobotsToShow: document.querySelector(".numberInput.topRobotsToShow"),
}

const multiselectInputs = {
    rewards: document.querySelector(".multiselectInput.rewards"),
    punishments: document.querySelector(".multiselectInput.punishments"),
}

const toggleInputs = {
    showDiscs: document.querySelector(".toggleInput.showDiscs"),
    showGoals: document.querySelector(".toggleInput.showGoals"),
    showField: document.querySelector(".toggleInput.showField"),
}

const multiSelectOptions = {
    rewards: {
        distanceToGoal: document.querySelector(".checkboxInput.rewards.distanceToGoal"),
    },
    punishments: {
        distanceToGoal: document.querySelector(".checkboxInput.punishments.distanceToGoal"),
    },
}

const inputLabels = {
    mode: document.querySelector(".inputLabel.mode"),
    showRobots: document.querySelector(".inputLabel.topRobotsToShow"),
    population: document.querySelector(".inputLabel.population"),
    mutationRate: document.querySelector(".inputLabel.mutationRate"),
    timeToLive: document.querySelector(".inputLabel.timeToLive"),
    topRobotsToShow: document.querySelector(".inputLabel.topRobotsToShow"),
    rewards: document.querySelector(".inputLabel.rewards"),
    punishments: document.querySelector(".inputLabel.punishments"),
}