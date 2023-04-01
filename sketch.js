let robots = [];
let prevRobots = [];

let timer = 0;

let discsCords = [
  [365/12, 365/12],
  [365/6, 365/6],
  [365/4, 365/4],
  [365/3, 365/3],
  [365/2.4, 365/2.4],
  [365/1.72, 365/1.72],
  [365/1.5, 365/1.5],
  [365/1.335, 365/1.335],
  [365/1.2, 365/1.2],
  [365/1.09, 365/1.09],

  [365/2.4, 365/4],
  [365/2, 365/3],
  [365/1.72, 365/2.4],
  [365/1.335, 365/1.72],

  [365/4, 365/2.4],
  [365/2.4, 365/1.72],
  [365/1.99, 365/1.5],
  [365/1.72, 365/1.335],

  [365/6+16.5/2, 365/1.5-16.5/2],
  [365/4.4+16.5/2, 365/1.5-16.5/2],
  [365/3.5+16.5/2, 365/1.5-16.5/2],
  [365/2.9+16.5/2, 365/1.4-16.5/2],
  [365/2.9+16.5/2, 365/1.293-16.5/2],
  [365/2.9+16.5/2, 365/1.2-16.5/2],

  [365/1.5-16.5/2, 365/6+16.5/2],
  [365/1.5-16.5/2, 365/4.4+16.5/2],
  [365/1.5-16.5/2, 365/3.5+16.5/2],
  [365/1.4-16.5/2, 365/2.9+16.5/2],
  [365/1.293-16.5/2, 365/2.9+16.5/2],
  [365/1.2-16.5/2, 365/2.9+16.5/2],
];

for (let i = 0; i < population; i++) {
  robots.push(new Robot(i, true, 18, 83, 0, 0.5, 0.01, 0.85, 0.85, 10, 0.1));
}

let discs = robots.map(() => discsCords.map(([x,y]) => new Disc(x,y, 16.5)));


let goals = [new Goal("red"), new Goal("blue")];

let field = new Field();

function setup() {
  createCanvas(365, 365);
  background(0);
}

function draw() {
  frameRate(60);

  field.draw();

  timer++;

  if(robots.every((robot) => robot.dead) || timer >= maxTime) {
    timer = 0;

    prevRobots = robots;
    robots = [];

    nextGeneration();

    generation++;
    document.querySelector(".generation").innerHTML = `Generation: ${generation}`;

    discs = robots.map(() => discsCords.map(([x,y]) => new Disc(x,y, 16.5)));
  }

  robots?.map((robot, index) => {
    robot.handleInput(discs[index]);
    discs[index].map((disc) => disc.draw(robot.corners));
    //robot.think(discs[index]);
  });

  goals.map((goal) => goal.draw());
};
