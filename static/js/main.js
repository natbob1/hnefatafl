//TODO: Change postMove and createGame to be POST requests
//TODO: Write Unit Tests for Board, Game?, & Display?
//TODO: Write a Network class to factor all AJAX out of Game
//TODO: Fix behavior for "double traps"
//TODO: Change out modals to new effects
//TODO: Bugs in Firefox: multiple network calls
//TODO: Show error when creating a game fails
//TODO: Fix intro.js highlight things
//TODO: Fix graphics on FF

function Piece(id, color, isQueen, location) {
    this.id = id;
    this.color = color;
    this.isQueen = isQueen;
    this.location = location;
    this.lastMovedPiece = false;

    this.isEqual = function(otherPiece) {
        return (this.id === otherPiece.id &&
                this.color === otherPiece.color &&
                this.isQueen === otherPiece.isQueen &&
                this.location.isEqual(otherPiece.location));
    }
}


function Move(piece, endLocation) {
    this.piece = piece;
    this.endLocation = endLocation;

    this.toJSON = function () {
        return this;
    };
}

Move.fromJSON = function (moveJSON) {
    var piece = new Piece(moveJSON.piece.id, moveJSON.piece.color, moveJSON.piece.isQueen, new Point(moveJSON.piece.location.x, moveJSON.piece.location.y));
    var endLocation = new Point(moveJSON.endLocation.x, moveJSON.endLocation.y);

    return new Move(piece, endLocation);
};


function Point(x, y) {
    this.x = x;
    this.y = y;

    this.adjacentPoints = function () {
        var pts = [];

        if (this.x > 0) {
            pts.push(new Point(x - 1, y));
        }
        if (this.x < 10) {
            pts.push(new Point(x + 1, y));
        }
        if (this.y > 0) {
            pts.push(new Point(x, y - 1));
        }
        if (this.y < 10) {
            pts.push(new Point(x, y + 1));
        }

        return pts;
    };

    this.getOppositeAdjacentPoint = function (firstAdjacentPoint) {
        var pt;

        if (this.x === firstAdjacentPoint.x) {
            pt = new Point(this.x, this.y + (this.y - firstAdjacentPoint.y));
        }
        else if (this.y === firstAdjacentPoint.y) {
            pt = new Point(this.x + (this.x - firstAdjacentPoint.x), this.y);
        }
        else {
            return false;
        }

        if (pt.isValid()) {
            return pt;
        }
        else {
            return false;
        }
    };

    this.isAdjacent = function (point) {
        var pts = this.adjacentPoints();

        for (var i = 0; i < pts.length; i++) {
            if (point.isEqual(pts[i])) {
                return true;
            }
        }

        return false;
    };

    this.isValid = function () {
        return this.x <= 10 && this.x >= 0 && this.y <= 10 && this.y >= 0;
    };

    this.isEdge = function () {
        return this.adjacentPoints().length <= 3;
    };

    this.isCorner = function () {
        return this.adjacentPoints().length === 2
    };

    this.isCenter = function () {
        return this.isEqual(new Point(5, 5));
    };

    this.isEqual = function (otherPoint) {
        return (this.x === otherPoint.x) && (this.y === otherPoint.y)
    };
}


function Board() {
    this.pieces = [];

    this.setupPieces = function () {
        this.pieces = [];

        var id = 0;
        var i;

        var black = [3, 4, 5, 6, 7, 16, 33, 43, 44, 54, 55, 56, 64, 65, 66, 76, 77, 87, 104, 113, 114, 115, 116, 117];
        for (i = 0; i < black.length; i++) {
            this.pieces.push(new Piece(id++, "black", false, new Point(Math.floor(black[i] / 11), black[i] % 11)));
        }

        var white = [38, 48, 49, 50, 58, 59, 61, 62, 70, 71, 72, 82];
        for (i = 0; i < white.length; i++) {
            this.pieces.push(new Piece(id++, "white", false, new Point(Math.floor(white[i] / 11), white[i] % 11)));
        }

        this.pieces.push(new Piece(id, "white", true, new Point(5, 5)));
    };

    this.pieceAtPoint = function (point) {
        for (var i = 0; i < this.pieces.length; i++) {
            if (point.isEqual(this.pieces[i].location)) {
                return this.pieces[i];
            }
        }
        return false;
    };

    this.pieceWithId = function (id) {
        for (var i = 0; i < this.pieces.length; i++) {
            if (this.pieces[i].id === id) {
                return this.pieces[i];
            }
        }
        return false;
    };

    this.allValidMoveLocations = function (piece) {
        var points = [];
        for (var i = 0; i < 11; i++) {
            for (var j = 0; j < 11; j++) {
                var pt = new Point(i, j);

                if (this.canMoveTo(piece, pt)) {
                    points.push(pt);
                }
            }
        }

        return points;
    };

    this.canMoveTo = function (piece, point) {
        var i;

        if (piece.location.isEqual(point) || !point.isValid() || ( ( point.isCorner() || point.isCenter() ) && !piece.isQueen )) {
            return false;
        }

        if (piece.location.x == point.x) {
            if (piece.location.y < point.y) {
                for (i = piece.location.y + 1; i <= point.y; i++) {
                    if (this.pieceAtPoint(new Point(piece.location.x, i))) {
                        return false;
                    }
                }
            }
            else {
                for (i = piece.location.y - 1; i >= point.y; i--) {
                    if (this.pieceAtPoint(new Point(piece.location.x, i))) {
                        return false;
                    }
                }
            }
        }
        else if (piece.location.y == point.y) {
            if (piece.location.x < point.x) {
                for (i = piece.location.x + 1; i <= point.x; i++) {
                    if (this.pieceAtPoint(new Point(i, piece.location.y))) {
                        return false;
                    }
                }
            }
            else {
                for (i = piece.location.x - 1; i >= point.x; i--) {
                    if (this.pieceAtPoint(new Point(i, piece.location.y))) {
                        return false;
                    }
                }
            }
        }
        else {
            return false;
        }

        return true;
    };

    this.checkForTakenPieces = function () {
        var removes = [];

        for (var i = 0; i < this.pieces.length; i++) {
            if (this.isPieceTaken(this.pieces[i])) {
                removes.push(this.pieces[i]);
            }
        }

        return removes;
    };

    this.checkForVictory = function () {
        for (var i = 0; i < this.pieces.length; i++) {
            if (this.pieces[i].isQueen) {
                if (this.pieces[i].location.isCorner()) {
                    return "white";
                }
                else {
                    return false;
                }
            }
        }

        return "black";
    };

    this.isPieceTaken = function (piece) {
        var i;
        var adj = piece.location.adjacentPoints();

        if (!piece.lastMovedPiece) {
            if (!piece.isQueen) {
                for (i = 0; i < adj.length; i++) {
                    if (
                        this.pieceAtPoint(adj[i]) &&
                            (this.pieceAtPoint(adj[i]).color !== piece.color) &&
                            this.pieceAtPoint(adj[i]).lastMovedPiece
                        ) {
                        var op = piece.location.getOppositeAdjacentPoint(adj[i]);

                        if (op !== false) {
                            if (
                                ( this.pieceAtPoint(op) && (this.pieceAtPoint(op).color !== piece.color) ) ||
                                    op.isCorner() ||
                                    ( (piece.color === "black") && op.isCenter() ) ||
                                    ( (piece.color === "white") && op.isCenter() && !this.pieceAtPoint(op) )
                                ) {
                                return true;
                            }
                        }
                    }

                }
            }
            else {
                for (i = 0; i < adj.length; i++) {
                    if (
                        ( this.pieceAtPoint(adj[i]) && this.pieceAtPoint(adj[i]).color !== piece.color ) ||
                            adj[i].isCorner() ||
                            adj[i].isCenter()
                        ) {
                    }
                    else {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    };

    this.removePieces = function (pieces) {
        for (var i = 0; i < pieces.length; i++) {
            this.removePiece(pieces[i]);
        }
    };

    this.removePiece = function (piece) {
        for (var i = 0; i < this.pieces.length; i++) {
            if (this.pieces[i] == piece) {
                this.pieces.splice(i, 1);
            }
        }
    };

    this.setupPieces();
}


function Display(boardElement, turnElement, turnCountElement, joinGameButton, showCodeButton) {
    this.boardElement = boardElement;
    this.playerTurnDisplayElement = turnElement;
    this.turnCountDisplayElement = turnCountElement;
    this.joinGameButton = joinGameButton;
    this.showCodeButton = showCodeButton;

    this.board = null;
    this.clickedPiece = null;

    this.setup = function () {
        var boardHTML = "";
        for (var i = 0; i < 121; i++) {
            boardHTML += '<div class="hide"></div>';
        }
        this.boardElement.innerHTML = boardHTML;
    };

    this.classForPiece = function (piece) {
        if (piece.color === "white") {
            if (piece.isQueen) {
                return "queen";
            }
            else {
                return "white";
            }
        }
        else {
            return "black";
        }
    };

    this.squareElementAtPoint = function (point) {
        var index = point.y * 11 + point.x;
        return this.boardElement.children[index];
    };

    this.pointAtSquareElement = function (element) {
        for (var i = 0; i < this.boardElement.children.length; i++) {
            if (this.boardElement.children[i] === element) {
                return new Point(i % 11, Math.floor(i / 11));
            }
        }
        return false;
    };

    this.elementForPiece = function (piece) {
        var results = $("#board img[data-piece-id='" + piece.id + "']");
        if (results.length === 1) {
            return results[0];
        }

        return false;
    };

    this.getDisplayLocationForPiece = function (piece) {
        var elem = this.elementForPiece(piece);

        var matrix = elem.style.webkitTransform.substr(10, elem.style.webkitTransform.length - 11).split(', ');

        return new Point( parseInt(matrix[0]) / 60, parseInt(matrix[1]) / 60 );
    };

    this.setOffsetForPiece = function (piece, element) {
        var xOffset = piece.location.x * 60;
        var yOffset = piece.location.y * 60;
        element.style.transitionDuration = '1000ms';
        element.style.webkitTransform = "translate(" + xOffset + "px, " + yOffset + "px)";
        element.style.MozTransform = "translate(" + xOffset + "px, " + yOffset + "px)";
    };

    this.update = function () {
        var squares = $(this.boardElement).children();
        var pieceIns = [];
        var elementOuts = [];
        var pieceSlides = [];
        var possibleIns = [];
        var possibleOuts = [];
        var i, j;
        var allPossible;


        if (this.clickedPiece) {
            allPossible = this.board.allValidMoveLocations(this.clickedPiece);
        } else {
            allPossible = [];
        }

        for (i = 0; i < squares.length; i++) {
            var possibleView = squares[i].classList.contains("possibleMove");
            var possibleModel = false;


            for (j = 0; j < allPossible.length; j++) {
                if (allPossible[j].isEqual(this.pointAtSquareElement(squares[i]))) {
                    possibleModel = true;
                }
            }

            if (possibleView && !possibleModel) {
                possibleOuts.push(this.pointAtSquareElement(squares[i]));
            }
            else if (!possibleView && possibleModel) {
                possibleIns.push(this.pointAtSquareElement(squares[i]));
            }
        }


        for (i = 0; i < possibleIns.length; i++) {
            (function (elem) {
                elem.style.transitionDuration = '300ms';
                elem.classList.add('possibleMove');
                elem.classList.remove('hide');
            })(this.squareElementAtPoint(possibleIns[i]));
        }

        for (i = 0; i < possibleOuts.length; i++) {
            (function (elem) {
                elem.style.transitionDuration = '200ms';
                elem.classList.add('hide');

                setTimeout(function () {
                    elem.classList.remove('possibleMove');
                }, 50);

            })(this.squareElementAtPoint(possibleOuts[i]));
        }

        var piece;
        for (i = 0; i < this.board.pieces.length; i++) {
            piece = this.board.pieces[i];

            if ( this.board.pieces.some(function (testPiece) {
                return testPiece.id === piece.id;
            }) ) { // Piece should be on the board
                if (this.elementForPiece(piece) === false) { // Piece is not yet on the board
                    pieceIns.push(piece);
                }
                else if (!piece.location.isEqual(this.getDisplayLocationForPiece(piece))) { // Piece is already on the board, but needs to be moved
                    pieceSlides.push(piece);
                }
            }
        }

        var imgElements = $("#board img");
        for (i = 0; i < imgElements.length; i++) {
            var elementValid = false;

            for (j = 0; j < this.board.pieces.length; j++) {
                if (this.board.pieces[j].id == imgElements[i].getAttribute('data-piece-id')) {
                    elementValid = true;
                }
            }

            if (!elementValid) {
                elementOuts.push(imgElements[i]);
            }
        }

        for (i = 0; i < pieceIns.length; i++) {
            (function (display, piece) {
                var elem = document.createElement('img');
                elem.src = 'css/img/' + display.classForPiece(piece) + '.png';
                elem.setAttribute('data-piece-id', piece.id);

                elem.classList.add('hide');
                elem.style.transitionDuration = '400ms';
                elem.classList.add('fade');
                display.setOffsetForPiece(piece, elem);

                display.boardElement.appendChild(elem);
                elem.classList.remove('hide');

                setTimeout(function() { elem.classList.remove('fade'); }, 400);
            })(this, pieceIns[i]);
        }

        for (i = 0; i < elementOuts.length; i++) {
            (function (display, elem) {
                elem.style.transitionDuration = '400ms';
                elem.classList.add('fade');
                elem.classList.add('hide');

                setTimeout(function() {
                    display.boardElement.removeChild(elem);
                }, 400);
            })(this, elementOuts[i]);
        }

        for (i = 0; i < pieceSlides.length; i++) {
            (function (display, piece) {
                display.elementForPiece(piece).classList.add('slide');
                display.setOffsetForPiece(piece, display.elementForPiece(piece));

                setTimeout(function () {
                    display.elementForPiece(piece).classList.remove('slide');
                }, 1000);
            })(this, pieceSlides[i]);
        }
    };

    this.updateTurnDisplay = function (whiteMove) {
        var color;
        if (whiteMove) {
            color = "White";
        }
        else {
            color = "Black";
        }

        this.playerTurnDisplayElement.innerHTML = color + "'s Move";
    };

    this.updateTurnCountDisplay = function (count) {
        this.turnCountDisplayElement.innerHTML = "Turn #" + count;
    };

    this.updateButtons = function (isNetwork, done) {
        if (isNetwork && !done) {
            $(this.showCodeButton).show();
            $(this.joinGameButton).hide();
        }
        else {
            $(this.showCodeButton).hide();
            $(this.joinGameButton).show();
        }
    };

    this.updateIsMyTurnIndicator = function (isMyTurn, done) {
        if (isMyTurn && !done) {
            this.playerTurnDisplayElement.classList.add('glow');
        }
        else {
            this.playerTurnDisplayElement.classList.remove('glow');
        }
    };

    this.setup();
}


function Sound() {
    this.sounds = {
        victory: 'audio/victory.ogg',
        pieceTaken: 'audio/taken.ogg',
        ping: 'audio/ping.ogg'
    };

    this.queue = [];

    this.playSounds = function () {
        for (var i = 0; i < this.queue.length; i++) {
            if (this.queue[i] === 'ping' && ( this.queue.indexOf('pieceTaken') > -1 || this.queue.indexOf('victory') > -1)) {
                break;
            }

            this.playSound(this.queue[i]);
        }

        this.queue = [];
    };

    this.playSound = function (soundName) {
        var sound = new Audio(this.sounds[soundName]);
        sound.play();
    };
}


function Game(display, sound, doneCallback) {
    this.board = new Board();
    this.display = display;
    if (this.display) {
        this.display.board = this.board;
    }

    this.sound = sound;
    this.doneCallback = doneCallback;

    this.performLocalProcessing = true;
    this.color = null;
    this.gameId = null;

    this.done = false;
    this.winner = null;
    this.whiteMove = true;
    this.turnCount = 1;

    this.updateView = function () {
        if (this.winner && !this.done) {
            this.doneCallback(this);
            this.done = true;
        }

        this.display.update();
        this.sound.playSounds();
        this.display.updateTurnCountDisplay(this.turnCount);
        this.display.updateTurnDisplay(this.whiteMove);
        this.display.updateButtons(this.gameId, this.done);
        this.display.updateIsMyTurnIndicator(this.isMyTurn(), this.done);

        if (!this.performLocalProcessing && !this.winner) {
            $.getJSON("/api/getGame.json", {
                gameId: this.gameId
            })
            .done((function (game) {
                return function(data) {
                    game.fromJSON(data);
                    game.updateTimer = setTimeout.call(game, game.updateView, 100);
                }
            })(this))
            .error((function (game) {
                return function() {
                    game.updateTimer = setTimeout.call(game, game.updateView, 100);
                }
            })(this));
        }
    };

    this.tick = function () {
        if (this.board.checkForTakenPieces().length > 0) {
            this.board.removePieces(this.board.checkForTakenPieces());

            if (this.performLocalProcessing) {
                this.sound.queue.push("pieceTaken");
            }
        }

        if (this.board.checkForVictory()) {
            if (this.performLocalProcessing) {
                this.sound.queue.push("victory");
                this.winner = this.board.checkForVictory();
            }
        }

        if (this.performLocalProcessing) {
            this.sound.queue.push("ping");
        }
    };

    this.reset = function () {
        this.whiteMove = true;
        this.winner = null;
        this.turnCount = 1;

        this.board.setupPieces();
    };

    this.moveIsValid = function (move) {
        return ( (move.piece.color === "white") === this.whiteMove ) && this.board.canMoveTo(move.piece, move.endLocation);
    };

    this.executeMove = function (move) {
        if (!this.moveIsValid(move)) {
            return false;
        }

        if (this.performLocalProcessing) {
            for (var i = 0; i < this.board.pieces.length; i++) {
                this.board.pieces[i].lastMovedPiece = false;
            }
            var pieceOnBoard = this.board.pieceWithId(move.piece.id);
            if (!move.piece.isEqual(pieceOnBoard)) {
                return false;
            }

            pieceOnBoard.location = move.endLocation;

            pieceOnBoard.lastMovedPiece = true;

            this.whiteMove = !this.whiteMove;

            this.turnCount++;
        } else {
            $.getJSON("/api/postMove.json", {
                gameId: this.gameId,
                move: JSON.stringify(move.toJSON())
            });
        }

        return true;
    };

    this.isMyTurn = function() {
        return (this.color !== null) && ( this.whiteMove === (this.color === "white") );
    };

    this.setHotSeat = function () {
        this.color = null;
        this.gameId = null;
        this.winner = null;
        this.done = false;
        this.performLocalProcessing = true;
    };

    this.setNetwork = function (color, gameId) {
        this.color = color;
        this.gameId = gameId;
        this.winner = null;
        this.done = false;
        this.performLocalProcessing = false;
    };

    this.toJSON = function () {
        return {
            whiteMove: this.whiteMove,
            turnCount: this.turnCount,
            winner: this.winner,
            pieces: this.board.pieces,
            soundQueue: this.sound.queue
        };
    };

    this.fromJSON = function (gameJSON) {
        this.whiteMove = gameJSON.whiteMove;
        this.turnCount = gameJSON.turnCount;
        this.winner = gameJSON.winner;
        this.sound.queue = gameJSON.soundQueue;

        this.board.pieces = [];
        for (var i = 0; i < gameJSON.pieces.length; i++) {
            var pieceJSON = gameJSON.pieces[i];

            this.board.pieces.push(new Piece(pieceJSON.id, pieceJSON.color, pieceJSON.isQueen, new Point(pieceJSON.location.x, pieceJSON.location.y)));
        }
    };
}


var module = module || {}; // Fix for running in non Node environment in which module exports are not needed
module.exports = {
    Piece: Piece,
    Move: Move,
    Point: Point,
    Board: Board,
    Sound: Sound,
    Game: Game
};