// Credit to Mark Pilgrim at Dive Into HTML5
// http://diveintohtml5.info/storage.html

function supportsLocalStorage() {
    return ('localStorage' in window) && window['localStorage'] !== null;
}

function saveGame(game) {
    if (!supportsLocalStorage() || game.winner !== null) {
        return false;
    }

    localStorage['Hnefatafl'] = JSON.stringify(game.toJSON());

    return true;
}

function loadGame(game) {
    if (!supportsLocalStorage() || !localStorage['Hnefatafl']) {
        return false;
    }

    game.fromJSON(JSON.parse(localStorage['Hnefatafl']));
    return true;
}

function initialGameSetup() {
    if (document.cookie.replace(/(?:(?:^|.*;\s*)playerId\s*\=\s*([^;]*).*$)|^.*$/, "$1") === "") {
        document.cookie = "playerId=" + new Date().getTime().toString(32) + Math.random().toString(32) + ";expires=Fri, 31 Dec 9999 23:59:59 GMT";
    }

    mainGame = new Game(
        new Display($("#board")[0], $("#playerTurn")[0], $("#turnCount")[0], $("#joinGameButton")[0], $("#getCodeButton")[0]),
        new Sound(),
        function (game) {
            localStorage.clear();
            doneDialog(game);
        }
    );
}

function newHotSeatGame() {
    localStorage.clear();

    mainGame.setHotSeat();

    mainGame.reset();
    mainGame.updateView();
}

function newNetworkGame(color) {
    $.getJSON("/api/newGame.json", {
        color: color
    }).done(function (data) {
            mainGame.setNetwork(color, data.code);
            mainGame.updateView();
            networkGameCodeDialog();
    });
}

function joinNetworkGame(gameId) {
    $.getJSON("/api/joinGame.json", {
        gameId: gameId
    }).done(function (data) {
        setTimeout(function () { joinSucessDialog(data.color) }, 450);
        mainGame.setNetwork(data.color, data.code);
        mainGame.updateView();
    }).fail(function () {
        setTimeout(joinFailDialog, 450);
    });
}