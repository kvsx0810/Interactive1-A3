let canvas;

let drops = [];
let snowflakes = [];
let state = {
  cirlceOPacity: 0,
  waveOffsetY: 600,
  waveHeight: 0,
};

let waveLayers = 2;
let waveDetail = 0.002;
let t = 2;
let crackEnabled = true;

let crackImg;
let crackMask;

let weatherMode = "none"; // "none", "rain", "snow"

function preload() {
  crackImg = loadImage("https://kvsx0810.github.io/Interactive1-A3/%E2%80%94Pngtree%E2%80%94cracked%20crack%20texture_5437555.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style("z-index", "-1"); // send it behind everything
  noStroke();

  crackMask = createGraphics(200, 200);
  crackMask.ellipse(100, 100, 200, 200);

  for (let i = 0; i < 100; i++) {
    drops.push(new Drop());
    snowflakes.push(new Snowflake());
  }
}

function draw() {
  background("#0A0A0A");

  drawGlowingCircle(width/2, height/2, 200);
  drawCrackOnCircle(width/2, height/2, 200);
  //drawReflection(width/2, height/2, 200);

  // weather system
  if (weatherMode === "rain") {
    for (let d of drops) {
      d.update();
      d.show();
    }
  } else if (weatherMode === "snow") {
    for (let s of snowflakes) {
      s.update();
      s.show();
    }
  }

  drawWaves();
  t += 0.01;
}

function drawGlowingCircle(x, y, r) {
  push();
  noStroke()
  drawingContext.shadowBlur = 40;
  drawingContext.shadowColor = color(245, 245, 245 ,state.cirlceOPacity);
  fill(245, 245, 245 ,state.cirlceOPacity);
  ellipse(x, y, r, r);
  pop();
}

function drawCrackOnCircle(x, y, r) {
  if (!crackEnabled) return;
  push();
  let crack = crackImg.get();
  crack.mask(crackMask);
  crack.filter(GRAY);
  tint(255, 255*state.cirlceOPacity/100);
  imageMode(CENTER);
  image(crack, x, y, r, r);
  pop();
}

function drawReflection(x, y, r) {
  push();
  translate(0, height * 0.75);
  for (let i = 0; i < 40; i++) {
    let alpha = map(i, 0, 40, 80, 0);
    let offset = noise(i * 0.1, t) * 40 - 20;
    fill(245, 245, 245, alpha);
    ellipse(x + offset, y - height * 0.25 + i * 4, r * 0.9, r * 0.3);
  }
  pop();
}

function drawWaves() {
  for (let l = 0; l < waveLayers; l++) {
    let baseY = height * 0.75 + l * 20 + state.waveOffsetY;
    let c = 200 - l * 20;
    c = constrain(c, 100, 255);

    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = "#E6E6E6";

    fill(c, c, c, 220);
    noStroke();
    beginShape();
    vertex(0, height);
    vertex(0, baseY);
    for (let x = 0; x <= width; x += 10) {
      let y = baseY + noise(x * waveDetail, t + l * 100) * state.waveHeight - state.waveHeight/2;
      vertex(x, y);
    }
    vertex(width, baseY);
    vertex(width, height);
    endShape(CLOSE);

    drawingContext.shadowBlur = 0;
  }
}

class Drop {
  constructor() { this.reset(); }
  reset() {
    this.x = random(width);
    this.y = random(-height, 0);
    this.len = random(10, 20);
    this.speed = random(8, 14);
    this.weight = random(1, 2);
    this.color = color(200, 200, 200, 180);
  }
  update() {
    this.y += this.speed;
    if (this.y > height) {
      this.reset();
      this.y = 0;
    }
  }
  show() {
    stroke(this.color);
    strokeWeight(this.weight);
    line(this.x, this.y, this.x, this.y + this.len);
  }
}

class Snowflake {
  constructor() { this.reset(); }
  
  reset() {
    this.x = random(width);
    this.y = random(-height, 0);
    this.size = random(0.3, 0.7);  // scale factor for snowflake
    this.speed = random(1, 2);
    this.angle = random(TWO_PI);
    this.drift = random(0.5, 1.0);
  }
  
  update() {
    this.y += this.speed;
    this.x += sin(this.angle) * this.drift;
    this.angle += 0.02;
    
    if (this.y > height) {
      this.reset();
      this.y = 0;
    }
  }
  
  show() {
    push();
    translate(this.x, this.y);
    scale(this.size);
    stroke(255);
    strokeWeight(1.2);
    noFill();
    
    let numArms = 6;
    let armLength = 20;   // shorter for small flakes
    let branchLength = 6;
    let branchAngle = PI / 4; // 45 degrees in radians
    
    for (let i = 0; i < numArms; i++) {
      push();
      rotate(i * (TWO_PI / numArms));  // evenly spaced arms
      line(0, 0, armLength, 0);
      
      for (let j = 0; j < 2; j++) {
        let segmentPos = armLength * (j + 1) / 3;
        
        push();
        translate(segmentPos, 0);
        rotate(branchAngle);
        line(0, 0, branchLength, 0);
        pop();
        
        push();
        translate(segmentPos, 0);
        rotate(-branchAngle);
        line(0, 0, branchLength, 0);
        pop();
      }
      pop();
    }
    pop();
  }
}


