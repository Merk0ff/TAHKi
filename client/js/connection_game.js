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
}

function Response() {
    socket.emit("Game", players[mydata.userid].GetPosition());
    socket.on('BackGame', function (data) {
        for (var i = 0; i < data.length; i++) {
            players[data[i].userid].SetPosition(data[i].coord);
        }        
    });
}