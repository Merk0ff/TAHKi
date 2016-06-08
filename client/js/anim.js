var Player;

var CamAX = 1.0;
var CamAY = 0.8;
var CamL = 50.0;

function UpdateKeyboard() {
    if (Keys[KEY_CODE.UP])
        obj.position.add(dalekLook);
    if (Keys[KEY_CODE.RIGHT]) {
        obj.rotation.y -= 0.1;
        dalekLook.x = dalekSpeed * Math.sin(obj.rotation.y);
        dalekLook.z = dalekSpeed * Math.cos(obj.rotation.y);
    }
    if (Keys[KEY_CODE.LEFT])
    {
        obj.rotation.y += 0.1;
        dalekLook.x = dalekSpeed * Math.sin(obj.rotation.y);
        dalekLook.z = dalekSpeed * Math.cos(obj.rotation.y);
    }
}

function UpdateCam()
{
    camera.position.x = CamL * Math.sin(CamAX) * Math.cos(CamAY);
    camera.position.z = CamL * Math.cos(CamAX) * Math.cos(CamAY);
    camera.position.y = CamL * Math.sin(CamAY);
    camera.lookAt(scene.position);
}

function Update()
{
    UpdateKeyboard();
}