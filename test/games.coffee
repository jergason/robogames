
mongo = require 'mongodb-wrapper'
assert = require 'assert'

Model = require('../games').Model
minefield = require '../games/minefield'
Game = require '../games/Game'
Player = Game.Player

describe 'games', ->

    db = mongo.db 'localhost', 27017, 'test'
    db.collection 'games'

    games = new Model(db.games)

    player = new Player "test", "nothing@nothing.com", "http://google.com" 

    describe "setup", ->
        it 'should set up the collection', (done) ->
            db.games.remove {}, (err) ->
                assert.ifError err
                games.index done

    describe "Game", ->
        it 'should convert correctly', ->
            game = new Game("id", "name", "level", player, []) 
            assert.ok game.gameId
            assert.ok game.name
            assert.ok game.level
            assert.ok game.player
            assert.ok game.states

            game2 = Game.convert game
            assert.equal game.name, game2.name
            assert.ok game2.player, "didn't copy player"
            assert.equal game2.player.username, game.player.username


    describe 'minefield', ->

        gameId = null

        it 'should let me connect', (done) ->
            games.play minefield, "one", player, (err, game) ->  
                assert.ifError err
                assert.ok game
                assert.ok game.gameId
                assert.ok game.player
                assert.equal game.player.username, "test"
                assert.equal game.player.username, player.username
                assert.ok game.states
                assert.ok game.states[0], "missing initial state"
                gameId = game.gameId
                done()

        it 'should move right', (done) ->
            games.move minefield, gameId, {action: "right"}, (err, state) ->
                assert.ifError err
                assert.ok state
                assert.ok state.player
                assert.equal state.player.x, 1
                done()

        it 'should move down (and remember state)', (done) ->
            games.move minefield, gameId, {action: "down"}, (err, state) ->
                assert.ifError err
                assert.ok state
                assert.ok state.player
                assert.equal state.player.x, 1
                assert.equal state.player.y, 1
                done()

        it 'should fail if I move off screen', (done) ->
            games.move minefield, gameId, {action: "down"}, (err, state) ->
                assert.ok err, 'should have given me an error that I cant move down'
                done()

        it 'should win if I move onto the target', (done) ->
            # we're at 1, 1 from before
            games.move minefield, gameId, {action: "left"}, (err, state) ->
                assert.ifError err
                assert.equal state.mode, minefield.modes.won
                done()


        game3Id = null

        it 'should work with level 3', (done) ->
            games.play minefield, "three", player, (err, game) ->
                game3Id = game.gameId
                done()

        it 'should die if I move onto a mine', (done) ->
            games.move minefield, game3Id, {action: "down"}, (err, state) ->
                assert.ifError err
                assert.ok state
                assert.equal state.mode, minefield.modes.dead
                done()






    

