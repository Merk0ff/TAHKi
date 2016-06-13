var StartCoords = [
    {x: 683, y: 255},
    {x: 172, y: 534}
]; // Start coords arry
var utils = require('./Scripts/utils'); // Utils
var app; // Express app
var io; // Socket.io handle
var http; // Http handle

var Rooms = []; // Arry of rooms

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

        // Disconect handle
        socket.on('disconnect', function (data) {
            Rooms[data.userid].userCounter--;

            if (Rooms[data.userid].users[data.userid].team == 1)
                Rooms[data.userid].blteam--;
            else
                Rooms[data.userid].reteam--;

            io.sockets.in(data.roomid).emit('Backdisconnect', {userid: data.userid});

            if (Rooms[data.userid].userCounter == 0) {
                delete Rooms[data.userid];
                return;
            }
            else
                delete Rooms[data.userid].users[data.userid];
        });

        // Crate new room callback
        socket.on('NewRoom', function (data) {
            var RoomId = utils.getRandom(1, 3000);

            while (Rooms[RoomId] != undefined)
                RoomId = utils.getRandom(1, 3000);

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

            if (Rooms[data.roomid] == undefined) {
                socket.emit('Err', 4);
                return;
            }

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
            for (var i = 0; i < Rooms[data.roomid].userCounter; i++) {
                if (Rooms[data.roomid].users[i].team == 0)
                    Rooms[data.roomid].users[i].coord = StartCoords[0];
                else
                    Rooms[data.roomid].users[i].coord = StartCoords[1];

                Rooms[data.roomid].users[i].iskill = 0;
            }

            io.sockets.in(data.roomid).emit('BackStartGame', true);
        });

        socket.on('SwichLight', function (data) {
            io.sockets.in(data.roomid).emit('BackSwichLight', data);
        });

        // Init game handle
        socket.on('InitGame', function (data) {
            socket.join(data.roomid);

            socket.emit('BackInitGame', Rooms[data.roomid].users);
        });

        // Game handle
        socket.on('Game', function (data) {
            if (Rooms[data.roomid].users[data.userid].iskill == 1)
                io.sockets.in(data.roomid).emit('Err', 5);

            Rooms[data.roomid].users[data.userServerId].coord = data.coord;
            Rooms[data.roomid].users[data.userServerId].rotation = data.rotation;
            Rooms[data.roomid].users[data.userServerId].light = data.light;
            io.sockets.in(data.roomid).emit('BackGame', Rooms[data.roomid].users);
        });

        // Shoot handle
        socket.on('Shoot', function (data) {
            var user = utils.CollDet(data.coord.x, data.coord.x + 150 * Math.sin(data.rotation),
                data.coord.y, data.coord.y + 150 * Math.cos(data.rotation), data.roomid);

            if (user != -1) {
                io.sockets.in(data.roomid).emit('BackShoot', user);
                Rooms[data.roomid].users[data.userid].iskill = 1;
            }
        });
    });
}

function Serverhandler() {
    app.get('/', function (req, res) {
        utils.SendFile(res, '/index.html');
    });

    app.get('/game', function (req, res) {
        utils.SendFile(res, '/game.html');
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

    http.listen(25565, function () {
        console.log('listening on *:25565');
    });
}

function Main() {
    SetUpServer();
}

if (require.main === module) {
    Main();
}