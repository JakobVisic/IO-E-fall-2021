// original code taken from https://editor.p5js.org/Suchista/sketches/yGa-zhTFA
// used snippets from the p5.speech example 05.continousrecognition.html found in p5.speech github
//
// CHANGES:
// - added speech recognition so that the player jumps when the word jump is said
// - unfortunately p5.speech is glitchy and reads the words twice so the player jumps twice every time
//        - to make it playable I changed the intervals of the obstacles so there is more space between the obstacles
//        - I also adjust the size of the obstacles to make it easier to time
//        - I attempted to remove the interimResult property in order to get more accurate results however this resulted in delayed jumping making the game unplayable


//*********************************************/
//* Obstacle Creation */
//*********************************************/
const flor=214;

let obs = [], pobs = [], gobs = [];
let px=64,py=230, pw=32, ph=32, pvy=0;
let gravity=1;
let oh=20, ow=10;
let ovx=4;
let spawnx=640;
let upkey = false;
const orgvx=2.5;

class Obstacle {
	constructor(X,W,H,wm,hm) {
  	this.orgx = X;
    this.x = X+random(0,X/10000);
    this.w = W+random(-wm,wm);
    this.h = H+random(-hm,hm);
    this.y = flor-this.h;
  }
}

Obstacle.prototype.ceiling = function() {
	this.h = flor-ph-4;
  this.y=0;
}

function updateObstacles() {
	for (let i=0; i<obs.length; i++) {
  	obs[i].x-=ovx;
    obs[i].orgx-=ovx;
  }
  if (obs[0].orgx+ow*ovx/(orgvx-0.5)+ow<0) {
  	obs.shift();
    obs.push(new Obstacle(spawnx*ovx/(orgvx-0.5),ow,oh,4,8));
    if (Math.floor(random(0,8))<2) {
      obs[obs.length-1].ceiling();
    }
  }
  
  for (let i=0; i<pobs.length; i++) {
  	pobs[i].x-=ovx/2;
    pobs[i].orgx-=ovx/2;
  }
  if (pobs[0].orgx+pobs[0].w+spawnx/22.5<0) {
  	pobs.shift();
    pobs.push(new Obstacle(spawnx,ow*2,oh*2,32,64));
  }
  
  for (let i=0; i<gobs.length; i++) {
  	gobs[i].x-=ovx/4;
    gobs[i].orgx-=ovx/4;
  }
  if (gobs[0].orgx+gobs[0].w+spawnx/22.5<0) {
  	gobs.shift();
    gobs.push(new Obstacle(spawnx,ow*3,oh*1.5,64,32));
  }
}


function updatePlayer() {
	pvy+=gravity;
  py+=pvy;
  if (py+ph>flor) {
  	py=flor-ph;
    pvy=0;
  }
	for (let i=0; i<obs.length; i++) {
  	if (px+pw>obs[i].x & px<obs[i].x+obs[i].w & py+ph>obs[i].y & py<obs[i].y+obs[i].h) {
    	setupScene();
    }
  }
}

//*********************************************/
//* Key functions */
//*********************************************/

function keyPressed() {
	if (keyCode==UP_ARROW) {
  	upkey=true;
  }
}

function keyReleased() {
	if (keyCode==UP_ARROW) {
  	upkey=false;
  }
}

function keyCheck() {
	if (upkey) {
  	if (py+ph==flor) {
    	pvy=-17.5;
    }
  }
}

function setupScene() {
  ovx=orgvx;
	obs = [];
  pobs = [];
  gobs = [];
  for (let i=0; i<4; i++) {
  	obs.push(new Obstacle((i+3)*600,ow,oh,1,1));
	}
  for (let i=0; i<6; i++) {
    pobs.push(new Obstacle(i*width/5,ow*2,oh*2,32,64));
  }
  for (let i=0; i<7; i++) {
    gobs.push(new Obstacle(i*width/5,ow*3,oh*1.5,64,32));
  }

}

//
var myRec = new p5.SpeechRec('en-US', parseResult); // new P5.SpeechRec object
	myRec.continuous = true; // do continuous recognition
	myRec.interimResults = true; // allow partial recognition (faster, less accurate)

//*********************************************/
//* Main Setup Function */
//*********************************************/
function setup() {
  createCanvas(640, 320);
  frameRate(60);
  setupScene();

  
  // mostRecent = "";
  myRec.onResult = parseResult; // now in the constructor
	myRec.start(); // start engine
}


//*********************************************/
//* Main Draw Function */
//*********************************************/
function draw() {
  updateObstacles();
  keyCheck();
  updatePlayer();
  ovx+=0.00225;
  
  background(160);
  stroke(128);
  fill(96);
  for (let i=0; i<gobs.length; i++) {
  	rect(gobs[i].x, gobs[i].y, gobs[i].w, gobs[i].h);
  }
  stroke(96);
  fill(64);
  for (let i=0; i<pobs.length; i++) {
  	rect(pobs[i].x, pobs[i].y, pobs[i].w, pobs[i].h);
  }
  noStroke();
  fill(0);
  for (let i=0; i<obs.length; i++) {
  	rect(obs[i].x, obs[i].y, obs[i].w, obs[i].h);
  }
  rect(0,flor,width,height);
	//stroke(255);
  rect(px,py,pw,ph);
}

//*********************************************/
//* Voice Control */
//*********************************************/
function parseResult() {

  mostRecent = myRec.resultString;
  console.log(mostRecent);

  // if jump is recorded
  if (mostRecent.indexOf("jump")!==-1) {
    // if the obstacle is on the floor, make it jump
    if (py+ph == flor) {
      pvy = -17.5;
    }
  }
 
}