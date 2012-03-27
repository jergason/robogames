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

where :level is a level (see below for a list of levels)

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


####NOTE: Only one game per level per player at a time, i.e, creating a new game on level 1 will delete your previous attempt

To move
--------
POST to /minefield/:gameId/moves

where :gameId is the id received from the start post

and post body is (JSON or form encoded):

    { action: "direction" } //valid directions are "up" "down" "left" "right"

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

It displays the list of top games on the right and clicking on it will play the game
up to its current position.

To view a specific game, hit: /#/game/:gameId where :gameId is the id of the game you want to see

The are also http routes to see the game in text form:

GET /games/:gameId/state.txt returns a text document with the game position, such as:
<pre>
	_____________________
	| | | |x| | | | | | |
	| | | |o| | | |x| | |
	| | | | | | | |x| | |
	| |x| | | | |x|x| | |
	| | | | | | | | | | |
	| | | |x| | | | | | |
	| | |x| | | | |x| | |
	| | | | | | | | | | |
	| | | | | | | | | | |
	| | | | | | | | | |*|

x - indicates a mine
o - your position
* - the target
d - your dead robot

</pre>
GET /games/:gameId/state/:n.txt returns the nth state of the game


Levels
-----------------
There are 10 levels, some are easy, some are really hard, each level has it own rules and challenges

tiny - all the demos solve this for you, move once to win (hint, go down)
empty - a large map with no mines
easy - a few stationary mines always in the same place
muchosMines - lots of mines with deadly traps
randomMines - a random assortment of mines to avoid
movingTarget - Your goal keeps shifting, can you hit it?
blackAnts - the mines grow legs and move each time you do (they can't move onto your square)
heatSeeking - a single mine heads straight for you, watch out!
puppyGuard - a few mines patrol the way to your goal, can you get past?
armyAnts - the ultimate challenge, tons of mines move randomly without regard to your position

