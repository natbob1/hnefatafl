//TODO: Write Unit Tests for Board, Game?, & Display?
//TODO: Move backend to Node.js and add Multiplayer functionality

function Piece (id, color, isQueen, location) {
	this.id = id;
	this.color = color;
	this.isQueen = isQueen;
	this.location = location;
	this.lastMovedPiece = false;
}

function Move (piece, endLocation) {
	this.piece = piece;
	this.endLocation = endLocation;
}

function Point (x, y) {
	this.x = x;
	this.y = y;

	this.isAdjacent = function (point) {
		var pts = this.adjacentPoints();

		for (var i = 0; i < pts.length; i++) {
			if (point.isEqual(pts[i])) {
				return true;
			}
		}

		return false;
	}

	this.isValid = function () {
		if (this.x > 10 || this.x < 0 || this.y > 10 || this.y < 0) {
			return false;
		}
		return true;
	}

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
	}

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
	}

	this.isEdge = function () {
		return this.adjacentPoints().length <= 3;
	}

	this.isCorner = function () {
		return this.adjacentPoints().length === 2
	}

	this.isCenter = function () {
		return this.isEqual(new Point(5, 5));
	}

	this.isEqual = function (otherPoint) {
		return (this.x === otherPoint.x) && (this.y === otherPoint.y)
	}
}

function Board () {
	this.pieces = [];
	this.removedPieces = [];

	this.pieceAt = function (point) {
		for (var i = 0; i < this.pieces.length; i++) {
			if (point.isEqual(this.pieces[i].location)) {
				return this.pieces[i];
			}
		}
		return false;
	}

	this.pieceWithId = function (id) {
		for (var i = 0; i < this.pieces.length; i++) {
			if (this.pieces[i].id === id) {
				return this.pieces[i];
			}
		}
		return false;
	}

	this.removePiece = function (piece) {
		for (var i = 0; i < this.pieces.length; i++) {
			if (this.pieces[i] == piece) {
				this.removedPieces.push(this.pieces.splice(i, 1)[0]);
			}
		}
	}

	this.canMoveTo = function(piece, point) {
		if (piece.location.isEqual(point) || !point.isValid() || ((point.isCorner() || point.isCenter()) && !piece.isQueen)) {
			return false;
		}

		if (piece.location.x == point.x) {
			if (piece.location.y < point.y) {
				for (var i = piece.location.y + 1; i <= point.y; i++) {
					if (this.pieceAt(new Point(piece.location.x, i))) {
						return false;
					}
				}
			}
			else {
				for (var i = piece.location.y - 1; i >= point.y; i--) {
					if (this.pieceAt(new Point(piece.location.x, i))) {
						return false;
					}
				}
			}
		}
		else if (piece.location.y == point.y) {
			if (piece.location.x < point.x) {
				for (var i = piece.location.x + 1; i <= point.x; i++) {
					if (this.pieceAt(new Point(i, piece.location.y))) {
						return false;
					}
				}
			}
			else {
				for (var i = piece.location.x - 1; i >= point.x; i--) {
					if (this.pieceAt(new Point(i, piece.location.y))) {
						return false;
					}
				}
			}
		}
		else {
			return false;
		}

		return true;
	}

	this.allValidMoveLocations = function(piece) {
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
	}

	this.checkForTakenPieces = function () {
		for (var i in this.pieces) {
			if (this.isPieceTaken(this.pieces[i])) {
				this.removePiece(this.pieces[i]);
			}
		}
	}

	this.checkForVictory = function() {
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
	}

	this.isPieceTaken = function (piece) {
		var adj = piece.location.adjacentPoints();

		if (!piece.lastMovedPiece) {
			if (!piece.isQueen) {
				for (var i in adj) {
					if (this.pieceAt(adj[i]) && (this.pieceAt(adj[i]).color !== piece.color) && this.pieceAt(adj[i]).lastMovedPiece) {
						var op = piece.location.getOppositeAdjacentPoint(adj[i]);

						if (op === false) {
							continue;
						}
						else if ((this.pieceAt(op) && this.pieceAt(op).color !== piece.color) || op.isCorner()) {
							//alert(this.pieceAt(op).color + " != " + piece.color);
							return true;
						}
						else {
							continue;
						}
					}

				}
			}
			else {
				for (var i in adj) {
					if ( ( this.pieceAt(adj[i]) && this.pieceAt(adj[i]).color !== piece.color ) || adj[i].isCorner() || adj[i].isCenter() ) {
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
	}

	this.setupPieces = function() {
		this.pieces = [];

		var id = 0;

		var black = [3,4,5,6,7,16,33,43,44,54,55,56,64,65,66,76,77,87,104,113,114,115,116,117];
		for (var i in black) {
			this.pieces.push(new Piece(id++, "black", false, new Point(Math.floor(black[i] / 11), black[i] % 11)));
		}

		var white = [38,48,49,50,58,59,61,62,70,71,72,82];
		for (var i in white) {
			this.pieces.push(new Piece(id++, "white", false, new Point(Math.floor(white[i] / 11), white[i] % 11)));
		}

		this.pieces.push(new Piece(id++, "white", true, new Point(5, 5)));
	}

	this.setupPieces();
}

function Display(board, boardElement, turnElement) {
	this.element = boardElement;
	this.turnDisplayElement = turnElement;
	this.board = board;
	this.clickedPiece = null;

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
	}

	this.elementAtPoint = function (point) {
		var index = point.y * 11 + point.x;
		return this.element.children[index];
	}

	this.pointAtElement = function (element) {
		for (var i = 0; i < this.element.children.length; i++) {
			if (this.element.children[i] === element) {
				return new Point(i % 11, Math.floor(i / 11));
			}
		}
	}

	this.setupDisplay = function () {
		$(this.element).empty();

		for (var i = 0; i < 121; i++) {
			$(this.element).append($('<div/>'));
			$("div:nth-child(11n)", this.element).addClass("right");
		}
	}

	this.pieceAtElement = function(element) {
		return $(element).hasClass("white") || $(element).hasClass("black") || $(element).hasClass("queen");
	}

	this.update = function () {
		var squares = $(this.element).children();
		var ins = [];
		var outs = [];
		var crosses = [];

		for (var i = 0; i < squares.length; i++) {
			var view = this.pieceAtElement(squares[i]);
			var model = this.board.pieceAt(this.pointAtElement(squares[i]));

			if (model && !view) {
				ins.push(this.pointAtElement(squares[i]));
			}
			else if (!model && view) {
				outs.push(this.pointAtElement(squares[i]));
			}
			else if (model && view) {
				if ($(squares[i]).attr('class').split(/\s+/).indexOf(this.classForPiece(model)) == -1) {
					crosses.push(this.pointAtElement(squares[i]));
				}
			}
		}

		for (var i = 0; i < outs.length; i++) {
			(function(elem) {
				$(elem).fadeOut(400, function () {
					$(elem).removeClass("white black queen"); //UPDATE
					$(elem).show();
				});
			})(this.elementAtPoint(outs[i]));
		}

		for (var i = 0; i < ins.length; i++) {
			(function(elem, _class) {
				$(elem).hide();

				$(elem).addClass(_class);

				$(elem).fadeIn(400);
			})(this.elementAtPoint(ins[i]), this.classForPiece(this.board.pieceAt(ins[i])));
		}

		for (var i = 0; i < crosses.length; i++) {
			(function(elem, _class) {
				$(elem).fadeOut(200, function () {
					$(elem).removeClass("white black queen"); //UPDATE
					$(elem).addClass(_class);
					$(elem).fadeIn(200);
				});
			})(this.elementAtPoint(crosses[i]), this.classForPiece(this.board.pieceAt(crosses[i])));
		}
	}

	this.updateTurnDisplay = function (displayText) {
		$(this.turnDisplayElement).html(displayText);
	}

	this.setupDisplay();
}

function Game (boardElement, turnDisplayElement, doneCallback) {
	this.done = doneCallback;
	this.board = new Board();
	this.display = new Display(this.board, boardElement, turnDisplayElement);
	this.whitePlayer = new HumanPlayer("white");
	this.blackPlayer = new HumanPlayer("black");
	this.winner = null;
	this.whiteMove = true;

	this.tick = function () {
		this.board.checkForTakenPieces();

		this.hardUpdateView();

		if (this.board.checkForVictory()) {
			if (this.board.checkForVictory() === "white") {
				this.winner = this.whitePlayer;
			}
			else {
				this.winner = this.blackPlayer;
			}
			
			this.done(this);
		}
	}

	this.reset = function () {
		this.whiteMove = true;
		this.winner = null;

		this.board.setupPieces();
		this.hardUpdateView();
	}

	this.moveIsValid = function (move) {
		return ( (move.piece.color === "white") === this.whiteMove ) && this.board.canMoveTo(move.piece, move.endLocation);
	}

	this.executeMove = function (move) {
		for (var i = 0; i < this.board.pieces.length; i++) {
			this.board.pieces[i].lastMovedPiece = false;
		}
		var startLocation = move.piece.location;

		move.piece.location = move.endLocation;

		move.piece.lastMovedPiece = true;

		this.whiteMove = !this.whiteMove;
	}

	this.updateTurnDisplay = function () {
		if (this.whiteMove) {
			this.display.updateTurnDisplay("White's Move");
		}
		else {
			this.display.updateTurnDisplay("Black's Move");
		}
	}

	this.hardUpdateView = function () {
		this.display.update();
		this.updateTurnDisplay();
	}

	this.tryMove = function (move) {
		if (this.moveIsValid(move)) {
			this.executeMove(move);
			return true;
		}

		return false;
	}
}