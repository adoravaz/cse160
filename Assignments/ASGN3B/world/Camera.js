class Camera {
    constructor(fov, aspect, near, far){
        this.eye = new Vector3([0,0,3]);
        this.at = new Vector3([0,0,-100]);
        this.up = new Vector3([0,1,0]); 

        this.viewMat=new Matrix4();

        this.projMat = new Matrix4();
        this.projMat.setPerspective(fov, aspect, near, far);

        this.speed = 0.1; // Default movement speed
        this.alpha= 10; // Default rotation angle in degrees

        this.updateView();

    }

    moveForward(){
        let f = new Vector3();  // Create a new vector f: let f = new Vector3();
        f.set(this.at).sub(this.eye).normalize();
        f.mul(this.speed); //multiply by default speed to move the camera
        
        this.eye.add(f);  // Add forward vector to eye: eye += f
        this.at.add(f);   // Add forward vector to center: at += f

        this.updateView(); // Update the view matrix
    }

    moveBackward(){
        //Same idea as moveForward, but compute backward  vector b = eye - at instead of forward.
        let b = new Vector3();  // Create a new vector b: let b = new Vector3();
        b.set(this.eye).sub(this.at).normalize();
        b.mul(this.speed); //multiply by default speed to move the camera
        
        this.eye.add(b);  // Add forward vector to eye: eye += b
        this.at.add(b);   // Add forward vector to center: at += b

        this.updateView(); // Update the view matrix
    }

    moveLeft(){
       let f = new Vector3();
       f.set(this.at).sub(this.eye).normalize();  // Compute forward vector f = at - eye. 
       
       // Cross product needs to be calculated using a static function
       let s = Vector3.cross(this.up, f); // s = up x f, returns a new Vector3
       s.normalize(); // Normalize the side vector
       s.mul(this.speed); // Scale s by a desired "speed" value:  s.mul(speed)

       this.eye.add(s); // Add side vector to both eye and center: eye += s; at += s; 
       this.at.add(s);
       this.updateView();
    }

    moveRight(){
        //Same idea as moveLeft, but compute the opposite side vector s = f x up.
        let f = new Vector3();
        f.set(this.at).sub(this.eye).normalize();  // Compute forward vector f = at - eye. 
        
        // Cross product needs to be calculated using a static function
        let s = Vector3.cross(f, this.up); // s = up x f, returns a new Vector3
        s.normalize(); // Normalize the side vector
        s.mul(this.speed); // Scale s by a desired "speed" value:  s.mul(speed)
 
        this.eye.add(s); // Add side vector to both eye and center: eye += s; at += s; 
        this.at.add(s);
        this.updateView();

    }

    panLeft(){
        // Rotate the vector f by alpha (decide a value) degrees around the up vector.
        // Create a rotation matrix: rotationMatrix.setRotate(alpha, up.x, up.y, up.z).
        // Multiply this matrix by f to compute f_prime = rotationMatrix.multiplyVector3(f);
        // Update the "at"vector to be at = eye + f_prime;
        let f = new Vector3();
        f.set(this.at).sub(this.eye).normalize();
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(this.alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]); // Rotate around up axis by degrees, // Create a rotation matrix: rotationMatrix.setRotate(alpha, up.x, up.y, up.z).
        console.log("Rotation Matrix:", rotationMatrix.elements);
        let fprime = rotationMatrix.multiplyVector3(f); // Multiply this matrix by f to compute f_prime = rotationMatrix.multiplyVector3(f);

        this.at.set(this.eye).add(fprime); // Reset 'at' to 'eye'
        this.updateView();
        console.log("Original f:", f.elements);
        console.log("Rotated fprime:", fprime.elements);
    }

    panRight(){
        //Same idea as panLeft, but rotate u by -alpha degrees around the up vector.
        let f = new Vector3();
        f.set(this.at).sub(this.eye).normalize();
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(-this.alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]); // Rotate around up axis by degrees, // Create a rotation matrix: rotationMatrix.setRotate(alpha, up.x, up.y, up.z).
        console.log("Rotation Matrix:", rotationMatrix.elements);
        let fprime = rotationMatrix.multiplyVector3(f); // Multiply this matrix by f to compute f_prime = rotationMatrix.multiplyVector3(f);

        this.at.set(this.eye).add(fprime); // Reset 'at' to 'eye'
        this.updateView();
        console.log("Original f:", f.elements);
        console.log("Rotated fprime:", fprime.elements);
    }

    //for mouse movement
    rotateY(degrees) {
        let f = new Vector3();
        f.set(this.at).sub(this.eye).normalize();
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(degrees, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        let fprime = rotationMatrix.multiplyVector3(f);
        this.at.set(this.eye).add(fprime);
        this.updateView();
    }

    rotateX(degrees) {
        let f = new Vector3();
        f.set(this.at).sub(this.eye).normalize();
        let r = Vector3.cross(f, this.up).normalize();
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(degrees, r.elements[0], r.elements[1], r.elements[2]);
        let fprime = rotationMatrix.multiplyVector3(f);
        let upPrime = rotationMatrix.multiplyVector3(this.up);

        this.at.set(this.eye).add(fprime);
        this.up.set(upPrime);
        this.updateView();
    }

    updateView(){
        this.viewMat.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }
}