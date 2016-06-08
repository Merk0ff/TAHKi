var scene;
var camera;
var renderer;
var terrain;
var light;


function InitPlayer() {
    PlayerLook = new THREE.Vector3(0, 0, PlayerSpeed);
    PlayerRelativeCam = new THREE.Vector3(0, 0, 0);
    var path = "resources/models/daleks/";
    var name = "Dalek";
    var manager = new THREE.LoadingManager();
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath(path);
    mtlLoader.load(name + ".mtl", function (materials) {
        materials.preload();
        var loader = new THREE.OBJLoader(manager);
        loader.setMaterials(materials);
        loader.setPath(path);
        loader.load(name + ".obj", function (object) {
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            object.scale.x = 0.1;
            object.scale.y = 0.1;
            object.scale.z = 0.1;
            object.position.x = 500;
            object.position.z = 500;
            Player = object;
            scene.add(Player);
        });
    });
}

function InitTerrain() {
    var path = "resources/models/city/";
    var name = "The_City";
    var manager = new THREE.LoadingManager();
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath(path);
    mtlLoader.load(name + ".mtl", function (materials) {
        materials.preload();
        var loader = new THREE.OBJLoader(manager);
        loader.setMaterials(materials);
        loader.setPath(path);
        loader.load(name + ".obj", function (object) {
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            object.scale.x = 0.5;
            object.scale.y = 0.5;
            object.scale.z = 0.5;
            object.position.y = -20;
            object.position.x = 750;
            object.position.z = 900;
            terrain = object;
            scene.add(terrain);
        });
    });
}

function Init() {
    document.body.style.cursor = 'default';
    window.addEventListener("mousemove", MouseMove);
    window.addEventListener("mouseup", MouseUp);
    window.addEventListener("mousedown", MouseDown);
    window.addEventListener("keyup", KeyUp);
    window.addEventListener("keydown", KeyDown);
    window.addEventListener("keypress", KeyPress);
    window.addEventListener("wheel", onWheel);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45
        , window.innerWidth / window.innerHeight, 0.1, 1000);
    InitPlayer();
    InitTerrain();
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(1, 255);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    light = new THREE.DirectionalLight(0xffffff, 0.2);
    light.position.set(1, 1, 1);
    light.castShadow = false;
    light.shadow.mapSize.width = 1024;    // power of 2
    light.shadow.mapSize.height = 1024;
    /*
     light.shadow.camera.near = 0.01;
     light.shadow.camera.far = 1000;
     light.shadow.camera.fov = 10;
     */
    scene.add(light);

    PlayerLight = new THREE.SpotLight(0xff0000, 1, 300, 0.8);
    PlayerLight.position.set(1, 1, 1);
    PlayerLight.castShadow = false;
    PlayerLight.shadow.mapSize.width = 1024;
    PlayerLight.shadow.mapSize.height = 1024;
    PlayerLightTarget = new THREE.Object3D();
    PlayerLightTarget.position = new THREE.Vector3(0, 0, 0);
    PlayerLight.target = PlayerLightTarget;
    scene.add(PlayerLight);
    scene.add(PlayerLightTarget);
    lightHelper = new THREE.SpotLightHelper(PlayerLight);
    //scene.add(lightHelper);
    /* light.shadowDarkness = 0.5; */
    $("#canvas").append(renderer.domElement);
    renderScene();
}