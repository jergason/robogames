(function() {
  var assert, mongo;

  mongo = require('mongodb-wrapper');

  assert = require('assert');

  describe('games', function() {
    var Model, db, games;
    db = mongo.db('localhost', 27017, 'test');
    db.collection('games');
    Model = require('../games').Model;
    games = new Model(db.games);
    return it('should let me connect', function() {
      return assert.ok(false);
    });
  });

}).call(this);
