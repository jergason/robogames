
/*
Minefield: move your piece from the top-left to the bottom right

Stateless: each tick takes a game state and a move, and returns a new world state. 

Synchronous: all level moves return synchronously.
*/

(function() {
  var Mine, collision, mine, mines, modes, movePoint, moveState, point, size, withinBounds, won, _;

  _ = require('underscore');

  exports.modes = modes = {
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

  movePoint = function(start, action) {
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
    var hits;
    hits = mines.filter(function(m) {
      return m.x === p.x && m.y === p.y;
    });
    return hits.length > 0;
  };

  won = function(target, p) {
    return p.x === target.x && p.y === target.y;
  };

  moveState = function(currentState, action) {
    var state;
    state = _.clone(currentState);
    state.player = movePoint(state.player, action);
    if (!withinBounds(state.size, state.player)) return false;
    if (collision(state.mines, state.player)) {
      state.mode = modes.dead;
    } else if (won(state.target, state.player)) {
      state.mode = modes.won;
    }
    return state;
  };

  exports.name = "minefield";

  exports.levels = function() {
    return ["one", "two"];
  };

  exports.one = {
    start: function() {
      var state;
      return state = {
        mode: modes.play,
        size: size(2, 2),
        player: point(0, 0),
        target: point(0, 1),
        mines: []
      };
    },
    move: function(state, m) {
      return moveState(state, m.action);
    }
  };

  exports.two = {
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
      return moveState(state, m.action);
    }
  };

  exports.three = {
    start: function() {
      var mine, state;
      mine = mines();
      return state = {
        mode: modes.play,
        size: size(10, 10),
        player: point(0, 0),
        target: point(9, 9),
        mines: [mine(8, 0), mine(0, 1)]
      };
    },
    move: function(state, m) {
      return moveState(state, m.action);
    }
  };

  mines = function() {
    var id;
    id = 0;
    return function(x, y) {
      return new Mine(point(x, y), id++);
    };
  };

  mine = function(n, x, y) {
    return new Mine(point(x, y)(n));
  };

  Mine = (function() {

    function Mine(point, id) {
      this.id = id;
      this.x = point.x;
      this.y = point.y;
    }

    return Mine;

  })();

}).call(this);
