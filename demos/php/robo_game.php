<?php

class RoboGame {
    // user data
    private $username;
    private $email;
    private $repo;

    // game data
    private $level;
    private $game_id;
    private $game_state;

    function __construct($host, $username, $email, $repo) {
        $this->host = $host;
        $this->username = $username;
        $this->email = $email;
        $this->repo = $repo;
    }

    /**
     * get the current game state
     */
    public function get_game_state() {
        return $this->game_state;
    }

    /**
     * Create a new game for the specified level. If a game already exists
     * for that level it will be overwritten.
     */
    public function start_game($level) {
        $this->level = $level;

        $body = array(
            "username" => $this->username,
            "email" => $this->email,
            "repo" => $this->repo
        );

        $res = $this->post($this->host . "/minefield/levels/" . $level . "/games", $body);
        $this->game_id = $res["gameId"];
        $this->game_state = $res["state"];
    }

    /**
     * Send a move to the game server
     * $direction can be left, right, down or up
     */
    public function move($direction) {
        $body = array(
            "action" => $direction
        );

        $this->game_state = $this->post($this->host . "/minefield/" . $this->game_id . "/moves", $body);
    }


    private function post($url, $body) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $res = curl_exec($ch);
        curl_close($ch);

        return json_decode($res, true);
    }
}

?>