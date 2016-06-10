
function GetData() {
    socket.on('BackNewRoomUser', function (backdata) {
        data.userid = backdata.userid;
        data.userServerId = backdata.userServerId;
    });
    
    socket.on('BackNewRoomId', function (backdata) {
        data.roomid = backdata;
    });
}

function CreateRoom() {
    socket.emit('NewRoom', data);
}

function JoinRoom(nick, roomid) {
    data.userid = nick;
    data.roomid = roomid;
    
    socket.emit('JoinRoom', data);
}