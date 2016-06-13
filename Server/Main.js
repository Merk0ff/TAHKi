var StartCoords = [
    {x: 683, y: 255},
    {x: 172, y: 534}
]; // Start coords arry
var utils = require('./Scripts/utils'); // Utils module
var app; // Express app
var io; // Socket.io handle
var http; // Http handle

var Rooms = []; // Arry of rooms

var CollDet = function (x0, x1, y0, y1, roomid, userServerId) {
    var usersid = [], userCounter = 0;

    if (x0 > x1) {
        var t = x0;
        x0 = x1;
        x1 = t;
    }

    if (y0 > y1) {
        var t = y0;
        y0 = y1;
        y1 = t;
    }

    for (var i = 0; i < Rooms[roomid].userCounter; i++)
        if (Rooms[roomid].users[i].team != Rooms[roomid].users[userServerId].team)
            if (Rooms[roomid].users[i].coord.x > x0 && Rooms[roomid].users[i].coord.x < x1
                && Rooms[roomid].users[i].coord.y > y0 && Rooms[roomid].users[i].coord.y < y1) {
                usersid[userCounter] = i;
                userCounter++;
            }
    var deltaX = x1 - x0;
    var deltaY = y1 - y0;
    var error = deltaX - deltaY;
    while (x0 <= x1 || y0 <= y1) {
        for (var i = 0; i < userCounter; i++) {
            if (x0 > Rooms[roomid].users[usersid[i]].coord.x - 20 && x0 < Rooms[roomid].users[usersid[i]].coord.x + 20
                && y0 > Rooms[roomid].users[usersid[i]].coord.y - 20 && y0 < Rooms[roomid].users[usersid[i]].coord.y + 20) {
                return Rooms[roomid].users[usersid[i]];
            }
        }

        var error2 = error * 2;
        if (error2 > -deltaY) {
            error -= deltaY;
            x0 += 1;
        }
        if (error2 < deltaX) {
            error += deltaX;
            y0 += 1;
        }
    }

    return -1;
};

function StartRound(roomid) {
    for (var i = 0; i < Rooms[roomid].userCounter; i++) {
        if (Rooms[roomid].users[i].team == 0)
            Rooms[roomid].users[i].coord = StartCoords[0];
        else
            Rooms[roomid].users[i].coord = StartCoords[1];

    }

    Rooms[roomid].users[i].iskill = 0;
    Rooms[roomid].blinround = Rooms[data.roomid].blteam;
    Rooms[roomid].reinround = Rooms[data.roomid].reteam;
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

        // Disconect handle
        socket.on('Disco', function (data) {
            console.log('Disconnect from server' + socket.request.connection.remoteAddress);
            if (data.roomid == undefined)
                return;
            Rooms[data.roomid].userCounter--;

            if (Rooms[data.roomid].users[data.userServerId].team != undefined)
                if (Rooms[data.roomid].users[data.userServerId].team == 1)
                    Rooms[data.roomid].blteam--;
                else
                    Rooms[data.roomid].reteam--;

            if (Rooms[data.roomid].users[data.userServerId].reinround != undefined && Rooms[data.roomid].users[data.userServerId].reinround != 0)
                Rooms[data.roomid].users[data.userServerId].reinround--;

            if (Rooms[data.roomid].users[data.userServerId].blinround != undefined && Rooms[data.roomid].users[data.userServerId].blinround != 0)
                Rooms[data.roomid].users[data.userServerId].reinround--;

            io.sockets.in(data.roomid).emit('BackDiscoGame', data.userid);

            if (Rooms[data.roomid].userCounter == 0) {
                delete Rooms[data.roomid];
                return;
            }
            else {
                delete Rooms[data.roomid].users[data.userServerId];
                Rooms[data.roomid].users.length--;
                io.sockets.in(data.roomid).emit('BackDiscoLobby', Rooms[data.roomid].users);
            }
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
                StartRound(data.roomid);
                Rooms[data.roomid].blcount = 0;
                Rooms[data.roomid].recount = 0;
                Rooms[data.roomid].rounds = 0;
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
            if (Rooms[data.roomid].users[data.userServerId].iskill == 1)
                socket.emit('Err', 5);

            Rooms[data.roomid].users[data.userServerId].coord = data.coord;
            Rooms[data.roomid].users[data.userServerId].rotation = data.rotation;
            Rooms[data.roomid].users[data.userServerId].light = data.light;
            io.sockets.in(data.roomid).emit('BackGame', Rooms[data.roomid].users);
        });

        // Shoot handle
        socket.on('Shoot', function (data) {
            var user = CollDet(data.coord.x, data.coord.x + 150 * Math.sin(data.rotation),
                data.coord.y, data.coord.y + 150 * Math.cos(data.rotation), data.roomid, data.userServerId);

            if (user != -1) {
                io.sockets.in(data.roomid).emit('BackShoot', user.userid);

                if (Rooms[data.roomid].users[user.userServerId].team == 1)
                    Rooms[data.roomid].blinround--;
                else
                    Rooms[data.roomid].reinround--;

                if (Rooms[data.roomid].blinround == 0) {
                    Rooms[data.roomid].recount++;
                    StartRound(data.roomid);
                }
                else if (Rooms[data.roomid].reinround == 0) {
                    Rooms[data.roomid].blcount++;
                    StartRound(data.roomid);
                }
                Rooms[data.roomid].users[user.userServerId].iskill = 1;
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