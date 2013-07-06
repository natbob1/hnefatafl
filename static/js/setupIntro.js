function setupIntro() {
    var step = 1;

    $("#board").attr("data-step", step++);
    $("#board").attr("data-intro", "Hnefatafl is an ancient Norse board-game. &nbsp;It is played between <b>two players</b>, <b>white</b> and <b>black</b>, who alternate turns by <b>moving one of their pieces</b>.");

    var blackPiece = mainGame.display.elementAtPoint(new Point(1, 5));
    $(blackPiece).attr("data-step", step++);
    $(blackPiece).attr("data-intro", "All <b>pieces move as rooks do in chess</b>. &nbsp;A player may <b>capture an opponent's piece</b> by moving his own pieces both <b>above and below</b> it or to it's <b>left and right</b> (sandwiching the opponent's piece vertically or horizontally. &nbsp;A player's piece is not taken if it is moved between two opponent's pieces.)");

    var queen = mainGame.display.elementAtPoint(new Point(5, 5));
    $(queen).attr("data-step", step++);
    $(queen).attr("data-intro", "This piece is the the <b>King</b>. &nbsp;White's goal is to <b>move</b> her King to one of the <b>corners of the board</b>, while black's goal is to <b>capture the King</b>. &nbsp;The King may only be captured by <b>surrounding it on all four sides</b>.");

    var whitePiece = mainGame.display.elementAtPoint(new Point(7, 5));
    $(whitePiece).attr("data-step", step++);
    $(whitePiece).attr("data-intro", "To move a piece, first <b>click on the piece</b>. The squares to which the piece may move will be highlighted. &nbsp;<b>Click on one of the highlighted squares</b> to move your piece to that location.");
}