function Join() {
    var cb;
    var data ={
        userid: 30,
        team: 59,
        roomid: 239
    };

    socket.on('BackNewRoomUser', function (kek) {
        cb = kek;
    });

    socket.emit('JoinRoom', data);

    console.log('kek');
}