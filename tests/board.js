module("Board Tests");

test("test constructor", 1, function () {

    var board = new Board();

    equal(board.pieces.length, 37, "Expect the number of pieces on a new board to be 37");
});

test("test pieceAtPoint", 5, function () {

    var board = new Board();

    equal(Boolean(board.pieceAtPoint(new Point(5, 5))), true, "Expect a piece at (5, 5)");
    equal(Boolean(board.pieceAtPoint(new Point(6, 6))), true, "Expect a piece at (6, 6)");
    equal(Boolean(board.pieceAtPoint(new Point(3, 0))), true, "Expect a piece at (3, 0)");
    equal(Boolean(board.pieceAtPoint(new Point(1, 1))), false, "Expect no piece at (1, 1)");
    equal(Boolean(board.pieceAtPoint(new Point(0, 0))), false, "Expect no piece at (0, 0)");
});

