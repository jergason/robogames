### 
Games

The front-end for the different games. Handles storage and retreival of game state

###

fjs = require('fjs').attachPrototype()
Game = require './Game'

class Model
    constructor: (collection) ->
        @play = exports.play.partial collection


exports.Model = Model

# start the game
# needs: gameId and starting state
exports.play = (games, game, levelName, player, cb) ->
    gameId = uniqueId()
    level = game[levelName]
    state = level.start()

    # store the game and return it to the player
    exports.storeGame games, new Game(gameId, game.name, levelName, 0, player, state), cb



# make a move
# needs: new state
exports.move = (turns, game, gameId, move, cb) ->
    exports.lastTurn turns, gameId, (err, turn) ->
        if err? then return cb err
        level = game[turn.level]
        state = level.move turn.state, move

        exports.addState games, gameId, state, cb  




# gets the last game state (not opinionated about the format!)
exports.lastState = (games, gameId, cb) ->
    games.find({gameId: gameId}, {_id: 0, states:{$slice:-1}}).one (err, doc) ->
        if err? then return cb err
        cb null, Game.convert(doc)

exports.addState = (games, gameId, state, cb) ->
    games.update {gameId: gameId}, {$push: {states: state}}, (err) ->
        if err? then return cb err
        cb null, state

# store an existing game state
# gameId, turn, state, player (player info?)
exports.storeGame = (games, game, cb) ->

    if not game.valid() then return cb(new Error("Invalid Game"))

    games.save game, (err, doc) ->
        if err? then return cb err
        cb null, Game.convert(doc)

# build indexes
exports.index = (games, cb) ->
    states.ensureIndex({gameId: 1}, cb)



uniqueId = -> Math.random().toString(36).replace("0.", "")



