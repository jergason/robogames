
/* 
Game
*/

(function() {
  var Game;

  Game = (function() {

    function Game(gameId, name, level, player, states) {
      this.gameId = gameId;
      this.name = name;
      this.level = level;
      this.player = player;
      this.states = states;
    }

    Game.prototype.valid = function() {
      return true;
    };

    return Game;

  })();

  Game.convert = function(doc) {
    return new Game(doc.gameId, doc.name, doc.level, doc.turn, doc.player, doc.states);
  };

  module.exports = Game;

}).call(this);
