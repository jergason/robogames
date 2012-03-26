
/* 
Games

The front-end for the different games. Handles storage and retreival of game state
*/

(function() {
  var Game, Model, fjs, storeGame, uniqueId, updateState;

  fjs = require('fjs').attachPrototype();

  Game = require('./Game');

  Model = (function() {

    function Model(collection) {
      this.play = exports.play.partial(collection);
      this.move = exports.move.partial(collection);
      this.index = exports.index.partial(collection);
      this.fetch = exports.fetch.partial(collection);
    }

    return Model;

  })();

  exports.Model = Model;

  exports.fetch = function(games, gameId, cb) {
    return games.findOne({
      gameId: gameId
    }, cb);
  };

  exports.play = function(games, game, levelName, player, cb) {
    var gameId, level, state;
    gameId = uniqueId();
    level = game[levelName];
    state = level.start();
    return storeGame(games, new Game(gameId, game.name, levelName, player, [state]), cb);
  };

  exports.move = function(games, game, gameId, move, cb) {
    return exports.lastState(games, gameId, function(err, g) {
      var level, state;
      if (err != null) return cb(err);
      level = game[g.level];
      state = level.move(g.state, move);
      if (!state) return cb(new Error("Invalid Move"));
      return updateState(games, gameId, state, cb);
    });
  };

  exports.index = function(games, cb) {
    return games.ensureIndex({
      gameId: 1
    }, cb);
  };

  exports.lastState = function(games, gameId, cb) {
    return games.findOne({
      gameId: gameId
    }, {
      _id: 0,
      level: 1,
      state: 1
    }, function(err, doc) {
      if (err != null) return cb(err);
      if (!(doc != null)) return cb(new Error("Could not find game"));
      return cb(null, Game.convert(doc));
    });
  };

  updateState = function(games, gameId, state, cb) {
    return games.update({
      gameId: gameId
    }, {
      $set: {
        state: state
      },
      $push: {
        states: state
      }
    }, false, false, function(err) {
      if (err != null) return cb(err);
      return cb(null, state);
    });
  };

  storeGame = function(games, game, cb) {
    if (!game.valid()) return cb(new Error("Invalid Game"));
    return games.save(game, function(err, doc) {
      if (err != null) return cb(err);
      return cb(null, game.summary());
    });
  };

  uniqueId = function() {
    return Math.random().toString(36).replace("0.", "");
  };

}).call(this);
