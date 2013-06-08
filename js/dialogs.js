function splashDialog () {
    $("#splash").modal({
        onOpen: function (dialog) {
            dialog.overlay.fadeIn(400);
            dialog.container.fadeIn(400);
            dialog.data.fadeIn(400);
        },
        onClose: function (dialog) {
            dialog.overlay.fadeOut(400);
            dialog.container.fadeOut(400);
            dialog.data.fadeOut(400, function () {
                $.modal.close();
            });
        },
        close: false
    });
}

function newGameDialog () {
    $("#newGame").modal({
        onOpen: function (dialog) {
            dialog.overlay.fadeIn(400);
            dialog.container.fadeIn(400);
            dialog.data.fadeIn(400);
        },
        onClose: function (dialog) {
            dialog.overlay.fadeOut(400);
            dialog.container.fadeOut(400);
            dialog.data.fadeOut(400, function () {
                $.modal.close();
            });
        }
    });
}

function doneDialog (game) {
  $("#winText").html("Winner is the " + game.winner.color + " player!");
  $("#done-dialog").dialog({
    modal: true,
    dialogClass: "no-close",
    draggable: false,
    resizable: false,
    show: "fadeIn",
    hide: "fadeOut",
    buttons: [{text: "New Game", click: function() {
      $(this).dialog( "close" );
      resetGame();
    }}]
  });
}

function invalidMoveDialog(message) {
  $("#invalid-message").html(message);
  
  $("#invalid-dialog").dialog({
    modal: true,
    dialogClass: "no-close",
    draggable: false,
    resizable: false,
    show: "fadeIn",
    hide: "fadeOut",
    buttons: [{text: "Okay", click: function() {
      $(this).dialog( "close" );
    }}]
  });
}