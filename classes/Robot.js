class Robot {
    constructor(autonomous, x, y, angle, acceleration, turnAcceleration, friction, turnFriction, maxSpeed, maxTurnSpeed, brain) {
      this.size = 38; // Size of the robot
      this.x = x; // X position
      this.y = y; // Y position
      this.prevX = x; // Previous X position
      this.prevY = y; // Previous Y position
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
      this.corners = [ // Corner coords of the robot
        [this.x + this.size/2, this.y + this.size/2],
        [this.x + this.size/2, this.y - this.size/2],
        [this.x - this.size/2, this.y - this.size/2],
        [this.x - this.size/2, this.y + this.size/2]
      ];
      this.discs = 2; // Number of discs the robot has
      this.autonomous = autonomous;
      this.dead = false; // If the robot has crossed the central line
      this.brain = brain ? brain.copy() : new NeuralNetwork(70, 560, 8); // Neural network of the robot
      this.score = 0; // Score of the robot
      this.timeInSameSpot = 0;
      this.fitness = 0;
    }

    draw() {
      fill(50, 170, 70);
      strokeWeight(0);
      push();
      translate(this.x, this.y);
      rotate(this.angle);
      rectMode(CENTER);
      rect(0, 0, this.size, this.size);

      // draw a gray rectangle at the front of the robot
      fill(100);
      rect(16, 0, 5, this.size-8);

      pop();
    }

    handleInput(discs, controls) {
      let UP = controls == "WASD" ? 87 : UP_ARROW;
      let DOWN = controls == "WASD" ? 83 : DOWN_ARROW;
      let LEFT = controls == "WASD" ? 65 : LEFT_ARROW;
      let RIGHT = controls == "WASD" ? 68 : RIGHT_ARROW;

      if (keyIsDown(UP)) {
        this.driveForwards();
      } else if (keyIsDown(DOWN)) {
        this.driveBackwards();
      } else {
        this.stopDrive();
      }
    
      if(keyIsDown(LEFT)) {
        this.turnLeft();
      } else if (keyIsDown(RIGHT)) {
        this.turnRight();
      }
      else {
        this.stopTurn();
      }

      // while shift is pressed activate the robot's intaker
      if(keyIsDown(SHIFT)) {
        this.intake(discs);
      }
    
      this.move(discs);
    }

    move(discs) {
      if(this.dead) return;

      this.vx += this.ax;
      this.vt += this.at;
    
      this.vx *= this.friction;
      this.vt *= this.turnFriction;
    
      this.vx = constrain(this.vx, -this.maxSpeed, this.maxSpeed);
      this.vt = constrain(this.vt, -this.maxTurnSpeed, this.maxTurnSpeed);
    
      this.angle += this.vt;
    
      this.x += this.vx * cos(this.angle);
      this.y += this.vx * sin(this.angle);

      this.updateCornerCoords();
      this.checkWallCollisions();
      this.checkDiscCollisions(discs);
      this.checkLineCross();
      this.countTimeOnSameSpot();
      this.draw();
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

    intake(discs) {
      if(discs.length >= 3) return;

      discs.map((disc, index) => {
        if (this.checkDiscIntakeCollision(disc)) {
          this.discs++;
          this.score += 10;
          return discs.splice(index, 1);
        }
      })
    }

    shoot() {
      if(this.discs <= 0) return;
      this.discs--;
    }

    updateCornerCoords() {
      let corners = [
        rotatePoint(this.x + this.size/2, this.y + this.size/2, this.angle, this.x, this.y),
        rotatePoint(this.x + this.size/2, this.y - this.size/2, this.angle, this.x, this.y),
        rotatePoint(this.x - this.size/2, this.y - this.size/2, this.angle, this.x, this.y),
        rotatePoint(this.x - this.size/2, this.y + this.size/2, this.angle, this.x, this.y)
      ];
    
      this.corners = corners;
    }

    checkWallCollisions() {
      // Corner coordinates that are closest to the wall
      let nearestCorners = [
        this.corners[0][0], // Nearest x coord to the left
        this.corners[0][0], // Nearest x coord to the right
        this.corners[0][1], // Nearest y coord to the top
        this.corners[0][1] // Nearest y coord to the bottom
      ];

      for (let i = 0; i < nearestCorners.length; i++) {
        for (let j = 0; j < this.corners.length; j++) {
          let corner = this.corners[j][i<2 ? 0 : 1];
      
          if (i%2 === 0 ? corner < nearestCorners[i] : corner > nearestCorners[i]) {
            nearestCorners[i] = corner;
          }
        }
      }

      let offset = {
        x: [
          this.x - nearestCorners[0],
          width + (this.x - nearestCorners[1])
        ],
        y: [
          this.y - nearestCorners[2],
          height + (this.y - nearestCorners[3])
        ],
      }

      this.x = constrain(this.x, offset.x[0], offset.x[1]);
      this.y = constrain(this.y, offset.y[0], offset.y[1]);

      if(this.x == offset.x[0] || this.x == offset.x[1] || this.y == offset.y[0] || this.y == offset.y[1]) {
      }
    }

    checkDiscCollisions(discs) {
      discs.map((disc) => {
        if(disc.checkRobotCollision(this.corners)) {
          if(disc.collidingWalls[0] == 1) { // Disc is colliding with the left wall
            this.x = disc.x + disc.size/2 + this.size/2;
            // this.vx = 0;
          }

          if(disc.collidingWalls[1] == 1) { // Disc is colliding with the top wall
            this.y = disc.y + disc.size/2 + this.size/2;
            // this.vx = 0;
          }

          if(disc.collidingWalls[2] == 1) { // Disc is colliding with the right wall
            this.x = disc.x - disc.size/2 - this.size/2;
            // this.vx = 0;
          }

          if(disc.collidingWalls[3] == 1) { // Disc is colliding with the bottom wall
            this.y = disc.y - disc.size/2 - this.size/2;
            // this.vx = 0;
          }
        }
      })
    }

    checkDiscIntakeCollision(disc) {
      let frontOfRobot = rotatePoint(this.x + 14, this.y, this.angle, this.x, this.y);
      let distance = dist(frontOfRobot[0], frontOfRobot[1], disc.x, disc.y);

      let intakeCollision = distance < this.size/2 + disc.size/2;

      return intakeCollision;
    }

    checkLineCross() {
      let lines = [
        [this.corners[0][0], this.corners[0][1], this.corners[1][0], this.corners[1][1]],
        [this.corners[1][0], this.corners[1][1], this.corners[2][0], this.corners[2][1]],
        [this.corners[2][0], this.corners[2][1], this.corners[3][0], this.corners[3][1]],
        [this.corners[3][0], this.corners[3][1], this.corners[0][0], this.corners[0][1]]
      ]

      let centralLine = [7.3, 0, 365, 357.7];

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let intersect = linesIntersect(line, centralLine);

        if (intersect) {
          this.dead = true
        };
      }
    }

    think(discs) {
      let inputs = [
        this.x/365,
        this.y/365,
        this.prevX/365,
        this.prevY/365,
        this.angle/365,
        this.discs/3
      ];

      for (let i = 0; i < 30; i++) {
        if(discs[i]) {
          inputs.push(discs[i].x/365);
          inputs.push(discs[i].y/365);
        } else {
          inputs.push(0);
          inputs.push(0);
        }
      }

      let centralLine = [7.3, 0, 365, 357.7];

      centralLine.map((coord) => inputs.push(coord/365));

      let output = this.brain.predict(inputs); // [forwards, backwards, left, right, stop, intake, shooting]

      if(output[0] > 0.5) {
        this.driveForwards();
        // console.log("forwards")
      }

      if(output[1] > 0.6) {
        this.driveBackwards();
        // console.log("backwards")
      }

      if(output[2] > 0.5) {
        this.turnLeft();
        // console.log("turn left")
      }

      if(output[3] > 0.5) {
        this.turnRight();
        // console.log("turn right")
      }

      if(output[4] > 0.5) {
        this.stopDrive();
        // console.log("stop drive")
      }

      if(output[5] > 0.5) {
        this.stopTurn();
        // console.log("stop turn")
      }

      if(output[6] > 0.7) {
        this.intake(discs);
        // console.log("intake");
      }

      if(output[7] > 0.7) {
        this.shoot();
        // console.log("shoot");
      }

      this.move(discs);
    }

    countTimeOnSameSpot() {
      if (this.x === this.prevX && this.y === this.prevY) {
        this.timeOnSameSpot++;
      } else {
        this.timeOnSameSpot = 0;
      }

      this.prevX = this.x;
      this.prevY = this.y;

      if(this.timeOnSameSpot > 100) {
        this.dead = true;
      }
    }

    mutate(rate) {
      this.brain.mutate(rate);
    }
  }