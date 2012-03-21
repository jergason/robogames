### 
Game
###

class Game
    constructor: (gameId, name, level, player, states) ->
        @gameId = gameId
        @name = name
        @level = level
        @player = player
        @states = states # an array of State objects. These are specific to the type of game

    valid: -> true


# converts raw documents into a game object
Game.convert = (doc) -> 
    new Game doc.gameId, doc.name, doc.level, doc.turn, doc.player, doc.states


module.expores = Game