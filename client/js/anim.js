var CameraMode = 0;

var CamAX = 1.0;
var CamAY = 0.8;
var CamL = 50.0;

function KeyPress(e) {
    switch (e.keyCode) {
        case KEY_CODE.M:
            CameraMode ^= 1;
            players[mydata.userid].SetCamera();
            break;
        case KEY_CODE.L:
            players[mydata.userid].ToggleLight();
            break;
        case KEY_CODE.SPACE:
            BulletLaunch(VecSet2(Player.Model.position.x, players[mydata.userid].Model.position.z), VecSet2(players[mydata.userid].Look.x, players[mydata.userid].Look.z));
            break;
    }
}

function UpdateKeyboard()
{
    if (Keys[KEY_CODE.UP]) {
        players[mydata.userid].Move();
        players[mydata.userid].SetCamera();
    }
    if (Keys[KEY_CODE.DOWN]) {
        players[mydata.userid].Look.negate();
        players[mydata.userid].Move();
        players[mydata.userid].Look.negate();
        players[mydata.userid].SetCamera();
    }
    if (Keys[KEY_CODE.RIGHT]) {
        players[mydata.userid].Rotate(-0.030);
        players[mydata.userid].SetCamera();
    }
    if (Keys[KEY_CODE.LEFT]) {
        players[mydata.userid].Rotate(0.030);
        players[mydata.userid].SetCamera();
    }
}

function Update() {
    for (var i = 0; i < Entities.length; i++)
    {
        if (Entities[i] != undefined) {
            Entities[i].Update();
            if (!Entities[i].IsAlive()) {
                Entities[i].Destroy();
                EntityRemove(i);
            }
        }
    }
    UpdateKeyboard();
    players[mydata.userid].Update();
    Response();
    //Friend.Update();
    //UpdateCam();
}