var container, stats;
var camera, controls, scene, projector, renderer;
var objects = [], plane, textGeo;

var mouse = new THREE.Vector2(),
offset = new THREE.Vector3(),
INTERSECTED, SELECTED;

var clock = new THREE.Clock();

var radius = 6371;
			var tilt = 0.41;
			var rotationSpeed = 0.02;

init();
animate();
playSounds();


function playSounds() {
	var audio = document.getElementById('bg_music');
	audio.volume = 0.0;
	//audio.play();
	audio.loop = true;
	$("#bg_music").animate({volume: 0.9}, 20000);
}

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 1000;

	controls = new THREE.FlyControls( camera );
	controls.movementSpeed = 100;
	controls.domElement = container;
	controls.rollSpeed = Math.PI / 24;
	controls.autoForward = false;
	controls.dragToLook = false;

	scene = new THREE.Scene();

	scene.add( new THREE.AmbientLight( 0x505050 ) );

	var light = new THREE.SpotLight( 0xffffff, 1.5 );
	light.position.set( 0, 500, 2000 );
	light.castShadow = true;

	light.shadowCameraNear = 200;
	light.shadowCameraFar = camera.far;
	light.shadowCameraFov = 50;

	light.shadowBias = -0.00022;
	light.shadowDarkness = 0.5;

	light.shadowMapWidth = 2048;
	light.shadowMapHeight = 2048;

	scene.add( light );
	// Add fog
	scene.fog = new THREE.FogExp2( 0xe0e0e0, 0.0015 );
	
	// Load texture for planes
	var img = new THREE.MeshBasicMaterial({
        map:THREE.ImageUtils.loadTexture('../assets/img/testfile.jpg')
    });
    img.map.needsUpdate = true; //ADDED
	
	// Add planes
	var geometry = new THREE.PlaneGeometry(5, 20);
	for ( var i = 0; i < 200; i ++ ) {

		var object = new THREE.Mesh( geometry, img); // new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

		object.material.ambient = object.material.color;

		object.position.x = Math.random() * 1000 - 500;
		object.position.y = Math.random() * 600 - 300;
		object.position.z = Math.random() * 800 - 400;

		object.rotation.x = Math.random() * 2 * Math.PI;
		object.rotation.y = Math.random() * 2 * Math.PI;
		object.rotation.z = Math.random() * 2 * Math.PI;

		object.scale.x = Math.random() * 2 + 1;
		object.scale.y = Math.random() * 2 + 1;
		//object.scale.z = 0;//Math.random() * 2 + 1;

		object.castShadow = true;
		object.receiveShadow = true;

		scene.add( object );

		objects.push( object );

	}
	
	// add text
	//initText();
	
	// Add Header
	createHeaderElement();
	// Add Menu
	createTableOfContentsElement();

	plane = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.25, transparent: true, wireframe: true } ) );
	plane.visible = false;
	scene.add( plane );

	projector = new THREE.Projector();

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setClearColor( 0xf0f0f0 );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.sortObjects = false;

	renderer.shadowMapEnabled = true;
	renderer.shadowMapType = THREE.PCFShadowMap;

	container.appendChild( renderer.domElement );


	renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
	renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
	renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );

	window.addEventListener( 'resize', onWindowResize, false );

}

function createHeaderElement() {
	var info = document.createElement( 'div' );
	info.style.position = 'absolute';
	info.style.top = '10px';
	info.style.width = '100%';
	info.style.textAlign = 'center';
	info.innerHTML = 'Site under construction... Feel free to interact with my sandbox.';
	container.appendChild( info );
}

function createSoundElement() {

}

function createTableOfContentsElement() {
	var menu = document.createElement( 'div' );
	var table_of_contents = document.createElement( 'ul' );
	
	// Actual contents of table of contents
	var item1 = document.createElement ( 'li' );
	item1.innerHTML = "About Me";
	$("li").click(function () {
		alert("Worked!");
	});
	var item2 = document.createElement ( 'li' );
	item2.innerHTML = "Projects";
	var item3 = document.createElement ( 'li' );
	item3.innerHTML = "Games";
	
	// Append the created items to our 'ul'
	table_of_contents.appendChild(item1);
	table_of_contents.appendChild(item2);
	table_of_contents.appendChild(item3);
	
	// Set up the menu div with some properties
	menu.style.position = 'absolute';
	menu.style.top = '10px';
	menu.style.width = '10%';
	menu.style.textAlign = 'left';
	menu.appendChild(table_of_contents);
	
	// Put it all back into the dom
	container.appendChild (menu);
}

function initText() {
	//var textmaterial = new THREE.MeshFaceMaterial( [ 
		//			new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } ), // front
			//		new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) // side
	textGeo = new THREE.TextGeometry( "Hello World!", {

		size: 700,
		height: 20,
		curveSegments: 4,

		font: "helvetiker",
		weight: "normal",
		style: "normal",

	});
	scene.add(textGeo);
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

	event.preventDefault();

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	//

	var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
	projector.unprojectVector( vector, camera );

	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );


	if ( SELECTED ) {
	
		var intersects = raycaster.intersectObject( plane );
		SELECTED.position.copy( intersects[ 0 ].point.sub( offset ) );
		return;

	}


	var intersects = raycaster.intersectObjects( objects );

	if ( intersects.length > 0 ) {

		if ( INTERSECTED != intersects[ 0 ].object ) {

			if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

			INTERSECTED = intersects[ 0 ].object;
			INTERSECTED.currentHex = INTERSECTED.material.color.getHex();

			plane.position.copy( INTERSECTED.position );
			plane.lookAt( camera.position );

		}

		container.style.cursor = 'pointer';

	} else {

		if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

		INTERSECTED = null;

		container.style.cursor = 'auto';

	}

}

function onDocumentMouseDown( event ) {

	event.preventDefault();

	var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
	projector.unprojectVector( vector, camera );

	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

	var intersects = raycaster.intersectObjects( objects );

	if ( intersects.length > 0 ) {

		controls.enabled = false;

		SELECTED = intersects[ 0 ].object;

		var intersects = raycaster.intersectObject( plane );
		offset.copy( intersects[ 0 ].point ).sub( plane.position );

		container.style.cursor = 'move';
	}

}

function onDocumentMouseUp( event ) {

	event.preventDefault();

	controls.enabled = true;

	if ( INTERSECTED ) {

		plane.position.copy( INTERSECTED.position );

		SELECTED = null;

	}

	container.style.cursor = 'auto';

}

//

function animate() {

	requestAnimationFrame( animate );

	render();


}

function render() {
	var delta = clock.getDelta();
	controls.update(delta);
	//camera.position.x+=0.5;
	renderer.render( scene, camera );

}