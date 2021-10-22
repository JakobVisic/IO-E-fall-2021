/*
October 2021 - Jakob Visic
- removed shapes and sound
- replaced with ASDR
- plays a sound every frame
- potentiometer controls the Attack
- light sensor controlls the Decay and Sustain
- the button adds a slight release tail


*/







/* 
August 2019 - Doug Whitton 
play 3 analog sensors that output sound and circle graphic
The Arduino file that's running is "threeSensorExample"
*/

const barWidth = 20;
var lastBar = -1;
var sliderB;
var sliderA;

let osc;
let playing = false;
let serial;
let latestData = "waiting for data";  // you'll use this to write incoming data to the canvas
let splitter;
let diameter0 = 0, diameter1 = 0, diameter2 = 0;

let osc1, osc2, osc3, fft, lowCut;



function setup() {
  
  var canvas = createCanvas(800, 800);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  canvas.position(x,y);


  


///////////////////////////////////////////////////////////////////
    //Begin serialport library methods, this is using callbacks
///////////////////////////////////////////////////////////////////    
    

  // Instantiate our SerialPort object
  serial = new p5.SerialPort();

  // Get a list the ports available
  // You should have a callback defined to see the results
  serial.list();
  console.log("serial.list()   ", serial.list());

  //////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////
  // Assuming our Arduino is connected, let's open the connection to it
  // Change this to the name of your arduino's serial port
  serial.open("/dev/tty.usbmodem1411101");
 /////////////////////////////////////////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////
 ////////////////////////////////////////////////////////////////////////////
  // Here are the callbacks that you can register

  // When we connect to the underlying server
  serial.on('connected', serverConnected);

  // When we get a list of serial ports that are available
  serial.on('list', gotList);
  // OR
  //serial.onList(gotList);

  // When we some data from the serial port
  serial.on('data', gotData);
  // OR
  //serial.onData(gotData);

  // When or if we get an error
  serial.on('error', gotError);
  // OR
  //serial.onError(gotError);

  // When our serial port is opened and ready for read/write
  serial.on('open', gotOpen);
  // OR
  //serial.onOpen(gotOpen);

  // Callback to get the raw data, as it comes in for handling yourself
  //serial.on('rawdata', gotRawData);
  // OR
  //serial.onRawData(gotRawData);
  asdrSetup();
 
}
////////////////////////////////////////////////////////////////////////////
// End serialport callbacks
///////////////////////////////////////////////////////////////////////////

// filter
lowCut = new p5.LowPass();

osc1 = new p5.SinOsc(); // set frequency and type  - button
osc1.amp(0);
osc2 = new p5.SqrOsc(); // set frequency and type  - potentiometer
osc2.amp(0);  
osc3 = new p5.TriOsc(); // set frequency and type  - light
osc3.amp(0);    

fft = new p5.FFT();
osc1.start();
osc2.start(); 
osc3.start();


// 'wire' oscillators through filter
osc1.disconnect();                    //stops the osc from directly playing
osc1.connect(lowCut);                 //sends it through the filter to be played 
osc2.disconnect();
osc2.connect(lowCut);
osc3.disconnect();
osc3.connect(lowCut);

// We are connected and ready to go
function serverConnected() {
  console.log("Connected to Server");
}

// Got the list of ports
function gotList(thelist) {
  console.log("List of Serial Ports:");
  // theList is an array of their names
  for (var i = 0; i < thelist.length; i++) {
    // Display in the console
    console.log(i + " " + thelist[i]);
  }
}

// Connected to our serial device
function gotOpen() {
  console.log("Serial Port is Open");
}

// Ut oh, here is an error, let's log it
function gotError(theerror) {
  console.log(theerror);
}



// There is data available to work with from the serial port
function gotData() {
  var currentString = serial.readLine();  // read the incoming string
  trim(currentString);                    // remove any trailing whitespace
  if (!currentString) return;             // if the string is empty, do no more
  console.log("currentString  ", currentString);             // println the string
  latestData = currentString;            // save it for the draw method
  console.log("latestData" + latestData);   //check to see if data is coming in
  splitter = split(latestData, ',');       // split each number using the comma as a delimiter
  //console.log("splitter[0]" + splitter[0]); 
  diameter0 = splitter[0];                 //put the first sensor's data into a variable
  diameter1 = splitter[1];
  diameter2 = splitter[2]; 



}

// We got raw data from the serial port
function gotRawData(thedata) {
  println("gotRawData" + thedata);
}

// Methods available
// serial.read() returns a single byte of data (first in the buffer)
// serial.readChar() returns a single char 'A', 'a'
// serial.readBytes() returns all of the data available as an array of bytes
// serial.readBytesUntil('\n') returns all of the data available until a '\n' (line break) is encountered
// serial.readString() retunrs all of the data available as a string
// serial.readStringUntil('\n') returns all of the data available as a string until a specific string is encountered
// serial.readLine() calls readStringUntil with "\r\n" typical linebreak carriage return combination
// serial.last() returns the last byte of data from the buffer
// serial.lastChar() returns the last byte of data from the buffer as a char
// serial.clear() clears the underlying serial buffer
// serial.available() returns the number of bytes available in the buffer
// serial.write(somevar) writes out the value of somevar to the serial device


function draw() {


  
  background(240,240,240);
  text(latestData, 10,10);
  
  asdr();



  // // filter
  // let fillFreq = map(mouseX, width/2 - 400, width/2 + 400, 20, 1320);
  // fillFreq = constrain(fillFreq, 0, 1320);
  // lowCut.freq(fillFreq);
  // console.log('FILTER: ' + fillFreq);
  // // filter resolution
  // let resWidth = map(mouseY, height/2 - 400, height/2 + 400, 0, 200);
  // lowCut.res(resWidth);
  // resWidth = constrain(resWidth, 0, 200);
  // console.log('RESOLUTION: ' + resWidth);

  // text('Filter: ' + fillFreq, 10,25);
  // text('Res: ' + resWidth, 10,40);


  // Circle ellips
  ellipseMode(CENTER);
  noFill();
  stroke(0);
  strokeWeight(1);
  // ellipse(mouseX, mouseY, 25);
  


  
    
  //
  // changed frequencies
  //
  var freq = map(diameter0*790, 0, width, 0, 56 );    // had to multiply the diameter to achieve desired range
    osc1.freq(freq);
    //console.log(freq);
    
  var freq2 = map(diameter1, 0, width, 261, 523);    
    osc2.freq(freq2);
    //console.log(freq2);
    
 var freq3 = map(diameter2*10, 0, width, 659, 1318);    
    osc3.freq(freq3);
    //console.log(freq3); 



  
}


function mouseClicked(){
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
    console.log("getAudioContext().state" + getAudioContext().state);
  }
  };
  

function asdr() {

  // sliderA = createSlider(0, 1.0, 0.1, 0.01);
  // sliderA.position(10 * x/8, 10+y-100);
  frameRate(1);
  var aaa = diameter1/1000;
  var ddd = diameter2/75;
  var sss = diameter2/75;
  var rrr = diameter0/5;

  



  print(aaa,ddd,sss,rrr);
  background(255,0);
  env.setADSR(aaa, ddd, sss, rrr);
  env.setRange(1.0, 0.0);
  env.play();
  
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