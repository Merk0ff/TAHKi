var CameraMode = 0;

var CamAX = 1.0;
var CamAY = 0.8;
var CamL = 50.0;
function KeyPress(e) {
    switch (e.keyCode) {
        case KEY_CODE.M:
            CameraMode ^= 1;
            UpdateCam();
            break;
        case KEY_CODE.L:
            Player.Light.visible = !Player.Light.visible;
            break;
    }
}
function UpdatePlayerLight() {
    Player.Light.position.copy(Player.Model.position.clone().add(new THREE.Vector3(Player.Look.x * 5, 17, 5 * Player.Look.z)));
    Player.LightTarget.position.copy(Player.Light.position.clone().add(Player.Look));
    Player.LightHelper.update();
}

function UpdatePosition() {
    var Newposition = Player.Model.position.clone().add(Player.Look);


    // collision detection:
    //   determines if any of the rays from the cube's origin to each vertex
    //		intersects any face of a mesh in the array of target meshes
    //   for increased collision accuracy, add more vertices to the cube;
    //		for example, new THREE.CubeGeometry( 64, 64, 64, 8, 8, 8, wireMaterial )
    //   HOWEVER: when the origin of the ray is within the target mesh, collisions do not occur

    var rc = new THREE.Raycaster(Player.Model.position, Player.Look, 0, 10);

    var results = rc.intersectObjects(terrain.children, true);
    if (DetectCollision(collision_map, 5, Newposition.x, Player.Model.position.z))
           Player.Model.position.x += Player.Look.x;
    if (DetectCollision(collision_map, 5, Player.Model.position.x, Newposition.z))
           Player.Model.position.z += Player.Look.z;
    $("#debug").html("X:" + Player.Model.position.x + "<br/>Z:" + Player.Model.position.z);
}

function UpdateKeyboard() {
    if (Keys[KEY_CODE.UP]) {
        UpdatePosition();
        UpdateCam();
    }
    if (Keys[KEY_CODE.DOWN]) {
        Player.Look.negate();
        UpdatePosition();
        Player.Look.negate();
        UpdateCam();
    }
    if (Keys[KEY_CODE.RIGHT]) {
        Player.Model.rotation.y -= 0.030;
        Player.Look.x = Player.Speed * Math.sin(Player.Model.rotation.y);
        Player.Look.z = Player.Speed * Math.cos(Player.Model.rotation.y);
        UpdateCam();
    }
    if (Keys[KEY_CODE.LEFT]) {
        Player.Model.rotation.y += 0.030;
        Player.Look.x = Player.Speed * Math.sin(Player.Model.rotation.y);
        Player.Look.z = Player.Speed * Math.cos(Player.Model.rotation.y);
        UpdateCam();

    }
}

function UpdateCam() {
    switch (CameraMode) {
        case 0:
            Player.RelativeCam.x = -Player.Look.x;
            Player.RelativeCam.z = -Player.Look.z;
            Player.RelativeCam.y = CamAY;
            Player.RelativeCam.multiplyScalar(CamL);
            camera.position.copy(Player.Model.position.clone().add(Player.RelativeCam));
            camera.lookAt(Player.Model.position.clone().add(new THREE.Vector3(0, 10, 0)));
            break;
        case 1:
            Player.RelativeCam.x = Player.Look.x * 0.2;
            Player.RelativeCam.z = Player.Look.z * 0.2;
            Player.RelativeCam.y = 18;
            //PlayerRelativeCam.multiplyScalar(CamL);
            camera.position.copy(Player.Model.position.clone().add(Player.RelativeCam));
            camera.lookAt(camera.position.clone().add(Player.Look));
            break;
    }
    UpdatePlayerLight();
    /*
     camera.position.x = CamL * Math.sin(CamAX) * Math.cos(CamAY);
     camera.position.z = CamL * Math.cos(CamAX) * Math.cos(CamAY);
     camera.position.y = CamL * Math.sin(CamAY);
     camera.lookAt(scene.position);
     */
}

function Update() {
    UpdateKeyboard();
    //UpdateCam();
}