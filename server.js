var express = require('express');
var mongodb = require('mongodb');
var hnefatafl = require('./static/js/main');
var connect = require('./connect');

var waiting = [];

function removeFromWaiting (item) {
    var i;
    for (i = 0; i < waiting.length; i++) {
        if (item === waiting[i]) {
            waiting.splice(i, 1);
            return true;
        }
    }
    return false;
}

function loadGameFromDatabase(gameId, callback) {
    var game = new hnefatafl.Game(null, null, null);
    game.isClient = false;

    connect(function (client){
        client.collection('games', function (err, collection) {
            collection.findOne({_id: new mongodb.ObjectID(gameId)}, function (err, doc) {
                game.fromJSONString(JSON.stringify(doc.game));
                callback(game);
            });
        });
    });
}

var app = express();
app.use(express.cookieParser());
app.use(express.static(__dirname + "/static"));

app.get('/api/newGame.json', function (request, response) {
    var gameId = new mongodb.ObjectID();
    var game = new hnefatafl.Game(null, null, null);

    if (request.query.color !== "white" && request.query.color !== "black") {
        response.send(500);
    }

    response.send({
        code: gameId,
        color: request.query.color
    });

    connect(function (client) {
        client.collection('games', function (err, collection) {
            collection.insert({
                _id: gameId,
                game: JSON.parse(game.toJSONString())
            });
        });

        client.collection('gamePlayers', function (err, collection) {
            collection.insert({
                gameId: gameId,
                color: request.query.color,
                playerId: request.cookies.playerId,
                current: false
            });
        });
    });
});

app.get('/api/joinGame.json', function (request, response) {
    if (!request.query.gameId) {
        response.send(500);
    }

    connect(function(client) {
        client.collection('gamePlayers', function (err, collection) {
            var gameId = new mongodb.ObjectID(request.query.gameId);

            collection.find({
                gameId: gameId,
                playerId: request.cookies.playerId
            }, function (err, cursor) {
                cursor.count(function (err, count) {
                    if (count == 1) {
                        collection.update({
                            gameId: gameId,
                            playerId: request.cookies.playerId
                        }, {
                            $set: {
                                current: false
                            }
                        });
                        cursor.nextObject(function (err, document) {
                            response.send({
                                code: request.query.gameId,
                                color: document.color
                            });
                        });
                    }
                    else {
                        collection.find({
                            gameId: gameId
                        }, function (err, cursor) {
                            cursor.count(function (err, count) {
                                if (count !== 1) {
                                    response.send(404);
                                }
                                else {
                                    cursor.nextObject(function (err, document) {
                                        var color = null;
                                        if (document.color === "white") {
                                            color = "black";
                                        }
                                        else if (document.color === "black") {
                                            color = "white";
                                        }
                                        collection.insert({
                                            gameId: gameId,
                                            color: color,
                                            playerId: request.cookies.playerId,
                                            current: false
                                        });

                                        response.send({
                                            code: request.query.gameId,
                                            color: color
                                        })
                                    });
                                }
                            });
                        });
                    }
                });
            });
        });
    });
});

app.get('/api/postMove.json', function (request, response) {
    if (!request.query.gameId || !request.query.move) {
        response.send(500);
    }

    connect(function(client){
        //TODO: Check whether the playerId ref in gamePlayers matches move.piece.color

        client.collection('games', function (err, collection) {
            loadGameFromDatabase(request.query.gameId, function (game) {
                var move = hnefatafl.Move.fromJSONString(request.query.move);

                if (game.executeMove(move)) { //TODO: examine whether executeMove allows bad moves through
                    game.tick();

                    collection.update({
                        _id: new mongodb.ObjectID(request.query.gameId)
                    }, {
                        game: JSON.parse(game.toJSONString())
                    });

                    client.collection('gamePlayers', function (error, playerCollection) {
                        playerCollection.update({
                            gameId: new mongodb.ObjectID(request.query.gameId)
                        }, {
                            $set: {
                                current: false
                            }
                        }, {
                            multi: true
                        });
                    });

                    response.send({
                        success: true
                    });
                } else {
                    response.send({
                        success: false
                    });
                }
            });
        });
    });
});

app.get('/api/getGame.json', function (request, response) {
    if (!request.query.gameId) {
        response.send(500);
    }

    waiting.push({
        request: request,
        response: response,
        time: new Date().getTime()
    });
    console.log(request.cookies.playerId +  " added to queue.");
});

app.get('*', function (request, response) {
    response.send(404);
});

setInterval(function () {
    var expiration = new Date().getTime() - 30000;
    var i;

    for (i = waiting.length - 1; i >= 0; i--) {
        if (waiting[i].time < expiration) {
            console.log(waiting[i].request.cookies.playerId +  " has timed out.");
            waiting[i].response.writeHead(200, {"Content-Type": "text/plain"});
            waiting[i].response.end("");
            removeFromWaiting(waiting[i]);
            break;
        }

        connect((function (item) {
            return function(client) {
                client.collection('gamePlayers', function (err, collection) {
                    var gameId = new mongodb.ObjectID(item.request.query.gameId);

                    collection.find({
                        gameId: gameId,
                        playerId: item.request.cookies.playerId,
                        current: false
                    }, function (err, cursor) {
                        cursor.count(function (err, count) {
                            if (count !== 0) {
                                //console.log(count + " players matching playerId");
                                loadGameFromDatabase(item.request.query.gameId, function (game) {
                                    item.response.send(JSON.parse(game.toJSONString()));
                                    removeFromWaiting(item);

                                    collection.update({
                                        gameId: gameId,
                                        playerId: item.request.cookies.playerId,
                                        current: false
                                    }, {
                                        $set: {
                                            current: true
                                        }
                                    });
                                    console.log(item.request.cookies.playerId + " has been updated.");
                                });
                            }
                        });
                    });
                });
            };
        })(waiting[i]));
    }
}, 100);

app.listen(process.env.PORT || 8000);