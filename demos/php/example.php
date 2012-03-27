<?php

$username = "myname";
$level = "one";

$host = "http://dev.i.tv:2663";
$newGameUrl = $host . "/minefield/level/" . $level . "/games";

$postBody = array(
    "username" => urlencode($username),
    "email" => urlencode("youremail@email.com"),
    "link" => urlencode("a webpage about you"));

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $newGameUrl);
//curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, formEncode($postBody));

//execute post
$result = json_decode(curl_exec($ch));
//close connection
curl_close($ch);

print_r($result);

$gameId = $result['gameId'];

$newState = makeMove($host, $gameId, "up");

var_dump($newState);


function makeMove($host, $gameId, $move) {
    $moveBody = "action=" . $move;
    $moveUrl = $host . "/minefield/" . $gameId . "/moves";

    $mch = curl_init();

    curl_setopt($mch, CURLOPT_URL, $moveUrl);
    curl_setopt($mch, CURLOPT_POST, true);
    curl_setopt($mch, CURLOPT_POSTFIELDS, $moveBody);

    $mRes = json_decode(curl_exec($mch));
    curl_close($mch);
    return $mRes;
}

function formEncode($arr) {
    $fields_string = "";
    foreach($arr as $key=>$value) { 
        $fields_string .= $key.'='.$value.'&'; 
    }
    var_dump($fields_string);
    return rtrim($fields_string,'&');
}
?>
