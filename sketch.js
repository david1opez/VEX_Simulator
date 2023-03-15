let dimensions = 365;
let robotSize = 38;

let robot = {
  dimensions: robotSize,
  x: 0,
  y: 0,
  angle: 0,
  ax: 0, // Acceleration
  at: 0, // Turn acceleration
  vx: 0, // Velocity
  vt: 0, // Turn velocity
  acceleration: 0.5, // How much can the robot accelerate per frame
  turnAcceleration: 0.01, // How much can the robot accelerate per frame
  friction: 0.85, // How much friction is applied to the robot
  turnFriction: 0.85, // How much friction is applied to the robot when turning
  maxSpeed: 10, // Maximum speed of the robot
  maxTurnSpeed: 0.1, // Maximum turn speed of the robot
}

let bumpers = [
  {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
  {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
  {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
  {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
]

function setup() {
  createCanvas(dimensions, dimensions);
  background(255);
}

function draw() {
  drawField();

  frameRate(60);
  handleInput();
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

  // Goal Poles
  strokeWeight(5);
  line(0, height/1.35, width/3.85, height);
  line(width/1.33, 0, width, height/4);
  
  // Goal Red Bottom Bump
  strokeWeight(5);
  stroke(255, 0, 0);
  line(width/6, height/1.48, width/3, height/1.48);
  line(width/3, height/1.48, width/3, height/1.2);

  bumpers[0] = {
    x: (width/3+width/6)/2,
    y: height/1.48,
    width: dist(width/3, height/1.48, width/6, height/1.48),
    height: 5,
  }

  bumpers[1] = {
    x: width/3,
    y: (height/1.48+height/1.2)/2,
    width: 5,
    height: dist(height/1.48, width/3, height/1.2, width/3),
  }

  // Goal Blue Bottom Bump
  strokeWeight(5);
  stroke(0, 0, 255);
  line(width/1.48, height/6, width/1.48, height/3);
  line(width/1.48, height/3, width/1.2, height/3);

  bumpers[2] = {
    x: (width/1.48+width/1.2)/2,
    y: height/3,
    width: dist(width/1.48, height/3, width/1.2, height/3),
    height: 5,
  }

  bumpers[3] = {
    x: width/1.48,
    y: (height/3+height/6)/2,
    width: 5,
    height: dist(height/3, width/1.48, height/6, width/1.48),
  }

  drawGoals();
  drawDiscs();
}

function drawGoals() {
  let goalSize = width*0.1;

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
  let discSize = width*0.045;

  let discsCords = [
    [width/12, width/12],
    [width/6, width/6],
    [width/4, width/4],
    [width/3, width/3],
    [width/2.4, width/2.4],
    [width/1.72, width/1.72],
    [width/1.5, width/1.5],
    [width/1.335, width/1.335],
    [width/1.2, width/1.2],
    [width/1.09, width/1.09],

    [width/2.4, width/4],
    [width/2, width/3],
    [width/1.72, width/2.4],
    [width/1.335, width/1.72],

    [width/4, width/2.4],
    [width/2.4, width/1.72],
    [width/1.99, width/1.5],
    [width/1.72, width/1.335],

    [width/6+discSize/2, width/1.5-discSize/2],
    [width/4.4+discSize/2, width/1.5-discSize/2],
    [width/3.5+discSize/2, width/1.5-discSize/2],
    [width/2.9+discSize/2, width/1.4-discSize/2],
    [width/2.9+discSize/2, width/1.293-discSize/2],
    [width/2.9+discSize/2, width/1.2-discSize/2],

    [width/1.5-discSize/2, width/6+discSize/2],
    [width/1.5-discSize/2, width/4.4+discSize/2],
    [width/1.5-discSize/2, width/3.5+discSize/2],
    [width/1.4-discSize/2, width/2.9+discSize/2],
    [width/1.293-discSize/2, width/2.9+discSize/2],
    [width/1.2-discSize/2, width/2.9+discSize/2],
  ];

  fill(255, 215, 0);
  strokeWeight(0);

  discsCords.map(([x,y]) => {
    circle(x, y, discSize);
  })
}

let startingPoint = 1;

function drawRobot() {
  fill(50, 170, 70);
  strokeWeight(0);
  push();
  translate(robot.x, robot.y);
  rotate(robot.angle);
  rectMode(CENTER);
  rect(0, 0, robot.dimensions, robot.dimensions);
  pop();
}

function handleInput() {
  if (keyIsDown(UP_ARROW)) {
    robot.ax = robot.acceleration;
  } else if (keyIsDown(DOWN_ARROW)) {
    robot.ax = -robot.acceleration;
  } else {
    robot.ax = 0;
  }

  if(keyIsDown(LEFT_ARROW)) {
    robot.at = -robot.turnAcceleration;
  } else if (keyIsDown(RIGHT_ARROW)) {
    robot.at = robot.turnAcceleration;
  }
  else {
    robot.at = 0;
  }

  moveRobot();
}

function moveRobot() {
  robot.vx += robot.ax;
  robot.vt += robot.at;

  robot.vx *= robot.friction;
  robot.vt *= robot.turnFriction;

  robot.vx = constrain(robot.vx, -robot.maxSpeed, robot.maxSpeed);
  robot.vt = constrain(robot.vt, -robot.maxTurnSpeed, robot.maxTurnSpeed);

  robot.x += robot.vx * cos(robot.angle);
  robot.y += robot.vx * sin(robot.angle);

  // constrain robot to the canvas
  robot.x = constrain(robot.x, robotSize/2, width-robotSize/2);
  robot.y = constrain(robot.y, robotSize/2, height-robotSize/2);

  robot.angle += robot.vt;

  checkCollision();

  drawRobot();
}

function checkCollision() {
  // Get the distance between the robot and the bumper
  let d = dist(robot.x, robot.y, bumpers[0].x, bumpers[1].y);

  // Check if the distance is less than their two radii (an overlap)
  if (d < robot.dimensions/2 + bumpers[0].width/2) {
    // Undo the last move
    robot.x -= robot.vx * cos(robot.angle);
    robot.y -= robot.vx * sin(robot.angle);

    robot.vx = 0;
    robot.vy = 0;
    robot.ax = 0;
    robot.ay = 0;
  }
}
