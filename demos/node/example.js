#!/usr/bin/env node

// request is a simple library for doing http stuff
// docs here! https://github.com/mikeal/request
var request = require('request')

if (process.argv.length !== 3) {
    console.log("syntax is username level")
}

var host = "dev.i.tv:3000"
var userName = process.argv[1]
var level = process.argv[2]
var startBody = "username=" + userName
var reqObj = {url: host + "/minefield/levels/" + level, body: startBody}

request.post(reqObj,function(err, res, body) {
    if (err) return console.log("died!", err)

    var gameId = JSON.parse(body).gameId
    var moveBody = "action=left"
    var moveObj = {url: host + "/minefield/" + gameId + "/moves", body: moveBody}

    request.post(moveObj, function(err, res, body) {
        if (err) return console.log("oops!", err)

        console.log("you made your first move!", body)
    })

})
