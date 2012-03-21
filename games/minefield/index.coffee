###
Minefield: move your piece from the top-left to the bottom right

Stateless: each tick takes a game state and a move, and returns a new world state. 

Synchronous: all level moves return synchronously. 
###

# exports.levelOne = (state, move) ->

modes = 
    dead: "dead"
    play: "play"
    won: "won"

point = (x, y) -> {x, y}
size = (w, h) -> {w, h}

move = (start, action) ->
    switch action
        when "right" then point start.x + 1, start.y
        when "left" then point start.x - 1, start.y
        when "up" then point start.x, start.y - 1
        when "down" then point start.x, start.y + 1
        else false

withinBounds = (size, p) -> (0 <= p.x < size.w) && (0 <= p.y < size.h)

collision = (mines, p) -> mines.forEach (m) ->

won = (target, p) -> p.x == target.x and p.y == target.y




exports.name = "minefield"


exports.levels = -> ["one"]


# Level one just allows you to move
exports.one = 
    start: -> state =
        mode: modes.play
        size: size 10, 10 
        player: point 0, 0
        target: point 9, 9
        mines: [] 

    move: (state, m) ->
        # make the move
        state.player = move state.player, m.action

        if not withinBounds state.size, state.player
            return false

        if collision state.mines, state.player
            state.mode = modes.dead

        else if won state.target, state.player
            state.mode = modes.won

        state


class Mine
    constructor: (point, id) ->
        @point = point
        @id = id


