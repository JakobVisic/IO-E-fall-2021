// Assignemtn 2 - Sprint 3
//
// https://editor.p5js.org/piecesofuk/sketches/rJxOzAKvm



/* ===
ml5 Example
PoseNet example using p5.js
=== */

var Engine = Matter.Engine,
  //    Render = Matter.Render,
  World = Matter.World,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Bodies = Matter.Bodies;

let engine;
let world;
let boxes = [];
let circles = [];
let grounds = [];
let mConstraint;


let sizes = [5, 10, 20, 30, 40];

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

  engine = Engine.create();
  world = engine.world;

  // grounds.push(new Boundary(0, height / 2, 10, height));
  // grounds.push(new Boundary(width, height / 2, 10, height));
  // grounds.push(new Boundary(200, 0, width, 10));
  grounds.push(new Boundary(width/2, height, width, 10));
  World.add(world, grounds);

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


let count = 0;

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

  // if (frameCount % 5 === 0) {
  //   print (++count);
  //   let size = random(sizes);
  //   if (random() < 0.5) {
  //     boxes.push(new Box(width / 2, 80, size, size));
  //   } else {
  //     circles.push(new Circle(width / 2, 80, size / 2));
  //   }
  // }
  Engine.update(engine);
  for (let box of boxes) {
    box.show();
  }
  for (let circle of circles) {
    circle.show();
  }
  for (let ground of grounds) {
    ground.show();
  }


  if (poses.length > 0) {
    const pose = poses[0].pose;
      console.log(pose);

    // Create a pink ellipse for the nose
    // fill(213, 0, 143);
    // const nose = pose.nose;
    // ellipse(nose.x, nose.y, 20, 20);
    // circles.push(new Circle(nose.x, 5, 5));



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

    fill(50,50,255,150);
    ellipse(pose.rightWrist.x, pose.rightWrist.y, 40, 40);
    circles.push(new Circle(pose.rightWrist.x, pose.rightWrist.y, 1));
    ellipse(pose.leftWrist.x, pose.leftWrist.y, 40, 40);
    circles.push(new Circle(pose.leftWrist.x, pose.leftWrist.y, 1));

  }

   //// Frequency Filter
  
}

