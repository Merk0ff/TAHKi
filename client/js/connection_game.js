var socket; // Socket by socket.io for game
var mydata = {}; // Data of 'this' player

function ConnectionInit() {
    socket = io(window.location.origin);
    $(window).bind("beforeunload", function () {
        socket.emit('Disco', mydata);
    });
    InitErrors();
    mydata.roomid = $.cookie("roomid");
    mydata.userid = $.cookie("userid");
    mydata.userServerId = $.cookie("userServerId");
    socket.emit("InitGame", mydata);
    socket.on('BackInitGame', function (data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].team == 0)
                AddPlayer(data[i].userid, "red");
            else if (data[i].team == 1)
                AddPlayer(data[i].userid, "blue");
            players[data[i].userid].SetPosition(data[i].coord);
        }
        window.addEventListener("mousemove", MouseMove);
        window.addEventListener("mouseup", MouseUp);
        window.addEventListener("mousedown", MouseDown);
        window.addEventListener("keyup", KeyUp);
        window.addEventListener("keydown", KeyDown);
        window.addEventListener("keypress", KeyPress);
        window.addEventListener("wheel", onWheel);
        $(window).resize(function () {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
            players[mydata.userid].SetCamera();
        });
        players[mydata.userid].SetCamera();
        renderScene();
        players[mydata.userid].SetCamera();
        setInterval(Update, 30);
        setInterval(UpdateKeyboard, 20);
    });
    socket.on("BackDiscoGame", function (data) {
        RemovePlayer(data);
    });
    socket.on('BackGame', function (data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].userid != mydata.userid) {
                players[data[i].userid].SetPosition(data[i].coord);
                players[data[i].userid].SetRotate(data[i].rotation);
                players[data[i].userid].Light.visible = data[i].light;
                //players[data[i].userid].Update();
            }
        }
    });
    $("#splash").fadeOut("slow");
}

function Response() {
    mydata.coord = players[mydata.userid].GetPosition();
    mydata.rotation = players[mydata.userid].Model.rotation.y;
    socket.emit("Game", mydata);
}