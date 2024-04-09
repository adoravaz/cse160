// DrawTriangle.js (c) 2012 matsuda
var canvas, ctx;

function main() {  
  // Retrieve <canvas> element
  canvas = document.getElementById('cnv1');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the rendering context for 2DCG
  ctx = canvas.getContext('2d');

  // Draw a black rectangle
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to black
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color

  // Instantiate the vector
  var v1 = new Vector3([2.5, 2.5, 0]);
  drawVector(v1, "red");
  
}

  // drawVector Function
function drawVector(v,color){
  // Set the color for the vector
  ctx.strokeStyle = color;

  // Start at the center of the canvas
  ctx.beginPath();
  ctx.moveTo(canvas.width/2 , canvas.height/2);

  // Calculate the vector scaled by 20
  var endX = canvas.width / 2 + v.elements[0] * 20; //x element of Vector3
  var endY = canvas.height / 2 - v.elements[1] * 20; //y element of Vector3
    
  ctx.lineTo(endX, endY);
  ctx.stroke();
}

//whenever a user clicks on the draw button
function handleDrawEvent(){
  //clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Redraw the black background
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to black
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var xvalue1 = parseFloat(document.getElementById("xvalue1").value); // check if need a parse float here
  var yvalue1 = parseFloat(document.getElementById("yvalue1").value);  
  var v1 = new Vector3([xvalue1, yvalue1, 0]);
  console.log(v1);
  drawVector(v1, "red");

  var xvalue2 = parseFloat(document.getElementById("xvalue2").value); 
  var yvalue2 = parseFloat(document.getElementById("yvalue2").value);  
  var v2 = new Vector3([xvalue2, yvalue2, 0]);
  console.log(v2);
  drawVector(v2, "blue");
}

//angle between function
function angleBetween(v1, v2){
  //get the dot product of two vectors
  let dotProduct = Vector3.dot(v1,v2); //since it is static
  let magnitudeV1 = v1.magnitude(); 
  let magnitudeV2 = v2.magnitude();

  //get cos of the angle
  let cosAngle = dotProduct / (magnitudeV1 * magnitudeV2);

  //get angle in radians then convert it to degrees
  let cosRadians = Math.acos(cosAngle); 
  let cosDegrees = cosRadians * (180/Math.PI);

  //print to console
  console.log("Angle:", cosDegrees);
}

//cross product function
function areaTriangle(v1, v2){
  let crossProduct = Vector3.cross(v1,v2);
  console.log(crossProduct);

   //area of triangle is half the parallelogram
  let areaTriangle = crossProduct.magnitude() / 2;
  console.log("Area of the Triangle:", areaTriangle);
}

//whenever user clicks on the second draw button 
function handleDrawOperationEvent(){
  //clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Redraw the black background
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to black
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var xvalue1 = parseFloat(document.getElementById("xvalue1").value); // check if need a parse float here
  var yvalue1 = parseFloat(document.getElementById("yvalue1").value);  
  var v1 = new Vector3([xvalue1, yvalue1, 0]);
  console.log(v1);
  drawVector(v1, "red");

  var xvalue2 = parseFloat(document.getElementById("xvalue2").value); 
  var yvalue2 = parseFloat(document.getElementById("yvalue2").value);  
  var v2 = new Vector3([xvalue2, yvalue2, 0]);
  console.log(v2);
  drawVector(v2, "blue");

  var operation = document.getElementById("operation-select").value;
  var scalar = parseFloat(document.getElementById("scalar").value);
  var v3;

  // console.log(scalar);

  if(operation == "add"){ //could be value or scalar 
    // console.log("add!");
    v3 = v1.add(v2);
    drawVector(v3, "green");
  }
  else if(operation == "sub"){
    // console.log("subtract!");
    v3 = v1.sub(v2);
    drawVector(v3, "green");
  }
  else if(operation =="mul"){
    // console.log(scalar);
    // console.log("multiply!");
    drawVector(v1.mul(scalar), "green");
    drawVector(v2.mul(scalar), "green");
  }
  else if(operation == "div"){
    // console.log("divide!");
    drawVector(v1.div(scalar), "green");
    drawVector(v2.div(scalar), "green");
  }
  else if(operation == "magnitude"){
    console.log("Magnitude v1:", v1.magnitude());
    console.log("Magnitude v2:", v2.magnitude());
  }
  else if(operation == "normalize"){
    // console.log("normalize!");
    drawVector(v1.normalize(), "green");
    drawVector(v2.normalize(), "green");
  }
  else if(operation == "anglebetween"){
    angleBetween(v1, v2);
  }
  else if(operation == "area"){
    areaTriangle(v1, v2);
  }
}
