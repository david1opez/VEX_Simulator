let options = [];

function toCammelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
        return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
}

function addOption(inputName, option, optionsContainerClass) {
    let div = document.createElement("div");
    div.className = "multiSelectOption";

    let label = document.createElement("label");
    label.innerHTML = option;
    
    option = toCammelCase(option);
    
    label.className = `checkboxLabel ${inputName} ${option}`

    let input = document.createElement("input");
    input.type = "checkbox";
    input.className = `checkboxInput ${inputName} ${option}`;
    

    div.appendChild(input);
    div.appendChild(label);

    document.querySelector(`.multiselectInput.${optionsContainerClass}`).appendChild(div);
}

// Neural Network Inputs
options = [
    "Distance to Goal",
]

options.forEach(option => addOption("neuralNetworkInputs", option, "neuralNetworkInputs"));


// Rewards
options = [
    "Distance to Goal",
]

options.forEach(option => addOption("rewards", option, "rewards"));

// Punishments
options = [
    "Distance to Goal",
]

options.forEach(option => addOption("punishments", option, "punishments"));
