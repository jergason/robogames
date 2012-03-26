###
Minefield: move your piece from the top-left to the bottom right

Stateless: each tick takes a game state and a move, and returns a new world state. 

Synchronous: all level moves return synchronously. 
###

# exports.levelOne = (state, move) ->

_ = require 'underscore'

exports.modes = modes = 
    dead: "dead"
    play: "play"
    won: "won"

point = (x, y) -> {x, y}
size = (w, h) -> {w, h}

movePoint = (start, action) ->
    switch action
        when "right" then point start.x + 1, start.y
        when "left" then point start.x - 1, start.y
        when "up" then point start.x, start.y - 1
        when "down" then point start.x, start.y + 1
        else false

withinBounds = (size, p) -> (0 <= p.x < size.w) && (0 <= p.y < size.h)

collision = (mines, p) -> 
    hits = mines.filter (m) ->
        m.x == p.x and m.y == p.y 
    (hits.length > 0)

won = (target, p) -> p.x == target.x and p.y == target.y


# standard game function, just handles the move and collisions
moveState = (currentState, action) ->

    state = _.clone currentState

    # make the move
    state.player = movePoint state.player, action

    if not withinBounds state.size, state.player
        return false

    if collision state.mines, state.player
        state.mode = modes.dead

    else if won state.target, state.player
        state.mode = modes.won

    state


exports.name = "minefield"

exports.levels = -> ["tiny", "empty", "easy", "lotsOfMines"]

# Level one just allows you to move

# only have to move one space!
exports.one = exports.tiny = 
    start: -> state =
        mode: modes.play
        size: size 2, 2 
        player: point 0, 0
        target: point 0, 1
        mines: [] 

    move: (state, m) -> 
        newState = moveState state, m.action

# move across the board
exports.two = exports.empty =
    start: -> state =
        mode: modes.play
        size: size 10, 10 
        player: point 0, 0
        target: point 9, 9
        mines: [] 

    move: (state, m) -> 
        moveState state, m.action

# some mines
exports.three = exports.easy =  
    start: -> 
        mine = mines()
        state =
            mode: modes.play
            size: size 10, 10 
            player: point 0, 0
            target: point 9, 9
            mines: [ mine(8, 0)
                   , mine(0, 1)
                   ]

    move: (state, m) -> 
        moveState state, m.action

# these mines were randomly generated
exports.lotsOfMines = 
    start: -> 
        mine = mines()
        state =
            mode: modes.play
            size: size 10, 10 
            player: point 0, 0
            target: point 9, 9
            mines: [ mine(0, 5)
                   , mine(0, 9)
                   , mine(1, 7)
                   , mine(3, 2)
                   , mine(3, 6)
                   , mine(4, 8)
                   , mine(5, 7)
                   , mine(6, 0)
                   , mine(6, 6)
                   , mine(7, 0)
                   , mine(7, 1)
                   , mine(7, 8)
                   , mine(8, 0)
                   , mine(8, 2)
                   , mine(8, 4)
                   , mine(8, 9)
                   , mine(9, 2)
                   , mine(9, 5)
                   ]

    move: (state, m) -> 
        moveState state, m.action




# returns a mine function that create a mine with a unique id 
mines = ->
    id = 0
    (x, y) -> new Mine point(x,y), id++ 

mine = (n, x, y) -> new Mine point(x,y) n

class Mine
    constructor: (point, id) ->
        @id = id
        @x = point.x
        @y = point.y
