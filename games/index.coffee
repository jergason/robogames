### 
Games

The front-end for the different games. Handles storage and retreival of game state

###

fjs = require('fjs').attachPrototype()
Game = require './Game'

class Model
    constructor: (collection) ->
        @play = exports.play.partial collection
        @move = exports.move.partial collection
        @index = exports.index.partial collection


exports.Model = Model

# start the game
# needs: gameId and starting state
exports.play = (games, game, levelName, player, cb) ->
    gameId = uniqueId()
    level = game[levelName]
    state = level.start()

    # store the game and return it to the player
    storeGame games, new Game(gameId, game.name, levelName, player, [state]), cb



# make a move
# needs: new state
exports.move = (games, game, gameId, move, cb) ->
    exports.lastState games, gameId, (err, g) ->
        if err? then return cb err
        level = game[g.level]
        state = level.move g.state, move

        if not state
            return cb new Error "Invalid Move"

        updateState games, gameId, state, cb  

# build indexes
exports.index = (games, cb) ->
    games.ensureIndex({gameId: 1}, cb)


# gets the last game state (not opinionated about the format!)
exports.lastState = (games, gameId, cb) ->
    games.findOne {gameId: gameId}, {_id: 0, level: 1, state: 1}, (err, doc) ->
        if err? then return cb err
        if not doc? then return cb new Error("Could not find game")
        cb null, Game.convert(doc)



updateState = (games, gameId, state, cb) ->
    games.update {gameId: gameId}, {$set: {state: state}, $push: {states: state}}, false, false, (err) ->
        if err? then return cb err
        cb null, state

# store an existing game state
# gameId, turn, state, player (player info?)
storeGame = (games, game, cb) ->

    if not game.valid() then return cb(new Error("Invalid Game"))

    games.save game, (err, doc) ->
        if err? then return cb err
        cb null, game.summary()





uniqueId = -> Math.random().toString(36).replace("0.", "")



