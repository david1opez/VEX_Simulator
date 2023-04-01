function toCammelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
        return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
}

function addOption(option, optionsContainerClass) {
    let div = document.createElement("div");
    div.className = "multiSelectOption";
    let input = document.createElement("input");
    input.type = "checkbox";
    input.className = "checkbox";
    let label = document.createElement("label");
    label.className = "checkboxLabel inputs " + toCammelCase(option);
    label.innerHTML = option;
    div.appendChild(input);
    div.appendChild(label);
    document.querySelector(`.multiselectInput.${optionsContainerClass}`).appendChild(div);
}

// Neural Network Inputs
[
    "Distance to Goal",
].forEach(option => addOption(option, "neuralNetworkInputs"));


// Rewards
[
    "Distance to Goal",
].forEach(option => addOption(option, "rewards"));

// Punishments
[
    "Distance to Goal",
].forEach(option => addOption(option, "punishments"));
