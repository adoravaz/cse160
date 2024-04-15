class Picture {
  constructor() {
    this.type = 'picture';
    
    // Colors for the scene elements
    this.mountainColor = [0.5, 0.35, 0.05, 1.0]; // A shade of brown for the mountains
    this.houseBodyColor = [0.76, 0.69, 0.57, 1.0]; // A shade of tan for the house body
    this.roofColor = [0.55, 0.09, 0.09, 1.0]; // A shade of dark red for the roof
    this.vibeColor = [1.0, 1.0, 1.0, 1.0]; // A flash of light
    this.grassColor = [0.0, 1.0, 0.0, 1.0]; // A shade of dark red for the roof
    this.starColor = [1.0, 1.0, 0.0, 1.0];  //some yellow for the sun

    // Define positions for the house and mountains using 20 triangles
    // Mountains
    this.mountainLeft = [-0.9, -0.3, -0.5, 0.6, -0.1, -0.3];
    this.mountainRight = [0.9, -0.3, 0.5, 0.6, 0.1, -0.3];

    //cool sun 
    this.sunL= [0.18, 0.9, -0.27, 0.73, 0.09, 0.73]; // Set the position of the chimney 
    this.sunR = reflectAboutYAxis(this.sunL);

    // Rays from the Saucer 
    this.houseBodyLeft = [-0.2, -0.3, -0.2, 0.1, 0.0, -0.3];
    this.houseBodyRight = [0.0, -0.3, 0.0, 0.1, 0.2, -0.3];

    //Flying Saucer 
    this.roofLeft = [-0.25, 0.1, 0.0, 0.3, 0.0, 0.1];
    this.roofRight = [0.0, 0.1, 0.25, 0.1, 0.0, 0.3];


    //vibes from the saucer
    this.vibeR = [0.27,0.09, 1,0.55, 1,0.09];
    this.vibeL = reflectAboutYAxis(this.vibeR);

    //grass 
    this.grassL= [-0.8, -0.3, -0.9, -0.2, -0.7, -0.3];
    this.grassR = reflectAboutYAxis(this.grassL);
    // New grass to the left
    this.grassL2 = this.shiftGrassX(this.grassL, -0.2); // Shifted further left by 0.2
    this.grassL3 = this.shiftGrassX(this.grassL2, -0.2); // Shifted further left by another 0.2
    
    // // New grass to the right
    this.grassR2 = reflectAboutYAxis(this.grassL2);
    this.grassR3 = reflectAboutYAxis(this.grassL3);

    //add pathway
    // Add properties for the pathway
    this.pathColorLight = [0.85, 0.85, 0.85, 1.0]; // A light color for the path bricks
    this.pathColorDark = [0.65, 0.65, 0.65, 1.0];  // A darker color for the path bricks
  
    // Pathway - composed of multiple triangles, alternating colors
    this.pathway = [
    // Coordinates for the path bricks, alternating light and dark
    // Triangle 1
    [-0.1, -0.55, 0.0, -0.3, -0.2, -0.55, this.pathColorLight],
    // Triangle 2
    [0.1, -0.55, 0.2, -0.55, 0.0, -0.3, this.pathColorDark],
    // Triangle 3
    [-0.3, -0.8, -0.2, -0.55, -0.4, -0.8, this.pathColorDark],
    // Triangle 4
    [0.3, -0.8, 0.2, -0.55, 0.4, -0.8, this.pathColorLight],
    // Triangle 5
    [-0.5, -1.05, -0.4, -0.8, -0.6, -1.05, this.pathColorLight],
    // Triangle 6
    [0.5, -1.05, 0.4, -0.8, 0.6, -1.05, this.pathColorDark]
    ];
    }

  drawMountains() {
    gl.uniform4f(u_FragColor, ...this.mountainColor);
    drawTriangle(this.mountainLeft);
    drawTriangle(this.mountainRight);
  }

  drawHouse() {
    gl.uniform4f(u_FragColor, ...this.houseBodyColor);
    drawTriangle(this.houseBodyLeft);
    drawTriangle(this.houseBodyRight);

    gl.uniform4f(u_FragColor, ...this.roofColor);
    drawTriangle(this.roofLeft);
    drawTriangle(this.roofRight);

  }

  drawSun(){
    gl.uniform4f(u_FragColor, ...this.starColor);
    drawTriangle(this.sunL);
    drawTriangle(this.sunR);
  }

  drawVibes(){
    gl.uniform4f(u_FragColor, ...this.vibeColor);
    drawTriangle(this.vibeL);
    drawTriangle(this.vibeR);
    gl.uniform4f(u_FragColor, ...this.grassColor);
    drawTriangle(this.grassL);
    drawTriangle(this.grassR);
    drawTriangle(this.grassL2);
    drawTriangle(this.grassL3);
    drawTriangle(this.grassR2);
    drawTriangle(this.grassR3);
  }

   // Helper method from chatgpt to try to streamline how to draw grass x-coordinates
   shiftGrassX(grass, shiftX) {
    return grass.map((val, index) => index % 2 === 0 ? val + shiftX : val);
   }

   drawPathway() {
    // Iterate over the pathway triangles and draw them
    this.pathway.forEach(triangle => {
      gl.uniform4f(u_FragColor, ...triangle[6]); 
      drawTriangle(triangle.slice(0, 6));        // Draw the triangle with coordinates
    });
  }


  //drawing each of my functions
  render() {
    this.drawMountains();
    this.drawHouse();
    this.drawSun();
    this.drawVibes();
    this.drawPathway();
  }
}

//function from chatgpt based on reflection
function reflectAboutYAxis(coordinates) {
  return coordinates.map((val, index) => index % 2 === 0 ? -val : val);
}


function recreateDrawing() {
  let picture = new Picture();
  g_shapesList.push(picture);
  renderAllShapes();
}
