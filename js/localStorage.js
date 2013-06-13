// Credit to Mark Pilgrim at Dive Into HTML5
// http://diveintohtml5.info/storage.html
function supportsLocalStorage() {
    return ('localStorage' in window) && window['localStorage'] !== null;
}

function saveGame(game) {
    if (!supportsLocalStorage() || game.winner !== null) {
        return false;
    }

    localStorage.clear();

    localStorage['Hnefatafl.savedGame'] = true;

    for (var i = 0; i < game.board.pieces.length; i++) {
        localStorage['Hnefatafl.piece.' + i] = JSON.stringify(game.board.pieces[i]);
    }
    localStorage['Hnefatafl.numPieces'] = i;

    localStorage['Hnefatafl.whiteMove'] = game.whiteMove;
    localStorage['Hnefatafl.turnCount'] = game.turnCount;

    return true;
}

function loadGame(game) {
    if (!supportsLocalStorage() || localStorage['Hnefatafl.savedGame'] !== "true") {
        return false;
    }

    game.whiteMove = localStorage['Hnefatafl.whiteMove'] == "true";
    game.turnCount = parseInt(localStorage['Hnefatafl.turnCount']);

    game.board.pieces = [];

    for (var i = 0; i < parseInt(localStorage['Hnefatafl.numPieces']); i++) {
        var objPiece = JSON.parse(localStorage['Hnefatafl.piece.' + i]);

        game.board.pieces.push(new Piece(objPiece.id, objPiece.color, objPiece.isQueen, new Point(objPiece.location.x, objPiece.location.y)));
    }
    return true;
}

function initialGameSetup() {
    mainGame = new Game($("#board")[0], $("#playerTurn")[0], $("#turnCount")[0], doneDialog);

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
    $.getJSON("getCode.json").done(function (data) {
        console.log(data);
        //mainGame.setNetwork(data.gameId, true);
    });

}