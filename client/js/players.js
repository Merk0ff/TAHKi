var players = []; // Arry of all players

function AddPlayer(id, color) {
    players[id] = new Dalek(color);
}
function RemovePlayer(id)
{
    players[id].Destroy();
    delete players[id];
}