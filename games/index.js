
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
      this.fetchStateAtTurn = exports.fetchStateAtTurn.partial(collection);
      this.leaderboard = exports.leaderboard.partial(collection);
      this.byPlayer = exports.byPlayer.partial(collection);
      this.byLevel = exports.byLevel.partial(collection);
    }

    return Model;

  })();

  exports.Model = Model;

  exports.fetch = function(games, gameId, cb) {
    return games.findOne({
      gameId: gameId
    }, cb);
  };

  exports.leaderboard = function(games, cb) {
    return games.find({
      "state.mode": "won"
    }, {
      _id: 0,
      level: 1,
      "player.username": 1,
      "state.mode": "state.mode",
      "gameId": 1
    }).toArray(function(err, docs) {
      var byUsername, g, obj, un, usernameGamesArray, _i, _len;
      if (err != null) return cb(err);
      games = docs;
      byUsername = {};
      for (_i = 0, _len = games.length; _i < _len; _i++) {
        g = games[_i];
        un = g.player.username;
        if (byUsername[un] == null) {
          byUsername[un] = {
            username: g.player.username,
            games: [],
            wins: 0
          };
        }
        byUsername[un].games.push({
          level: g.level,
          gameId: g.gameId
        });
        byUsername[un].wins++;
      }
      usernameGamesArray = [];
      for (un in byUsername) {
        obj = byUsername[un];
        usernameGamesArray.push(obj);
      }
      usernameGamesArray.sort(function(a, b) {
        return a.games.length - b.games.length;
      });
      return cb(null, usernameGamesArray);
    });
  };

  exports.byPlayer = function(games, username, cb) {
    return games.find({
      "player.username": username
    }, {
      _id: 0,
      level: 1,
      gameId: 1,
      "state.mode": 1
    }).toArray(function(err, docs) {
      if (err != null) return cb(err);
      return cb(null, docs.map(function(d) {
        return {
          gameId: d.gameId,
          level: d.level,
          won: d.state.mode === "won"
        };
      }));
    });
  };

  exports.byLevel = function(games, game, levelName, cb) {
    return games.find({
      name: game.name,
      level: levelName
    }, {
      _id: 0,
      gameId: 1,
      "player.username": 1,
      "state.mode": 1
    }).toArray(function(err, games) {
      if (err != null) return cb(err);
      games = games.map(function(g) {
        return {
          gameId: g.gameId,
          username: g.player.username,
          won: g.state.mode === "won"
        };
      });
      return cb(null, games);
    });
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

  exports.fetchStateAtTurn = function(games, gameId, n, cb) {
    return games.findOne({
      gameId: gameId
    }, {
      _id: 0,
      states: 1
    }, function(err, doc) {
      if ((err != null) || !(doc != null)) return cb(err);
      return cb(null, doc.states[n]);
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
