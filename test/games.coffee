
mongo = require 'mongodb-wrapper'
assert = require 'assert'

describe 'games', ->

    db = mongo.db 'localhost', 27017, 'test'
    db.collection 'games'

    Model = require('../games').Model
    games = new Model(db.games)

    it 'should let me connect', ->
        assert.ok true
    

