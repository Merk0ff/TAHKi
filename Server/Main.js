/**
 * Created by pd6 on 08.06.2016.
 */

var app;
var io;

function ConnectUser() {
    io.on('connection', function (socket) {
        var address = socket.request.connection.remoteAddress;

        console.log('New connection from ' + address);
        socket.on('newmsg', function (data) {
            socket.emit('msg', data);
        });

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

function handler (req, res) {
    if (req.url == '/game'){
        ConnectUser();
        SendFile(res, '/game.html');
    }
    else if (req.url == '/room')
        SendFile(res, '/room.html');
    else {
        SendFile(res, '/index.html');
        ConnectUser();
    }

}

function SetUpServer() {
    app = require('http').createServer(handler);
    io  = require('socket.io')(app);
    app.listen(8000);
}

function Main() {
    SetUpServer();
}

if (require.main === module) {
    Main();
}