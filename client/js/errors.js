function GetErrorExeption(code) {
    switch (code) {
        case 0:
            return "Room full.";
        case 1:
            return "Team is full.";
        case 2:
            return "You can't change team.";
        case 3:
            return "Your nick is already used.\nPlease change.";
        case 4:
            return "This lobby uncreated.";
        case 5:
            return "You died.";
        case 6:
            return "It's not enough players to start.";
    }
}
function InitErrors() {
    socket.on('Err', function (code) {
        alert("ERROR #" + code + ":\n" + GetErrorExeption(code));
    });
}