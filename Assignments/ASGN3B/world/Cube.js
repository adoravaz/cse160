class Cube {
  constructor() {
    this.type = "cube";
  //   this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
  //   this.size = 5.0;
  //   this.segments = 10;
    this.matrix = new Matrix4();
    this.textureNum = -1;
    // this.cubeVerts32 = new Float32Array([
    //   0,0,0 , 1,1,0, 1,0,0 
    //   ,
    //   0,0,0 , 0,1,0, 1,1,0 
    //   ,
    //   0,1,0 , 0,1,1, 1,1,1
    //   ,
    //   0,1,0 , 1,1,1, 1,1,0
    //   ,
    //   1,0,0 , 1,1,0, 1,1,1
    //   ,
    //   1,0,0 , 1,1,1, 1,0,1 
    //   ,
    //   1,1,1 , 0,1,1, 0,0,1
    //   ,
    //   1,1,1 , 0,0,1, 1,0,1 
    //   ,
    //   1,0,1 , 0,0,1, 0,0,0
    //   ,
    //   1,0,1 , 0,0,0, 1,0,0
    //   ,
    //   0,0,0 , 0,0,1, 0,1,1 
    //   ,
    //   0,0,0 , 0,1,1, 0,1,0 
    //  ]);

    //  this.cubeUV32 = new Float32Array([
    //   1,0, 0,0, 0,1
    //   ,
    //   0,1, 0,0, 1,0
    //   ,
    //   0,1, 0,0, 1,0
    //   ,
    //   0,1, 1,0, 1,1
    //   ,
    //   0,1, 0,0, 1,0
    //   ,
    //   0,1, 1,0, 1,1
    //   ,
    //   0,1, 0,0, 1,0
    //   ,
    //   1,0, 0,1, 1,1
    //   ,
    //   1,0, 0,0, 0,1
    //   ,
    //   1,0, 0,1, 1,1
    //   ,
    //   0,1, 0,0, 1,0
    //   ,
    //   0,1, 1,0, 1,1
    //  ]);

  }

  render() {
  //   var xy = this.position;
    var rgba = this.color;
  //   var size = this.size;

    //pass the texture number
    gl.uniform1i(u_whichTexture, this.textureNum);

    // pass the color of a point to u_FragColor uniform variable 
    if (this.textureNum == -2) {
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    }


    // gl.uniform4fv(u_FragColor, color); // Set color
    // gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
  
    //pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    //Front of cube 
    drawTriangle3DUV([0,0,0 , 1,1,0, 1,0,0 ], [0,1, 1,0, 1,1]);
    drawTriangle3DUV([0,0,0 , 0,1,0, 1,1,0 ], [0,1, 0,0, 1,0]);
    // drawTriangle3D([0.0, 0.0, 0.0,  1.0, 1.0, 0.0,  1.0, 0.0, 0.0 ]);
    // drawTriangle3D([0.0, 0.0, 0.0,  0.0, 1.0, 0.0,  1.0, 1.0, 0.0 ]);

    //pass the color of a point to u_FragColor uniform variable (for lighting)
    gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);

    //top of the cube
    drawTriangle3DUV([0,1,0 , 0,1,1, 1,1,1 ], [0,1, 0,0, 1,0]);
    drawTriangle3DUV([0,1,0 , 1,1,1, 1,1,0 ], [0,1, 1,0, 1,1]);
    // drawTriangle3D([0.0, 1.0, 0.0,  0.0, 1.0, 1.0,  1.0, 1.0, 1.0 ]);
    // drawTriangle3D([0.0, 1.0, 0.0,  1.0, 1.0, 1.0,  1.0, 1.0, 0.0 ]);

    //Other sides of cube top, bottom, left, right, back
    //right face of the cube
    drawTriangle3DUV([1,0,0 , 1,1,0, 1,1,1 ], [0,1, 0,0, 1,0]);
    drawTriangle3DUV([1,0,0 , 1,1,1, 1,0,1 ], [0,1, 1,0, 1,1]);
    // drawTriangle3D([1.0, 0.0, 0.0,  1.0, 0.0, 1.0,  1.0, 1.0, 1.0]);
    // drawTriangle3D([1.0, 0.0, 0.0,  1.0, 1.0, 1.0,  1.0, 1.0, 0.0]);

     // Back of the cube
    drawTriangle3DUV([1,1,1 , 0,1,1, 0,0,1 ], [1,0, 0,0, 0,1]);
    drawTriangle3DUV([1,1,1 , 0,0,1, 1,0,1 ], [1,0, 0,1, 1,1]);
    //  drawTriangle3D([1.0, 1.0, 1.0,  0.0, 1.0, 1.0,  0.0, 0.0, 1.0]);
    //  drawTriangle3D([1.0, 1.0, 1.0,  0.0, 0.0, 1.0,  1.0, 0.0, 1.0]);

     // Bottom of the cube
    drawTriangle3DUV([1,0,1 , 0,0,1, 0,0,0 ], [1,0, 0,0, 0,1]);
    drawTriangle3DUV([1,0,1 , 0,0,0, 1,0,0 ], [1,0, 0,1, 1,1]);
    //  drawTriangle3D([1.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 0.0]);
    //  drawTriangle3D([1.0, 0.0, 1.0,  0.0, 0.0, 0.0,  1.0, 0.0, 0.0]);

     // Left face of the cube
    drawTriangle3DUV([0,0,0 , 0,0,1, 0,1,1 ], [0,1, 0,0, 1,0]);
    drawTriangle3DUV([0,0,0 , 0,1,1, 0,1,0 ], [0,1, 1,0, 1,1]);
    //  drawTriangle3D([0.0, 0.0, 0.0,  0.0, 1.0, 1.0,  0.0, 1.0, 0.0]);
    //  drawTriangle3D([0.0, 0.0, 0.0,  0.0, 1.0, 0.0,  0.0, 0.0, 1.0]);
  }

  // renderfaster(){
  //     var rgba = this.color;
  
  //     //pass the texture number
  //     gl.uniform1i(u_whichTexture, this.textureNum);
  
  //     //Pass the color of a point to u_FragColor uniform variable
  //     gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  
  //     //pass the matrix to u_ModelMatrix attribute
  //     gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
  
  //     if(g_vertexBuffer == null){
  //     initTriangle3D();
  //     }
   
  //     // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.cubeVerts), gl.DYNAMIC_DRAW);
  
  //     gl.bufferData(gl.ARRAY_BUFFER, this.cubeVerts32, gl.DYNAMIC_DRAW);
  //     // gl.bufferData(gl.ARRAY_BUFFER, this.cubeUV32, gl.DYNAMIC_DRAW);
  
  //     gl.drawArrays(gl.TRIANGLES, 0, 36);
  // }
}
  

