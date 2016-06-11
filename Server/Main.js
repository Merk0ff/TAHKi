var StartCoords = [
    {x: 1, y: 1},
    {}
];
var app;
var io;
var http;

var Rooms = [];

function getRandomArbitary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function AddNewUser(data) {
    var send = {
        userid: data.userid,
        roomid: data.roomid,
        userServerId: Rooms[data.roomid].userCounter
    };

    Rooms[data.roomid].users[Rooms[data.roomid].userCounter] = {
        userid: data.userid,
        roomid: data.roomid
    };
    Rooms[data.roomid].userCounter++;
    return send;
}

function ConnectUser() {
    io.on('connection', function (socket) {
        var address = socket.request.connection.remoteAddress;

        console.log('New connection from ' + address);

        // Crate new room callback
        socket.on('NewRoom', function (data) {
            var RoomId = getRandomArbitary(400, 30000);

            Rooms[RoomId] = {
                id: RoomId,
                userCounter: 0,
                users: undefined,
                blteam: 0,
                reteam: 0
            };
            Rooms[RoomId].users = [];

            socket.emit('BackNewRoomId', RoomId);
        });

        // Join room callback
        socket.on('JoinRoom', function (data) {
            var send;

            for (var i = 0; i < Rooms[data.roomid].userCounter; i++)
                if (Rooms[data.roomid].users[i].userid == data.userid) {
                    socket.emit('Err', 3);
                    return;
                }
            send = AddNewUser(data);

            if (Rooms[data.roomid].userCounter >= 10) {
                socket.emit('Err', 0);
                return;
            }

            socket.join(data.roomid);

            send.users = Rooms[data.roomid].users;

            socket.emit('BackNewRoomUser', send);
        });

        // Join team callback
        socket.on('JoinTeam', function (data) {
            if (Rooms[data.roomid].users[data.userServerId].team != undefined) {
                socket.emit('Err', 2);
                return;
            }


            if (Rooms[data.roomid].reteam >= 5 || Rooms[data.roomid].blteam >= 5) {
                socket.emit('Err', 1);
                return;
            }

            Rooms[data.roomid].users[data.userServerId].team = data.team;

            if (data.team)
                Rooms[data.roomid].blteam++;
            else
                Rooms[data.roomid].reteam++;

            io.sockets.in(data.roomid).emit('BackJoinTeam', {team: data.team, userid: data.userid});
        });

        // Start game handle
        socket.on('StartGame', function (data) {
            for (var i = 0; i < Rooms[data.roomid].userCounter; i++)
                if (Rooms[data.roomid].users[i] == 0)
                    Rooms[data.roomid].users[i].coord = StartCoords[0];
                else
                    Rooms[data.roomid].users[i].coord = StartCoords[1];

            io.sockets.in(data.roomid).emit('BackStartGame', true);
        });

        // Init game handle
        socket.on('InitGame', function (data) {
            socket.emit('BackInitGame', Rooms[data.roomid].userCounter);
        });

        // Game handle
        socket.on('Game', function (data) {
            Rooms[data.roomid].users[data.userServerId].coord = data.coord;

            io.sockets.in(data.roomid).emit('BackGame', {coord: Rooms[data.roomid].users[data.userServerId].coord});
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