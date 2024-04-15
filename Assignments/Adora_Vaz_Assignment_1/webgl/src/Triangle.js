class Triangle{

  //constructor
  constructor(){
    this.type='triangle';
    this.position = [0.0, 0.0, 0.0]; 
    this.color = [1.0,1.0,1.0,1.0];
    this.size = 5.0;
  }

  //render the shape
  render(){
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;
    
    // var xy = g_points[i];
    // var rgba = g_colors[i];
    // var size = g_sizes[i];

    // // Pass the position of a point to a_Position variable
    // gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the size of a point to u_FragSize variable
    gl.uniform1f(u_Size, size);
    
    // Draw
    //gl.drawArrays(gl.POINTS, 0, 1);
    var d = this.size/200.0; //delta 
    drawTriangle( [xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d]);
  }
  
}


function drawTriangle(vertices) {
  // var vertices = new Float32Array([
  //   0, 0.5,   -0.5, -0.5,   0.5, -0.5
  // ]);
  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  // gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  //already have done this in connectVariablestoGLSL
  // var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  // if (a_Position < 0) {
  //   console.log('Failed to get the storage location of a_Position');
  //   return -1;
  // }
  
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, n); 
  // return n;
}

// function customTriangles(x1, y1, x2, y2, x3, y3, color){
//   let customTriangle = new Triangle();
//   customTriangle.position = [x1, y1, x2, y2, x3, y3];
//   customTriangle.color = color;
//   return customTriangle;
// }

// function reflectTriangleAcrossY(triangle) {
//   let reflected = new Triangle();
//   reflected.position = [-triangle.position[0], triangle.position[1], 
//                        -triangle.position[2], triangle.position[3], 
//                       -triangle.position[4], triangle.position[5]];
//   reflected.color = triangle.color;
//   reflected.size = triangle.size;
//   return reflected;
// }





