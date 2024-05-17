import * as THREE from 'three';
// import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

//added 5B
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

function main() {

	const canvas = document.querySelector( '#c' );
	//Added 3b- look up the 2 view elements
	// const view1Elem = document.querySelector('#view1');
    // const view2Elem = document.querySelector('#view2');
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	// different method to compute which pixels are in front and which are behind-logarithmicDepthBuffer
	// const renderer = new THREE.WebGLRenderer({
	// 	canvas,
	// 	alpha: true,
	// 	antialias: true,
	// 	logarithmicDepthBuffer: true,
	// });
	

	const fov = 45; //45
	const aspect = 2; // the canvas default
	const near = 0.1;
	// const near = 0.00001;
	const far = 100;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    // camera.position.set(0, 10, 70);
	camera.position.z = 3;
	camera.position.set(0, 10, 20);
	// camera.position.z = 1.9;
	const planeSize = 97; //18

	//added 5b
	const cameraHelper = new THREE.CameraHelper(camera);


	// const controls = new OrbitControls( camera, canvas );
	// controls.target.set(0, 10, 20);
	// controls.update();

	const controls = new OrbitControls( camera, canvas );
	//added 5b -  OrbitControls to respond to the first view element only.
	// const controls = new OrbitControls(camera, view1Elem);
	// controls.target.set(0, 10, 20); //0 5 0 removed
	controls.target.set(0, 0, 0); //45
	controls.update();

	//defining the scene
	const scene = new THREE.Scene(); //make a Scene
	// scene.background = new THREE.Color( 'black' );
	scene.add(cameraHelper);

	// const scene = new THREE.Scene(); //make a Scene
    // // scene.background = new THREE.Color( 'black' );

	//added 5b for GUI
	class MinMaxGUIHelper {
		constructor(obj, minProp, maxProp, minDif) {
		  this.obj = obj;
		  this.minProp = minProp;
		  this.maxProp = maxProp;
		  this.minDif = minDif;
		}
		get min() {
		  return this.obj[this.minProp];
		}
		set min(v) {
		  this.obj[this.minProp] = v;
		  this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
		}
		get max() {
		  return this.obj[this.maxProp];
		}
		set max(v) {
		  this.obj[this.maxProp] = v;
		  this.min = this.min;  // this will call the min setter
		}
	}


	{
		const loader = new THREE.TextureLoader();
		// const bgTexture = loader.load('resources/images/402170560.jpg');
		// bgTexture.colorSpace = THREE.SRGBColorSpace;
		// scene.background = bgTexture;

		const loaderC = new THREE.CubeTextureLoader();
		const textureBack = loaderC.load( [
			'resources/images/SwedishRoyalCastle/posx.jpg',
			'resources/images/SwedishRoyalCastle/negx.jpg',
			'resources/images/SwedishRoyalCastle/posy.jpg',
			'resources/images/SwedishRoyalCastle/negy.jpg',
			'resources/images/SwedishRoyalCastle/posz.jpg',
			'resources/images/SwedishRoyalCastle/negz.jpg',
		] );
		scene.background = textureBack;

		// // Load background image
		// loader.load(
		// 	'resources/images/402170560.jpg',  // replace with the path to your image
		// 	function(texture) {
		// 		scene.background = texture;
		// 	}
		// );

		// const planeSize = 60; //18

		const checkLoad = new THREE.TextureLoader();

		const texture = checkLoad.load('https://threejs.org/manual/examples/resources/images/checker.png', function(tex){
			tex.wrapS = THREE.RepeatWrapping;
			tex.wrapT = THREE.RepeatWrapping;
			tex.colorSpace = THREE.SRGBColorSpace;
			tex.repeat.set(planeSize / 2, planeSize / 2); // Adjust the texture to cover the plane appropriately
			tex.magFilter = THREE.NearestFilter;
		});
		// texture.magFilter = THREE.NearestFilter;

		// const texture = loader.load( 'https://threejs.org/manual/examples/resources/images/checker.png' );
		// texture.colorSpace = THREE.SRGBColorSpace;
		// texture.wrapS = THREE.RepeatWrapping;
		// texture.wrapT = THREE.RepeatWrapping;
		// texture.magFilter = THREE.NearestFilter;
		// const repeats = planeSize / 200;
		// texture.repeat.set( repeats, repeats );

		const planeGeo = new THREE.PlaneGeometry( planeSize, planeSize );
		const planeMat = new THREE.MeshPhongMaterial( {
			map: texture,
			side: THREE.DoubleSide,
		} );
		const mesh = new THREE.Mesh( planeGeo, planeMat );
		mesh.rotation.x = Math.PI * - .5;
		// mesh.rotation.x = -Math.PI / 2;
        mesh.position.y = -0.8; // Adjust this value so the plane lies just below all objects
		scene.add( mesh );

	}

	// {
	// 	const sphereRadius = 3;
	// 	const sphereWidthDivisions = 32;
	// 	const sphereHeightDivisions = 16;
	// 	const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
	// 	const numSpheres = 20;
	// 	for (let i = 0; i < numSpheres; ++i) {
	// 	  const sphereMat = new THREE.MeshPhongMaterial();
	// 	  sphereMat.color.setHSL(i * .73, 1, 0.5);
	// 	  const mesh = new THREE.Mesh(sphereGeo, sphereMat);
	// 	  mesh.position.set(-sphereRadius - 1, sphereRadius + 2, i * sphereRadius * -2.2);
	// 	  scene.add(mesh);
	// 	}
	// }


	// a function that will compute distance and then move the camera that distance units from the center of the box. 
	//We'll then point the camera at the center of the box
	function frameArea( sizeToFitOnScreen, boxSize, boxCenter, camera ) {

		const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
		const halfFovY = THREE.MathUtils.degToRad( camera.fov * .5 );
		const distance = halfSizeToFitOnScreen / Math.tan( halfFovY );
		// compute a unit vector that points in the direction the camera is now
		// from the center of the box
		const direction = ( new THREE.Vector3() )
												.subVectors( camera.position, boxCenter )
												.multiply( new THREE.Vector3( 1, 0, 1 ) )
												.normalize();

		// move the camera to a position distance units way from the center
		// in whatever direction the camera was from the center already
		camera.position.copy( direction.multiplyScalar( distance ).add( boxCenter ) );

		// pick some near and far values for the frustum that
		// will contain the box.
		camera.near = boxSize / 100;
		camera.far = boxSize * 100;

		camera.updateProjectionMatrix();

		// point the camera to look at the center of the box
		camera.lookAt( boxCenter.x, boxCenter.y, boxCenter.z );

	}

	//We pass in 2 sizes. The boxSize and the sizeToFitOnScreen
	{

		const objLoader = new OBJLoader();
		objLoader.load('resources/man/rp_dennis_posed_004_100k.OBJ', ( root ) => {
           
			// Choose a scale factor that makes the model the appropriate size.
			const scale = 0.09; // The scale factor. 
			root.scale.set(scale, scale, scale);
			root.position.y = 0.8;
			root.position.x = 1.7;

			scene.add( root );

             
			root.updateMatrixWorld();
			// compute the box that contains all the stuff
			// from root and below
			const box = new THREE.Box3().setFromObject( root );

			const boxSize = box.getSize( new THREE.Vector3() ).length();
			const boxCenter = box.getCenter( new THREE.Vector3() );

			// set the camera to frame the box
			frameArea( boxSize * 3, boxSize, boxCenter, camera );

			// update the Trackball controls to handle the new size
			controls.maxDistance = boxSize * 10;
			controls.target.copy( boxCenter );
			controls.update();

		} );

	}



    //BoxGeometry which contains the data for a box.
	const boxWidth = 1.3;
	const boxHeight = 1.3;
	const boxDepth = 1.3;
	const boxGeometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

	//Sphere Geometry which contains data for a circle
	const circleRadius = 0.6;
	const circleWidth = 34;
	const circleHeight = 17;
	const sphereGeometry = new THREE.SphereGeometry(circleRadius, circleWidth, circleHeight);

	//Cylinder which contains data for a cylinder
	const cylinderRadiusTop = 1;
	const cylinderRadiusBottom = 1;
	const cylinderHeight = 1.5;
	const cylinderRadialSegments = 35;
	const cylinderGeometry = new THREE.CylinderGeometry(cylinderRadiusTop, cylinderRadiusBottom, cylinderHeight, cylinderRadialSegments);


    // creates a new material with the specified color. Then it creates a 
    //mesh using the specified geometry and adds it to the scene and sets its X position.
    function makeInstance(boxGeometry, color, x) {

		//cube
        const material = new THREE.MeshPhongMaterial({color});
  
        const cube = new THREE.Mesh(boxGeometry, material);
        scene.add(cube);
 
        cube.position.x = x + 10;
 
        return cube;
    }

	function makeTextureInstance(boxGeometry, color, x) {

		const texture = loader.load( 'resources/images/maxresdefault.jpg', function(texture) {
			texture.minFilter = THREE.LinearFilter;
			texture.magFilter = THREE.NearestFilter; // This makes the texture blocky when viewed up close
			texture.needsUpdate = true;

		});
	    texture.colorSpace = THREE.SRGBColorSpace;

	    const material = new THREE.MeshBasicMaterial( {
				map: texture
		} );
	    const cube = new THREE.Mesh(boxGeometry, material );
 
        return cube;
    }

	function makeInstance(sphereGeometry, color, x){
		//sphere
		const material = new THREE.MeshPhongMaterial({color});
		const sphere = new THREE.Mesh(sphereGeometry, material);

		scene.add(sphere); 

		sphere.position.x = x;

		return sphere;
	}


	//Adding Functions to create the City World 
	function createBuilding(width, height, depth, color, x, y, z) {
		const geometry = new THREE.BoxGeometry(width, height, depth);
		const material = new THREE.MeshPhongMaterial({ color });
		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(x, y + height / 2, z);
		return mesh;
	}

	//function to create trees on the scene
	function createTree(trunkHeight, trunkRadius, crownHeight, crownRadius, x, y, z) {
		const trunkGeometry = new THREE.CylinderGeometry(trunkRadius, trunkRadius, trunkHeight, 32);
		const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
		const trunkMesh = new THREE.Mesh(trunkGeometry, trunkMaterial);
		trunkMesh.position.set(x, y + trunkHeight / 2, z);
	
		const crownGeometry = new THREE.SphereGeometry(crownRadius, 32, 32);
		const crownMaterial = new THREE.MeshPhongMaterial({ color: 0x00FF00 });
		const crownMesh = new THREE.Mesh(crownGeometry, crownMaterial);
		crownMesh.position.set(x, y + trunkHeight + crownHeight / 2, z);
	
		const group = new THREE.Group();
		group.add(trunkMesh);
		group.add(crownMesh);
		return group;
	}


	//just calling the sphere outside so that it does not move
	// makeInstance(sphereGeometry, 0x8844aa, -2);

	makeInstance(cylinderGeometry, 0x2C2C54,  1.7);
	makeInstance(sphereGeometry, 0x474787, -1.6);

    //we'll call it 3 times with 3 different colors and X positions saving the Mesh instances in an array.
    const cubes = [
        // makeInstance(boxGeometry, 0x2C2C54,  0),
        // makeInstance(sphereGeometry, 0x474787, -1.6),
        // makeInstance(cylinderGeometry, 0xaa8844,  1.7),
    ];

	const buildingHeights = [5, 10 , 15, 20, 25]; // Defined building heights
	//grid to add the buildings and trees in the city 
	const buildings = [];
	const trees = [];

	const numBuildingsX = 12; // Number of buildings along the X-axis
	const numBuildingsZ = 10; // Number of buildings along the Z-axis
	const spacing = 14; // Spacing between buildings
	
	// Calculate starting points to centralize the grid
	const startX = (planeSize - numBuildingsX * spacing) / 2;
	const startZ = (planeSize - numBuildingsZ * spacing) / 2;

	for (let i = 0; i < 5; i++) {
		for (let j = 0; j < 4; j++) {
			const heightIndex = (i + j) % buildingHeights.length; // Cycle through predefined heights
			const height = buildingHeights[heightIndex];
			// const building = createBuilding(7, height, 10, 0x555555, i*15, 0, j*15);
			const building = createBuilding(7, height, 10, 0x555555, startX + i * spacing, 0, startZ + j * spacing);
			buildings.push(building);
			scene.add(building);
		}
	}

	// // Add some trees
	// for (let i = 0; i < 10; i++) {
	// 	 const tree = createTree(4, 1, 6, 4, Math.random() * 75 - 35, 0, Math.random() * 60 - 30);
	// 	 trees.push(tree);
	// 	 scene.add(tree);
	// }
    // Function to add a row of trees along one side
	function addTreeLine(startX, startZ, endX, endZ, numTrees) {
		const deltaX = (endX - startX) / (numTrees -1);
		const deltaZ = (endZ - startZ) / (numTrees -1);
		for (let i = 0; i < numTrees; i++) {
			const x = startX + i * deltaX;
			const z = startZ + i * deltaZ;
			const tree = createTree(7, 1, 6, 4, x, -1, z);
			scene.add(tree);
		}
	}

	const treeLineCount = 7; // Adjust based on how dense tree lines to be
	const offset = 5; // Distance to move trees inward from the edge
	// Top edge
	addTreeLine(-planeSize / 2 + offset, -planeSize / 2 + offset , planeSize / 2 - offset, -planeSize / 2 + offset, treeLineCount);
    // Bottom edge
    addTreeLine(-planeSize / 2 + offset, planeSize / 2 - offset, planeSize / 2 - offset, planeSize / 2 - offset, treeLineCount);
    // Left edge
	addTreeLine(-planeSize / 2 + offset, -planeSize / 2 + offset, -planeSize / 2 + offset, planeSize / 2 - offset, treeLineCount);
    // Right edge
    addTreeLine(planeSize / 2 - offset, -planeSize / 2 + offset, planeSize / 2 - offset, planeSize / 2 - offset, treeLineCount);

    const loader = new THREE.TextureLoader();


	
	
	const cube = makeTextureInstance(boxGeometry, THREE.SRGBColorSpace, 0);
	scene.add( cube );
	cubes.push( cube ); // add to our list of cubes to rotate
    

	/* removing since we're updating everything in the render function*/

	// function updateCamera() {

	// 	camera.updateProjectionMatrix();

	// }

	/*Our helper will get the color from a named property, convert it to a hex string to offer to lil-gui. When lil-gui tries to set the helper's property we'll assign the result back to the light's color.*/
	class ColorGUIHelper {
		constructor(object, prop) {
			  this.object = object;
			  this.prop = prop;
		}
		get value() {
			  return `#${this.object[this.prop].getHexString()}`;
		}
		set value(hexString) {
			  this.object[this.prop].set(hexString);
		}
	}


	//defining the different kinds of light
	{

		const skyColor = 0x151e6a; 
		const groundColor = 0x8d1515; 
		const intensity = 3;
		const light = new THREE.HemisphereLight( skyColor, groundColor, intensity );
		scene.add( light );

	}

    // {

	// 	const color = 0xFFFFFF;
	// 	const intensity = 7;
	// 	const light = new THREE.DirectionalLight( color, intensity );
	// 	light.position.set( 4, 4, 20);
	// 	// light.target.position.set( - 5, 0, 0 );
	// 	scene.add( light );
	// 	// scene.add( light.target );

	// }

	{
		/*Ambient Light*/
		const colorA = 0xFFFFFF;
		const intensityA = 1;
		const lightA = new THREE.AmbientLight(colorA, intensityA);
		lightA.position.set( 4, 4, 20);
		scene.add(lightA);

		/*Hemisphere Light*/
		const skyHColor = 0xB1E1FF; // light blue
		const groundColor = 0xB97A20; // brownish orange
		const intensityH = 1;
		const lightH = new THREE.HemisphereLight( skyHColor, groundColor, intensityH );
		scene.add( lightH );

		/*directional light */
		const color = 0xFFFFFF;
		const intensity = 1;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(0, 10, 0);
		light.target.position.set(-5, 0, 0);
		scene.add(light);
		scene.add(light.target)

		scene.add(light);
		const gui = new GUI();
		// gui.add( camera, 'fov', 1, 180 ).onChange( updateCamera );
	
		//adding for the ambient lighting
		gui.addColor(new ColorGUIHelper(lightA, 'color'), 'value').name('Ambient Color');
		gui.add(lightA, 'intensity', 0, 2, 0.01);

		//adding for hemisphere lighting 
		gui.addColor(new ColorGUIHelper(lightH, 'color'), 'value').name('skyColor');
        gui.addColor(new ColorGUIHelper(lightH, 'groundColor'), 'value').name('groundColor');
		gui.add(lightH, 'intensity', 0, 2, 0.01);

		//camera movements
		gui.add(camera, 'fov', 1, 180);
		const minMaxGUIHelper = new MinMaxGUIHelper( camera, 'near', 'far', 0.1 );
		// gui.add(minMaxGUIHelper, 'min', 0.00001, 50, 0.00001).name('near').onChange(updateCamera);
		// gui.add( minMaxGUIHelper, 'min', 0.1, 50, 0.1 ).name( 'near' ).onChange( updateCamera );
		// gui.add( minMaxGUIHelper, 'max', 0.1, 50, 0.1 ).name( 'far' ).onChange( updateCamera );
		gui.add(minMaxGUIHelper, 'min', 0.00001, 50, 0.00001).name('near');
		gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far');

		//adding for directional lighting
		gui.addColor( new ColorGUIHelper( light, 'color' ), 'value' ).name( 'color' );
		gui.add( light, 'intensity', 0, 5, 0.01 );
		gui.add( light.target.position, 'x', - 10, 10, .01 );
		gui.add( light.target.position, 'z', - 10, 10, .01 );
		gui.add( light.target.position, 'y', 0, 10, .01 );

	}


	function resizeRendererToDisplaySize( renderer ) {

		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {

			renderer.setSize( width, height, false );

		}

		return needResize;

	}

	// function that given an element will compute the rectangle of that element that overlaps the canvas
	function setScissorForElement(elem) {
		const canvasRect = canvas.getBoundingClientRect();
		const elemRect = elem.getBoundingClientRect();
	   
		// compute a canvas relative rectangle
		const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
		const left = Math.max(0, elemRect.left - canvasRect.left);
		const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
		const top = Math.max(0, elemRect.top - canvasRect.top);
	   
		const width = Math.min(canvasRect.width, right - left);
		const height = Math.min(canvasRect.height, bottom - top);
	   
		// setup the scissor to only render to that part of the canvas
		const positiveYUpBottom = canvasRect.height - bottom;
		renderer.setScissor(left, positiveYUpBottom, width, height);
		renderer.setViewport(left, positiveYUpBottom, width, height);
	   
		// return the aspect
		return width / height;
	}

	// To animate it we'll render inside a render loop using requestAnimationFrame
    function render(time) {
		// time
        time *= 0.001;  // convert time to seconds

        // /*Added in part 2*/
        if ( resizeRendererToDisplaySize( renderer ) ) {

			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();

		}
       
		/*added in 5b*/
		resizeRendererToDisplaySize(renderer);
 
		// turn on the scissor
		renderer.setScissorTest(true);
	 
		// render the original view
		{
		  const aspect = setScissorForElement(canvas);
	 
		  // adjust the camera for this aspect
		  camera.aspect = aspect;
		  camera.updateProjectionMatrix();
		  cameraHelper.update();
	 
		  // don't draw the camera helper in the original view
		  cameraHelper.visible = false;
	 
		//   scene.background.set(texture);
	 
		  // render
		  renderer.render(scene, camera);
		}
	 
		// // render from the 2nd camera
		// {
		//   const aspect = setScissorForElement(view2Elem);
	 
		//   // adjust the camera for this aspect
		//   camera2.aspect = aspect;
		//   camera2.updateProjectionMatrix();
	 
		//   // draw the camera helper in the 2nd view
		//   cameraHelper.visible = true;
	 
		// //   scene.background.set(0x000040);
	 
		//   renderer.render(scene, camera2);
		// }

        /*Added in part 2*/

        //spin cubes
        cubes.forEach((cube, ndx) => {
            const speed = 1 + ndx * .1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        });


        // cube.rotation.x = time;
        // cube.rotation.y = time;
 
        // renderer.render(scene, camera);
 
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}


main();

