
var getRandom = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
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
module.exports.getRandom = getRandom;