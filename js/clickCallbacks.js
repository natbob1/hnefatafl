function setupClickCallbacks() {
  mainGame.display.clickedPiece = null;

  $("#board div").on("click", function () {

    if (!mainGame.display.clickedPiece) {
      mainGame.display.clickedPiece = mainGame.board.pieceAt(mainGame.display.pointAtElement(this));


      if (!(mainGame.display.clickedPiece.color === "white") === mainGame.whiteMove) {
        mainGame.display.clickedPiece = null;
        invalidMoveDialog("That's not your piece!");
        return false;
      }

    }
    else {
      var newLocation = mainGame.display.pointAtElement(this);

      if (newLocation) {
        if(mainGame.display.clickedPiece.location.isEqual(newLocation)) {
          mainGame.display.clickedPiece = null;
          return false;
        }
        else if (mainGame.board.pieceAt(newLocation) && mainGame.board.pieceAt(newLocation).color == mainGame.display.clickedPiece.color) {
          mainGame.display.clickedPiece = mainGame.board.pieceAt(newLocation);
          return false;
        }

        var move = new Move(mainGame.display.clickedPiece, newLocation); //***MOVE CREATED***

        if (!mainGame.tryMove(move)) {
          invalidMoveDialog("That move isn't allowed!");
          return false;
        }
        else {
          mainGame.tick();
          saveGame(mainGame);
        }
      }

      mainGame.display.clickedPiece = null;
    }
  });
}

function clearClickCallbacks() {
  mainGame.display.clickedPiece = null;
  $("#board div").unbind("click");
}