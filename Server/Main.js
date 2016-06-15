var StartCoords = [
    {x: 683, y: 255},
    {x: 172, y: 534}
]; // Start coords arry
var utils = require('./Scripts/utils'); // Utils module
var PNG = require('./Scripts/png-node'); // Png handle module
var app; // Express app
var io; // Socket.io handle
var http; // Http handle

var Rooms = []; // Arry of rooms

var cmap_mirage;
var cmap_mirage_w;

var DetectCollision = function (x0, x1, y0, y1, roomid, userServerId) {
    var usersid = [], userCounter1 = 0;

    var sx0, sx1, sy0, sy1;
    if (x0 > x1) {
        sx0 = x1;
        sx1 = x0;
    }
    else {
        sx0 = x0;
        sx1 = x1;
    }


    if (y0 > y1) {
        sy0 = y1;
        sy1 = y0;
    }
    else {
        sy0 = y0;
        sy1 = y1;
    }

    for (var i = 0; i < Rooms[roomid].userCounter; i++)
        if (Rooms[roomid].users[i].team != Rooms[roomid].users[userServerId].team)
            if (Rooms[roomid].users[i].coord.x > sx0 && Rooms[roomid].users[i].coord.x < sx1
                && Rooms[roomid].users[i].coord.y > sy0 && Rooms[roomid].users[i].coord.y < sy1) {
                usersid[userCounter1] = i;
                userCounter1++;
            }
    var deltaX = Math.abs(x1 - x0);
    var deltaY = Math.abs(y1 - y0);
    var signX = x0 < x1 ? 0.5 : -0.5;
    var signY = y0 < y1 ? 0.5 : -0.5;
    var error = deltaX - deltaY;
    while (Math.abs(x0 - x1) > 2 || Math.abs(y0 - y1) > 2) {
        for (var i = 0; i < userCounter1; i++) {
            if (utils.getPixel(cmap_mirage, cmap_mirage_w, Math.round(x0 / 7.4), Math.round(y0 / 7.4)) == 0)
                return -1;
            else if (x0 > Rooms[roomid].users[usersid[i]].coord.x - 17 && x0 < Rooms[roomid].users[usersid[i]].coord.x + 17
                && y0 > Rooms[roomid].users[usersid[i]].coord.y - 17 && y0 < Rooms[roomid].users[usersid[i]].coord.y + 17) {
                return Rooms[roomid].users[usersid[i]];
            }
        }

        var error2 = error * 2;
        if (error2 > -deltaY) {
            error -= deltaY;
            x0 += signX;
        }
        if (error2 < deltaX) {
            error += deltaX;
            y0 += signY;
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

        Rooms[roomid].users[i].iskill = 0;
        Rooms[roomid].users[i].timer = 0;
        Rooms[roomid].users[i].rotation = 0;
    }
    Rooms[roomid].blinround = Rooms[roomid].blteam;
    Rooms[roomid].reinround = Rooms[roomid].reteam;
    Rooms[roomid].rounds++;
}

function AddNewUser(data) {
    var send = {
        userid: data.userid,
        roomid: data.roomid,
        userServerId: Rooms[data.roomid].userCounter
    };

    Rooms[data.roomid].users[send.userServerId] = {
        userid: data.userid,
        userServerId: Rooms[data.roomid].userCounter,
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
            if (data.roomid == undefined)
                return;
            if (Rooms[data.roomid] == undefined)
                return;
            if (Rooms[data.roomid].users[data.userServerId] == undefined)
                return;

            Rooms[data.roomid].userCounter--;
            console.log('Disconnect from server' + socket.request.connection.remoteAddress);

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
            }
            else {
                delete Rooms[data.roomid].users[data.userServerId];
                Rooms[data.roomid].users.length--;
                io.sockets.in(data.roomid).emit('BackDiscoLobby', Rooms[data.roomid].users);
            }
        });

        // Crate new room callback
        socket.on('NewRoom', function (data) {
            var RoomId = utils.getRandom(1, 1490);

            while (Rooms[RoomId] != undefined)
                RoomId = utils.getRandom(1, 1490);

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

            if (Rooms[data.roomid].userCounter >= 10) {
                socket.emit('Err', 0);
                return;
            }

            for (var i = 0; i < Rooms[data.roomid].userCounter; i++)
                if (Rooms[data.roomid].users[i].userid == data.userid) {
                    socket.emit('Err', 3);
                    return;
                }


            send = AddNewUser(data);

            socket.join(data.roomid);

            send.users = Rooms[send.roomid].users;

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
            if (!(Rooms[data.roomid].reteam > 0 && Rooms[data.roomid].blteam > 0)) {
                io.sockets.in(data.roomid).emit('Err', 6);
                return;
            }

            StartRound(data.roomid);

            for (var i = 0; i < Rooms[data.roomid].userCounter; i++) {
                Rooms[data.roomid].users[i].kills = 0;
                Rooms[data.roomid].users[i].deth = 0;
            }

            Rooms[data.roomid].blcount = 0;
            Rooms[data.roomid].recount = 0;
            Rooms[data.roomid].rounds = 0;
            Rooms[data.roomid].connectedUsers = 0;
            Rooms[data.roomid].newrounddelta = new Date().getTime();
            io.sockets.in(data.roomid).emit('BackStartGame', true);

        });

        // Init game handle
        socket.on('InitGame', function (data) {

            if (Rooms[data.roomid] == undefined)
                return;
            if (Rooms[data.roomid].users[data.userServerId] == undefined)
                return;

            socket.join(data.roomid);

            Rooms[data.roomid].connectedUsers++;

            if (Rooms[data.roomid].connectedUsers >= Rooms[data.roomid].userCounter)
                io.sockets.in(data.roomid).emit('BackInitGame', Rooms[data.roomid].users);
        });

        // Game handle
        socket.on('Game', function (data) {
            if (Rooms[data.roomid] == undefined)
                return;

            if (Rooms[data.roomid].users[data.userServerId] == undefined)
                return;

            if (Rooms[data.roomid].users[data.userServerId].iskill == 1) {
                socket.emit('Err', 5);
                return;
            }

            if (Rooms[data.roomid].reteam == 0 || Rooms[data.roomid].blteam == 0) {
                io.sockets.in(data.roomid).emit('GG', Rooms[data.roomid]);
                return;
            }

            Rooms[data.roomid].users[data.userServerId].coord = data.coord;
            Rooms[data.roomid].users[data.userServerId].rotation = data.rotation;
            io.sockets.in(data.roomid).emit('BackGame', Rooms[data.roomid].users);
        });

        // Shoot handle
        socket.on('Shoot', function (data) {
            var user = DetectCollision(data.coord.x, data.coord.x + 150 * Math.sin(data.rotation),
                data.coord.y, data.coord.y + 150 * Math.cos(data.rotation), data.roomid, data.userServerId);
            var date = new Date().getTime();

            if (user != -1 &&
                date - Rooms[data.roomid].users[data.userServerId].timer >= 3000 &&
                date - Rooms[data.roomid].newrounddelta >= 5000 &&
                Rooms[data.roomid].users[data.userServerId].iskill == 0) {

                io.sockets.in(data.roomid).emit('BackShoot', {killed: user.userid, killer: data.userid});

                Rooms[data.roomid].users[data.userServerId].kills++;
                Rooms[data.roomid].users[user.userServerId].deth++;

                io.sockets.in(data.roomid).emit('StatsUpdate', Rooms[data.roomid].users);

                if (Rooms[data.roomid].users[user.userServerId].team == 1)
                    Rooms[data.roomid].blinround--;
                else
                    Rooms[data.roomid].reinround--;

                Rooms[data.roomid].users[user.userServerId].iskill = 1;
                if (Rooms[data.roomid].blinround == 0) {
                    Rooms[data.roomid].recount++;
                    if (Rooms[data.roomid].recount > 7) {
                        io.sockets.in(data.roomid).emit('GG', "Red");
                        return;
                    }
                    io.sockets.in(data.roomid).emit("EndRound");
                    StartRound(data.roomid);
                    utils.sleep(5000);
                    Rooms[data.roomid].newrounddelta = new Date().getTime();
                    io.sockets.in(data.roomid).emit("StartNewRound", Rooms[data.roomid]);
                }
                else if (Rooms[data.roomid].reinround == 0) {
                    io.sockets.in(data.roomid).emit("EndRound");
                    Rooms[data.roomid].blcount++;
                    if (Rooms[data.roomid].blcount > 7) {
                        io.sockets.in(data.roomid).emit('GG', "Blue");
                        return;
                    }
                    StartRound(data.roomid);
                    utils.sleep(5000);
                    Rooms[data.roomid].newrounddelta = new Date().getTime();
                    io.sockets.in(data.roomid).emit("StartNewRound", Rooms[data.roomid]);
                }
            }
            Rooms[data.roomid].users[data.userServerId].timer = new Date().getTime();
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

    http.listen(80, function () {
        console.log('listening on *:80');
    });
}

function Main() {
    SetUpServer();
    cmap_mirage_w = 105;
    PNG.decode('./../client/resources/models/mineways/mirage/cmap_merged.png', function (pixels) {
        cmap_mirage = pixels;
    });
}

if (require.main === module) {
    Main();
}