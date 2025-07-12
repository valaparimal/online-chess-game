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
        <!-- <div class="container">
            <div>
                <h2>Chess</h2>
            </div>
            <div id="chess_main_box">
                
            </div>
            
            <div class="container" id="gameOverContainer">
                <div id="gameOver"></div>
            </div>

            
        </div> -->
        <div class="">
            <div>
                <h2 style="display:inline;">Chess</h2>
            </div>

            <div id="rotate_me">
                <div id="chess_main_box"></div>
            </div>
            
            <div id="gameOver"></div>

            
        </div>

        <div id="gameId" style="display: none">
            <?php echo "$game_id"; ?>
        </div>
        <div id="playerId" style="display: none">
            <?php echo "$playerId"; ?>
        </div>
    </main>
    <footer>
    </footer>
</body>
<script src="offline_chess.js"></script>
</html>