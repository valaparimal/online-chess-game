<?php
    include_once "session_destroy.php";
    session_start();
    // if(isset($_SESSION["gameId"])){
    //     die("Game full!");
    // }

    $game_id = isset($_GET["game_id"]) ? $_GET["game_id"] : null;
    

    if(!$game_id){
        die("Invalid game link!");
    }

    // $dataFile = "./games/{$game_id}.json";
    // if (file_exists($dataFile) && !isset($_SESSION["player2"])) {
    //     $_SESSION["player2"] = "player2";
    //     $_SESSION["playerId"] = "player2";
    //     // unlink($dataFile);
    //     echo "player2";
    // }else if(!isset($_SESSION["player1"])){
    //     file_put_contents("./games/{$game_id}.json",json_encode([
    //                 "player" => "player1"
    //             ]));
    //     $_SESSION["player1"] = 'player1';
    //     $_SESSION["playerId"] = 'player1';
    //     echo "player1";
    // }else{
    //     die("Game full!");
    //     exit();
    // }

    $_SESSION["gameId"] = $game_id;

    // $playerId =$_SESSION["playerId"];
?>



<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chess</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="style.css"/>
</head>
<body>
    <header></header>
    <main>
        <div class="">
            <div>
                <h2 style="display:inline;">Chess</h2>
            </div>
            <!-- <div id="idicator_container">
                
            </div> -->
            <div id="indicator"></div>
            <div id="rotate_me">
                <div id="chess_main_box"></div>
            </div>
            
            <div id="gameOver"></div>

            
        </div>

        <div id="gameId" style="display: none">
            <?php echo "$game_id"; ?>
        </div>
        <div id="playerId" style="display: none">
            <!-- <?php echo "$playerId"; ?> -->
        </div>
    </main>
    <footer>
    </footer>
</body>
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js"></script>
<script type="module" src="chess.js"></script>
</html>