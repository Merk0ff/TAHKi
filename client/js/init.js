var scene;
var camera;
var renderer;
var terrain;
var light;
var cube;
var collision_map;
var stats;

var model_red;
var model_blue;
var model_bull;

function InitModels() {
    var path = "resources/models/daleks/red/";
    var name = "Dalek";
    NumOfLoadingModels++;
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
            NumOfLoadingModels--;
            model_red = object;
            InitFinish();
        });
    });

    var sphereMaterial =
        new THREE.MeshBasicMaterial(
            {
                color: 0xCC0000
            });

    model_bull = new THREE.Mesh(
        new THREE.SphereGeometry(
            0.59,
            5,
            5),
        sphereMaterial);
    model_bull.position.y = 17;
}

function InitSkybox() {
    var urls = [
        'xpos',
        'xneg',
        'ypos',
        'yneg',
        'zpos',
        'zneg'
    ];
    for (var i = 0; i < 6; i++) {
        urls[i] = "././resources/textures/skybox/" + urls[i] + ".png";
    }
    var loader = new THREE.CubeTextureLoader();
    var cubemap = loader.load(urls);
    cubemap.format = THREE.RGBFormat;
    var shader = THREE.ShaderLib['cube'];
    shader.uniforms['tCube'].value = cubemap;
    var skyBoxMaterial = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
    });
    var skybox = new THREE.Mesh(
        new THREE.CubeGeometry(10000, 10000, 10000),
        skyBoxMaterial
    );
    scene.add(skybox);
}

function InitTerrain() {
    var path = "resources/models/mineways/scene1/";
    var name = "scene";
    var manager = new THREE.LoadingManager();
    var mtlLoader = new THREE.MTLLoader();
    NumOfLoadingModels++;
    mtlLoader.setPath(path);
    mtlLoader.load(name + ".mtl", function (materials) {
        materials.magFilter = THREE.NearestFilter;
        materials.minFilter = THREE.LinearMipMapLinearFilter;
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
            object.scale.x = 74;
            object.scale.y = 74;
            object.scale.z = 74;
            object.position.y = -22;
            object.position.x = 262;
            object.position.z = 322;
            terrain = object;
            NumOfLoadingModels--;
            scene.add(terrain);
            InitFinish();
        });
    });
}

var NumOfLoadingModels = 0;

function InitFinish() {
    if (NumOfLoadingModels > 0)
        return;
    ConnectionInit();
    window.addEventListener("mousemove", MouseMove);
    window.addEventListener("mouseup", MouseUp);
    window.addEventListener("mousedown", MouseDown);
    window.addEventListener("keyup", KeyUp);
    window.addEventListener("keydown", KeyDown);
    window.addEventListener("keypress", KeyPress);
    window.addEventListener("wheel", onWheel);
    Player.SetCamera();
    renderScene();
    $("#splash").fadeOut("slow");
}

function Init() {
    stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);
    document.body.style.cursor = 'default';
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45
        , window.innerWidth / window.innerHeight, 0.1, 10000);
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(1, 255);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    cube = new THREE.Mesh(new THREE.CubeGeometry(30, 30, 30), new THREE.MeshNormalMaterial());
    //scene.add(cube);

    light = new THREE.DirectionalLight(0xffffff, 0.9);
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

    var imgLoader = new THREE.ImageLoader();
    imgLoader.load("./resources/models/mineways/scene1/collision_map.png", function (e) {
        collision_map = getImageData(e);
    });

    InitModels();
    InitTerrain();
    InitSkybox();

    /* light.shadowDarkness = 0.5; */
    $("#canvas").append(renderer.domElement);
}