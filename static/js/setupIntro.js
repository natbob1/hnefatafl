function setupIntro() {
    $("#board").attr("data-step", 1);
    $("#board").attr("data-intro", "Hnefatafl is an ancient Norse board-game. &nbsp;It is played between <b>two players</b>, <b>white</b> and <b>black</b>, who alternate turns by <b>moving one of their pieces</b>.");

    var blackPiece = mainGame.board.pieces[5];
    var blackPieceSquareElement = mainGame.display.squareElementAtPoint(blackPiece.location);
    $(blackPieceSquareElement).attr("data-step", 2);
    $(blackPieceSquareElement).attr("data-intro", "All <b>pieces move as rooks do in chess</b>. &nbsp;A player may <b>capture an opponent's piece</b> by moving his own pieces both <b>above and below</b> it or to it's <b>left and right</b> (sandwiching the opponent's piece vertically or horizontally. &nbsp;A player's piece is not taken if it is moved between two opponent's pieces.)");

    var queen = mainGame.board.pieces[36];
    var queenSquareElement = mainGame.display.squareElementAtPoint(queen.location);
    $(queenSquareElement).attr("data-step", 3);
    $(queenSquareElement).attr("data-intro", "This piece is the the <b>King</b>. &nbsp;White's goal is to <b>move</b> her King to one of the <b>corners of the board</b>, while black's goal is to <b>capture the King</b>. &nbsp;The King may only be captured by <b>surrounding it on all four sides</b>.");

    var whitePiece = mainGame.board.pieces[24];
    var whitePieceSquareElement = mainGame.display.squareElementAtPoint(whitePiece.location);
    $(whitePieceSquareElement).attr("data-step", 4);
    $(whitePieceSquareElement).attr("data-intro", "To move a piece, first <b>click on the piece</b>. The squares to which the piece may move will be highlighted. &nbsp;<b>Click on one of the highlighted squares</b> to move your piece to that location.");

    var intro = introJs();

    intro.setOptions({
        'exitOnOverlayClick': false
    });

    var handleStepChange = function(elem){
        var stepToPieceMap = [undefined, undefined, blackPiece, queen, whitePiece];

        var step = $(elem).attr('data-step') || 0;

        for (var i = 0; i < stepToPieceMap.length; i++) {
            if (stepToPieceMap[i] !== undefined) {
                var zIndexVal = i == step ? 99999999 : '';

                $(mainGame.display.elementForPiece(stepToPieceMap[i])).css('z-index', zIndexVal);
            }
        }
    };



    intro.onbeforechange(handleStepChange);
    //TODO: There should be a onexit call to handleStepChange, but "onexit" is overridden elsewhere

    return intro;
}