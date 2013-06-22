var mongodb = require("mongodb");

var connection;

module.exports = function(callback) {
    if (connection) {
        callback(connection);
    }
    else {
        mongodb.connect(process.env.MONGOLAB_URI || "mongodb://localhost:27017/hnefatafl?w=0", function(error, databaseCon) {
            connection = databaseCon;
            callback(connection);
        });
    }
};