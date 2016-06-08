var Player;
/* Player Model */
var PlayerLook;
/* PLayer Look Vector */
var PlayerSpeed = 1;
/* Player speed */
var PlayerRelativeCam;
var PlayerLight;
var PlayerLightTarget;
var lightHelper;
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
            PlayerLight.visible = !PlayerLight.visible;
            break;
    }
}
function UpdatePlayerLight() {
    PlayerLight.position.copy(Player.position.clone().add(new THREE.Vector3(PlayerLook.x * 5, 17, 5 * PlayerLook.z)));
    PlayerLightTarget.position.copy(PlayerLight.position.clone().add(PlayerLook));
    lightHelper.update();
}

function UpdatePosition() {
    var Newposition = Player.position.clone().add(PlayerLook);

    if (Newposition.x > 30 && Newposition.x < 1100)
        Player.position.x += PlayerLook.x;
    if (Newposition.z > 30 && Newposition.z < 1000)
        Player.position.z += PlayerLook.z;

}

function UpdateKeyboard() {
    if (Keys[KEY_CODE.UP]) {
        UpdatePosition();
        UpdateCam();
    }
    if (Keys[KEY_CODE.RIGHT]) {
        Player.rotation.y -= 0.030;
        PlayerLook.x = PlayerSpeed * Math.sin(Player.rotation.y);
        PlayerLook.z = PlayerSpeed * Math.cos(Player.rotation.y);
        UpdateCam();
    }
    if (Keys[KEY_CODE.LEFT]) {
        Player.rotation.y += 0.030;
        PlayerLook.x = PlayerSpeed * Math.sin(Player.rotation.y);
        PlayerLook.z = PlayerSpeed * Math.cos(Player.rotation.y);
        UpdateCam();

    }
}

function UpdateCam() {
    switch (CameraMode) {
        case 0:
            PlayerRelativeCam.x = -PlayerLook.x;
            PlayerRelativeCam.z = -PlayerLook.z;
            PlayerRelativeCam.y = CamAY;
            PlayerRelativeCam.multiplyScalar(CamL);
            camera.position.copy(Player.position.clone().add(PlayerRelativeCam));
            camera.lookAt(Player.position.clone().add(new THREE.Vector3(0, 10, 0)));
            break;
        case 1:
            PlayerRelativeCam.x = PlayerLook.x * 0.2;
            PlayerRelativeCam.z = PlayerLook.z * 0.2;
            PlayerRelativeCam.y = 18;
            //PlayerRelativeCam.multiplyScalar(CamL);
            camera.position.copy(Player.position.clone().add(PlayerRelativeCam));
            camera.lookAt(camera.position.clone().add(PlayerLook));
            break;
    }
    UpdatePlayerLight();
    $("#debug").html("x: " + Player.position.x + "<br/>y: " + Player.position.y + "<br/>z: " + Player.position.z);
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