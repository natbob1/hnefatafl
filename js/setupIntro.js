function setupIntro() {
    var step = 1;

    $("#board").attr("data-step", step++);
    $("#board").attr("data-intro", "Hnefatafl is a 16th century Norse boardgame.<br />The white and black players alternate turns by moving one of their pieces.");

    var blackPiece = mainGame.display.elementAtPoint(new Point(1, 5));
    $(blackPiece).attr("data-step", step++);
    $(blackPiece).attr("data-intro", "All pieces move as rooks do in chess.  A player may capture an opponent's piece by moving his own pieces both above and below it or to it's left and right (sandwiching it vertically or horizontally.)");

    var queen = mainGame.display.elementAtPoint(new Point(5, 5));
    $(queen).attr("data-step", step++);
    $(queen).attr("data-intro", "This piece is the the King. White's goal is to move her King to one of the corners of the board, while black's goal is to capture the King.<br />The King may only be captured by surrounding it on all four sides.");
}