/**
 * Created by pd6 on 08.06.2016.
 */

function SetUpClient() {
    var PORT = 33333;
    var HOST = '127.0.0.1';

    var dgram = require('dgram');
    var message = ['30', '239'];


    var client = dgram.createSocket('udp4');
    for (var i = 0; i < message.length; i++)
        client.send(message[i], 0, message[i].length, PORT, HOST, function (err, bytes) {
            if (err) throw err;
            console.log('UDP message sent to ' + HOST + ':' + PORT);
            client.close();
        });
}

function Main() {
    SetUpClient();
    return 0;
}

if (require.main === module) {
    Main();
}
