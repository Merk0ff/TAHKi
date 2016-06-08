var Player; /* Player Model */
var PlayerLook; /* PLayer Look Vector */
var PlayerSpeed = 1; /* Player speed */
var PlayerRelativeCam;
var PlayerLight;
var PlayerLightTarget;
var lightHelper;

var CamAX = 1.0;
var CamAY = 0.8;
var CamL = 50.0;
function UpdatePlayerLight()
{
    PlayerLight.position.copy(Player.position.clone().add(new THREE.Vector3(PlayerLook.x * 5, 20, 5 * PlayerLook.z)));
    PlayerLightTarget.position.copy(PlayerLight.position.clone().add(PlayerLook));
    lightHelper.update();
}

function UpdateKeyboard() {
    if (Keys[KEY_CODE.UP])
    {
        Player.position.add(PlayerLook);
        UpdateCam(true);
    }
    if (Keys[KEY_CODE.RIGHT]) {
        Player.rotation.y -= 0.1;
        PlayerLook.x = PlayerSpeed * Math.sin(Player.rotation.y);
        PlayerLook.z = PlayerSpeed * Math.cos(Player.rotation.y);
        UpdateCam(true);
    }
    if (Keys[KEY_CODE.LEFT])
    {
        Player.rotation.y += 0.1;
        PlayerLook.x = PlayerSpeed * Math.sin(Player.rotation.y);
        PlayerLook.z = PlayerSpeed * Math.cos(Player.rotation.y);
        UpdateCam(true);
    }
}

function UpdateCam(MouseFlag)
{
    if(MouseFlag)
    {
        PlayerRelativeCam.x = -PlayerLook.x;
        PlayerRelativeCam.z = -PlayerLook.z;
        PlayerRelativeCam.y = CamAY;
        PlayerRelativeCam.multiplyScalar(CamL);
        camera.position.copy(Player.position.clone().add(PlayerRelativeCam));
        camera.lookAt(Player.position.clone().add(new THREE.Vector3(0, 10, 0)));
        UpdatePlayerLight();
    }
    else
    {
        return;
        camera.position.x = CamL * Math.sin(CamAX) * Math.cos(CamAY);
        camera.position.z = CamL * Math.cos(CamAX) * Math.cos(CamAY);
        camera.position.y = CamL * Math.sin(CamAY);
        camera.lookAt(scene.position);
    }
}

function Update()
{
    UpdateKeyboard();
    //UpdateCam();
}