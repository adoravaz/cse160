class Cube {
  constructor() {
    this.type = "cube";
  //   this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
  //   this.size = 5.0;
  //   this.segments = 10;
    this.matrix = new Matrix4();
    this.textureNum = -1;
  }

  render() {
  //   var xy = this.position;
    var rgba = this.color;
  //   var size = this.size;

    //pass the texture number
    gl.uniform1i(u_whichTexture, this.textureNum);

    // // pass the color of a point to u_FragColor uniform variable 
    // if (this.textureNum == -2) { //this is not present in his
    // gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // }

    //this is not present in his
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);


    // gl.uniform4fv(u_FragColor, color); // Set color
    // gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
  
    //pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    
    // console.log('Enters render')
    // Front of the cube 
    drawTriangle3DUVNormal(
      [0,0,0, 1,1,0, 1,0,0],
      [0,1, 1,0, 1,1],
      [0,0,-1, 0,0,-1, 0,0,-1]);
    drawTriangle3DUVNormal( [0,0,0, 0,1,0, 1,1,0], [0,1, 0,0, 1,0], [0,0,-1, 0,0,-1, 0,0,-1]);
  
    // gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9,rgba[3]); //basically artificial lighting for cubes
    
    // Top of Cube
    drawTriangle3DUVNormal( [0,1,0, 0,1,1, 1,1,1], [0,0, 0,1, 1,1], [0,1,0, 0,1,0, 0,1,0]);
    drawTriangle3DUVNormal( [0,1,0, 1,1,1, 1,1,0], [0,0, 1,1, 1,0], [0,1,0, 0,1,0, 0,1,0]);
    
    // gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);

    // Right of cube
    // gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);
    drawTriangle3DUVNormal( [1,1,0, 1,1,1, 1,0,0], [0,0, 0,1, 1,1], [1,0,0, 1,0,0, 1,0,0]);
    drawTriangle3DUVNormal( [1,0,0, 1,1,1, 1,0,1], [0,0, 1,1, 1,0], [1,0,0, 1,0,0, 1,0,0]);

    // left of cube
    // gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3]);
    drawTriangle3DUVNormal( [0,1,0, 0,1,1, 0,0,0], [0,0, 0,1, 1,1], [-1,0,0, -1,0,0, -1,0,0]);
    drawTriangle3DUVNormal( [0,0,0, 0,1,1, 0,0,1], [0,0, 1,1, 1,0], [-1,0,0, -1,0,0, -1,0,0]);

    // bottom of cube
    // gl.uniform4f(u_FragColor, rgba[0]*.6, rgba[1]*.6, rgba[2]*.6, rgba[3]);
    drawTriangle3DUVNormal( [0,0,0, 0,0,1, 1,0,1], [0,0, 0,1, 1,1], [0,-1,0, 0,-1,0, 0,-1,0]);
    drawTriangle3DUVNormal( [0,0,1, 0,1,1, 1,1,1], [0,0, 1,1, 1,0], [0,0,1, 0,0,1, 0,0,1]);

    // back of cube
    // gl.uniform4f(u_FragColor, rgba[0]*.5, rgba[1]*.5, rgba[2]*.5, rgba[3]);
    drawTriangle3DUVNormal([0,0,1, 1,1,1, 1,0,1],[0,0, 0,1, 1,1], [0,0,1, 0,0,1, 0,0,1]);
    drawTriangle3DUVNormal([0,0,1, 0,1,1, 1,1,1],[0,1, 0,1, 1,1], [0,0,1, 0,0,1, 0,0,1]);
  }
}