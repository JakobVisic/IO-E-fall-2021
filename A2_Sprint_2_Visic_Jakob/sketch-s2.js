// Assignemtn 2 - Sprint 2
//
// Used nose to control filter cuttoff and frequency




/* ===
ml5 Example
PoseNet example using p5.js
=== */

let video;
let poseNet;
let poses = [];
let skeletons = [];

let pg;
let pNoseX;
let pNoseY;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  pixelDensity(1);
  pg = createGraphics(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, {outputStride:8, quantBytes:4}, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function mousePressed(){
  console.log(JSON.stringify(poses))
}

////
//// OSCILATOR SOUNDS
////

lowCut = new p5.LowPass();

osc1 = new p5.SinOsc(); // set frequency and type  - button
osc1.amp(.6);

osc1.start();

osc1.disconnect();                    //stops the osc from directly playing
osc1.connect(lowCut);     


////
//// Main Draw Function
////
function draw() {
  // mirrors movement
  // push();
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);
    // image(pg, 0, 0, width, height);
  // pop();


 

  strokeWeight(2);

  // drawKeypoints();
  // drawSkeleton();
  // For one pose only (use a for loop for multiple poses!)
  if (poses.length > 0) {
    const pose = poses[0].pose;
      console.log(pose);

    // Create a pink ellipse for the nose
    fill(213, 0, 143);
    const nose = pose.nose;
    ellipse(nose.x, nose.y, 20, 20);

    
    // filter
    let fillFreq = map(nose.x, width/2 - 400, width/2 + 400, 20, 1320);
    fillFreq = constrain(fillFreq, 0, 1320);
    lowCut.freq(fillFreq);
    // filter resolution
    let resWidth = map(nose.y, height/2 - 400, height/2 + 400, 0, 200);
    lowCut.res(resWidth);
    resWidth = constrain(resWidth, 0, 200);

    // // Create a yellow ellipse for the right eye
    // fill(255, 215, 0);
    // const rightEye = pose.rightEye;
    // ellipse(rightEye.x, rightEye.y, 20, 20);

    // // Create a yellow ellipse for the right eye
    // fill(255, 215, 0);
    // const leftEye = pose.leftEye;
    // ellipse(leftEye.x, leftEye.y, 20, 20);
      
    // fill(0,255,0);
    //   const rightShoulder = pose.rightShoulder;
    // ellipse(rightShoulder.x, rightShoulder.y, 20, 20 );  
  }

   //// Frequency Filter
  
}

