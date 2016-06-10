var CameraMode = 0;

var CamAX = 1.0;
var CamAY = 0.8;
var CamL = 50.0;

function KeyPress(e) {
    switch (e.keyCode) {
        case KEY_CODE.M:
            CameraMode ^= 1;
            Player.SetCamera();
            break;
        case KEY_CODE.L:
            Player.ToggleLight();
            break;
    }
}

function UpdateKeyboard()
{
    if (Keys[KEY_CODE.UP]) {
        Player.Move();
        Player.SetCamera();
    }
    if (Keys[KEY_CODE.DOWN]) {
        Player.Look.negate();
        Player.Move();
        Player.Look.negate();
        Player.SetCamera();
    }
    if (Keys[KEY_CODE.RIGHT]) {
        Player.Rotate(-0.030);
        Player.SetCamera();
    }
    if (Keys[KEY_CODE.LEFT]) {
        Player.Rotate(0.030);
        Player.SetCamera();
    }
}

function Update() {
    UpdateKeyboard();
    Player.Update();
    Friend.Update();
    //UpdateCam();
}