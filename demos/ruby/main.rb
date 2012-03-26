HOST = 'http://dev.i.tv:2663' # Set this to the address of the game server

require "rubygems"
require "bundler/setup"
require "./robo_game"


game = RoboGame.new("username", "my_email_address@i.tv", "github_repo_with_teh_codez")
game.start_game :one # one, two, three, etc...
game.move :down # can be right, left, down or up
puts game.game_state.inspect