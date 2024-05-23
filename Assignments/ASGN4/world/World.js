// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
   precision mediump float;   
   attribute vec4 a_Position;
   attribute vec2 a_UV; 
   attribute vec3 a_Normal;
   varying vec2 v_UV; 
   varying vec3 v_Normal;
   uniform mat4 u_ModelMatrix; 
   uniform mat4 u_GlobalRotateMatrix; 
   uniform mat4 u_ViewMatrix; 
   uniform mat4 u_ProjectionMatrix;
    void main() {
        gl_Position =  u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
        v_UV = a_UV;
        v_Normal = a_Normal;
    }`

// Fragment shader program
var FSHADER_SOURCE = `
   precision mediump float;
   varying vec2 v_UV;
   varying vec3 v_Normal;
   uniform vec4 u_FragColor;
   uniform sampler2D u_Sampler0;
   uniform sampler2D u_Sampler1; 
   uniform sampler2D u_Sampler2; 
   uniform sampler2D u_Sampler3;
   uniform int u_whichTexture;
   void main() {
    if(u_whichTexture == -3){
      gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);
      // gl_FragColor = vec4((v_Normal+2.0)/2.0, 1.0); //use color
    }else if (u_whichTexture == -2){
      gl_FragColor = u_FragColor; //use color
    }else if (u_whichTexture == -1){
      gl_FragColor = vec4(v_UV, 1.0, 1.0); //use uv debug color
    }else if (u_whichTexture == 0){  // use texture0
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    }else if (u_whichTexture == 1){
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    }else if (u_whichTexture == 2){
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    }else if (u_whichTexture == 3){
      gl_FragColor = texture2D(u_Sampler3, v_UV);
    }else{                          //error, put Redish
      // gl_FragColor = vec4(0,0,0,1);
      gl_FragColor = vec4(1, .2, .2, 1);
    }

   }`

//global variables
let canvas;
let gl;
let a_Position;
let a_Normal;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_whichTexture;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
// let u_GlobalRotateMatrix;
// Global rotation variables
let g_rotateX = 0;
let g_rotateY = 0;
let mouseDown = false;
let lastMouseX = null;
let lastMouseY = null;
// let g_vertexBuffer;



//get the canvas and gl context
function setUpWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  } 

  gl.enable(gl.DEPTH_TEST);
}


//compile the shader programs, attach the javascript variables to the GLSL variables
function connectVariablestoGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  //get the storage location of u_FragColor
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

    //get the storage location of u_FragColor
  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  //get storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix){
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }


  //get the storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix){
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  } 
  
  //get the storage location of u_ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix){
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  //get the storage location of u_ViewMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix){
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  } 

  //get the storage location of u_GlobalRotateMatrix
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if(!u_Sampler0){
    console.log("Failed to get the storage location of u_Sampler0");
    return;
  }
  
    //get the storage location of u_GlobalRotateMatrix
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if(!u_Sampler1){
    console.log("Failed to get the storage location of u_Sampler1");
    return;
  }

   //get the storage location of u_GlobalRotateMatrix
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if(!u_Sampler2){
    console.log("Failed to get the storage location of u_Sampler2");
    return;
  }

   //get the storage location of u_GlobalRotateMatrix
  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if(!u_Sampler3){
    console.log("Failed to get the storage location of u_Sampler3");
    return;
  }

  //get the storage location of u_GlobalRotateMatrix
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if(!u_whichTexture){
    console.log("Failed to get the storage location of u_whichTexture");
    return;
  }
  //set an initial value for this matrix to identify
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  gl.uniformMatrix4fv(u_ViewMatrix, false, identityM.elements);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, identityM.elements);

}

//Constants
const POINT = 0; 
const TRIANGLE = 1; 
const CIRCLE = 2; 
// const FIGURE = 3;

//globals related to UI elements
let g_selectedColor=[1.0, 1.0, 1.0, 1.0];
let g_selectedSize=5;
let g_selectedType=POINT;
let g_selectedSegment=10;
let g_globalAngle=0;
let g_yellowAngle=0;
let g_magentaAngle=0;
let g_tailAngle=0;
let g_earAngle=0;
let g_snoutAngle=16;
let g_yellowAnimation=false;
let g_magentaAnimation=false;
let g_tailAnimation=false;
let g_earAnimation=false;
let g_normalOn=false; //added 
// let g_snoutAnimation=false;

//pooping animation
let g_isPoopingMoney = false;
let g_moneyParticles = [];



//set up actions for the HTML UI elements 
function addActionsForHtmlUI(){
  //button events (shape type)

  document.getElementById('normalOn').onclick = function(){g_normalOn=true;};
  document.getElementById('normalOff').onclick = function(){g_normalOn=false;};

  document.getElementById('animationYellowOffButton').onclick = function(){ g_yellowAnimation=false };
  document.getElementById('animationYellowOnButton').onclick = function(){  g_yellowAnimation=true };
  document.getElementById('animationMagentaOffButton').onclick = function(){ g_magentaAnimation=false };
  document.getElementById('animationMagentaOnButton').onclick = function(){  g_magentaAnimation=true };
  document.getElementById('animationTailOffButton').onclick = function(){ g_tailAnimation=false };
  document.getElementById('animationTailOnButton').onclick = function(){  g_tailAnimation=true };
  document.getElementById('animationEarOffButton').onclick = function(){ g_earAnimation=false };
  document.getElementById('animationEarOnButton').onclick = function(){  g_earAnimation=true };
  // document.getElementById('animationSnoutOffButton').onclick = function(){ g_snoutAnimation=false };
  // document.getElementById('animationSnoutOnButton').onclick = function(){  g_snoutAnimation=true };


  document.getElementById('magentaSlide').addEventListener('mousemove', function() {g_magentaAngle = this.value; renderAllShapes(); });

  document.getElementById('yellowSlide').addEventListener('mousemove', function() {g_yellowAngle = this.value; renderAllShapes(); });

  document.getElementById('tailSlide').addEventListener('mousemove', function() {g_tailAngle = this.value; renderAllShapes(); });

  document.getElementById('earSlide').addEventListener('mousemove', function() {g_earAngle = this.value; renderAllShapes(); });

  // document.getElementById('snoutSlide').addEventListener('mousemove', function() {g_snoutAngle = this.value; renderAllShapes(); });

  //size slider events 
  document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = this.value; renderAllShapes(); });

}


function initTextures(gl, n){

  var image = new Image(); //create the image object
  if(!image){
    console.log('Failed to create the image object');
    return false;
  }
  
  image.onload = function() {
    checkTextureDimensions(image);
  };
  //register the event handler to be called on loading an image
  image.onload = function(){ sendImageToTEXTURE0(image);}
  //tell the browser to load an image
  image.src = "../lib/sky.jpg";

  var image2 = new Image(); //create the image object
  if(!image2){
    console.log('Failed to create the image object');
    return false;
  }

  //register the event handler to be called on loading an image
  image2.onload = function(){ sendImageToTEXTURE1(image2);}
  //tell the browser to load an image
  image2.src = "../lib/trees.jpg";

  var image3 = new Image(); //create the image object
  if(!image3){
    console.log('Failed to create the image object');
    return false;
  }

  //register the event handler to be called on loading an image
  image3.onload = function(){ sendImageToTEXTURE2(image3);}
  //tell the browser to load an image
  image3.src = "../lib/meadow.jpg";

  var image4 = new Image(); //create the image object
  if(!image4){
    console.log('Failed to create the image object');
    return false;
  }

  //register the event handler to be called on loading an image
  image4.onload = function(){ sendImageToTEXTURE3(image4);}
  //tell the browser to load an image
  image4.src = "../lib/wall.jpeg";

  //Add more texture loading
  return true;
}

function sendImageToTEXTURE0(image){

  var texture = gl.createTexture(); //create a texture object
  if(!texture){
    console.log('Failed to create the texture object');
    return false;
  }
  
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable the texture unit 0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);

  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
  console.log('finished loadTexture0');
}

function sendImageToTEXTURE1(image){
 
  var texture = gl.createTexture(); //create a texture object
  if(!texture){
    console.log('Failed to create the texture object');
    return false;
  }
  
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable the texture unit 1
  gl.activeTexture(gl.TEXTURE1);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 1 to the sampler
  gl.uniform1i(u_Sampler1, 1);

  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
  console.log('finished loadTexture1');
}

function sendImageToTEXTURE2(image){
 
  var texture = gl.createTexture(); //create a texture object
  if(!texture){
    console.log('Failed to create the texture object');
    return false;
  }
  
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable the texture unit 1
  gl.activeTexture(gl.TEXTURE2);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 1 to the sampler
  gl.uniform1i(u_Sampler2, 2);

  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
  console.log('finished loadTexture2');
}

function sendImageToTEXTURE3(image){
 
  var texture = gl.createTexture(); //create a texture object
  if(!texture){
    console.log('Failed to create the texture object');
    return false;
  }
  
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable the texture unit 1
  gl.activeTexture(gl.TEXTURE3);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 1 to the sampler
  gl.uniform1i(u_Sampler3, 3);

  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
  console.log('finished loadTexture3');
}




function togglePoopingAnimation() {
    g_isPoopingMoney = !g_isPoopingMoney;
    if (g_isPoopingMoney) {
        g_tailAngle = -10; // Lift the tail
        emitMoneyParticles();
    } else {
        g_tailAngle = 8; // Reset tail position
    }
}


let emitCount = 0;  // Keep track of how many times particles have been emitted

function emitMoneyParticles() {
    // console.log("Emitting money");
    // let stackHeight = 0;  // Track the height of the stack
    let baseWidth = 0.2;  // Base width of the pile, increases with height
    let xOffset = emitCount * -0.2;  // Start farther away based on emit count
    // let currentParticlesCount = g_moneyParticles.length;
    // let stackHeight = currentParticlesCount * 0.02;  // Calculate initial stack height based on existing particles

    for (let i = 0; i < 10; i++) {  // Emit 10 money particles
        let yOffset = (Math.random() * baseWidth) - (baseWidth / 2);  // Randomize x position within base width
        let zOffset = (Math.random() * baseWidth) - (baseWidth / 2);  // Randomize z position within base width
        g_moneyParticles.push({
            position: [-0.4+xOffset, -0.88 - yOffset, 0.3+zOffset], // Adjust Y position for stacking
            velocity: [0, 0, 0],  // No movement after emission
            rotation: Math.random() * 360,  // Random rotation for a more natural look
            life: 350, // Long life since they don't need to disappear
            settled: true // They are already settled when created
        });
        xOffset += 0.01;  // Increment for the next particle to sit on top
        // stackHeight += 0.01;  // Smaller increment for height to make thicker layers
        // baseWidth += 0.03;  // Gradually increase the base width
    }
    emitCount++;  // Increment the count of emissions
}


function renderMoneyParticles() {
    g_moneyParticles.forEach(particle => {
        let moneyMatrix = new Matrix4();
        moneyMatrix.translate(particle.position[0], particle.position[1], particle.position[2]);
        moneyMatrix.rotate(particle.rotation, 0, 1, 0);  // Apply random rotation
        moneyMatrix.scale(0.2, 0.005, 0.09); // Larger size
        let money = new Cube();
        money.matrix = moneyMatrix;
        money.color = [0, 1, 0, 1]; // Green color for money
        money.render();
    });
}


function main() {

  //set up canvas and gl variables
  setUpWebGL();
  //set up GLSL shader programs and connect to GLSL variables
  connectVariablestoGLSL();

  //set up actions for the HTML UI elements 
  addActionsForHtmlUI();

  document.onkeydown = keydown;

  initTextures();

  //register function (event handler) on mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev){if(ev.buttons == 1){click(ev)}};

  addMouseControls(); 

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  //   gl.clear(gl.COLOR_BUFFER_BIT);
//   renderAllShapes();
  requestAnimationFrame(tick);
}

//added function for mouse controls
function addMouseControls(){
    canvas.onmousedown = function(event) {
        if (event.shiftKey) { //when click and shift do the money poop
            g_tailAngle = g_tailAngle === -10 ? 8 : -10; // Toggle tail angle between two positions
            emitMoneyParticles();  // Emit particles on each shift-click
            // console.log("yay");
        } else {
            mouseDown = true;
            lastMouseX = event.clientX;
            lastMouseY = event.clientY;
        }
    };

    canvas.onmouseup = function() {
        mouseDown = false;
    };

    canvas.onmousemove = function(event) {
        if (!mouseDown) return;
        let deltaX = event.clientX - lastMouseX;
        let deltaY = event.clientY - lastMouseY;
        // g_rotateX += deltaY * 0.1;
        g_rotateY += deltaX * 0.1;
        g_rotateX = Math.max(-90, Math.min(90, g_rotateX + deltaY * 0.1));
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
        renderAllShapes();
    };
}


//update the angles of everything if currently animated
function updateAnimationAngles(){ 
    if(g_yellowAnimation){  //if yellow animation is on then I will set the yellow angle
        g_yellowAngle = (15 * Math.abs(Math.sin(g_seconds)));
    }

    if(g_magentaAnimation){  //if yellow animation is on then I will set the yellow angle
        g_magentaAngle = (10 *  Math.abs(Math.sin(2*g_seconds))); //multiplying by 3 makes it faster
    }

    if(g_tailAnimation){  //if yellow animation is on then I will set the yellow angle
        g_tailAngle = (10 *  Math.abs(Math.sin(2*g_seconds))); //multiplying by 3 makes it faster
    }

    if(g_earAnimation){  //if yellow animation is on then I will set the yellow angle
        g_earAngle = (10 *  Math.abs(Math.sin(2*g_seconds))); //multiplying by 3 makes it faster
    }

    // if(g_snoutAnimation){  
    //     // Calculate the oscillation between 15 and 21 degrees
    //     var minAngle = 15;
    //     var maxAngle = 25;
    //     // Oscillate between 0 (at minAngle) and 1 (at maxAngle)
    //     var normalizedSinWave = (Math.sin(2 * Math.PI * g_seconds / 5) + 1) / 2; // Normalizes the sine wave to range from 0 to 1
    //     g_snoutAngle = minAngle + (maxAngle - minAngle) * normalizedSinWave; // Scale and shift the sine wave to the desired range
    // }

}

var g_startTime=performance.now()/1000.0; 
var g_seconds=performance.now()/1000.0-g_startTime;


//called by browser repeatedly whenever its time 
function tick(){
    //save current time
    g_seconds=performance.now()/1000.0-g_startTime;
    // console.log(g_seconds);

    //update animation angles
    updateAnimationAngles();

    //draw everything
    renderAllShapes();

    //tell the browser to update again when it has time
    requestAnimationFrame(tick);

}

var g_shapesList = [];
// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = [];

//specific function that handles a click
function click(ev) {
  
  //Extract the event click and return it in WebGL coordinates
  let [x,y] = convertCoordinatesEventToGL(ev);

  //create and store a new point
  let point;
  if(g_selectedType==POINT){
    point = new Point();
  }else if(g_selectedType==TRIANGLE){
    point = new Triangle();
  }else if(g_selectedType==CIRCLE){
    point = new Circle(); 
    // console.log("Updated segment count:", g_selectedSegment); 
  }

  // //create and store the new point
  // let point = new Triangle(); //changed from Point
  point.position=[x,y];
  point.color=g_selectedColor.slice();
  point.size=g_selectedSize;
  point.segments=g_selectedSegment;
  g_shapesList.push(point);


  //Draw every shape that is supposed to be in the canvas
  renderAllShapes();
   
}


//Extract the event click and return it in the WebGL coordinates
function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

function keydown(ev){
  if(ev.keyCode==39){ //right arrow
    g_eye[0] += 0.2;
  }else{
  if(ev.keyCode==37){
    g_eye[0] -= 0.2;
  }

  renderAllShapes();
  console.log(ev.keyCode);
  }
}

var g_eye = [0, 0, 3];
var g_at = [0, 0, -100];
var g_up = [0, 1, 0];

var g_map=[
  [1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1],
  [1,0,0,1,1,0,0,1],
  [1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1],
  [1,0,0,0,1,0,0,1],
  [1,0,0,0,0,0,0,1]
];

function drawMap(){
  for(x=0; x<8; x++){
    for(y=0; y<8; y++){
      // if(g_map[x][y] == 1){
      if(x==0 || x==7 || y==0 || y==7){
        var sky = new Cube();
        sky.textureNum = 3;
        sky.color = [1.0, 1.0, 1.0, 1.0];
        sky.matrix.translate(x-4, -0.75, y-4);
        sky.render();

      }
    }

  }
}

//Draw every shape that is supposed to be in the canvas
function renderAllShapes(){

  //check the time at the start of this function
  var startTime = performance.now();

  //pass the projection matrix
  var projMat = new Matrix4();
  projMat.setPerspective(50, 1*canvas.width/canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  //Pass the view matrix
  var viewMat=new Matrix4();
  viewMat.setLookAt(g_eye[0], g_eye[1], g_eye[2], g_at[0], g_at[1], g_at[2], g_up[0], g_up[1], g_up[2]);
  // viewMat.setLookAt(0,0,3, 0,0,-100, 0,1,0); //(eye, at, up)
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  // Global rotation from the slider
  var sliderglobalRotMat = new Matrix4().rotate(g_globalAngle,0,1,0);

  //pass the matrix to u_ModelMatrix.attribute mouse
  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0 );
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements); 
  // globalRotMat.rotate(g_rotateX, 1, 0, 0);
  // globalRotMat.rotate(g_rotateY, 0, 1, 0);
  // gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements); 
  
  // Combine both rotations: order matters here!
  var finalRotMat = sliderglobalRotMat.multiply(globalRotMat);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, finalRotMat.elements); //then pass it in 
  
  // Clear <canvas>  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); //for clearing the depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT);


  // Render money particles if any
  renderMoneyParticles();

  //draw the body cube 
  var body = new Cube(); 
  var bodyColor = [0.5, 0.25, 0.05, 1.0];
  body.matrix.translate(-.25, -.5, 0.0);
//   body.matrix.rotate(-2, 1, 0, 0);
  body.matrix.scale(0.75, 0.4, 0.55);
  body.render(bodyColor); 

  //draw the neck arm 
  var neck = new Cube(); 
  neck.matrix.setTranslate(0.0, -0.4, 0.0);
//   yellow.matrix.rotate(-5, 1, 0, 0);

  neck.matrix.rotate(-g_yellowAngle, 0, 0, 1);
  var yellowCoordinatesMat=new Matrix4(neck.matrix);
  neck.matrix.scale(0.18, 0.7, 0.2);
  neck.matrix.translate(1.2, 0.2, 0.9);
  neck.render(bodyColor); 

  //head Box
  var head = new Cube(); 
  // if(g_normalOn) head.textureNum=-3;
  head.matrix = yellowCoordinatesMat;
  head.matrix.translate(0, 0.65, 0);
  head.matrix.rotate(g_magentaAngle, 0, 0, 1);
  head.matrix.scale(0.3, 0.3, 0.3);
  head.matrix.translate(0.7, 0, 0.5);
//   box.matrix.rotate(-30, 1, 0, 0);
//   box.matrix.scale(0.2, 0.4, 0.2);
  head.render(bodyColor); 

  //draw the floor cube
  var floor = new Cube();
  floor.color = [1.0, 0.0, 0.0, 1.0];
  floor.textureNum=2;
  floor.matrix.translate(0, -0.75, 0.0);
  floor.matrix.scale(10,0,10);
  floor.matrix.translate(-0.5,0,-0.5);
  floor.render();

  drawMap();

  // draw the sky
  var sky = new Cube();
  sky.color = [1.0,0.0,0.0,1.0];
  sky.textureNum=1; 
  if(g_normalOn) sky.textureNum=-3;
  sky.matrix.scale(50,50,50);
  sky.matrix.translate(-.5, -.5, -.5);
  sky.render();


//  // Mane for the neck
//   var mane = new Cylinder();
//   // mane.textureNum=0;
//   mane.color = [0.3, 0.15, 0.05, 1.0];// Color of the mane
//   mane.matrix = new Matrix4(head.matrix); 
//   mane.matrix.translate(0, 0, 0.4); 
//   mane.matrix.rotate(90, 1, 0, 0); 
//   mane.matrix.scale(0.5, 0.7, 0.5);
// //   snout.matrix.translate(0, -0.3, 0); // Adjust Z translation to place it correctly in front
//   mane.render();

//   // Mane for the head
//   var mane2 = new Cylinder();
//   mane2.textureNum=0;
//   mane2.color = [0.3, 0.15, 0.05, 1.0]; // Color of the snout
//   mane2.matrix = new Matrix4(head.matrix); // Start with the transformation matrix of the magenta box
//   mane2.matrix.translate(0, 0.9, 0.4); // Moves snout forward from the face of the head cube
//   mane2.matrix.rotate(90, 1, 0, 0); // Rotate to point the snout outward (90 degrees about X-axis)
//   mane2.matrix.scale(0.5, 0.5, 0.4);
//   //   snout.matrix.translate(0, -0.3, 0); // Adjust Z translation to place it correctly in front
//   mane2.render();

//   // Create and render the cylinder snout
//   var snout = new Cylinder();
//   snout.textureNum=0;
//   snout.color = [0.5, 0.25, 0.05, 1.0]; // Color of the snout
//   snout.matrix = new Matrix4(head.matrix); // Start with the transformation matrix of the magenta box
//   snout.matrix.translate(0.1, 0.6, 0.7);
//   snout.matrix.rotate(90, 0, 1, 0); // Rotate to point the snout outward (90 degrees about X-axis)
//   // rotate to angle the snout downward
//   snout.matrix.rotate(g_snoutAngle, 1, 0.8, 0); // Angles the snout downward by 20 degrees around the X-axis
//   snout.matrix.scale(1, 1, 1);
//   snout.render();
 

// Function to create and render an ear
function createEar(x, y, z) {
     var ear = new Cube();
     ear.matrix = new Matrix4(head.matrix); // Start with the head box's matrix
     ear.matrix.translate(x, y, z); // Adjust position relative to the magenta box
     ear.textureNum = -2;

     // Rotate based on magenta box's rotation plus an offset for natural movement
     ear.matrix.rotate(g_earAngle, 0, 0, 1);
     
     ear.matrix.scale(0.3, 0.4, 0.1); // Scale down for ear size
     ear.matrix.rotate(45, 0, 0, 1); // Rotate to make it look more like a triangle
     ear.matrix.translate(0, -0.15, 0); // Adjust position after rotation
     ear.render(bodyColor);
 }
 // Create left ear
 createEar(0.3, 0.75, 0.1);
 // Create right ear
 createEar(0.3, 0.75, 0.8); 

 // Function to create and render an eye
function createEye(x, y, z) {
    var eye = new Cube();
    var eyeColor = [0.0, 0.0, 0.0, 0.0]; // Eye color: black
    eye.textureNum = -2;
    eye.matrix = new Matrix4(head.matrix); // Start with the magenta box's matrix
    eye.matrix.translate(x, y, z); // Position relative to the magenta box
    eye.matrix.scale(0.2, 0.2, 0.1); // Scale down to make the eye size appropriate
    eye.render(eyeColor);
 }

// Create left and right eyes positioned on the sides
createEye(0.5, 0.55, -0.1); // Left eye, adjust z for outward visibility
createEye(0.5, 0.55, 1);  // Right eye, adjust z for outward visibility


//legs
// Function to create a leg
function createLeg(x, y, z, angle) {
    var leg = new Cube();
    leg.matrix.setTranslate(x, y, z);
    leg.matrix.rotate(angle, 0, 0, 1);
    leg.matrix.scale(0.1, 0.6, 0.1); // Adjust leg thickness and length
    leg.render(bodyColor);

    // Adding a hoof at the bottom of the leg
    var hoof = new Cube();
    var bodyHighlights = [0.3, 0.15, 0.05, 1.0]; // Slightly darker color for the hoof
    hoof.matrix.setTranslate(x, y-0.001, z-0.001); // Positioning it right below the leg
    hoof.matrix.scale(0.12, 0.05, 0.12); // Making the hoof slightly wider and flatter
    hoof.render(bodyHighlights);
}

// Positioning legs
createLeg(-0.2, -0.9, 0.04, 0);  // Left back leg- can make it -0.1 and -0.8 if you want it shorter
createLeg(-0.2, -0.9, 0.4, 0);  // Right back leg
createLeg(0.3, -0.9, 0.04, 0);   // Left front leg
createLeg(0.3, -0.9, 0.4, 0);   // Right front leg

// Create the parts of the tail
var tail = new Cube();
var bodyHighlights = [0.3, 0.15, 0.05, 1.0]; 
tail.textureNum = -2;
tail.matrix.setTranslate(-0.33, -0.62, 0.3); // Adjust this to move the tail closer or further
tail.matrix.translate(0, 0.2, -0.1); // Move pivot to the base of the tail
// Rotate the tail 30 degrees initially to slant outwards
tail.matrix.rotate(-15, 0.1, 0, 1); // Rotate around Z-axis by 30 degrees
tail.matrix.rotate(g_tailAngle, 0, 0, 1);
tail.matrix.translate(-0.02, -0.2, 0.1); // Translate back after rotation
tail.matrix.scale(0.07, 0.4, 0.05); // Thin and long
tail.render(bodyHighlights);

var tail2 = new Cube();
tail2.matrix.setTranslate(-0.3, -0.6, 0.3); // Adjust this to move the tail closer or further
tail2.matrix.translate(0, 0.2, -0.1); // Move pivot to the base of the tail
tail2.textureNum = -2;
// tail.matrix.rotate(15, 2, 1, 0); // Adjusting the angle to make the tail hang down a bit
tail2.matrix.rotate(g_tailAngle, 0, 0, 1);
tail2.matrix.translate(0, -0.2, 0.1); // Translate back after rotation
tail2.matrix.scale(0.07, 0.4, 0.05); // Thin and long
tail2.render(bodyHighlights);

var tail3 = new Cube();
tail3.matrix.setTranslate(-0.33, -0.6, 0.3); // Adjust this to move the tail closer or further
tail3.matrix.translate(0, 0.2, -0.1); // Move pivot to the base of the tail
tail3.textureNum = -2;
// Rotate the tail 30 degrees initially to slant outwards
tail3.matrix.rotate(-40, 0, 0, 1); // Rotate around Z-axis by 30 degrees
tail3.matrix.rotate(g_tailAngle, 0, 0, 1);
tail3.matrix.translate(-0.02, -0.2, 0.1); // Translate back after rotation
tail3.matrix.scale(0.07, 0.4, 0.05); // Thin and long
tail3.render(bodyHighlights);

var tail4 = new Cube();
tail4.matrix.setTranslate(-0.37, -0.5, 0.1); // Adjust this to move the tail closer or further
tail4.matrix.translate(0, 0.19, -0.1); // Move pivot to the base of the tail
tail4.textureNum = -2;
// Rotate the tail 30 degrees initially to slant outwards
tail4.matrix.rotate(-30, 0.13, 0, 1); // Rotate around Z-axis by 30 degrees
tail4.matrix.rotate(g_tailAngle, 0, 0, 1);
tail4.matrix.translate(0.015, -0.19, 0.1); // Translate back after rotation
tail4.matrix.scale(0.07, 0.4, 0.05); // Thin and long
tail4.render(bodyHighlights);

//check the time at the end of the function and show on the webpage
var duration = performance.now() - startTime;
sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration)/10, "numdot");  
  
}

//set the text of a HTML element 
function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  if(!htmlElm){
    console.log("Failed to get " + htmlID + "from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}