/* Constructor */
function Dalek() {
        /* Player Model */
    this.Speed = 1;
    this.Look = new THREE.Vector3(0, 0, this.Speed);
    this.RelativeCam = new THREE.Vector3(0, 0, 0);
    this.Light = new THREE.SpotLight(0xff0000, 1, 300, 0.8, 0.8);
    this.Light.position.set(1, 1, 1);
    this.Light.castShadow = true;
    this.Light.shadow.mapSize.width = 1024;
    this.Light.shadow.mapSize.height = 1024;
    this.LightTarget = new THREE.Object3D();
    this.LightTarget.position = new THREE.Vector3(0, 0, 0);
    this.Light.target = this.LightTarget;
    this.LightHelper = new THREE.SpotLightHelper(this.Light);
    scene.add(this.Light);
    scene.add(this.LightTarget);
    //scene.add(this.LightHelper);
    
    var path = "resources/models/daleks/";
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
            object.position.x = 86;
            object.position.z = 570;
            NumOfLoadingModels--;
            Player.Model = object;
            InitFinish();
            scene.add(Player.Model);
        });
    });    
}

/* Funcitons */
Dalek.prototype.run = function(speed)
{
    //this.speed += speed;
    alert( this.name + ' бежит, скорость ' + this.speed );
};

Dalek.prototype.stop = function() {
    //this.speed = 0;
    alert( this.name + ' стоит' );
};
