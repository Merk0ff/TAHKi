var Entities = [];

function EntityAdd(object) {
    var i = 0;

    while (Entities[i] != undefined)
        i++;
    Entities[i] = object;
}

function EntityRemove(index) {
    Entities[index] = undefined;
}