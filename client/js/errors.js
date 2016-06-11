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
    }
}
function InitErrors() {
    socket.on('Err', function (code) {
        alert("ERROR #" + code + ":\n" + GetErrorExeption(code));
    });
}