function setupClickCallbacks() {
  clickedPiece = null;

  $("#board div").on("click", function () {

    if (!clickedPiece) {
      clickedPiece = mainGame.board.pieceAt(mainGame.display.pointAtElement(this));

      if (!(clickedPiece.color === "white") === mainGame.whiteMove) {
        clickedPiece = null;
        invalidMoveDialog("That's not your piece!");
        return false;
      }
    }
    else {
      var newLocation = mainGame.display.pointAtElement(this);

      if (newLocation) {
        if(clickedPiece.location.isEqual(newLocation)) {
          clickedPiece = null;
          return false;
        }
        else if (mainGame.board.pieceAt(newLocation) && mainGame.board.pieceAt(newLocation).color == clickedPiece.color) {
          clickedPiece = mainGame.board.pieceAt(newLocation);
          return false;
        }

        var move = new Move(clickedPiece, newLocation);

        if (!mainGame.tryMove(move)) {
          invalidMoveDialog("That move isn't allowed!");
          return false;
        }
        else {
          mainGame.tick();
          saveGame(mainGame);
        }
      }

      clickedPiece = null;
    }
  });
}

function clearClickCallbacks() {
  clickedPiece = null;
  $("#board div").unbind("click");
}