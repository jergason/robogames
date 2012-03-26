class RoboGame
  attr_accessor :username, :email, :repo
  attr_reader :level, :game_id, :game_state

  # HTTParty stuff
  include HTTParty
  base_uri HOST 
  format :json

  def initialize(username, email, repo)
    @username = username
    @email = email
    @repo = repo
  end

  ##
  # Create a new game for the specified level. If a game already
  # exists at that level it will be overwritten.
  ##
  def start_game(level)
    @level = level
    res = self.class.post("/minefield/levels/#{@level}/games", :body => {:username => @username, :email => @email, :rep => @repo})
    @game_id = res.parsed_response["gameId"]
    @game_state = res.parsed_response["state"]
  end

  ##
  # Send a move to the game server.
  # action can be left, right, down or up 
  ##
  def move(action)
    @game_state = self.class.post("/minefield/#{@game_id}/moves", :body => {:action => action}).parsed_response
  end
end