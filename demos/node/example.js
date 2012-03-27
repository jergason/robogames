#!/usr/bin/env node

// request is a simple library for doing http stuff
// docs here: https://github.com/mikeal/request
var request = require('request')

if (process.argv.length !== 4) {
    console.log(process.argv.length)
    console.log("syntax is username level")
    process.exit(1)
}

var host = "http://dev.i.tv:2663"
var userName = process.argv[2]
var level = process.argv[3]

// this function makes a move given a gameId and returns the new game state
function makeMove(gameId, action, cb) {
    var moveBody = { action: action }
    var moveObj = {url: host + "/minefield/" + gameId + "/moves", json: moveBody}

    request.post(moveObj, function(err, res, body) {
        console.log(body)
        if (err || res.statusCode !== 200) return console.log("oops!", err)

        cb(body)
    })
}

// kick off the game by registering a new game
var startBody = {username:  userName, email: "youremail@email.com"}
var reqObj = {url: host + "/minefield/levels/" + level + "/games", json: startBody}
request.post(reqObj,function(err, res, body) {
    console.log(body)
    if (err || res.statusCode !== 200) return console.log("died!", err)

    var jsonRes = body
    var gameState = jsonRes.mode
    var gameId = jsonRes.gameId

    var positon = jsonRes.position

    makeMove(gameId, "down", function(gameState) {
        console.log('you have made your first move!', gameState)
        return
    })
})
