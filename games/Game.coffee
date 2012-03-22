### 
Game
###

class Game
    constructor: (gameId, name, level, player, states, state) ->
        @gameId = gameId
        @name = name
        @level = level
        @player = player
        @states = states # an array of State objects. These are specific to the type of game
        @state = state || states[states.length - 1] # the last (current) state

    valid: -> true


# converts raw documents into a game object
Game.convert = (doc) -> 
    if not doc? then return null
    new Game doc.gameId, doc.name, doc.level, doc.player, doc.states, doc.state

class Player
    constructor: (username, email, link) ->
        @username = username.replace(/[^\w]/g, "") # unique username, only word characters
        @email = email      # your email
        @link = link        # a link to your code repo


Game.Player = Player
module.exports = Game