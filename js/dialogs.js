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