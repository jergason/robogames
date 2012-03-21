
/*
Minefield: move your piece from the top-left to the bottom right

Stateless: each tick takes a game state and a move, and returns a new world state. 

Synchronous: all level moves return synchronously.
*/

(function() {
  var Mine, collision, modes, move, point, size, withinBounds, won;

  modes = {
    dead: "dead",
    play: "play",
    won: "won"
  };

  point = function(x, y) {
    return {
      x: x,
      y: y
    };
  };

  size = function(w, h) {
    return {
      w: w,
      h: h
    };
  };

  move = function(start, action) {
    switch (action) {
      case "right":
        return point(start.x + 1, start.y);
      case "left":
        return point(start.x - 1, start.y);
      case "up":
        return point(start.x, start.y - 1);
      case "down":
        return point(start.x, start.y + 1);
      default:
        return false;
    }
  };

  withinBounds = function(size, p) {
    var _ref, _ref2;
    return ((0 <= (_ref = p.x) && _ref < size.w)) && ((0 <= (_ref2 = p.y) && _ref2 < size.h));
  };

  collision = function(mines, p) {
    return mines.forEach(function(m) {});
  };

  won = function(target, p) {
    return p.x === target.x && p.y === target.y;
  };

  exports.name = "minefield";

  exports.levels = function() {
    return ["one"];
  };

  exports.one = {
    start: function() {
      var state;
      return state = {
        mode: modes.play,
        size: size(10, 10),
        player: point(0, 0),
        target: point(9, 9),
        mines: []
      };
    },
    move: function(state, m) {
      state.player = move(state.player, m.action);
      if (!withinBounds(state.size, state.player)) return false;
      if (collision(state.mines, state.player)) {
        state.mode = modes.dead;
      } else if (won(state.target, state.player)) {
        state.mode = modes.won;
      }
      return state;
    }
  };

  Mine = (function() {

    function Mine(point, id) {
      this.point = point;
      this.id = id;
    }

    return Mine;

  })();

}).call(this);
