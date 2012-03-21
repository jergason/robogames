(function() {
  var MONGODB_HOST, PORT, app, connectLess, express, games, minefield, mongo, notImplemented;

  PORT = process.env.PORT || 2663;

  MONGODB_HOST = process.env.MONGODB_HOST || "localhost";

  express = require('express');

  connectLess = require('connect-less');

  mongo = require('mongodb-wrapper');

  games = require('./games');

  minefield = require('./games/minefield');

  exports.createServer = function() {
    var app, db;
    app = express.createServer();
    app.use(express.bodyParser());
    app.use(connectLess({
      src: __dirname + '/public'
    }));
    app.use(express.static(__dirname + "/public"));
    db = mongo.db(MONGODB_HOST, 27017, "robogames");
    db.collection('states');
    app.post("/minefield/levels/:level/games", function(req, res) {
      var level, player;
      level = req.param("level");
      player = req.body;
      return games.play(minefield, level, player, function(err, state) {
        if (err != null) return res.send(err, 500);
        return res.send(state);
      });
    });
    app.post("/minefield/:gameId/moves", function(req, res) {
      var gameId, player;
      gameId = req.param("gameId");
      return player = req.body;
    });
    app.get("/minefield/levels", notImplemented);
    app.get("/minefield/levels/:level/games", notImplemented);
    app.get("/minefield/:gameId/turns", notImplemented);
    app.get("/minefield/:gameId/turns/latest", notImplemented);
    app.get("/players/:username/games", notImplemented);
    return app;
  };

  notImplemented = function(req, res) {
    return res.send("Not Implemented", 501);
  };

  if (module === require.main) {
    app = exports.createServer();
    console.log("Started on " + PORT);
    app.listen(PORT);
  }

}).call(this);
