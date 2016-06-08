var scene;
var camera;
var renderer;
var plane;
var light;
var step = 0;

var KEY_CODE = {
    LEFT: 65,
    UP: 87,
    RIGHT: 68,
    DOWN: 83,
    PLUS: 107,
    MINUS: 109
};

function InitPlayer()
{
    var path = "resources/models/daleks/";
    var name = "Dalek";
    var manager = new THREE.LoadingManager();
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( path );
    mtlLoader.load( name + ".mtl", function( materials ) {
        materials.preload();
        var loader = new THREE.OBJLoader( manager );
        loader.setMaterials(materials);
        loader.setPath( path );
        loader.load(  name + ".obj", function ( object ) {
            object.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.castShadow = true;
                }
            });
            object.scale.x = 0.01;
            object.scale.y = 0.01;
            object.scale.z = 0.01;
            Player = object;
            scene.add( Player );
        } );
    });
}

function Init(){
    document.body.style.cursor = 'default';
    window.addEventListener("mousemove", MouseMove);
    window.addEventListener("mouseup", MouseUp);
    window.addEventListener("mousedown", MouseDown);
    window.addEventListener("keyup", KeyUp);
    window.addEventListener("keydown", KeyDown);
    window.addEventListener("wheel", onWheel);
    //dalekLook = new THREE.Vector3(0, 0, dalekSpeed);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45
        , window.innerWidth / window.innerHeight , 0.1, 1000);
    UpdateCam();
    InitPlayer();
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(1, 255);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    var planeGeometry = new THREE.PlaneGeometry(50, 50, 100, 100);
    var planeMaterial = new THREE.MeshLambertMaterial(
        {color: 0xffffff});
    plane = new THREE.Mesh(planeGeometry,planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);

    light = new THREE.SpotLight( 0xffffff );
    light.position.set( 100, 50, -100 );
    light.castShadow = true;
    light.shadowMapWidth = 1024;    // power of 2
    light.shadowMapHeight = 1024;
    light.shadowCameraNear = 0.01;
    light.shadowCameraFar = 500;
    light.shadowCameraFov = 10;
    light.shadowDarkness = 0.5;
    scene.add(light);
    $("#canvas").append(renderer.domElement);
    renderScene();
}