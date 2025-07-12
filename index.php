<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Play Chess</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="index.css"/>
</head>
<body>
    <div class="container"><h1 class="green-black-color">Play Chess</h1></div>
    <button id="offline_play_btn" class="btn" onclick="play()">Play</button>
    <button id="create_btn" class="btn" onclick="createGame()">Get Game Link</button>
    <div class="link_container"></div>
    <div class="help green-black-color" onClick="help()">help</div>
</body>
<script>
    function createGame(){
        // window.location.href="session_destroy.php";
        let linkContainer = document.querySelector(".link_container");
        linkContainer.style.display = "none";
        fetch("create_game.php")
            .then(response => response.text())
            .then(link => {
                linkContainer.style.display = "block";
                linkContainer.innerHTML=`<a href="${link}" target="_blank">${link}</a>`;
                console.log(linkContainer.innerHTML);
            });
    }

    function play(){
        window.open("offline_chess.php");
    }

    function help(){
        alert("Click on 'Get Game Link' button.\nThen send the generated link to your friend to join.");
    }
window.addEventListener("onload", (event) => {
    navigator.sendBeacon("session_destroy.php");
});


</script>
</html>