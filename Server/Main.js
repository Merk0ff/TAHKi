/**
 * Created by pd6 on 08.06.2016.
 */


function SetUpServer() {
    var PORT = 33333;
    var HOST = '127.0.0.1';

    var dgram = require('dgram');
    var server = dgram.createSocket('udp4');
    var mc = 0;
    var User = {};

    server.on('listening', function () {
        var address = server.address();
        console.log('UDP Server listening on ' + address.address + ":" + address.port);
    });

    server.on('message', function (message, remote) {
        console.log(remote.address + ':' + remote.port +' - ' + message);
         User.hp = message;
         User.speed = message;
    });

    server.bind(PORT, HOST);

}

function Main() {
    SetUpServer();
    return 0;
}

if (require.main === module) {
    Main();
}