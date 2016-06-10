var Entities = [];

function EntityAdd(object) {
    var i = 0;
    
    while(Entities[i] != undefined)
    ;
    Entities[i] = object;
}

function EntityRemove(index)
{
    Entities[index] = undefined;
}