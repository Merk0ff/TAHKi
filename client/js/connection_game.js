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