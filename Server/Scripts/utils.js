
var getRandom = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
};

var CollDet = function (x0, x1, y0, y1, roomid, userid) {
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
        if (Rooms[roomid].users[i].team != Rooms[roomid].users[userid].team)
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
                return Rooms[roomid].users[usersid[i]].userid;
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

var SendFile = function (res, path) {
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
};

module.exports.SendFile = SendFile;
module.exports.CollDet = CollDet;
module.exports.getRandom = getRandom;