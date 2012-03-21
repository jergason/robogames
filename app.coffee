
PORT = process.env.PORT || 2663

express = require 'express'

exports.createServer = ->

    app = express.createServer()
    app.use express.bodyParser()

    app.get "/", (req, res) -> res.send "HI"

    app


if module == require.main
    app = exports.createServer()
    console.log "Started on " + PORT
    app.listen PORT

