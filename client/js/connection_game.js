var socket;
var mydata = {};
var count_red;
var count_blue;

function ConnectionInit() {
    socket = io(window.location.origin);
    InitErrors();
    mydata.roomid = $.cookie("roomid");
    mydata.userid = $.cookie("userid");
    mydata.userServerId = $.cookie("userServerId");
    socket.emit("InitGame", mydata);
    socket.on('BackInitGame', function (data) {
        for (var i = 0; i < data.length; i++) {
            AddPlayer(data[i].userid, "red");
            players[data[i].userid].SetPosition(data[i].coord);
        }
        window.addEventListener("mousemove", MouseMove);
        window.addEventListener("mouseup", MouseUp);
        window.addEventListener("mousedown", MouseDown);
        window.addEventListener("keyup", KeyUp);
        window.addEventListener("keydown", KeyDown);
        window.addEventListener("keypress", KeyPress);
        window.addEventListener("wheel", onWheel);
        renderScene();
        $("#splash").fadeOut("slow");
    });
    socket.on('BackGame', function (data) {
        for (var i = 0; i < data.length; i++) {
            players[data[i].userid].SetPosition(data[i].coord);
            players[data[i].userid].SetRotate(data[i].rotation);
            players[data[i].userid].Light.visible = data[i].light;
            players[data[i].userid].Update();
        }
    });
}

function Response() {
    mydata.coord = players[mydata.userid].GetPosition();
    mydata.rotation = players[mydata.userid].Model.rotation.y;
    mydata.light = players[mydata.userid].Light.visible;
    socket.emit("Game", mydata);
}