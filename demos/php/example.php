<?php

$username = "myname";
$level = 1;

$host = "http://dev.i.tv:300";
$newGameUrl = $host . "/minefield/level" . $level;

$postBody = "username=" . $username;

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $newGameUrl);
curl_setopt($ch,CURLOPT_POST,1);
curl_setopt($ch,CURLOPT_POSTFIELDS,$postBody);

//execute post
$result = json_decode(curl_exec($ch));
//close connection
curl_close($ch);

$gameId = $result['gameId'];

$newState = makeMove($host, $gameId, "up");

var_dump($newState);


function makeMove($host, $gameId, $move) {
    $moveBody = "action=" . $move;
    $moveUrl = $host . "/minefield/" . $gameId . "/moves";

    $mch = curl_init();

    curl_setopt($mch, CURLOPT_URL, $moveUrl);
    curl_setopt($mch, CURLOPT_POST, 1);
    curl_setopt($mch, CURLOPT_POSTFIELDS, $moveBody);

    $mRes = json_decode(curl_exec($mch));
    curl_close($mch);
    return $mRes;
}

?>
