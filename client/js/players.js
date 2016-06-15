var players = []; // Arry of all players

function AddPlayer(id, color) {
    players[id] = new Dalek(color);
}
function RemovePlayer(id) {
    players[id].Destroy();
    delete players[id];
}
function HidePlayer(id) {
    players[id].Model.visible = false;
}

function ShowPlayer(id) {
    players[id].Model.visible = true;
}