
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

function getPixel(imagedata, width, x, y) {

    var position = ( x + width * y ) * 4;
    return imagedata[position];
}

function DetectSimpleCollision(map, x, y) {
    var color = getPixel(map, Math.round(x / 7.4), Math.round(y / 7.4));
    if (color == 0)
        return false;
    return true;
}

module.exports.SendFile = SendFile;
module.exports.getRandom = getRandom;
module.exports.getPixel = getPixel;
module.exports.DetectSimpleCollision = DetectSimpleCollision;