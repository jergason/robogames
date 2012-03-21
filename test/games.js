(function() {
  var Game, Model, Player, assert, minefield, mongo;

  mongo = require('mongodb-wrapper');

  assert = require('assert');

  Model = require('../games').Model;

  minefield = require('../games/minefield');

  Game = require('../games/Game');

  Player = Game.Player;

  describe('games', function() {
    var db, games, player;
    db = mongo.db('localhost', 27017, 'test');
    db.collection('games');
    games = new Model(db.games);
    player = new Player("test", "nothing@nothing.com", "http://google.com");
    describe("setup", function() {
      return it('should set up the collection', function(done) {
        return db.games.remove({}, function(err) {
          assert.ifError(err);
          return games.index(done);
        });
      });
    });
    describe("Game", function() {
      return it('should convert correctly', function() {
        var game, game2;
        game = new Game("id", "name", "level", player, []);
        assert.ok(game.gameId);
        assert.ok(game.name);
        assert.ok(game.level);
        assert.ok(game.player);
        assert.ok(game.states);
        game2 = Game.convert(game);
        assert.equal(game.name, game2.name);
        assert.ok(game2.player, "didn't copy player");
        return assert.equal(game2.player.username, game.player.username);
      });
    });
    return describe('minefield', function() {
      var gameId;
      gameId = null;
      it('should let me connect', function(done) {
        return games.play(minefield, "one", player, function(err, game) {
          assert.ifError(err);
          assert.ok(game);
          assert.ok(game.gameId);
          assert.ok(game.player);
          assert.equal(game.player.username, "test");
          assert.equal(game.player.username, player.username);
          assert.ok(game.states);
          assert.ok(game.states[0], "missing initial state");
          gameId = game.gameId;
          return done();
        });
      });
      it('should move right', function(done) {
        return games.move(minefield, gameId, {
          action: "right"
        }, function(err, state) {
          assert.ifError(err);
          assert.ok(state);
          assert.ok(state.player);
          assert.equal(state.player.x, 1);
          return done();
        });
      });
      it('should fail if I move off screen', function(done) {
        return games.move(minefield, gameId, {
          action: "up"
        }, function(err, state) {
          assert.ok(err, 'should have given me an error that I cant move up');
          return done();
        });
      });
      it('should die if I move onto a mine', function(done) {
        return assert.ok(false, "test me");
      });
      return it('should win if I move onto the target', function(done) {
        return assert.ok(false, "test me");
      });
    });
  });

}).call(this);
