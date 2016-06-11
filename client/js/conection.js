var index_red = 1;
var index_blue = 1;

function GetData() {
    socket.on('BackJoinTeam', function (backdata) {
        if (backdata.team == 0) {
            $("#red_" + index_red).text(backdata.userid);
            index_red++;
        }
        else if (backdata.team == 1) {
            $("#blue_" + index_blue).text(backdata.userid);
            index_blue++;
        }
    });
    socket.on('BackNewRoomUser', function (backdata) {
        data.userid = backdata.userid;
        data.userServerId = backdata.userServerId;
        data.roomid = backdata.roomid;
    });

    socket.on('BackNewRoomId', function (backdata) {
        data.roomid = backdata;
        $("#RoomIdLabel").text("Your room name");
        $("#RoomId").val(data.roomid.toString());
        $("#RoomId").attr("readonly", "readonly");
        $("#drop").slideDown("fast");
        JoinRoom($("#Nick").val(), data.roomid);
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

function JoinTeam(Team) {
    data.team = Team;
    socket.emit('JoinTeam', data);
}