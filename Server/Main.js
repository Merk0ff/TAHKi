/**
 * Created by pd6 on 08.06.2016.
 */

function handler (req, res) {
    var fs = require('fs');
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            res.writeHead(200);
            res.end(data);
        });
}

function SetUpServer() {
    var app = require('http').createServer(handler);
    var io = require('socket.io')(app);

    app.listen(3000)


    io.on('connection', function (socket) {
        var address = socket.request.connection.remoteAddress;

        console.log('New connection from ' + address);
        socket.on('newmsg', function (data) {
            socket.broadcast.emit('mesg', data);
        });
    });
}

function Main() {
    SetUpServer();
    return 0;
}

if (require.main === module) {
    Main();
}