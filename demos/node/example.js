#!/usr/bin/env node

// request is a simple library for doing http stuff
// docs here: https://github.com/mikeal/request
var request = require('request')

if (process.argv.length !== 4) {
    console.log(process.argv.length)
    console.log("syntax is: node example.js username level (see README for list of levels)")
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
        if (err || res.statusCode !== 200) return console.log("something went wrong making the move", err, body)

        // result of move is just the game state
        cb(body)
    })
}

// kick off the game by registering a new game
// email and link are optional
var startBody = {username:  userName, email: "youremail@email.com", link: "github.com/user/repo"}
var reqObj = {url: host + "/minefield/levels/" + level + "/games", json: startBody}

// request takes a hash with parameters for posting, json sets all the headers like we need em
request.post(reqObj,function(err, res, body) {
    if (err || res.statusCode !== 200) return console.log("something went wrong with creating the game", err, body)

    // state contains the initial state
    var gameState = body.state
    var gameId = body.gameId

    // hint, to be the first level, you jsut have to move down!
    makeMove(gameId, "down", function(gameState) {
        console.log('you have made your first move!, new state is: ', gameState)
        return
    })
})
