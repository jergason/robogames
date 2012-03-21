


PORT = process.env.PORT || 2663
MONGODB_HOST = process.env.MONGODB_HOST || "localhost"

express = require 'express'
connectLess = require 'connect-less'
mongo = require 'mongodb-wrapper'

# games
games = require './games'
minefield = require './games/minefield'

exports.createServer = ->

    app = express.createServer()
    app.use express.bodyParser()
    app.use connectLess({ src: __dirname + '/public' })
    app.use express.static(__dirname + "/public")
    

    # mongo connection
    db = mongo.db MONGODB_HOST, 27017, "robogames"
    db.collection 'states'


    # BROWSER #############################################################





    # PLAY THE GAME #######################################################

    # Create a game
    # If you retry a level with the same player, it will erase the old game
    # body: Player {username, email, repo}
    # ret: State {gameId, positions, etc}
    app.post "/minefield/levels/:level/games", (req, res) ->
        level = req.param "level"
        player = req.body
        games.play minefield, level, player, (err, state) ->
            if err? then return res.send err, 500
            res.send state



    # makes a move
    # body: Move {action: "right|left|down|up"} 
    # ret: State {gameId, turn :: Int, positions :: [??]} 
    app.post "/minefield/:gameId/moves", (req, res) ->
        gameId = req.param "gameId"
        player = req.body




    # ADMIN / VIEWER ######################################################

    # ret: ["levelId"]
    app.get "/minefield/levels", notImplemented

    # ret: ["gameId"]
    app.get "/minefield/levels/:level/games", notImplemented

    # returns all the states for the game
    # ret: [State]
    app.get "/minefield/:gameId/turns", notImplemented

    # returns the latest state for the game
    # ret: State
    app.get "/minefield/:gameId/turns/latest", notImplemented

    # ret: ["gameId"]
    app.get "/players/:username/games", notImplemented


    app


notImplemented = (req, res) ->
    res.send "Not Implemented", 501


if module == require.main
    app = exports.createServer()
    console.log "Started on " + PORT
    app.listen PORT

