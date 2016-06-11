/**
 * Created by pd6 on 08.06.2016.
 */

var app;
var io;
var http;

var Users = [], UserCounter = 0, Rooms = [];

function getRandomArbitary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function AddNewUser(data) {
    var send = {
        userid: data.userid,
        roomid: data.roomid,
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

        //io.sockets.removeAllListeners();

        console.log('New connection from ' + address);

        // Crate new room callback
        socket.on('NewRoom', function (data) {
            var RoomId = getRandomArbitary(400, 30000);

            Rooms[RoomId] = {
                id: RoomId,
                users: undefined,
                blteam: 0,
                reteam: 0
            };
            Rooms[RoomId].users = [];

            socket.emit('BackNewRoomId', RoomId);
        });

        // Join room callback
        socket.on('JoinRoom', function (data) {
            var send = AddNewUser(data);
            
            if (Rooms[data.roomid].users.length >= 10)
                socket.emit('Err', 0);

            socket.join(data.roomid.toString());
            Rooms[data.roomid].users.push(data);

            send.users = Rooms[data.roomid].users;

            socket.emit('BackNewRoomUser', send);
        });

        // Join team callback
        socket.on('JoinTeam', function (data) {
            Users[data.userServerId].team = data.team;

            if (Rooms[data.roomid].reteam >= 5 || Rooms[data.roomid].blteam >= 5)
                socket.emit('Err', 1);

            if (data.team)
                Rooms[data.roomid].blteam++;
            else
                Rooms[data.roomid].reteam++;
            
            io.sockets.in(data.roomid.toString()).emit('BackJoinTeam', {team: data.team, userid: data.userid});
        });

        /*
        socket.on('disconnect', function () {
        });
        */
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

    ConnectUser();
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