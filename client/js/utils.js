function fopen(FileName) {
    var str = "";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', FileName, false);
    xhr.send();
    str = xhr.responseText;
    return str;
}

function VecSet2(x, y) {
    return new THREE.Vector2(x, y);
}

function VecSet3(x, y, z) {
    return new THREE.Vector3(x, y, z);
}

function getImageData(image) {

    var canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    var context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);

    return context.getImageData(0, 0, image.width, image.height);

}

function getPixel(imagedata, x, y) {

    var position = ( x + imagedata.width * y ) * 4, data = imagedata.data;
    return {r: data[position], g: data[position + 1], b: data[position + 2], a: data[position + 3]};

}

function DetectSimpleCollision(map, x, y) {
    var color = getPixel(map, Math.round(x / 7.4), Math.round(y / 7.4));
    if (color.r == 0)
        return false;
    return true;
}
function DetectCollision(map, size, x, y) {
    var color = getPixel(map, Math.round((x + size) / 7.4), Math.round(y / 7.4));
    if (color.r == 0)
        return false;
    color = getPixel(map, Math.round(x / 7.4), Math.round((y + size) / 7.4));
    if (color.r == 0)
        return false;
    color = getPixel(map, Math.round((x - size) / 7.4), Math.round(y / 7.4));
    if (color.r == 0)
        return false;
    color = getPixel(map, Math.round(x / 7.4), Math.round((y - size) / 7.4));
    if (color.r == 0)
        return false;
    /*
     color = getPixel(map, Math.round((x + size) / 7.4), Math.round((y + size) / 7.4));
     if(color.r == 0)
     return false;
     color = getPixel(map, Math.round((x - size) / 7.4), Math.round((y + size) / 7.4));
     if(color.r == 0)
     return false;
     color = getPixel(map, Math.round((x + size) / 7.4), Math.round((y - size) / 7.4));
     if(color.r == 0)
     return false;
     color = getPixel(map, Math.round((x - size) / 7.4), Math.round((y - size) / 7.4));
     if(color.r == 0)
     return false;
     */
    /*
     var color = getPixel(map, Math.round(x / 7.4), Math.round(y / 7.4));
     if(color.r > 0)
     return true;
     */
    return true;
}