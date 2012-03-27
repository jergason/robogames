
/*
Minefield: move your piece from the top-left to the bottom right

Stateless: each tick takes a game state and a move, and returns a new world state. 

Synchronous: all level moves return synchronously.
*/

(function() {
  var Mine, byId, byLocation, collision, hit, mine, mines, modes, movePoint, moveState, pkey, point, puppyGuard, random, size, withinBounds, won, _;

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
    return ["tiny", "empty", "easy", "randomMines", "muchosMines", "puppyGuard"];
  };

  exports.one = exports.tiny = {
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
      var newState;
      return newState = moveState(state, m.action);
    }
  };

  exports.two = exports.empty = {
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

  exports.three = exports.easy = {
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

  exports.randomMines = {
    start: function() {
      var h, mine, rmine, state, w;
      w = 10;
      h = 10;
      mine = mines();
      rmine = function() {
        return mine(random(w - 2), random(h - 2));
      };
      return state = {
        mode: modes.play,
        size: size(w, h),
        player: point(0, 0),
        target: point(9, 9),
        mines: [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function(n) {
          return rmine();
        })
      };
    },
    move: function(state, m) {
      return moveState(state, m.action);
    }
  };

  exports.muchosMines = {
    start: function() {
      var mine, state;
      mine = mines();
      return state = {
        mode: modes.play,
        size: size(10, 10),
        player: point(0, 0),
        target: point(9, 9),
        mines: [mine(0, 4), mine(0, 9), mine(1, 7), mine(3, 2), mine(3, 6), mine(4, 8), mine(5, 7), mine(6, 0), mine(6, 6), mine(7, 0), mine(7, 1), mine(7, 8), mine(8, 0), mine(8, 2), mine(8, 4), mine(8, 9), mine(9, 2), mine(9, 5)]
      };
    },
    move: function(state, m) {
      return moveState(state, m.action);
    }
  };

  puppyGuard = function() {
    var move, pa1, pa2, pb1, pb2, start;
    pa1 = {
      x: 8,
      y: 9
    };
    pa2 = {
      x: 7,
      y: 9
    };
    pb1 = {
      x: 9,
      y: 7
    };
    pb2 = {
      x: 9,
      y: 8
    };
    start = function() {
      var state;
      return state = {
        mode: modes.play,
        size: size(10, 10),
        player: point(0, 0),
        target: point(9, 9),
        mines: [new Mine(pa1, 'a'), new Mine(pb1, 'b')]
      };
    };
    move = function(state, m) {
      var ids, ma, mb, px, py, update;
      state = moveState(state, m.action);
      ids = byId(state);
      ma = ids.a;
      mb = ids.b;
      px = state.player.x;
      py = state.player.y;
      update = function(m, p) {
        if (hit(state.player, p)) return;
        m.x = p.x;
        return m.y = p.y;
      };
      if (hit(ma, pa1)) {
        update(ma, pa2);
      } else {
        update(ma, pa1);
      }
      if (hit(mb, pb1)) {
        update(mb, pb2);
      } else {
        update(mb, pb1);
      }
      return state;
    };
    return {
      start: start,
      move: move
    };
  };

  exports.puppyGuard = puppyGuard();

  hit = function(a, b) {
    return a.x === b.x && a.y === b.y;
  };

  exports.attackDrones = {
    start: function() {},
    move: function() {}
  };

  pkey = function(x, y) {
    return x + "," + y;
  };

  byLocation = function(state) {
    var m, map, _i, _len, _ref;
    map = {};
    _ref = state.mines;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      m = _ref[_i];
      map[pkey(m.x, m.y)] = m;
    }
    map[pkey(state.player.x, state.player.y)] = state.player;
    return map;
  };

  byId = function(state) {
    var m, map, _i, _len, _ref;
    map = {};
    _ref = state.mines;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      m = _ref[_i];
      map[m.id] = m;
    }
    return map;
  };

  random = function(n) {
    return Math.floor(Math.random() * n);
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
