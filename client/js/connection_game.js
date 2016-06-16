var socket; // Socket by socket.io for game
var mydata = {}; // Data of 'this' player
var timerPlayer;
var timerConnection;
var gameEnded = false;

function ConnectionInit() {
    socket = io(window.location.origin);
    $(window).bind("beforeunload", function () {
        socket.emit('Disco', mydata);
    });
    InitErrors();
    mydata.roomid = $.cookie("roomid");
    mydata.userid = $.cookie("userid");
    mydata.userServerId = $.cookie("userServerId");
    socket.emit("InitGame", mydata);
    socket.on('BackInitGame', function (data) {
        var ired = 1;
        var iblue = 1;
        for (var i = 0; i < data.length; i++) {
            if (data[i].team == 0) {
                $("#red_player_" + ired + "_n").text(data[i].userid);
                $("#red_player_" + ired + "_k").text(data[i].kills);
                $("#red_player_" + ired + "_d").text(data[i].deth);
                ired++;
                AddPlayer(data[i].userid, "red");
            }
            else if (data[i].team == 1) {
                AddPlayer(data[i].userid, "blue");
                $("#blue_player_" + iblue + "_n").text(data[i].userid);
                $("#blue_player_" + iblue + "_k").text(data[i].kills);
                $("#blue_player_" + iblue + "_d").text(data[i].deth);
                iblue++;
            }
            players[data[i].userid].SetPosition(data[i].coord);
        }
        window.addEventListener("mousemove", MouseMove);
        window.addEventListener("mouseup", MouseUp);
        window.addEventListener("mousedown", MouseDown);
        window.addEventListener("keyup", KeyUp);
        window.addEventListener("keydown", KeyDown);
        window.addEventListener("keypress", KeyPress);
        window.addEventListener("keydown", function (e) {
            if (e.keyCode == KEY_CODE.DOTA)
                $("#stats").show();
        });
        window.addEventListener("keyup", function (e) {
            if (e.keyCode == KEY_CODE.DOTA)
                $("#stats").hide();
        });
        window.addEventListener("keypress", KeyPress);
        window.addEventListener("wheel", onWheel);
        $(window).resize(function () {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 10000);
            players[mydata.userid].SetCamera();
        });
        players[mydata.userid].SetCamera();
        renderScene();
        timerConnection = setInterval(Update, 20);
        timerPlayer = setInterval(UpdateKeyboard, 20);

        $("#fullscreen").fadeOut("slow");
        $("#score").fadeIn("slow");
    });
    socket.on("BackDiscoGame", function (data) {
        RemovePlayer(data);
    });
    socket.on("EndRound", function (data) {

    });
    socket.on("GG", function (data) {
        gameEnded = true;
        clearInterval(timerConnection);
        clearInterval(timerPlayer);
        $("#splash_text").text("GG. " + data + " wins");
        $("#fullscreen").fadeIn("fast");
        $("#btn_index").fadeIn("fast");
        $("#btn_index").click(function () {
            window.location.replace(window.location.origin);
        });
    });
    socket.on("BackShoot", function (data) {
        if (gameEnded)
            return;
        players[data.killer].Shoot();
        if (data.killed == -1)
            return;
        var killer_team = players[data.killer].team;
        var killed_team = players[data.killed].team;

        $("#chat").append("<li class=\'chat_unit\'><span class=\'team_" + killer_team +"\'>" + data.killer + "</span>&nbsp;&nbsp;̵͇̿̿/̿'̿ ̿ &nbsp;&nbsp;<span class=\'team_" + killed_team +"\'>" + data.killed + "</span></li>");
        //attr("class", "chat_unit");
        //console.log(data.killer + " ̵͇̿̿/̿'̿ ̿  " + data.killed);
        if (data.killed == mydata.userid) {
            $("#splash_text").text("You died");
            $("#fullscreen").fadeIn("slow");
        }
        HidePlayer(data.killed);
    });
    socket.on("StartNewRound", function (data) {
        if (gameEnded)
            return;
        $("#chat").empty();
        for (var i = 0; i < data.users.length; i++) {
            ShowPlayer(data.users[i].userid);
            players[data.users[i].userid].SetPosition(data.users[i].coord);
            players[data.users[i].userid].SetRotate(data.users[i].rotation);
        }
        players[mydata.userid].SetCamera();
        if (gameEnded)
            return;
        $("#fullscreen").fadeOut("slow");
        $("#score_red").text(data.recount);
        $("#score_blue").text(data.blcount);
    });

    socket.on('StatsUpdate', function (data) {
        data.sort(function (a, b) {
            return a.kills - b.kills;
        });
        for (var i = 0; i < 5; i++) {
            $("#red_player_" + i + "_n").text('-');
            $("#red_player_" + i + "_k").text(0);
            $("#red_player_" + i + "_d").text(0);
            $("#blue_player_" + i + "_n").text('-');
            $("#blue_player_" + i + "_k").text(0);
            $("#blue_player_" + i + "_d").text(0);
        }
        var ired = 1;
        var iblue = 1;
        for (var i = 0; i < data.length; i++) {
            if (data[i].team == 0) {
                $("#red_player_" + ired + "_n").text(data[i].userid);
                $("#red_player_" + ired + "_k").text(data[i].kills);
                $("#red_player_" + ired + "_d").text(data[i].deth);
                ired++;
            }
            else {
                $("#blue_player_" + iblue + "_n").text(data[i].userid);
                $("#blue_player_" + iblue + "_k").text(data[i].kills);
                $("#blue_player_" + iblue + "_d").text(data[i].deth);
                iblue++;
            }
        }
    });

    socket.on('BackGame', function (data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].userid != mydata.userid) {
                players[data[i].userid].SetPosition(data[i].coord);
                players[data[i].userid].SetRotate(data[i].rotation);
                //players[data[i].userid].Light.visible = data[i].light;
                //players[data[i].userid].Update();
            }
        }
    });
}

function Response() {
    UpdatePatricles();
    mydata.coord = players[mydata.userid].GetPosition();
    mydata.rotation = players[mydata.userid].Model.rotation.y;
    socket.emit("Game", mydata);
}