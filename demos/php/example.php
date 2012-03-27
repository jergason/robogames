<?php

require_once("robo_game.php");

$host = "http://dev.i.tv:2663";

$robo_game = new RoboGame($host, "my_user_name", "my_email@email_address", "git_repo_with_the_code");

$robo_game->start_game("one");
print_r($robo_game->get_game_state());

$robo_game->move("down");
print_r($robo_game->get_game_state());

?>
