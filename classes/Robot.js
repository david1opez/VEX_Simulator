class Robot {
    constructor(x, y, angle, acceleration, turnAcceleration, friction, turnFriction, maxSpeed, maxTurnSpeed) {
      this.size = 38; // Size of the robot
      this.x = x; // X position
      this.y = y; // Y position
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
      this.brain = new NeuralNetwork(63, 80, 7); // Neural network of the robot
      this.score = 0; // Score of the robot
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
      rect(14, 0, 10, this.size-8);

      pop();
    }

    handleInput(discs) {
      if (keyIsDown(UP_ARROW)) {
        this.driveForwards();
      } else if (keyIsDown(DOWN_ARROW)) {
        this.driveBackwards();
      } else {
        this.stopDrive();
      }
    
      if(keyIsDown(LEFT_ARROW)) {
        this.turnLeft();
      } else if (keyIsDown(RIGHT_ARROW)) {
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
      this.vx += this.ax;
      this.vt += this.at;
    
      this.vx *= this.friction;
      this.vt *= this.turnFriction;
    
      this.vx = constrain(this.vx, -this.maxSpeed, robot.maxSpeed);
      this.vt = constrain(this.vt, -this.maxTurnSpeed, robot.maxTurnSpeed);
    
      this.angle += this.vt;
    
      this.x += this.vx * cos(this.angle);
      this.y += this.vx * sin(this.angle);

      this.updateCornerCoords();
      this.checkWallCollisions();
      this.checkDiscCollisions(discs);
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
      return distance < this.size/2 + disc.size/2;
    }

    intake(discs) {
      // if the disc is touching the front of the robot, add it to the robot's inventory
      discs.map((disc) => {
        if (this.checkDiscIntakeCollision(disc)) {
          disc.x = this.x;
          disc.y = this.y;
          disc.vx = 0;
          disc.vy = 0;
          disc.ax = 0;
          disc.ay = 0;
        }
      })
    }

    think(discs) {
      let inputs = [
        this.x,
        this.y,
        this.angle,
      ];

      discs.map((disc) => {
        inputs.push(disc.x);
        inputs.push(disc.y);
      })

      console.log(inputs)

      let output = this.brain.predict(inputs); // [forwards, backwards, left, right, stop, intake, shooting]

      if(output[0] > 0.6) {
        this.driveForwards();
      }

      if(output[1] > 0.6) {
        this.driveBackwards();
      }

      if(output[2] > 0.6) {
        this.turnLeft();
      }

      if(output[3] > 0.6) {
        this.turnRight();
      }

      if(output[4] > 0.6) {
        this.stopDrive();
        this.stopTurn();
      }

      if(output[5] > 0.6) {
        this.intake(discs);
      }

      this.move(discs);
    }
  }