
/* 
Game
*/

(function() {
  var Game, Player;

  Game = (function() {

    function Game(gameId, name, level, player, states, state) {
      this.gameId = gameId;
      this.name = name;
      this.level = level;
      this.player = player;
      this.states = states;
      this.state = state || states[states.length - 1];
    }

    Game.prototype.valid = function() {
      return true;
    };

    return Game;

  })();

  Game.convert = function(doc) {
    if (!(doc != null)) return null;
    return new Game(doc.gameId, doc.name, doc.level, doc.player, doc.states, doc.state);
  };

  Player = (function() {

    function Player(username, email, link) {
      this.username = username.replace(/[^\w]/g, "");
      this.email = email;
      this.link = link;
    }

    return Player;

  })();

  Game.Player = Player;

  module.exports = Game;

}).call(this);
