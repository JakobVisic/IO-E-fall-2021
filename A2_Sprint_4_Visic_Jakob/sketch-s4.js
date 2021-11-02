// Assignemtn 2 - Sprint 3
//
// https://editor.p5js.org/piecesofuk/sketches/rJxOzAKvm



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
  createCanvas(1280, 960);
  video = createCapture(VIDEO);
  video.size(width, height);




  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, {outputStride:8, quantBytes:4}, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();

  // randomLocation();

  // btn1 = new HButton(100, 200, "snare");
  asdrSetup();
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

    ellipse(pose.leftWrist.x, pose.leftWrist.y, 40, 40);

    frameRate(5);
  var aaa = pose.rightWrist.x / 1000 /2;
  var ddd = .5;
  var sss = .5;
  var rrr = .1;

  console.log(aaa);

  print(aaa,ddd,sss,rrr);
  background(255,0);
  env.setADSR(aaa, ddd, sss, rrr);
  env.setRange(1.0, 0.0);
  env.play();

  osc.freq(pose.leftWrist.y);
  
  push();
  scale(2);
  //translate(250,200);
  
  ellipseMode(CENTER);
  ellipse(100,300,10);
  
  push();
  translate(aaa*200,0);
  ellipse(100,200,10);
  pop();
  
  push();
  translate(ddd*200+aaa*200,sss*-100);
  ellipse(100,300,10);
  pop();
  
  push();
  translate(rrr*200+aaa*200+ddd*200,0);
  ellipse(100,300,10);
  pop();
  
  stroke(255);
  line(100,300,100+aaa*200,200);
  line(100+aaa*200,200,100+ddd*200+aaa*200,300+sss*-100);
  line(100+ddd*200+aaa*200,300+sss*-100,100+rrr*200+aaa*200+ddd*200,300);
  pop();

  }

  // asdr();

  // osc1 = new p5.SinOsc(); // set frequency and type  - button
  // // osc1.amp(0.5);
  // osc1.start();
  // if(
  //   mouseX > 800 &&
  //   mouseX < width 
  //   ){
  //     osc1.amp(0.5);
  //     console.log('start');
  //   }
  //   else if (
  //     mouseX < 800 ||
  //     mouseX > width 
  //   ){
  //     osc1.amp(0);
  //     console.log('stop');
  //   }
 
}

function randomLocation() {
  for (i = 0; i < 4; i++) {
      randX = 100 * i;
      randY = 100;
      let interval = i + 1;
      this["btn" + i] = new HButton(randX, randY, "block" + interval);
  }
}


function asdr() {

  // sliderA = createSlider(0, 1.0, 0.1, 0.01);
  // sliderA.position(10 * x/8, 10+y-100);
  frameRate(1);
  var aaa = pose.rightWrist.x / 1000 /2;
  var ddd = .5;
  var sss = .5;
  var rrr = .1;

  console.log(aaa);

  print(aaa,ddd,sss,rrr);
  background(255,0);
  env.setADSR(aaa, ddd, sss, rrr);
  env.setRange(1.0, 0.0);
  env.play();

  osc.freq(pose.rightWrist.y);
  
  push();
  scale(2);
  //translate(250,200);
  
  ellipseMode(CENTER);
  ellipse(100,300,10);
  
  push();
  translate(aaa*200,0);
  ellipse(100,200,10);
  pop();
  
  push();
  translate(ddd*200+aaa*200,sss*-100);
  ellipse(100,300,10);
  pop();
  
  push();
  translate(rrr*200+aaa*200+ddd*200,0);
  ellipse(100,300,10);
  pop();
  
  stroke(255);
  line(100,300,100+aaa*200,200);
  line(100+aaa*200,200,100+ddd*200+aaa*200,300+sss*-100);
  line(100+ddd*200+aaa*200,300+sss*-100,100+rrr*200+aaa*200+ddd*200,300);
  pop();
}

function asdrSetup() {
  
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
 

  // colorMode(RGB, height, height, height,height);
  noStroke();
  noFill();
  // 
  // background(0,);

  // sliderA = createSlider(0, 1.0, 0.1, 0.01);
  // sliderA.position(10 * x/8, 10+y-100);
  // sliderA.style('width', '320px');
  // sliderD = createSlider(0, 1.0, 0.1, 0.01);
  // sliderD.position(10 * x/8, 30+y-100);
  // sliderD.style('width', '320px');
  // sliderS = createSlider(0, 1.0, 0.1, 0.01);
  // sliderS.position(10 * x/8, 50+y-100);
  // sliderS.style('width', '320px');
  // sliderR = createSlider(0, 1.0, 0.1, 0.01);
  // sliderR.position(10 * x/8, 70+y-100);
  // sliderR.style('width', '320px');
  env = new p5.Envelope();
  env.setADSR(0.1,0.1,0.1,0.1);
  env.setRange(1, 0);
  
  //  'sine' (default), 'triangle', 'sawtooth', 'square'
  osc = new p5.Oscillator('sawtooth');
  osc.amp(env);
 	osc.start();
  osc.freq(440);
 }
  