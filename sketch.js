let dimensions = 365;

let robotSize = 38;

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

let robot = new Robot(robotSize, x=18, y=83, ang=0, acc=0.5, tAcc=0.01, f=0.85, tf=0.85, maxSp=10, maxTSp=0.1);

let discs = discsCords.map(([x,y]) => new Disc(x,y, discSize));

function setup() {
  createCanvas(dimensions, dimensions);
  background(255);
}

function draw() {
  drawField();

  frameRate(60);
  handleInput();
  drawGoals();
}

function drawField() {
  // Tiles
  for (var x = 0; x < width; x += width / 6) {
    for (var y = 0; y < height; y += height / 6) {
      stroke(40);
      strokeWeight(0.5);
      fill(60);
      rect(x, y, width / 6, height / 6);
    }
  }

  // Central Lines
  strokeWeight(3);
  stroke(255);
  line(0+(width*0.02), 0, width, height-(width*0.02));
  line(0, 0+(width*0.02), width-(width*0.02), height);

  // Autonomous Position Lines
  line(0, width/6, width/13, height/6);
  line(width/1.5, width, width/1.5, height/1.08);
  line(width/3, 0, width/3, height/13);
  line(width/1.08, height/1.2, width, height/1.2);
  
  // Goal Red Bottom Bump
  strokeWeight(5);
  stroke(255, 0, 0);
  line(width/6, height/1.48, width/3, height/1.48);
  line(width/3, height/1.48, width/3, height/1.2);

  // Goal Blue Bottom Bump
  strokeWeight(5);
  stroke(0, 0, 255);
  line(width/1.48, height/6, width/1.48, height/3);
  line(width/1.48, height/3, width/1.2, height/3);

  drawDiscs();
}

function drawGoals() {
  let goalSize = width*0.1;

  // Goal Poles
  stroke(255);
  strokeWeight(5);
  line(0, height/1.35, width/3.85, height);
  line(width/1.33, 0, width, height/4);

  fill(0, 0, 0, 0);
  strokeWeight(3);
  stroke(255, 0, 0);
  circle(width/12+goalSize/2, height/1.09-goalSize/2, goalSize);
  fill(255, 0, 0);
  circle(width/12+goalSize/2, height/1.09-goalSize/2, goalSize/1.7);

  fill(0, 0, 0, 0);
  strokeWeight(3);
  stroke(0, 0, 255);
  circle(width/1.09-goalSize/2, height/12+goalSize/2, goalSize);
  fill(0, 0, 255);
  circle(width/1.09-goalSize/2, height/12+goalSize/2, goalSize/1.7);
}

function drawDiscs() {
  discs.map((disc, index) => {
    disc.draw();
    disc.checkRobotCollision(robot.corners);
    disc.checkDiscsCollision();
  });
}

function handleInput() {
  if (keyIsDown(UP_ARROW)) {
    robot.driveForwards();
  } else if (keyIsDown(DOWN_ARROW)) {
    robot.driveBackwards();
  } else {
    robot.stopDrive();
  }

  if(keyIsDown(LEFT_ARROW)) {
    robot.turnLeft();
  } else if (keyIsDown(RIGHT_ARROW)) {
    robot.turnRight();
  }
  else {
    robot.stopTurn();
  }

  robot.move();
}