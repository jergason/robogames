#!/usr/bin/env node

// request is a simple library for doing http stuff
// docs here: https://github.com/mikeal/request
var request = require('request')

if (process.argv.length !== 4) {
    console.log(process.argv.length)
    console.log("syntax is username level")
    process.exit(1)
}

var host = "http://dev.i.tv:3000"
var userName = process.argv[1]
var level = process.argv[2]

// this function makes a move given a gameId and returns the new game state
function makeMove(gameId, action, cb) {
    var moveBody = "action=" + action
    var moveObj = {url: host + "/minefield/" + gameId + "/moves", body: moveBody}

    request.post(moveObj, function(err, res, body) {
        if (err || res.statusCode !== 200) return console.log("oops!", err)

        cb(JSON.parse(body))
    })
}

// kick off the game by registering a new game
var startBody = "username=" + userName
var reqObj = {url: host + "/minefield/levels/" + level, body: startBody}
request.post(reqObj,function(err, res, body) {
    if (err || res.statusCode !== 200) return console.log("died!", err)

    var jsonRes = JSON.parse(body)
    var gameState = jsonRes.mode
    var gameId = jsonRes.gameId

    var positon = jsonRes.position

    makeMove(gameId, "up", function(gameState) {
        console.log('you have made your first move!', gameState)
        return
    })
})
