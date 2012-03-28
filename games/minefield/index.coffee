###
Minefield: move your piece from the top-left to the bottom right

Stateless: each tick takes a game state and a move, and returns a new world state. 

Synchronous: all level moves return synchronously. 
###

# exports.levelOne = (state, move) ->

_ = require 'underscore'
fjs = require('fjs').attachPrototype()

exports.modes = modes = 
    dead: "dead"
    play: "play"
    won: "won"

exports.name = "minefield"

# LEVELS ##################################################################

exports.levels = -> ["tiny", "empty", "easy", "randomMines", "muchosMines", "movingTarget", "blackAnts", "heatSeeking", "puppyGuard", "armyAnts"]

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

# this is only hard if you've been hard coding your paths
# to pass this off, make them RERUN the game.
exports.randomMines = 
    start: -> 
        w = 10
        h = 10
        mine = mines()
        rmine = -> mine(random(w-2)+1, random(h-2))
        state =
            mode: modes.play
            size: size w, h
            player: point 0, 0
            target: point 9, 9
            mines: [0..8].map (n) -> rmine()

    move: (state, m) -> 
        moveState state, m.action

# little traps
exports.muchosMines = 
    start: -> 
        mine = mines()
        state =
            mode: modes.play
            size: size 10, 10 
            player: point 0, 0
            target: point 9, 9
            mines: [ mine(0, 4)
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



# guards the exit. Mines will NOT move on top of you
# Hard+++ (reference implementation fails)
puppyGuard = ->

    pa1 = {x:8, y:9}
    pa2 = {x:7, y:9}

    pb1 = {x:9, y:7}
    pb2 = {x:9, y:8}

    start = ->

        state =
            mode: modes.play
            size: size 10, 10 
            player: point 0, 0
            target: point 9, 9
            mines: [ new Mine(pa1, 'a'), new Mine(pb1, 'b') ]

    move = (state, m) -> 

        # always let the player move first
        state = moveState state, m.action

        ids = byId state
        ma = ids.a
        mb = ids.b

        # now, patrol back and forth. Both of these configurations are solvable. 
        # each mine chooses it's other location, but not on top of the good guys
        # don't move onto the guy
        px = state.player.x
        py = state.player.y

        # move, but don't hit the player
        update = (m, p) ->
            if hit(state.player, p) then return
            m.x = p.x
            m.y = p.y

        if hit ma, pa1 then update ma, pa2
        else update ma, pa1

        if hit mb, pb1 then update mb, pb2
        else update mb, pb1

        state

    {start, move}

exports.puppyGuard = puppyGuard()



# single mine speeds towards you for the kill
exports.heatSeeking = 
    start: ->
        state =
            mode: modes.play
            size: size 10, 10 
            player: point 0, 0
            target: point 9, 9
            mines: [ new Mine({x: 5, y:5}, 'a') ]

    move: (state, m) ->

        # let the player move first
        state = moveState state, m.action

        px = state.player.x
        py = state.player.y

        ids = byId state

        m = ids.a

        # now move towards it
        if (m.x < px) then m.x += 1
        else if (m.x > px) then m.x -= 1
        else if (m.y < py) then m.y += 1
        else if (m.y > py) then m.y -= 1

        if collision state.mines, state.player
            state.mode = modes.dead

        state


# every couple of turns the target moves, randomly
exports.movingTarget = 
    start: ->
        state =
            mode: modes.play
            size: size 10, 10 
            player: point 0, 0
            target: point 9, 9
            mines: [ new Mine({x: 5, y:5}, 'a') ]

    move: (state, m) ->
        # let the player move first
        state = moveState state, m.action
        # if the player hits it, then be done
        if state.mode == modes.won then return state

        t = state.target

        # move roughly every couple of turns


        move = randomValue allDirections

        t.x += move.x
        t.y += move.y

        if t.x < 0 then t.x = 0
        else if t.x >= state.size.w then t.x = state.size.w-1

        if t.y < 0 then t.y = 0
        else if t.y >= state.size.h then t.y = state.size.h-1

        # check if the flag moved on top of the player  (win)
        if won state.target, state.player
            state.mode = modes.won

        state


# can you finish in a reasonable number of moves?
# bah, I'm sick of writing these. Looks good!
exports.huge = 
    start: ->
    move: ->


# they move randomly, all over the place!
exports.armyAnts = 
    start: -> 
        w = 10
        h = 10
        mine = mines()
        rmine = -> mine(random(w-2)+1, random(h-2))
        state =
            mode: modes.play
            size: size w, h
            player: point 0, 0
            target: point 9, 9
            mines: [0..17].map rmine

    move: (state, m) ->

        # let the player move first
        state = moveState state, m.action

        # now, move them all randomly
        state.mines = state.mines.map randomMovement.partial(state.size)

        # hit and sunk!
        if collision state.mines, state.player
            state.mode = modes.dead        

        state

# same as army ants but they won't move on top of you
exports.blackAnts = 
    start: -> 
        w = 10
        h = 10
        mine = mines()
        rmine = -> mine(random(w-2)+1, random(h-2))
        state =
            mode: modes.play
            size: size w, h
            player: point 0, 0
            target: point 9, 9
            mines: [0..17].map rmine

    move: (state, m) ->

        # let the player move first
        state = moveState state, m.action

        # now, move them all randomly
        state.mines = state.mines.map (m) ->
            newM = randomMovement(state.size, m)
            #console.log "NEW MINES!", m, newM
            if hit(newM, state.player) then m else newM

        state 


dstop = {x:0, y:0}
dleft = {x:-1, y:0}
dup = {x:0, y:-1}
ddown = {x:0, y:1}
dright = {x:1, y:0}
allDirections = [dstop, dleft, dup, ddown, dright]

randomMovement = (size, m) ->
    move = randomValue allDirections 

    # work with a copy

    m = _.clone m

    m.x += move.x
    m.y += move.y

    if m.x < 0 then m.x = 0
    else if m.x >= size.w then m.x = size.w-1

    if m.y < 0 then m.y = 0
    else if m.y >= size.h then m.y = size.h-1 

    m






# HELPERS #############################################################

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
    hits = mines.filter hit.partial(p)
    (hits.length > 0)

won = (target, p) -> 
    #console.log "checking if won!", target, p
    p.x == target.x and p.y == target.y


# standard game function, just handles the move and collisions
moveState = (currentState, action) ->

    state = _.clone currentState
    if state.mode == modes.dead
      return false

    # make the move
    state.player = movePoint state.player, action

    if not withinBounds state.size, state.player
        return false

    # if you get there first, you're ok, even if a mine is there
    if won state.target, state.player
        state.mode = modes.won

    else if collision state.mines, state.player
        state.mode = modes.dead


    state





# if you need to reference a point in a hash
pkey = (x, y) -> x + "," + y

# whether two points are the same
hit = (a, b) -> a.x == b.x && a.y == b.y

# returns a map of stuff by pkey
byLocation = (state) ->
    map = {}
    for m in state.mines
        map[pkey(m.x, m.y)] = m
    map[pkey(state.player.x, state.player.y)] = state.player
    map

# returns a map of mines by id (don't need player, you already have him in state.player)
byId = (state) ->
    map = {}
    for m in state.mines
        map[m.id] = m
    map

random = (n) -> Math.floor(Math.random() * n)
randomValue = (arr) -> arr[random(arr.length)] 

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
