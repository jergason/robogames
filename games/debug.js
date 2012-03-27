(function() {
  var Player, Target, dump, modes, toRows;

  modes = require('./minefield').modes;

  exports.dump = dump = function(rows) {
    var header, map, _i, _ref, _results;
    map = rows.map(function(cols) {
      var row;
      row = cols.map(function(v) {
        if (v === modes.play) {
          return "o";
        } else if (v === modes.won) {
          return "w";
        } else if (v === modes.dead) {
          return "d";
        } else if (v === Target) {
          return "*";
        } else if (v) {
          return "x";
        } else {
          return " ";
        }
      });
      return "|" + row.join("|") + "|";
    });
    header = (function() {
      _results = [];
      for (var _i = 0, _ref = rows[0].length * 2; 0 <= _ref ? _i <= _ref : _i >= _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this).map(function(i) {
      return "_";
    });
    map = [header.join("")].concat(map);
    return map = map.join("\n");
  };

  exports.toRows = toRows = function(state) {
    var m, p, rs, t, x, y, _i, _len, _name, _ref, _ref2, _ref3;
    rs = [];
    for (y = 0, _ref = state.size.h - 1; 0 <= _ref ? y <= _ref : y >= _ref; 0 <= _ref ? y++ : y--) {
      rs.push([]);
      for (x = 0, _ref2 = state.size.w - 1; 0 <= _ref2 ? x <= _ref2 : x >= _ref2; 0 <= _ref2 ? x++ : x--) {
        rs[y].push(false);
      }
    }
    _ref3 = state.mines;
    for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
      m = _ref3[_i];
      if (rs[_name = m.y] == null) rs[_name] = [];
      rs[m.y][m.x] = m;
    }
    t = state.target;
    rs[t.y][t.x] = Target;
    p = state.player;
    rs[p.y][p.x] = state.mode;
    return rs;
  };

  Player = "player";

  Target = "target";

}).call(this);
