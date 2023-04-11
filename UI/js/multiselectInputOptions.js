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


// Rewards
options = [
    "Move forwards",
    "Move backwards",
    "Turn left",
    "Turn right",
    "Touch disc",
    "Intake disc",
    "Shoot disc",
    "Cross middle line",
    "Score in any low goal",
    "Score in any high goal",
    "Score in self low goal",
    "Score in self high goal",
    "Score in opponent low goal",
    "Score in opponent high goal",
    "Touch Roller",
    "Move Roller",
    "Move roller to alliance color",
    "Move roller to opponent color",
]

options.forEach(option => addOption("rewards", option, "rewards"));

options.forEach(option => addOption("punishments", option, "punishments"));
