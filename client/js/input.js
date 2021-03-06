var MouseFlag = false; // Mouse button down flag
var MouseX = -1; // Mouse x cord
var MouseY = -1; // Mouse y cord
var Keys = []; // Keys clicked


var KEY_CODE = {
    LEFT: 65,
    UP: 87,
    RIGHT: 68,
    DOWN: 83,
    Q: 81,
    E: 69,
    PLUS: 107,
    M: 109,
    L: 108,
    SPACE: 32,
    DOTA: 192
};

function MouseUp(e) {
    MouseFlag = false;
}

function MouseMove(e) {
    if (MouseFlag) {
        CamAX += (e.clientX - MouseX) / 100.0;
        CamAY += (e.clientY - MouseY) / 100.0;
        players[mydata.userid].SetCamera();
        MouseX = e.clientX;
        MouseY = e.clientY;
    }
}

function MouseDown(e) {
    MouseFlag = true;
    MouseX = e.clientX;
    MouseY = e.clientY;
    return false;
}

function KeyDown(e) {
    Keys[e.keyCode] = true;
}

function KeyUp(e) {
    Keys[e.keyCode] = false;
}

function onWheel(e) {
    e = e || window.event;
    // wheelDelta ?? ???? ??????????? ?????? ?????????? ????????
    var delta = e.deltaY || e.detail || e.wheelDelta;
    CamL += delta / 30.0;
    players[mydata.userid].SetCamera();
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
}