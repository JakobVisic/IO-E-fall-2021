// Assignemtn 2 - Sprint 1
//
// Added a line that follows the nose
// This was taken from a previous project I have completed
// To change it i 

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

function draw() {
  // mirrors movement
  push();
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);
    image(pg, 0, 0, width, height);
  pop();

  strokeWeight(2);

  drawKeypoints();
  // drawSkeleton();
  // For one pose only (use a for loop for multiple poses!)
  // if (poses.length > 0) {
  //   const pose = poses[0].pose;
  //     console.log(pose);

  //   // Create a pink ellipse for the nose
  //   fill(213, 0, 143);
  //   const nose = pose.nose;
  //   ellipse(nose.x, nose.y, 20, 20);

  //   // Create a yellow ellipse for the right eye
  //   fill(255, 215, 0);
  //   const rightEye = pose.rightEye;
  //   ellipse(rightEye.x, rightEye.y, 20, 20);

  //   // Create a yellow ellipse for the right eye
  //   fill(255, 215, 0);
  //   const leftEye = pose.leftEye;
  //   ellipse(leftEye.x, leftEye.y, 20, 20);
      
  //   fill(0,255,0);
  //     const rightShoulder = pose.rightShoulder;
  //   ellipse(rightShoulder.x, rightShoulder.y, 20, 20 );  
  // }
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < min(poses.length, 1); i++) {
      // For each pose detected, loop through all the keypoints
      for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
          // A keypoint is an object describing a body part (like rightArm or leftShoulder)
          let keypoint = poses[i].pose.keypoints[j];
          // Only draw an ellipse is the pose probability is bigger than 0.2
          if (keypoint.score > 0.2) {
              if (j == 0) {
                  noseX = keypoint.position.x;
                  noseY = keypoint.position.y;

                  let r = random(50,255);
                  let g = random(50,255);
                  let b = random(50,255);

                  pg.stroke(r, g, b, 100);
                  pg.strokeWeight(5);
                  pg.line(noseX, noseY, pNoseX, pNoseY);

                  pNoseX = noseX;
                  pNoseY = noseY;
              }
          }
      }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
      // For every skeleton, loop through all body connections
      for (let j = 0; j < poses[i].skeleton.length; j++) {
          let partA = poses[i].skeleton[j][0];
          let partB = poses[i].skeleton[j][1];
          stroke(255, 0, 0, 100);
          line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
      }
  }
}

// The callback that gets called every time there's an update from the model
function gotPoses(results) {
  poses = results;
}

function keyPressed() {
  pg.clear();
}

function modelReady() {
  select('#status').html('model Loaded');
}