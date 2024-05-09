class Camera {
    constructor(fov, aspect, near, far){
        this.eye = new Vector3([1,0,3]);
        this.at = new Vector3([1,0,0]);
        this.up = new Vector3([0,1,0]); 

        this.viewMat=new Matrix4();

        this.projMat = new Matrix4();
        this.projMat.setPerspective(fov, aspect, near, far);

        this.updateView();

    }

    moveForward(){

    }

    moveBackward(){

    }

    moveLeft(){

    }

    moveRight(){

    }

    panLeft(){
 
    }

    panRight(){

    }

    updateView(){
        this.viewMat.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }
}