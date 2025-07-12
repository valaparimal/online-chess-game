<?php
    session_start();

    // $gameId = isset($_SESSION["gameId"]) ? $_SESSION["gameId"] : null;
    
    // if ($gameId) {
    //     // Firebase URL (replace with your actual project ID)
    //     $firebaseUrl = "https://play-chess-44af7.firebaseio.com/games/{$gameId}.json";

    //     // DELETE request using cURL
    //     $ch = curl_init();
    //     curl_setopt($ch, CURLOPT_URL, $firebaseUrl);
    //     curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
    //     curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
    //     $response = curl_exec($ch);
    //     curl_close($ch);

    //     // Optional: handle response or log errors
    //     // echo $response;
    // }
    
    
    
    // $file = "./games/{$gameId}.json";
    // if(file_exists($file)){
    //     unlink($file);
    // }

    session_destroy();
    // echo "Session Destroy...";
    // echo "<script>window.history.back();</script>";
    // exit();
?>