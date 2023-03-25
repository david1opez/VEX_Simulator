class Disc {
    constructor(x, y, size, color=[255, 215, 0]) {
      this.x = x;
      this.y = y;
      this.angle = 0;
      this.size = size;
      this.color = color;
      this.flying = false;
    }
  
    draw(robotCorners) {
      strokeWeight(0);
      fill(this.color[0], this.color[1], this.color[2]);
      circle(this.x, this.y, this.size);

      this.checkRobotCollision(robotCorners);
      this.checkDiscsCollision();
    }
  
    checkRobotCollision(robotCorners) {
      if(this.flying) return;

      // Find the 2 nearest corners to the disc
      let nearestCorners = robotCorners.sort((a,b) => dist(a[0], a[1], this.x, this.y) - dist(b[0], b[1], this.x, this.y)).slice(0,2);
  
      // Find the nearest point on the line between the 2 nearest corners to the disc
      let nearestPoint = nearestPointOnLine(nearestCorners[0][0], nearestCorners[0][1], nearestCorners[1][0], nearestCorners[1][1], this.x, this.y);
  
      let distance = dist(this.x, this.y, nearestPoint[0], nearestPoint[1]);
  
      if(distance <= this.size/2) {
        let angle = Math.atan2(this.y - nearestPoint[1], this.x - nearestPoint[0]);
        this.x += Math.cos(angle) * 5;
        this.y += Math.sin(angle) * 5;
  
        this.x = constrain(this.x, 16.5/2, 365 - 16.5/2);
        this.y = constrain(this.y, 16.5/2, 365 - 16.5/2);
      }
    }

    checkDiscsCollision() {
      if(this.flying) return;

      for(let i = 0; i < discs.length; i++) {
        if(discs[i] != this) {
          let distance = dist(this.x, this.y, discs[i].x, discs[i].y);

          if(distance <= this.size/2 + discs[i].size/2) {
            let angle = Math.atan2(this.y - discs[i].y, this.x - discs[i].x);
            this.x += Math.cos(angle) * 2;
            this.y += Math.sin(angle) * 2;
  
            this.x = constrain(this.x, 16.5/2, 365 - 16.5/2);
            this.y = constrain(this.y, 16.5/2, 365 - 16.5/2);
          }
        }
      }
    }
  }