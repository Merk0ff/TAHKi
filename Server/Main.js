/**
 * Created by pd6 on 08.06.2016.
 */

var app;
var io;
var http;

var Users = [], UserCounter = 0;

function getRandomArbitary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function AddNewUser(data) {
    var send = {
        userid: data.userid,
        userServerId: UserCounter
    };

    Users[UserCounter] = {
        userid: data.userid,
        roomid: data.roomid
    };

    UserCounter++;

    return send;
}

function ConnectUser() {
    io.on('connection', function (socket) {
        var address = socket.request.connection.remoteAddress;

        console.log('New connection from ' + address);

        // Crate new room callback
        socket.on('NewRoom', function (data) {
            var RoomId = getRandomArbitary(400, 30000);

            socket.emit('BackNewRoomId', RoomId);
        });

        // Join room callback
        socket.on('JoinRoom', function (data) {
            var send = AddNewUser(data);
            socket.join(data.roomid.toString());

            io.sockets.in(data.roomid.toString()).emit('BackNewRoomUser', send);
        });
    });
}

function SendFile(res, path) {
    var fs = require('fs');

    fs.readFile('../client' + path,
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading ' + path);
            }
            res.writeHead(200);
            res.end(data);
        });
}

function Serverhandler() {
    app.get('/', function (req, res) {
        SendFile(res, '/index.html');
        ConnectUser();
    });

    app.get('/game', function (req, res) {
        SendFile(res, '/game.html');
    });

}

function SetUpServer() {
    var exp = require('express');
    app = exp();
    http = require('http').Server(app);
    io = require('socket.io')(http);

    Serverhandler();
    app.use(exp.static('../client'));

    http.listen(3000, function () {
        console.log('listening on *:3000');
    });
}

function Main() {
    SetUpServer();
}

if (require.main === module) {
    Main();
}