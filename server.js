//  http://blog.modulus.io/nodejs-and-express-sessions
//  JSON.stringify(mainGame.board)

var express = require('express');
var mongodb = require('mongodb');
var hnefatafl = require('./static/js/main');

function loadGameFromDatabase (gameId, callback) {
	var game = new hnefatafl.Game(null, null, null);
	game.isClient = false;


	client.collection('games', function(err, collection) {
		collection.findOne({_id: new mongodb.ObjectID(gameId)}, function(err, doc) {
			game.fromJSONString(JSON.stringify(doc.game));
			callback(game);
		});
	});
}

var client = new mongodb.Db('hnefatafl', new mongodb.Server('127.0.0.1', 27017, {}));
client.open(function(err, db2) {});

var app = express();
app.use(express.cookieParser());
app.use(express.static(__dirname + "/static"));

app.get('/api/newGame.json', function(request, response) {
	var gameId = new mongodb.ObjectID();
	var game = new hnefatafl.Game(null, null, null);

	if(request.query.color !== "white" && request.query.color !== "black") {
		response.send(500);
	}

	client.collection('games', function(err, collection) {
		collection.insert({
			_id: gameId,
			game: JSON.parse(game.toJSONString())
		});
	});

	client.collection('gamePlayers', function(err, collection) {
		collection.insert({
			gameId: gameId,
			color: request.query.color,
			playerId: request.cookies.playerId
		});
	});

	response.send({
		code: gameId
	});
});

app.get('/api/joinGame.json', function(request, response) {
	if (!request.query.gameId) {
		response.send(500);
	}

	client.collection('gamePlayers', function(err, collection) {
		var gameId = new mongodb.ObjectID(request.query.gameId);

		collection.find({
			gameId: gameId
		}, function(err, cursor) {
			cursor.count(function(err, count) {
				if (count !== 1) {
					response.send({
						color: null
					});
				}
				else {
					cursor.nextObject(function(err, document) {
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
							playerId: request.cookies.playerId
						});

						response.send({
							color: color
						})
					});
				}
			});
		});
	});
});

app.get('/api/postMove.json', function(request, response) {
	if (!request.query.gameId || !request.query.move) {
		response.send(500);
	}

	//TODO: Check whether the playerId ref in gamePlayers matches whiteMove

	client.collection('games', function(err, collection) {
		loadGameFromDatabase(request.query.gameId, function(game) {
			var move = hnefatafl.Move.fromJSONString(request.query.move);

			if (game.executeMove(move)) { //TODO: examine whether executeMove allows bad moves through
				collection.update({
					_id: new mongodb.ObjectID(request.query.gameId)
				}, {
					game: JSON.parse(game.toJSONString())
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

app.get('/api/getGame.json', function(request, response) {
	if (!request.query.gameId) {
		response.send(500);
	}

	client.collection('games', function(err, collection) {
		loadGameFromDatabase(request.query.gameId, function(game) {
			response.send({
				game: JSON.parse(game.toJSONString())
			});
		});
	});
});

app.get('*', function(request, response) {
	response.send(404);
})

app.listen(8010);