var scene; // Threejs scene
var camera; // Threejs camera
var renderer; // Threejs renderer
var terrain; // Map model
var light_dir1; // Threejs global direction lightning
var light_dir2; // Threejs global direction lightning
var light_dir3; // Threejs global direction lightning
var cube; // NEED TO REMOVE
var collision_map; // Collision map for map
var stats; // Fps

var model_red; // Model of red Dalek model
var model_blue; // Model of blue Dalek model
var model_bull; // Model of bullet

function InitModels() {
    var path = "resources/models/daleks/";
    var name = "Dalek";
    NumOfLoadingModels++;
    var manager = new THREE.LoadingManager();
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath(path);
    mtlLoader.load(name + "_red.mtl", function (materials) {
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


    NumOfLoadingModels++;
    mtlLoader.setPath(path);
    mtlLoader.load(name + "_blue.mtl", function (materials) {
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
            model_blue = object;
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
    var path = "resources/models/mineways/mirage/";
    var name = "mirage";
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
            object.position.y = -95;
            object.position.x = 410;
            object.position.z = 322;
            terrain = object;
            NumOfLoadingModels--;
            scene.add(terrain);
            InitFinish();
        });
    });
}

var NumOfLoadingModels = 0; // Model load counter

function InitFinish() {
    if (NumOfLoadingModels > 0)
        return;
    ConnectionInit();
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

    light_dir1 = new THREE.DirectionalLight(0xffffff, 0.9);
    light_dir1.position.set(1, 1, 1);
    light_dir2 = new THREE.DirectionalLight(0xffffff, 0.9);
    light_dir2.position.set(-1, 1, -1);
    light_dir3 = new THREE.DirectionalLight(0xffffff, 0.30);
    light_dir3.position.set(0, -1, 0);

    /*
    light_spot = new THREE.SpotLight(0xffffff, 0.9, 5000);
    light_spot.position.set(0, 1000, 0);
    light_spot.castShadow = true;
    light_spot.shadow.mapSize.width = 1024;    // power of 2
    light_spot.shadow.mapSize.height = 1024;
    */
    //var kek = new THREE.SpotLightHelper(light_spot);
    //scene.add(kek);
    /*
     light.shadow.camera.near = 0.01;
     light.shadow.camera.far = 1000;
     light.shadow.camera.fov = 10;
     */
    scene.add(light_dir1);
    scene.add(light_dir2);
    scene.add(light_dir3);

    var imgLoader = new THREE.ImageLoader();
    imgLoader.load("./resources/models/mineways/mirage/cmap_merged.png", function (e) {
        collision_map = getImageData(e);
    });

    InitModels();
    InitTerrain();
    InitSkybox();

    /* light.shadowDarkness = 0.5; */
    $("#canvas").append(renderer.domElement);
}