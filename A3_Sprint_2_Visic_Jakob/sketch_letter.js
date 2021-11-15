// original letter code from https://editor.p5js.org/gizzuy/sketches/bGsY3jZ0R
//
// EDITS:
// - Added a function that adds the letter that you say
// - Sometimes speech recognizes letters as words so multiple variable had to be created for many letters (example: hey = a, see = c)
// - added a prompt

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

var voiceToKeyMap = {
  a: "A",
  hey: "A",

  b: "B",
  be: "B",  // the letter B doesn't work for some reason, issue exists in original code

  c: "C",
  see: "C",

  d: "D",

  e: "E",
  f: "F",
  g: "G",
  h: "H",

  i: "I",
  I: "I",

  j: "J",
  Jay: "J",

  k: "K",
  l: "L",
  m: "M",
  n: "N",

  o: "O",
  oh: "O",
  
  p: "P",
  q: "Q",

  r: "R",
  ar: "R",
  AR: "R",

  s: "S",
  t: "T",

  u: "U",
  you: "U",
  
  v: "V",
  w: "W",
  x: "X",

  y: "Y",
  why: "Y",
  
  z: "Z",
  Z: "Z",
  Zedd: "Z"
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

  // Create a Speech Recognition object with callback
  speechRec = new p5.SpeechRec('en-US', gotSpeech);
  // "Continuous recognition" (as opposed to one time only)
  let continuous = true;
  // If you want to try partial recognition (faster, less accurate)
  let interimResults = false;
  // This must come after setting the properties
  speechRec.start(continuous, interimResults);

  gotSpeech();
}

// remove bodies
function bodiesUpdate() {
  if (bodies.length > bodiesMaxLength) {
    Composite.remove(world, bodies[0].body);
    bodies.splice(0, 1);
  }
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

  // adds a prompt
  push();
  textSize(50);
  text("Say a single letter", width/2, height/2);
  pop();



  noStroke(255);
  fill(170);
  rectMode(CENTER);
  rect(ground.position.x, ground.position.y, myWidth, 50);
  
  if (ccapture_ctx.capturer) {
    ccapture_ctx.capturer.capture(document.getElementById('defaultCanvas0'));
  }
}

function gotSpeech() {
  // console.log(speechRec);
  var newBody;
  if (speechRec.resultValue){
    let said = speechRec.resultString;
    console.log(said);
    newBody = new Letter(world, random(50,myWidth-50), 0, letterTemplates[voiceToKeyMap[said]]);
    if (newBody.body) {
      bodies.push(newBody);
      bodiesUpdate();
    }
  }
  return false;
}