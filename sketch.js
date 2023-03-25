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
]

function setup() {
  createCanvas(dimensions, dimensions);
  background(255);
}

function draw() {
  drawField();

  frameRate(60);
  
  robot.handleInput();
  goals.map((goal) => goal.draw());
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

function drawDiscs() {
  discs.map((disc, index) => {
    disc.draw();
    disc.checkRobotCollision(robot.corners);
    disc.checkDiscsCollision();
  });
}
