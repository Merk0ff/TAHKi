var socket;
var data = {};
function ConnectionInit() {
    socket = io(window.location.origin);
    InitErrors();
    data.roomid = $.cookie("roomid");
    data.userid = $.cookie("userid");
    data.userServerId = $.cookie("userServerId");
    socket.emit("InitGame", data);
    socket.on('BackInitGame', function (data) {
        data;
        });
}