function splashDialog() {
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

function newGameDialog() {
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

function networkGameCodeDialog() {
    $("#gameCode").val(mainGame.gameId);

    $("#networkGameCode input").click(function () {
        $(this).select();
    });

    $("#networkGameCode").modal({
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

function joinNetworkGameDialog() {
    $("#joinNetworkButton").click(function () {
        joinNetworkGame($("#joinCode").val());
    });

    $("#joinNetworkGame").modal({
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

function doneDialog(game) {
    $("#winText").html("Winner is the " + game.winner + " player!");

    $("#gameDone").modal({
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

function invalidMoveDialog(message) {
    $("#invalid-message").html(message);

    $("#invalidMove").modal({
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

function joinSucessDialog(color) {
    var message;
    if (color === "white" || color === "black") {
        message = "the " + color + " player!";
    }
    else {
        message = "an observer!";
    }
    $("#join-success-message").html("You've joined the game as " + message);
    
    $("#joinSuccess").modal({
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
function joinFailDialog() {
    $("#joinFail").modal({
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