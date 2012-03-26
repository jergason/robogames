Robogames
=========


Robogames is a deceptively simple pathfinding excercise, all done over HTTP.

The goal of the game is to move your robot through the minefield while avoiding the mines on your path

It is currently running at dev.i.tv:2663

API
========

To start a new game
---------

POST to /minefield/levels/:level/games

where :level is one,two,...

and post body is:

{ username: "username, //required
  email: "youremail@email.com" // optional
  link: "github.com/name/yourcode" //optional
}
encoded as JSON or form-encoded

it returns a JSON object:

{ gameId: 'exampleId', // a random Id
  state: StateObj // (see state below)
}

#NOTE: Only one game per level per player at a time, i.e, creating a new game on level 1 will delete 
your previous attempt

To move
--------
POST to /minefield/:gameId/moves

where :gameId is the id received from the start post

and post body is (JSON or form encoded):

{ action: "direction" //valid directions are "up" "down" "left" "right"
}

or a 500 error if the move is invalid or the game is now over

it returns the new state of the game (see game state below)

Game State
----------

For each gameId, the server keeps track of the current game state and all prior states

On starting a game and on each subsequent move, the new game state is returned which is as below:

{ mode: 'play', // valid modes are "play", "dead", and "won"
  size: { w: 2, h: 2 }, // the size of the board
  player: { x: 0, y: 0 }, // the players current positon
  target: { x: 0, y: 1 }, // the goal you want to get to
  mines: [{x: 1, y:0  id: 0}] // an array of mines and their positions
}


Web Frontend
--------------
You can chart the progress of your robot by visiting the server root.

It displays the list of games on the right and clicking on it will play the game
up to its current position

