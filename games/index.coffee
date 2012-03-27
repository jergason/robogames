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
        @fetch = exports.fetch.partial collection
        @fetchStateAtTurn = exports.fetchStateAtTurn.partial collection
        @leaderboard = exports.leaderboard.partial collection
        @byPlayer = exports.byPlayer.partial collection
        @byLevel = exports.byLevel.partial collection
        @getGames = exports.getGames.partial collection
        @getGameById = exports.getGameById.partial collection


exports.Model = Model


# just dumps out the game from the db
exports.fetch = (games, gameId, cb) -> games.findOne({gameId:gameId}, cb)


exports.leaderboard = (games, cb) ->
    games.find({"state.mode":"won"}, {_id: 0, level: 1, "player.username": 1, "state.mode", "gameId": 1}).toArray (err, docs) ->
        if err? then return cb err

        games = docs

        byUsername = {}

        for g in games
            un = g.player.username
            byUsername[un] ?= {username: g.player.username, games: [], wins: 0}
            byUsername[un].games.push {level: g.level, gameId: g.gameId}
            byUsername[un].wins++

        usernameGamesArray = []
        for un, obj of byUsername
            usernameGamesArray.push obj

        usernameGamesArray.sort (a, b) -> 
            return a.games.length - b.games.length

        cb null, usernameGamesArray


exports.byPlayer = (games, username, cb) ->
    games.find({"player.username":username}, {_id: 0, level: 1, gameId: 1, "state.mode": 1}).toArray (err, docs) ->
        if err? then return cb err
        cb null, docs.map (d) -> {gameId: d.gameId, level: d.level, won: (d.state.mode == "won")}

exports.byLevel = (games, game, levelName, cb) ->
    games.find({name: game.name, level: levelName}, {_id: 0, gameId: 1, "player.username": 1, "state.mode": 1}).toArray (err, games) ->
        if err? then return cb err
        games = games.map (g) ->
            {gameId: g.gameId, username: g.player.username, won: (g.state.mode == "won")}
        cb null, games

# start the game
# needs: gameId and starting state
exports.play = (games, game, levelName, player, cb) ->
    gameId = uniqueId()
    level = game[levelName]
    if not level then return cb(new Error("Invalid Level"))
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
            return cb( new Error "Invalid Move")

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

exports.fetchStateAtTurn = (games, gameId, n, cb) ->
    games.findOne {gameId: gameId}, {_id: 0, states: 1}, (err, doc) ->
        if err? || !(doc?) then return cb err
        cb null, doc.states[n]


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


exports.getGames = (games, cb) ->
    games.find({}).toArray (err, docs) ->
        if err? then return cb err
        if not docs then return cb(new Error("no games find"))

        gameObjs = []
        for doc in docs
            gameObjs.push Game.convert doc

        cb null, gameObjs

exports.getGameById = (games, gameId, cb) ->
    games.findOne {gameId: gameId}, (err, doc) ->
        if err? then return cb err
        cb null, doc

uniqueId = -> Math.random().toString(36).replace("0.", "")



