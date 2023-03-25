let dimensions = 365;

let discSize = dimensions*0.045;

let discsCords = [
  [dimensions/12, dimensions/12],
  [dimensions/6, dimensions/6],
  [dimensions/4, dimensions/4],
  [dimensions/3, dimensions/3],
  [dimensions/2.4, dimensions/2.4],
  [dimensions/1.72, dimensions/1.72],
  [dimensions/1.5, dimensions/1.5],
  [dimensions/1.335, dimensions/1.335],
  [dimensions/1.2, dimensions/1.2],
  [dimensions/1.09, dimensions/1.09],

  [dimensions/2.4, dimensions/4],
  [dimensions/2, dimensions/3],
  [dimensions/1.72, dimensions/2.4],
  [dimensions/1.335, dimensions/1.72],

  [dimensions/4, dimensions/2.4],
  [dimensions/2.4, dimensions/1.72],
  [dimensions/1.99, dimensions/1.5],
  [dimensions/1.72, dimensions/1.335],

  [dimensions/6+discSize/2, dimensions/1.5-discSize/2],
  [dimensions/4.4+discSize/2, dimensions/1.5-discSize/2],
  [dimensions/3.5+discSize/2, dimensions/1.5-discSize/2],
  [dimensions/2.9+discSize/2, dimensions/1.4-discSize/2],
  [dimensions/2.9+discSize/2, dimensions/1.293-discSize/2],
  [dimensions/2.9+discSize/2, dimensions/1.2-discSize/2],

  [dimensions/1.5-discSize/2, dimensions/6+discSize/2],
  [dimensions/1.5-discSize/2, dimensions/4.4+discSize/2],
  [dimensions/1.5-discSize/2, dimensions/3.5+discSize/2],
  [dimensions/1.4-discSize/2, dimensions/2.9+discSize/2],
  [dimensions/1.293-discSize/2, dimensions/2.9+discSize/2],
  [dimensions/1.2-discSize/2, dimensions/2.9+discSize/2],
];

let robot = new Robot(18, 83, 0, 0.5, 0.01, 0.85, 0.85, 10, 0.1);

let discs = discsCords.map(([x,y]) => new Disc(x,y, discSize));

let goals = [
  new Goal("red"),
  new Goal("blue"),
];

let field = new Field();

function setup() {
  createCanvas(dimensions, dimensions);
  background(255);
}

function draw() {
  frameRate(60);
  
  field.draw();
  robot.handleInput();
  goals.map((goal) => goal.draw());
  drawDiscs();
}

function drawDiscs() {
  discs.map((disc, index) => {
    disc.draw();
    disc.checkRobotCollision(robot.corners);
    disc.checkDiscsCollision();
  });
}
