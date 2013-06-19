// Credit to Mark Pilgrim at Dive Into HTML5
// http://diveintohtml5.info/storage.html

function supportsLocalStorage() {
    return ('localStorage' in window) && window['localStorage'] !== null;
}

function saveGame(game) {
    if (!supportsLocalStorage() || game.winner !== null) {
        return false;
    }

    localStorage['Hnefatafl'] = game.toJSONString();

    return true;
}

function loadGame(game) {
    if (!supportsLocalStorage() || !localStorage['Hnefatafl']) {
        return false;
    }

    game.fromJSONString(localStorage['Hnefatafl']);
    return true;
}

function initialGameSetup() {
    if (document.cookie.replace(/(?:(?:^|.*;\s*)playerId\s*\=\s*([^;]*).*$)|^.*$/, "$1") === "") {
        document.cookie = "playerId=" + new Date().getTime().toString(32) + Math.random().toString(32);
    }

    mainGame = new Game(
        new Display($("#board")[0], $("#playerTurn")[0], $("#turnCount")[0]),
        new Sound($("#victoryEffect")[0], $("#takenEffect")[0]),
        doneDialog
    );

    setupClickCallbacks();
    setupIntro();
}

function newHotSeatGame() {
    localStorage.clear();

    mainGame.setHotSeat();

    mainGame.reset();
    mainGame.updateView();
}

function newNetworkGame() {
    $.getJSON("/api/newGame.json", {
        color: "white"
    }).done(function (data) {
            mainGame.setNetwork("white", data.code);
            networkGameCodeDialog();
    });
}

function joinNetworkGame(gameId) {
    $.getJSON("/api/joinGame.json", {
        gameId: gameId
    }).done(function (data) {
            mainGame.setNetwork(data.color, data.code);
    });
}