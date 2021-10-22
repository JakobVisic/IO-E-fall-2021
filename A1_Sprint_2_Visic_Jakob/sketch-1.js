/*
October 2021 - Jakob Visic
- moved canvas to center
- changed canvas size
- changed shape to match Oscillator type
- changed frquency ranges based on the A minor scale 
    - button is at 55 hz (A1), 
    - potentiometer is 261-523 hz (C3-C4),
    - light sensor is at 659-1319 hz (E4-E5)
- fixed the square oscillator so it works only when pressed
- shapes move based on frequency for further visualization
- added mouse controls for filter and resolution
- made the light sensor a triangle


*/







/* 
August 2019 - Doug Whitton 
play 3 analog sensors that output sound and circle graphic
The Arduino file that's running is "threeSensorExample"
*/

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

 
}
////////////////////////////////////////////////////////////////////////////
// End serialport callbacks
///////////////////////////////////////////////////////////////////////////

// filter
lowCut = new p5.LowPass();

osc1 = new p5.SinOsc(); // set frequency and type  - button
osc1.amp(.6);
osc2 = new p5.SqrOsc(); // set frequency and type  - potentiometer
osc2.amp(.5);  
osc3 = new p5.TriOsc(); // set frequency and type  - light
osc3.amp(.4);    

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
  

  // filter
  let fillFreq = map(mouseX, width/2 - 400, width/2 + 400, 20, 1320);
  fillFreq = constrain(fillFreq, 0, 1320);
  lowCut.freq(fillFreq);
  console.log('FILTER: ' + fillFreq);
  // filter resolution
  let resWidth = map(mouseY, height/2 - 400, height/2 + 400, 0, 200);
  lowCut.res(resWidth);
  resWidth = constrain(resWidth, 0, 200);
  console.log('RESOLUTION: ' + resWidth);

  text('Filter: ' + fillFreq, 10,25);
  text('Res: ' + resWidth, 10,40);

  ellipseMode(CENTER);
  noFill();
  stroke(0);
  strokeWeight(1);
  ellipse(mouseX, mouseY, 25);
  
  //console.log("diameter0  "  + diameter0);

  //button
  ellipseMode(RADIUS);    
  fill(255,0,0,100);
  noStroke(); 
  ellipse(400, 700, diameter0*300);


  //potentiometer
  rectMode(RADIUS);    
  fill(0,255,0,100);
  push();
  translate(0, -0.15 * diameter1); //slightly translates the square to represent its change in frequency
  square(400, 500,diameter1 / 5);
  pop();

  //light sensor
  ellipseMode(CENTER);
  fill(0,0,255, 100);
  push();
  translate(width/2, 300);                 // centers the triangle
  translate(-30 * (diameter2 *0.05), -1 * diameter2);    // moves the triangle based on diameter, in order to scale the triangle from the center, the triangle has to be translated by the diameter2
  scale(diameter2 * 0.05);
  triangle(0, 0, 30, -60, 60, 0);
  
  //ellipse(400, 200, diameter2, diameter2);
  pop();
  
    
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
  


  

 