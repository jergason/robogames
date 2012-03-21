


PORT = process.env.PORT || 2663

express = require 'express'
connectLess = require 'connect-less'

exports.createServer = ->

    app = express.createServer()
    app.use express.bodyParser()
    app.use connectLess({ src: __dirname + '/public' })
    app.use express.static(__dirname + "/public")
    

    app


if module == require.main
    app = exports.createServer()
    console.log "Started on " + PORT
    app.listen PORT

