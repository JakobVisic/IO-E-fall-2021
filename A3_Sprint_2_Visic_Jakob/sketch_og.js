let Engine, Composite, World, Vertices, Body, Bodies;
let font;
function preload() {
  Engine = Matter.Engine,
  Composite = Matter.Composite,
  World = Matter.World,
  Vertices = Matter.Vertices,
  Bodies = Matter.Bodies,
  Body = Matter.Body;
  font = loadFont('assets/SFNSDisplayCondensed-Black.otf');
}

let bounds;
let engine;
let world;
let ground;
var lut = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var letterToKeyMap = {
  65: "A",
  66: "B",
  67: "C",
  68: "D",
  69: "E",
  70: "F",
  71: "G",
  72: "H",
  73: "I",
  74: "J",
  75: "K",
  76: "L",
  77: "M",
  78: "N",
  79: "O",
  80: "P",
  81: "Q",
  82: "R",
  83: "S",
  84: "T",
  85: "U",
  86: "V",
  87: "W",
  88: "X",
  89: "Y",
  90: "Z"
};
var letterTemplates = {};
var bodies = [];
var bodiesMaxLength = 100;
var myWidth;
var myHeight;
var input;
var grav;
var theta;
var fps = 30;

function setup() {

  // create canvas 
  myWidth = windowWidth;
  myHeight = windowHeight;
  createCanvas(myWidth, myHeight);

  // setup frame rate
  frameRate(fps);
  ccapture_ctx = new Ccapture_context(fps);
  done = false;

  // input for mobile
  input = createInput('type here on mobile');
  input.size(105)
       .position(5, 0);

  // create world
  engine = Engine.create();
  world = engine.world;

  // create letter templates
  for (var i = 0; i < lut.length; i++) {
    letterTemplates[lut[i]] = font.textToPoints(lut[i], 0, 0, 10, {
      sampleFactor: 5,
      simplifyThreshold: 0
    });
    letterTemplates[lut[i]] = new LetterTemplate(letterTemplates[lut[i]]);
  }

  // create ground
  ground = Bodies.rectangle(myWidth/2, myHeight, myWidth, 50, { isStatic: true });
  World.add(world, ground);
  Engine.run(engine);
  grav = HALF_PI;
  theta = QUARTER_PI * 0.125;
}

// remove bodies
function bodiesUpdate() {
  if (bodies.length > bodiesMaxLength) {
    Composite.remove(world, bodies[0].body);
    bodies.splice(0, 1);
  }
}

var prevMouseX;
var prevMouseY;
/*
function mouseClicked() {
}
*/
function mousePressed(event) {
  prevMouseX = event.x;
  prevMouseY = event.y;
}

function mouseReleased(event) {
  var newBody;
  var mouseX = event.x;
  var mouseY = event.y;
  while (true) {
    newBody = new Letter(world, mouseX, mouseY, letterTemplates[lut[floor(random(lut.length))]]);
    if (newBody.body) {
      break;
    }
  }
  bodies.push(newBody);
  bodiesUpdate();
  var targetAngle = Matter.Vector.angle(newBody.body.position, {
    x: prevMouseX,
    y: prevMouseY
  });
  var force = map((mouseX - prevMouseX) * (mouseX - prevMouseX) + (mouseY - prevMouseY) * (mouseY - prevMouseY), 0, myWidth * myWidth + myHeight * myHeight, 0, 0.5);

  Body.applyForce(newBody.body, newBody.body.position, {
    x: cos(targetAngle) * force / 2, 
    y: sin(targetAngle) * force
  });
}

function touchStarted() {
  prevMouseX = mouseX;
  prevMouseY = mouseY;
}

function touchEnded() {
  return mouseReleased({x: mouseX, y: mouseY});
}

function mouseDragged() {
  //return mouseClicked();
  return false;
}

function keyPressed() {
  var newBody;
  if (keyCode in letterToKeyMap) {
    newBody = new Letter(world, random(50,myWidth-50), 0, letterTemplates[letterToKeyMap[keyCode]]);
    if (newBody.body) {
      bodies.push(newBody);
      bodiesUpdate();
    }
  }
  return false;
}

function draw() {
  background(255);
  if (!ccapture_ctx.capturer) {
    //ccapture_ctx.btn.click(); //start recording automatically
  }
  if (done) {
    noLoop();
    //ccapture_ctx.btn.click(); //stop recording automatically
    return;
  }

  for (var i = 0; i < bodies.length; i++) {
      bodies[i].show();
  }
/*
  if (frameCount % 10 == 0) {
    grav += theta;
    if (grav > TWO_PI) {
      grav -= TWO_PI;
    }
    engine.world.gravity.x = cos(grav);
    engine.world.gravity.y = sin(grav);
  }
  */
  noStroke(255);
  fill(170);
  rectMode(CENTER);
  rect(ground.position.x, ground.position.y, myWidth, 50);
  
  if (ccapture_ctx.capturer) {
    ccapture_ctx.capturer.capture(document.getElementById('defaultCanvas0'));
  }
}