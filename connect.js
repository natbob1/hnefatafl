var mongodb = require("mongodb");

var connection;

module.exports = function(callback) {
    if (connection) {
        callback(connection);
    }
    else {
        var url = process.env.MONGOLAB_URI || "mongodb://localhost:27017/hnefatafl";
        mongodb.connect(url + "?w=1", function(error, databaseCon) {
            connection = databaseCon;
            callback(connection);
        });
    }
};