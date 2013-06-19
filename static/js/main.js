//TODO: Write Unit Tests for Board, Game?, & Display?
//TODO: Replace jQueryUI with other modals
//TODO: Update dialogs so that you can join a network game
//TODO: Add a longpolling page and use it for game updates
//TODO: Add a sound effects queue to Game to allow network games to get effects from the server
//TODO: Add ability to specify what color you want in a new game
//TODO: Change .toJSONString methods to work directly with JSON (not strings)
//TODO: Write a Network class to factor all AJAX out of Game
//TODO: Add indicator for Game.color

function Piece(id, color, isQueen, location) {
    this.id = id;
    this.color = color;
    this.isQueen = isQueen;
    this.location = location;
    this.lastMovedPiece = false;
}


function Move(piece, endLocation) {
    this.piece = piece;
    this.endLocation = endLocation;

    this.toJSONString = function () {
        return JSON.stringify(this);
    };
}

Move.fromJSONString = function (moveJSONString) {
    var moveJSON = JSON.parse(moveJSONString);

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

                        if (op === false) {
                            continue;
                        }
                        else if (
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
            else {
                for (i = 0; i < adj.length; i++) {
                    if (
                        ( this.pieceAtPoint(adj[i]) && this.pieceAtPoint(adj[i]).color !== piece.color ) ||
                            adj[i].isCorner() ||
                            adj[i].isCenter()
                        ) {
                        continue;
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


function Display(boardElement, turnElement, turnCountElement) {
    this.boardElement = boardElement;
    this.playerTurnDisplayElement = turnElement;
    this.turnCountDisplayElement = turnCountElement;

    this.board = null;
    this.clickedPiece = null;

    this.setup = function () {
        $(this.boardElement).empty();

        for (var i = 0; i < 121; i++) {
            $(this.boardElement).append($('<div></div>'));
            $("div:nth-child(11n)", this.boardElement).addClass("right");
        }
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

    this.elementAtPoint = function (point) {
        var index = point.y * 11 + point.x;
        return this.boardElement.children[index];
    };

    this.pointAtElement = function (element) {
        for (var i = 0; i < this.boardElement.children.length; i++) {
            if (this.boardElement.children[i] === element) {
                return new Point(i % 11, Math.floor(i / 11));
            }
        }
        return false;
    };

    this.isPieceAtElement = function (element) {
        return $(element).hasClass("white") || $(element).hasClass("black") || $(element).hasClass("queen");
    };

    this.update = function () {
        var squares = $(this.boardElement).children();
        var ins = [];
        var outs = [];
        var crosses = [];
        var i;

        for (i = 0; i < squares.length; i++) {
            var view = this.isPieceAtElement(squares[i]); //Represents the previous state of the board
            var model = this.board.pieceAtPoint(this.pointAtElement(squares[i])); //Represents the new state of the board

            if (model && !view) { //Locations which previously were empty, but now have a piece
                ins.push(this.pointAtElement(squares[i]));
            }
            else if (!model && view) { //Locations which previously were occupied, but now are empty
                outs.push(this.pointAtElement(squares[i]));
            }
            else if (model && view) { //Locations which previously were occupied, but now are occupied with a different type of pieces
                if (!$(squares[i]).hasClass(this.classForPiece(model))) {
                    crosses.push(this.pointAtElement(squares[i]));
                }
            }
        }

        for (i = 0; i < outs.length; i++) {
            (function (elem) {
                $(elem).fadeOut(400, function () {
                    $(elem).removeClass("white black queen");
                    $(elem).show();
                });
            })(this.elementAtPoint(outs[i]));
        }

        for (i = 0; i < ins.length; i++) {
            (function (elem, _class) {
                $(elem).hide();

                $(elem).addClass(_class);

                $(elem).fadeIn(400);
            })(this.elementAtPoint(ins[i]), this.classForPiece(this.board.pieceAtPoint(ins[i])));
        }

        for (i = 0; i < crosses.length; i++) {
            (function (elem, _class) {
                $(elem).fadeOut(200, function () {
                    $(elem).removeClass("white black queen");
                    $(elem).addClass(_class);
                    $(elem).fadeIn(200);
                });
            })(this.elementAtPoint(crosses[i]), this.classForPiece(this.board.pieceAtPoint(crosses[i])));
        }

        $(squares).removeClass("possibleMove");
        if (this.clickedPiece) {
            var moveLocations = this.board.allValidMoveLocations(this.clickedPiece);
            for (i = 0; i < moveLocations.length; i++) {
                (function (elem) {
                    $(elem).hide();
                    $(elem).addClass("possibleMove");
                    $(elem).fadeIn(200);
                })(this.elementAtPoint(moveLocations[i]));
            }
        }
    };

    this.updateTurnDisplay = function (displayText) {
        $(this.playerTurnDisplayElement).html(displayText);
    };

    this.updateTurnCountDisplay = function (count) {
        $(this.turnCountDisplayElement).html("Turn #" + count);
    };

    this.setup();
}


function Sound(victoryElement, pieceTakenElement) {
    this.victoryElement = victoryElement;
    this.pieceTakenElement = pieceTakenElement;

    this.victory = function () {
        this.victoryElement.play();
    };

    this.pieceTaken = function () {
        this.pieceTakenElement.play();
    };
}


function Game(display, sound, doneCallback) {
    this.board = new Board();
    this.display = display;
    if (this.display) {
        this.display.board = this.board;
    }

    this.sound = sound;
    this.done = doneCallback;

    this.performLocalProcessing = true;
    this.isClient = true;
    this.color = null;
    this.gameId = null;

    this.winner = null;
    this.whiteMove = true;
    this.turnCount = 1;

    this.tick = function () {
        if (this.board.checkForTakenPieces().length > 0) {
            this.board.removePieces(this.board.checkForTakenPieces());

            if (this.isClient) {
                this.sound.pieceTaken();
            }
        }

        if (this.board.checkForVictory()) {
            this.winner = this.board.checkForVictory();

            if (this.isClient) {
                this.sound.victory();
                this.done(this);
            }
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
            var pieceOnBoard = this.board.pieceWithId(move.piece.id); //TODO: Assumes the user hasn't tampered with the id (network game)

            pieceOnBoard.location = move.endLocation;

            pieceOnBoard.lastMovedPiece = true;

            this.whiteMove = !this.whiteMove;

            this.turnCount++;
        } else {
            $.getJSON("/api/postMove.json", {
                gameId: this.gameId,
                move: move.toJSONString()
            });
        }

        return true;
    };

    this.updateView = function () {
        var update = function (game) {
            game.display.update();
            game.display.updateTurnCountDisplay(game.turnCount);

            if (game.whiteMove) {
                game.display.updateTurnDisplay("White's Move");
            }
            else {
                game.display.updateTurnDisplay("Black's Move");
            }
        };

        if (!this.performLocalProcessing) {
            $.getJSON("/api/getGame.json", {
                gameId: this.gameId
            }).done((function (game) {
                return function(data) {
                    game.fromJSONString(JSON.stringify(data));
                    update(game);
                }
            })(this));
        }
        else {
            update(this);
        }
    };

    this.setHotSeat = function () {
        this.color = null;
        this.gameId = null;
        this.performLocalProcessing = true;
    };

    this.setNetwork = function (color, gameId) {
        this.color = color;
        this.gameId = gameId;
        this.performLocalProcessing = false;
    };

    this.toJSONString = function () {
        return JSON.stringify({
            whiteMove: this.whiteMove,
            turnCount: this.turnCount,
            pieces: this.board.pieces
        });
    };

    this.fromJSONString = function (gameJSONString) {
        var gameJSON = JSON.parse(gameJSONString);

        this.whiteMove = gameJSON.whiteMove;
        this.turnCount = gameJSON.turnCount;

        this.board.pieces = [];
        for (var i = 0; i < gameJSON.pieces.length; i++) {
            var pieceJSON = gameJSON.pieces[i];

            this.board.pieces.push(new Piece(pieceJSON.id, pieceJSON.color, pieceJSON.isQueen, new Point(pieceJSON.location.x, pieceJSON.location.y)));
        }
    };
}


var module = module || {};
module.exports = {
    Piece: Piece,
    Move: Move,
    Point: Point,
    Board: Board,
    Game: Game
};