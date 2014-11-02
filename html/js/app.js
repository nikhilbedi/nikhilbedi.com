
// For WebGL content
var container, stats;
var camera, controls, glScene, projector, glRenderer;
var objects = [], textGeo;

var mouse = new THREE.Vector2(),
offset = new THREE.Vector3(),
INTERSECTED, SELECTED;

var clock = new THREE.Clock();

// For Fly Controls
var radius = 6371;
var tilt = 0.41;
var rotationSpeed = 0.02;

// For CSS3D
var cssRenderer, cssScene;

// For both renderers
var renderWidth = window.innerWidth;
var renderHeight = window.innerHeight;

init();
animate();
playSounds();


function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	initCamera();
	initControls(container);
	initGlScene();
	initCssScene();
	
	// Test CSS and WebGL Plane
	var material = new THREE.MeshBasicMaterial({ wireframe: true });
	var geometry = new THREE.PlaneGeometry();
	var planeMesh= new THREE.Mesh( geometry, material );
	glScene.add( planeMesh );
	objects.push( planeMesh );
	
	/*var tempElement = document.createElement( 'img' );
		tempElement.src = '../assets/img/testfile.jpg';
	var tempDiv = document.createElement( 'div' );
	var tempPg = document.createElement( 'p' );
		var tempText = document.createTextNode( 'Hey! This is a webpage in a 3D environment!' );
		tempPg.appendChild( tempText );
	tempDiv.appendChild( tempPg );
	tempDiv.appendChild( tempElement );	*/
	var tempDiv = loadHtmlFile( '../tests/sample.html' );
	var cssObject = new THREE.CSS3DObject( tempDiv );
	cssObject.position = planeMesh.position;
	cssObject.rotation = planeMesh.rotation;
	cssScene.add( cssObject );
	
	// Add Header
	createHeaderElement();
	// Add Menu
	createTableOfContentsElement();

	projector = new THREE.Projector();


	// Initial renderers, and add to the webpage
	initGlRenderer();
	container.appendChild( glRenderer.domElement );
	
	initCssRenderer();
	container.appendChild( cssRenderer.domElement );
	
	window.addEventListener( 'resize', onWindowResize, false );
}

function initCssScene() {
	cssScene = new THREE.Scene();
	cssScene.add( new THREE.AmbientLight( 0x505050 ) );
}

function initCssRenderer() {
	cssRenderer = new THREE.CSS3DRenderer();
	cssRenderer.setSize( renderWidth, renderHeight );
	cssRenderer.domElement.style.position = 'absolute';
	cssRenderer.domElement.style.top = 0;
}

function initGlRenderer() {
	glRenderer = new THREE.WebGLRenderer( { antialias: true } );
	glRenderer.setClearColor( 0xf0f0f0 );
	glRenderer.setSize( renderWidth, renderHeight );
	glRenderer.sortObjects = false;
	glRenderer.shadowMapEnabled = true;
	glRenderer.shadowMapType = THREE.PCFShadowMap;
}

function playSounds() {
	var audio = document.getElementById('bg_music');
	audio.volume = 0.0;
	//audio.play();
	audio.loop = true;
	$("#bg_music").animate({volume: 0.9}, 20000);
}

function initCamera() {
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 1000;
}

function initControls( domElement ) {
	controls = new THREE.FlyControls( camera );
	controls.movementSpeed = 100;
	controls.domElement = domElement;
	controls.rollSpeed = Math.PI / 24;
	controls.autoForward = false;
	controls.dragToLook = false;
}

/*
 * This function must be called after initCamera()
 */
function initGlScene() {
	glScene = new THREE.Scene();
	glScene.add( new THREE.AmbientLight( 0x505050 ) );

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

	glScene.add( light );

	//glScene.fog = new THREE.FogExp2( 0xe0e0e0, 0.0015 );
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

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	glRenderer.setSize( window.innerWidth, window.innerHeight );
	cssRenderer.setSize( window.innerWidth, window.innerHeight );
}

// returns a dom element
function loadHtmlFile(filename) {
	var tempDiv = document.createElement( 'div' );
	var loadCommand = '<object type="text/html" data="' + filename + '" ></object>';
	console.log(loadCommand);
	tempDiv.innerHTML = loadCommand;
	return tempDiv;
}

function animate() {
	requestAnimationFrame( animate );

	var delta = clock.getDelta();
	controls.update(delta);
	
	render();
}

function render() {
	
	//camera.position.x+=0.5;
	glRenderer.render( glScene, camera );
	cssRenderer.render( cssScene, camera );

}