PORT = process.env.PORT || 2663
MONGODB_HOST = process.env.MONGODB_HOST || "localhost"

express = require 'express'
connectLess = require 'connect-less'
mongo = require 'mongodb-wrapper'

# games
Games = require('./games').Model
debug = require './games/debug'
minefield = require './games/minefield'

exports.createServer = ->
    app = express.createServer()
    app.use express.bodyParser()
    app.use connectLess({ src: __dirname + '/public' })
    app.use express.static(__dirname + "/public")
    

    # mongo connection
    db = mongo.db MONGODB_HOST, 27017, "robogames"
    db.collection 'games'

    # games
    games = new Games(db.games)

    # BROWSER #############################################################
    # PLAY THE GAME #######################################################


    # Minefield
    # State {mode: "play|dead|won", size: {w, h}, player: {x, y}, target: {x, y}, mines: [{x, y, id}]}

    # Create a game
    # If you retry a level with the same player, it will erase the old game
    # body: Player {username, email, link}
    # ret: {gameId, state: State} (see above)
    app.post "/minefield/levels/:level/games", (req, res) ->
        level = req.param "level"
        player = req.body
        if not player.username then return res.send "Need a username!", 500
        games.play minefield, level, player, (err, game) ->
            if err? then return res.send err.message, 500
            res.send game
    # makes a move, and returns the new game state
    # body: Move {action: "right|left|down|up"} 
    # ret: State (see above)
    app.post "/minefield/:gameId/moves", (req, res) ->
        gameId = req.params.gameId
        move = req.body
        games.move minefield, gameId, move, (err, state) ->
            if err? then return res.send err.message, 500
            res.send state



    # ADMIN / VIEWER ######################################################


    app.use "*.txt", (req, res, next) ->
        res.contentType ".txt"
        next()

    # ret: ["levelId"]
    app.get "/minefield/levels", (req, res) ->
        res.send minefield.levels()

    # ret: [{gameId, username, won:true|false}]
    app.get "/minefield/levels/:level/games", (req, res) ->
        games.byLevel minefield, req.param('level'), (err, games) ->
            if err? then return res.send err, 500
            res.send games

    # returns a game, with latest state and all states
    # ret: Game {gameId, level, name, player: Player, state: State, states: [State]}
    app.get "/games/:gameId", (req, res) ->
        games.fetch req.param('gameId'), (err, game) ->
            if err? then return res.send err, 500
            if !game then return res.send 404
            res.send game

    # returns only the latest state for a game
    # ret: State
    app.get "/games/:gameId/state", (req, res) ->
        games.fetch req.param('gameId'), (err, game) ->
            if err? then return res.send err, 500
            if !game then return res.send 404
            res.send game.state

    # returns text visualization of state for a game
    app.get "/games/:gameId/state.txt", (req, res) ->
        games.fetch req.param('gameId'), (err, game) ->
            if err? then return res.send err, 500
            if !game then return res.send 404
            res.send textualize game.state

    # must go before the n route
    app.get "/games/:gameId/state/:n.txt", (req, res) ->
        gameId = req.param('gameId')
        n = parseInt(req.param('n'), 10)
        games.fetchStateAtTurn gameId, n, (err, state) ->
            if err? then return res.send err, 500
            if !state then return res.send 404
            res.send textualize state

    app.get "/games/:gameId/state/:n", (req, res) ->
        gameId = req.param('gameId')
        n = parseInt(req.param('n'), 10)
        games.fetchStateAtTurn gameId, n, (err, state) ->
            if err? then return res.send err, 500
            if !state then return res.send 404
            res.send state

    # the top players, but # of levels completed, just brute force it
    # [{username, wins: N, games:[{gameId, level}]}]
    app.get "/players/leaderboard", (req, res) ->
        games.leaderboard (err, leaders) ->
            if err? then return res.send err, 500
            res.send leaders

    app.get "/players/entries.txt", (req, res) ->
        games.entrants true, (err, users) ->
            if err? then return res.send err, 500
            if not users then return res.send "No users", 404
            res.send users.join("\n") + "\n"

    # ret: [{gameId, level, won:true|false}]
    app.get "/players/:username/games", (req, res) ->
        games.byPlayer req.param('username'), (err, games) ->
            if err? then return res.send err, 500
            res.send games

    # ret: ["gameId"]
    app.get "/minefield/games", (req, res) ->
        games.getGames (err, docs) ->
            if err? then return res.send err.message, 500
            if not docs then return res.send "No games found", 404
            res.send docs

    # returns a game, with latest state and all states
    app.get "/minefield/games/:gameId", (req, res) ->
        gameId = req.params.gameId
        games.getGameById gameId, (err, doc) ->
            if err? then return res.send err.message, 500
            if not doc then return res.send "Game not found", 404
            res.send doc

    app


textualize = (s) -> debug.dump(debug.toRows(s))

notImplemented = (req, res) ->
    res.send "Not Implemented", 501


if module == require.main
    app = exports.createServer()
    console.log "Started on " + PORT
    app.listen PORT

