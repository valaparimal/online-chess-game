<?php
session_start();
    if(isset($_SESSION["gameId"])){
        if($_SERVER["REQUEST_METHOD"] == "POST"){
            $game_id = isset($_POST["game_id"]) ? $_POST["game_id"] : null;
            $player = isset($_POST["player"]) ? $_POST["player"] : null;
            $isGameOver = isset($_POST["isGameOver"]) ? $_POST["isGameOver"] : null;
            $result = isset($_POST["result"]) ? $_POST["result"] : null;
            $chessBoxHTML = isset($_POST["chessBoxHTML"]) ? $_POST["chessBoxHTML"] : null;
    
    
            if($game_id && $player && $isGameOver && $chessBoxHTML){
                file_put_contents("./games/{$game_id}.json",json_encode([
                    "player" => $player,
                    "isGameOver" => $isGameOver,
                    "chessBoxHTML" => $chessBoxHTML,
                    "result" => $result
                ]));
                // $_SESSION[$game_id] = [
                //     "player" => $player,
                //     "isGameOver" => $isGameOver,
                //     "chessBoxHTML" => $chessBoxHTML,
                //     "result" => $result
                // ];
                echo json_encode(["message" => "Board Updated Successfully!"]);
            } else {
                echo json_encode(["error" => "Missing Data!"]);
            }
        }
    
        if($_SERVER["REQUEST_METHOD"] == "GET"){
            $game_id = isset($_GET["game_id"]) ? $_GET["game_id"] : null;
            $dataFile = "./games/{$game_id}.json";
            if ($game_id && file_exists($dataFile)) {
                echo file_get_contents($dataFile); // Return JSON data
            }else {
                echo json_encode(["board" => "<div> Waiting for opponent...</div>"]);
            }
        }
    }else{
        echo json_encode(["error_wrong" => "Somthing want to wrong!"]);
    }
?>