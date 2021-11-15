// original letter code from https://editor.p5js.org/gizzuy/sketches/bGsY3jZ0R
// snipets of code from https://editor.p5js.org/dano/sketches/T-XASCOsa
// this is an evolution of Sprint 1: Letters
//
// EDITS:
// - Added a function that splits words into single characters and prints them out
// - Had to add capitles and some punctuation to the variables
// - removed random letter position so that the sentence could be read in sequence


// inital variables for Matter
let Engine, Composite, World, Vertices, Body, Bodies;
let font;

// creates short forms for quicker coding
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

// this creates an object that maps the letter that heard by the voiceRec into a string the letter.js function understands
var voiceToKeyMap = {
  a: "A",
  A: "A",
  hey: "A",

  b: "B",
  B: "B",
  be: "B",  // the letter B doesn't work for some reason, issue exists in original code

  c: "C",
  C: "C",
  see: "C",

  d: "D",
  d: "D",

  e: "E",
  f: "F",
  g: "G",
  h: "H",
  E: "E",
  F: "F",
  G: "G",
  H: "H",

  i: "I",
  I: "I",

  j: "J",
  J: "J",
  Jay: "J",

  k: "K",
  l: "L",
  m: "M",
  n: "N",
  K: "K",
  L: "L",
  M: "M",
  N: "N",

  o: "O",
  O: "O",
  oh: "O",
  
  p: "P",
  P: "P",

  q: "Q",
  Q: "Q",

  r: "R",
  R: "R",
  ar: "R",
  AR: "R",

  s: "S",
  t: "T",
  S: "S",
  T: "T",

  u: "U",
  U: "U",
  you: "U",
  
  v: "V",
  w: "W",
  x: "X",
  V: "V",
  W: "W",
  X: "X",

  y: "Y",
  Y: "Y",
  why: "Y",
  
  z: "Z",
  Z: "Z",
  Zedd: "Z",

  ' ': "B", // spaces are places as blanks and because B doesn't work anyway, I selected B as the blank letter
  "'": "B" // spaces are places as blanks and because B doesn't work anyway, I selected B as the blank letter
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


/**************************************/
/* SETUP FUNCTION */
/**************************************/
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

  // Initiates main function
  gotSpeech();
}

// remove bodies
function bodiesUpdate() {
  if (bodies.length > bodiesMaxLength) {
    Composite.remove(world, bodies[0].body);
    bodies.splice(0, 1);
  }
}


/**************************************/
/* DRAW FUNCTION */
/**************************************/
function draw() {
  background(255);

  // loops through all the matter.js bodies and shows them
  for (var i = 0; i < bodies.length; i++) {
      bodies[i].show();
  }

  // adds a prompt
  push();
  textSize(50);
  text("Say a short sentence", width/2, height/2);
  pop();


  // draws ground
  noStroke(255);
  fill(170);
  rectMode(CENTER);
  rect(ground.position.x, ground.position.y, myWidth, 50);
  
}

/**************************************/
/* MAIN FUNCTION THAT CREATES LETTERS */
/**************************************/
function gotSpeech() {
  // console.log(speechRec);
  let newBody;

  // function stars when recorder is finished recordign
  if (speechRec.resultValue){

    // creates a varaible with the value of what is recorded
    let said = speechRec.resultString;
    console.log(said);

    // Splits the speach into sepereate characters
    let char = said.split('');
    console.log(char);

    // Loops through all the characters and creates a letter for each
    for (let i=0; i < char.length; i++) {

      // creates a new body with letter.js
      newBody = new Letter(world, 100+ 50*i, 0, letterTemplates[voiceToKeyMap[char[i]]]);
        if (newBody.body) {
        bodies.push(newBody);
        bodiesUpdate();
      }
    }
  }
  return false;
}