
{modes} = require './minefield'

# dumps the state to a console in a readable way
exports.dump = dump = (rows) ->
    map = rows.map (cols) ->
        row = cols.map (v) -> 
            if v is modes.play then "o"
            else if v is modes.won then "w"
            else if v is modes.dead then "d"
            else if v is Target then "*"
            else if v then "x"
            else " "

        "|" + row.join("|") + "|"

    header = [0..(rows[0].length*2)].map (i) -> "_"
    map = [header.join("")].concat(map)
    map = map.join "\n"

# changes to an array representation of the state
exports.toRows = toRows = (state) ->
    rs = []

    for y in [0..state.size.h-1]
        rs.push []
        for x in [0..state.size.w-1]
            rs[y].push(false)

    for m in state.mines
        rs[m.y] ?= []
        rs[m.y][m.x] = m 

    t = state.target
    rs[t.y][t.x] = Target

    p = state.player
    rs[p.y][p.x] = state.mode

    rs


Player = "player"
Target = "target"
