import * as THREE from 'three';
// import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	const fov = 12; 
	const aspect = 2; // the canvas default
	const near = 0.01;
	const far = 0.01;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set(1, 10, 70);
	// camera.position.z = 1.9;

	const controls = new OrbitControls( camera, canvas );
	controls.target.set(0, 10, 20);
	controls.update();

	const scene = new THREE.Scene(); //make a Scene
    // scene.background = new THREE.Color( 'black' );

    {
		const loader = new THREE.TextureLoader();

		// Load background image
		loader.load(
			'resources/images/402170560.jpg',  // replace with the path to your image
			function(texture) {
				scene.background = texture;
			}
		);

		const planeSize = 6;

		const texture = loader.load('https://threejs.org/manual/examples/resources/images/checker.png', function(tex){
			tex.wrapS = THREE.RepeatWrapping;
			tex.wrapT = THREE.RepeatWrapping;
			tex.repeat.set(planeSize / 2, planeSize / 2); // Adjust the texture to cover the plane appropriately
		});
		texture.magFilter = THREE.NearestFilter;

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
		// mesh.rotation.x = Math.PI * - .5;
		mesh.rotation.x = -Math.PI / 2;
        mesh.position.y = -0.8; // Adjust this value so the plane lies just below all objects
		scene.add( mesh );

	}

    {

		const skyColor = 0x151e6a; 
		const groundColor = 0x8d1515; 
		const intensity = 3;
		const light = new THREE.HemisphereLight( skyColor, groundColor, intensity );
		scene.add( light );

	}

    {

		const color = 0xFFFFFF;
		const intensity = 7;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( 4, 4, 20);
		// light.target.position.set( - 5, 0, 0 );
		scene.add( light );
		// scene.add( light.target );

	}


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
			const scale = 0.02; // The scale factor. 
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

    // {

	// 	const mtlLoader = new MTLLoader();
	// 	mtlLoader.load( 'https://threejs.org/manual/examples/resources/models/windmill_2/windmill-fixed.mtl', ( mtl ) => {

	// 		mtl.preload();
	// 		const objLoader = new OBJLoader();
	// 		// mtl.materials.Material.side = THREE.DoubleSide;
	// 		objLoader.setMaterials( mtl );
	// 		objLoader.load( 'https://threejs.org/manual/examples/resources/models/windmill_2/windmill.obj', ( root ) => {

	// 			scene.add( root );
				
	// 			// compute the box that contains all the stuff
	// 			// from root and below
	// 			const box = new THREE.Box3().setFromObject( root );

	// 			const boxSize = box.getSize( new THREE.Vector3() ).length();
	// 			const boxCenter = box.getCenter( new THREE.Vector3() );

	// 			// set the camera to frame the box
	// 			frameArea( boxSize * 1.2, boxSize, boxCenter, camera );

	// 			// update the Trackball controls to handle the new size
	// 			controls.maxDistance = boxSize * 10;
	// 			controls.target.copy( boxCenter );
	// 			controls.update();

	// 		} );
	// 	} );

	// }


    //BoxGeometry which contains the data for a box.
	const boxWidth = 1;
	const boxHeight = 1;
	const boxDepth = 1;
	const boxGeometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

	//Sphere Geometry which contains data for a circle
	const circleRadius = 0.6;
	const circleWidth = 34;
	const circleHeight = 17;
	const sphereGeometry = new THREE.SphereGeometry(circleRadius, circleWidth, circleHeight);

	//Cylinder which contains data for a cylinder
	const cylinderRadiusTop = 0.4;
	const cylinderRadiusBottom = 0.4;
	const cylinderHeight = 1.6;
	const cylinderRadialSegments = 32;
	const cylinderGeometry = new THREE.CylinderGeometry(cylinderRadiusTop, cylinderRadiusBottom, cylinderHeight, cylinderRadialSegments);


    // creates a new material with the specified color. Then it creates a 
    //mesh using the specified geometry and adds it to the scene and sets its X position.
    function makeInstance(boxGeometry, color, x) {

		//cube
        const material = new THREE.MeshPhongMaterial({color});
  
        const cube = new THREE.Mesh(boxGeometry, material);
        scene.add(cube);
 
        cube.position.x = x;
 
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
    const loader = new THREE.TextureLoader();

	// const texture = loader.load( 'https://threejs.org/manual/examples/resources/images/wall.jpg' );
	// texture.colorSpace = THREE.SRGBColorSpace;

	// const material = new THREE.MeshBasicMaterial( {
	// 	map: texture
	// } );
	// const cube = new THREE.Mesh( geometry, material );
	
	
	const cube = makeTextureInstance(boxGeometry, THREE.SRGBColorSpace, 0);
	scene.add( cube );
	cubes.push( cube ); // add to our list of cubes to rotate


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

	// To animate it we'll render inside a render loop using requestAnimationFrame
    function render(time) {
        time *= 0.001;  // convert time to seconds

        /*Added in part 2*/
        if ( resizeRendererToDisplaySize( renderer ) ) {

			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();

		}

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
 
        renderer.render(scene, camera);
 
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}


main();

