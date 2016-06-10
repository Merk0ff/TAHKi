
function GetData() {
    socket.on('BackNewRoomUser', function (backdata) {
        data.userid = backdata.userid;
        data.userServerId = backdata.userServerId;
        /*****/
    });
    
    socket.on('BackNewRoomId', function (backdata) {
        data.roomid = backdata;
        $("#RoomIdLabel").text("Your room name");
        $("#RoomId").val(data.roomid.toString());
        $("#RoomId").attr("readonly", "readonly");
        $("#drop").slideDown("fast");
        JoinRoom($("#RoomId").val(), data.roomid);
    });
}

function CreateRoom() {
    socket.emit('NewRoom', data);
}

function JoinRoom(nick, roomid) {
    data.userid = nick;
    data.roomid = roomid;
    
    socket.emit('JoinRoom', data);
    $("#teams").show("fast");
}