
/* 
Games

The front-end for the different games. Handles storage and retreival of game state
*/

(function() {
  var Game, Model, fjs, uniqueId;

  fjs = require('fjs').attachPrototype();

  Game = require('./Game');

  Model = (function() {

    function Model(collection) {
      this.play = exports.play.partial(collection);
    }

    return Model;

  })();

  exports.Model = Model;

  exports.play = function(games, game, levelName, player, cb) {
    var gameId, level, state;
    gameId = uniqueId();
    level = game[levelName];
    state = level.start();
    return exports.storeGame(games, new Game(gameId, game.name, levelName, 0, player, state), cb);
  };

  exports.move = function(turns, game, gameId, move, cb) {
    return exports.lastTurn(turns, gameId, function(err, turn) {
      var level, state;
      if (err != null) return cb(err);
      level = game[turn.level];
      state = level.move(turn.state, move);
      return exports.addState(games, gameId, state, cb);
    });
  };

  exports.lastState = function(games, gameId, cb) {
    return games.find({
      gameId: gameId
    }, {
      _id: 0,
      states: {
        $slice: -1
      }
    }).one(function(err, doc) {
      if (err != null) return cb(err);
      return cb(null, Game.convert(doc));
    });
  };

  exports.addState = function(games, gameId, state, cb) {
    return games.update({
      gameId: gameId
    }, {
      $push: {
        states: state
      }
    }, function(err) {
      if (err != null) return cb(err);
      return cb(null, state);
    });
  };

  exports.storeGame = function(games, game, cb) {
    if (!game.valid()) return cb(new Error("Invalid Game"));
    return games.save(game, function(err, doc) {
      if (err != null) return cb(err);
      return cb(null, Game.convert(doc));
    });
  };

  exports.index = function(games, cb) {
    return states.ensureIndex({
      gameId: 1
    }, cb);
  };

  uniqueId = function() {
    return Math.random().toString(36).replace("0.", "");
  };

}).call(this);
