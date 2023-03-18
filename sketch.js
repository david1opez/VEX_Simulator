let dimensions = 365;
let robotSize = 38;
let discSize = dimensions*0.045;

class Robot {
  constructor(dimensions, x, y, angle, acceleration, turnAcceleration, friction, turnFriction, maxSpeed, maxTurnSpeed) {
    this.dimensions = dimensions;
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.ax = 0; // Acceleration
    this.at = 0; // Turn acceleration
    this.vx = 0; // Velocity
    this.vt = 0; // Turn velocity
    this.acceleration = acceleration; // How much can the robot accelerate per frame
    this.turnAcceleration = turnAcceleration; // How much can the robot accelerate per frame
    this.friction = friction; // How much friction is applied to the robot
    this.turnFriction = turnFriction; // How much friction is applied to the robot when turning
    this.maxSpeed = maxSpeed; // Maximum speed of the robot
    this.maxTurnSpeed = maxTurnSpeed; // Maximum turn speed of the robot
  }

  driveForwards() {
    this.ax = this.acceleration;
  }

  driveBackwards() {
    this.ax = -this.acceleration;
  }

  turnLeft() {
    this.at = -this.turnAcceleration;
  }

  turnRight() {
    this.at = this.turnAcceleration;
  }

  stopDrive() {
    this.ax = 0;
  }

  stopTurn() {
    this.at = 0;
  }
}

class Disc {
  constructor(x, y, size, color=[255, 215, 0]) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.size = size;
    this.color = color;
  }

  draw() {
    strokeWeight(0);
    fill(this.color[0], this.color[1], this.color[2]);
    circle(this.x, this.y, this.size);
  }

  checkCollision() {
    let distance = dist(this.x, this.y, robot.x, robot.y);
    if (distance < this.size/2 + robot.dimensions/2) {
      // push the disc
      let angle = atan2(this.y - robot.y, this.x - robot.x);
      this.x += cos(angle) * 2;
      this.y += sin(angle) * 2;

      this.x = constrain(this.x, discSize/2, dimensions-discSize/2);
      this.y = constrain(this.y, discSize/2, dimensions-discSize/2);

      // Check collisions with other discs
      discs.map(disc => {
        if (disc != this) {
          let distance = dist(this.x, this.y, disc.x, disc.y);
          if (distance < this.size/2 + disc.size/2) {
            // push the disc
            let angle = atan2(this.y - disc.y, this.x - disc.x);
            this.x += cos(angle) * 2;
            this.y += sin(angle) * 2;
          }
        }
      });
    }
  }
}

let robot = new Robot(robotSize, x=100, y=10, ang=0, acc=0.5, tAcc=0.01, f=0.85, tf=0.85, maxSp=10, maxTSp=0.1);

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

let discs = discsCords.map(([x,y]) => new Disc(x,y, discSize));

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
  drawGoals();
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
    disc.checkCollision();
  });
}

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

  moveRobot();
}

function rotatePoint(x, y, angle, originX, originY) {
  let newX = (x - originX) * cos(angle) - (y - originY) * sin(angle) + originX;
  let newY = (x - originX) * sin(angle) + (y - originY) * cos(angle) + originY;
  
  return [newX, newY];
}

function moveRobot() {
  robot.vx += robot.ax;
  robot.vt += robot.at;

  robot.vx *= robot.friction;
  robot.vt *= robot.turnFriction;

  robot.vx = constrain(robot.vx, -robot.maxSpeed, robot.maxSpeed);
  robot.vt = constrain(robot.vt, -robot.maxTurnSpeed, robot.maxTurnSpeed);

  robot.angle += robot.vt;

  robot.x += robot.vx * cos(robot.angle);
  robot.y += robot.vx * sin(robot.angle);

  checkWallCollisions();
  drawRobot();
  drawGoals();
}

function checkWallCollisions() {
  let corners = [
    rotatePoint(robot.x + robot.dimensions/2, robot.y + robot.dimensions/2, robot.angle, robot.x, robot.y),
    rotatePoint(robot.x + robot.dimensions/2, robot.y - robot.dimensions/2, robot.angle, robot.x, robot.y),
    rotatePoint(robot.x - robot.dimensions/2, robot.y - robot.dimensions/2, robot.angle, robot.x, robot.y),
    rotatePoint(robot.x - robot.dimensions/2, robot.y + robot.dimensions/2, robot.angle, robot.x, robot.y)
  ];

  // Corner's coordinates that are closest to the wall
  let nearestCorners = [
    corners[0][0], // Nearest x coord to the left
    corners[0][0], // Nearest x coord to the right
    corners[0][1], // Nearest y coord to the top
    corners[0][1] // Nearest y coord to the bottom
  ];

  for (let i = 0; i < nearestCorners.length; i++) {
    for (let j = 0; j < corners.length; j++) {
      let corner = corners[j][i<2 ? 0 : 1];
  
      if (i%2 === 0 ? corner < nearestCorners[i] : corner > nearestCorners[i]) {
        nearestCorners[i] = corner;
      }
    }
  }

  let offset = {
    x: [
      robot.x - nearestCorners[0],
      width + (robot.x - nearestCorners[1])
    ],
    y: [
      robot.y - nearestCorners[2],
      height + (robot.y - nearestCorners[3])
    ],
  }

  robot.x = constrain(robot.x, offset.x[0], offset.x[1]);
  robot.y = constrain(robot.y, offset.y[0], offset.y[1]);
}
