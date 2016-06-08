var MouseFlag = false;
var MouseX = -1;
var MouseY = -1;
var Keys = [];

function MouseUp(e)
{
    MouseFlag = false;
}

function MouseMove(e)
{
    if (MouseFlag)
    {
        CamAX += (e.clientX - MouseX) / 100.0;
        CamAY += (e.clientY - MouseY) / 100.0;
        UpdateCam();
        MouseX = e.clientX;
        MouseY = e.clientY;
    }
}

function MouseDown(e)
{
    MouseFlag = true;
    MouseX = e.clientX;
    MouseY = e.clientY;
}

function KeyDown(e)
{
    Keys[e.keyCode] = true;
}

function KeyUp(e)
{
    Keys[e.keyCode] = false;
}

function onWheel(e) {
    e = e || window.event;
    // wheelDelta ?? ???? ??????????? ?????? ?????????? ????????
    var delta = e.deltaY || e.detail || e.wheelDelta;
    CamL += delta / 30.0;
    UpdateCam();
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
}