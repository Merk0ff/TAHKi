/**
 * Created by pd6 on 08.06.2016.
 */

var app;
var io;

var Users = [], UserCounter;

function getRandomArbitary(min, max) {
    return Math.random() * (max - min) + min;
}


function NewRoom(socket) {
    var RoomId = getRandomArbitary(400, 30000);

    socket.join(RoomId);
    socket.emit('NewRoomId', RoomId);
}

function JoinRoom(data, socket) {
    var send = {
        userid: data.userid,
        userServerId: UserCounter
    };

    socket.join(data.roomid);
    Users[UserCounter] = {
        id: data.id,
        team: data.team,
        roomid: data.roomid
    };
    socket.in(data.roomid).emit('NewRoomUser', send);
}

function ConnectUser() {
    io.on('connection', function (socket) {
        var address = socket.request.connection.remoteAddress;

        console.log('New connection from ' + address);
        socket.on('NewRoom', NewRoom(socket));
        socket.on('JoinRoom', JoinRoom(data, socket));
    });
}

function SendFile(res, path) {
    var fs = require('fs');

    fs.readFile(__dirname + path,
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading ' + path);
            }
            res.writeHead(200);
            res.end(data);
        });
}

function handler(req, res) {
    if (req.url == '/game') {
        ConnectUser();
        SendFile(res, '/game.html');
    }
    else if (req.url == '/room')
        SendFile(res, '/room.html');
    else {
        SendFile(res, '/Exmpl.html');
        ConnectUser();
    }

}

function SetUpServer() {
    app = require('http').createServer(handler);
    io = require('socket.io')(app);
    app.listen(8000);
}

function Main() {
    SetUpServer();
}

if (require.main === module) {
    Main();
}