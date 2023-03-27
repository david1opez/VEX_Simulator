function nextGeneration() {
    calculateFitness();
    for (let i = 0; i < population; i++) {
        robots[i] = pickOne();
    }

    prevRobots = [];
}

function pickOne() {
    let index = 0;
    let r = random(1);

    while (r > 0) {
        r -= prevRobots[index].fitness;
        index++;
    }

    index--;

    let robot = prevRobots[index];

    let child = new Robot(true, 18, 83, 0, 0.5, 0.01, 0.85, 0.85, 10, 0.1, robot.brain);
    child.mutate(0.1);

    return child;
}

function calculateFitness() {
    let sum = 0;

    for (let r of prevRobots) {
        sum += r.score;
    }

    for (let r of prevRobots) {
        r.fitness = r.score / sum;
    }
}