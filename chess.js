// Firebase Realtime Database

// Import the functions you need from the SDKs you need
//   import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
//   import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDyd8TOSSR5hf34JoNufNr12ThMMVgLOQc",
    authDomain: "play-chess-44af7.firebaseapp.com",
    databaseURL: "https://play-chess-44af7-default-rtdb.firebaseio.com",
    projectId: "play-chess-44af7",
    storageBucket: "play-chess-44af7.firebasestorage.app",
    messagingSenderId: "358778150961",
    appId: "1:358778150961:web:752b3f783741dcb98ab510",
    measurementId: "G-239WSGBY7B"
};

// Initialize Firebase
//   const app = initializeApp(firebaseConfig);
//   const analytics = getAnalytics(app);
firebase.initializeApp(firebaseConfig);
const db = firebase.database();



// ------------------------------------------------------------------------------------------------------------------------

const gameId = document.querySelector("#gameId").innerText.trim();
const gameRef = db.ref("games/" + gameId);

let playerId;
let playerRef;
let opponentRef;

// Remove playerId on refresh so player treated as left
sessionStorage.removeItem("playerId");

db.ref(`games/${gameId}/players`).once("value").then((snap) => {
    const players = snap.val() || {};
    const p1Online = players.player1?.online === true;
    const p2Online = players.player2?.online === true;

    if (!p1Online) {
        playerId = "player1";
    } else if (!p2Online) {
        playerId = "player2";
    } else {
        alert("Game full! You cannot join.");
        window.location = "/index.php";
        throw new Error("Game full");
    }

    sessionStorage.setItem("playerId", playerId);

    playerRef = db.ref(`games/${gameId}/players/${playerId}`);
    opponentRef = db.ref(`games/${gameId}/players/${playerId === "player1" ? "player2" : "player1"}/online`);

    return playerRef.set({ online: true });
}).then(() => {
    playerRef.onDisconnect().update({ online: false });

    opponentRef.on("value", (snap) => {
        if (snap.val() === false) {
            alert("Opponent left the game.");
            window.location = "./index.php";
        }
    });

    play();
}).catch(console.error);



function play() {
    let indicator = document.querySelector("#indicator");

    let chessBox = document.querySelector("#chess_main_box");
    let previousClick;
    let canArmyMove = new Array();
    let canArmyAttack = new Array();
    let storeIndexOfChackedKing = new Array();
    let isGameContinue = true;
    let result;

    let black = ["♜", "♞", "♝", "♚", "♛", "♙."];
    let white = ["♖", "♘", "♗", "♔", "♕", "♙"];

    setChessBox();

    let boxes = document.querySelectorAll(".chess_inner_box");

    setArmyPosition();


    // rotate chess board
    if (playerId === "player2") {
        document.querySelector("#rotate_me").style.rotate = "180deg";
        enableBox(black); // for rotate individual army
    }

    if (playerId === "player1") {
        console.log(playerId)
        enableBox(white);
    } else {
        dissable();
        retriveUpdatedBox();
    }






    function setChessBox() {
        for (let i = 1; i < 9; i++) {
            for (let j = 1; j < 9; j++) {
                let div = document.createElement("div");

                div.setAttribute("class", "chess_" + (i % 2 == 0 ? (j % 2 == 0 ? "black" : "white") : (j % 2 == 0 ? "white" : "black")) + "_box");
                div.classList.add("chess_inner_box");
                div.style.gridRowStart = i;
                div.style.gridColumnStart = j;

                div.style.pointerEvents = "auto";

                chessBox.appendChild(div);
            }
        }
    }


    function setArmyPosition() {
        boxes[0].innerText = "♜"
        boxes[1].innerText = "♞";
        boxes[2].innerText = "♝";
        boxes[3].innerText = "♚";
        boxes[4].innerText = "♛";
        boxes[5].innerText = "♝";
        boxes[6].innerText = "♞";
        boxes[7].innerText = "♜";
        for (let i = 8; i < 16; i++) {
            boxes[i].innerText = "♙.";
            // ♟
        }

        boxes[56].innerText = "♖";
        boxes[57].innerText = "♘";
        boxes[58].innerText = "♗";
        boxes[59].innerText = "♔";
        boxes[60].innerText = "♕";
        boxes[61].innerText = "♗";
        boxes[62].innerText = "♘";
        boxes[63].innerText = "♖";
        for (let i = 48; i < 56; i++) {
            boxes[i].innerText = "♙";
        }
    }

    function gameSatrt() {
        boxes.forEach((element) => {
            element.addEventListener("click", () => {

                try {
                    previousClick.style.opacity = "0.9";
                } catch (error) { }


                element.style.opacity = "1";

                if (element.innerText == "o" || element.style.backgroundColor == "yellow") {
                    console.log("move");
                    element.innerText = previousClick.innerText;
                    previousClick.innerText = "";

                    circleClean(false);
                    colorClean(false);
                    twoColorClean("yellow", "red");
                    if (element.innerText == white[5]) {
                        // givePowerToPown(0,l,white);
                    }
                    else if (element.innerText == black[5]) {
                        // givePowerToPown(7,l,black);
                    }


                    let z;
                    for (z = 0; z < 6; z++) {
                        // it is white
                        if (element.innerText == white[z]) {
                            checkChecker(white, black);
                            break;
                        }
                    }

                    // it is black
                    if (z == 6) {
                        checkChecker(black, white);
                    }

                    updateTurn();


                } else {
                    circleClean(false);
                    colorClean(false);

                    if (element.innerText == "♙") {
                        whitepown(true, true, element.style.gridRowStart - 1, element.style.gridColumnStart - 1);
                    } else if (element.innerText == "♙.") {
                        blackpown(true, true, element.style.gridRowStart - 1, element.style.gridColumnStart - 1);
                    } else if (element.innerText == "♖") {
                        rook(true, true, element.style.gridRowStart - 1, element.style.gridColumnStart - 1, black);
                    } else if (element.innerText == "♜") {
                        rook(true, true, element.style.gridRowStart - 1, element.style.gridColumnStart - 1, white);
                    } else if (element.innerText == "♘") {
                        horse(true, true, element.style.gridRowStart - 1, element.style.gridColumnStart - 1, black);
                    } else if (element.innerText == "♞") {
                        horse(true, true, element.style.gridRowStart - 1, element.style.gridColumnStart - 1, white);
                    } else if (element.innerText == "♗") {
                        camel(true, true, element.style.gridRowStart - 1, element.style.gridColumnStart - 1, black);
                    } else if (element.innerText == "♝") {
                        camel(true, true, element.style.gridRowStart - 1, element.style.gridColumnStart - 1, white);
                    } else if (element.innerText == "♕") {
                        queen(true, true, element.style.gridRowStart - 1, element.style.gridColumnStart - 1, black);
                    } else if (element.innerText == "♛") {
                        queen(true, true, element.style.gridRowStart - 1, element.style.gridColumnStart - 1, white);
                    } else if (element.innerText == "♔") {
                        king(element.style.gridRowStart - 1, element.style.gridColumnStart - 1, black);
                    } else if (element.innerText == "♚") {
                        king(element.style.gridRowStart - 1, element.style.gridColumnStart - 1, white);
                    }
                }

                previousClick = element;

            });
        });
    }


    function enableBox(army) {
        indicator.style.display = "block";

        boxes.forEach((element) => {
            // console.log((army == white) + " army and white")
            if (army == white) {
                element.style.rotate = "0deg";
            } else {
                element.style.rotate = "180deg";
            }

            let i;
            for (i = 0; i < 6; i++) {
                // console.log(army[i]+", hi "+element.innerText+", "+(army[i] == element.innerText));
                // console.log(army[i]+" "+element.innerText);

                if (army[i] == element.innerText) {
                    element.style.opacity = "0.9";
                    element.style.pointerEvents = "auto";
                    break;
                }
            }

            if (i == 6) {
                element.style.opacity = "0.8";
                element.style.pointerEvents = "none";
            }
        });
        gameSatrt();
    }

    // Army function


    function whitepown(isSaveKing, isCheckPaint, k, l) {
        try {
            if (boxes[(k - 1) * 8 + l].innerText == "") {
                let isMove = true;

                if (isSaveKing) {
                    boxes[(k - 1) * 8 + l].innerText = boxes[k * 8 + l].innerText;
                    boxes[k * 8 + l].innerText = "";
                    isMove = isThisRightMove(black);
                    boxes[k * 8 + l].innerText = boxes[(k - 1) * 8 + l].innerText;
                    boxes[(k - 1) * 8 + l].innerText = "";
                }

                if (isMove) {
                    if (isSaveKing) {
                        canArmyMove[(k - 1) * 8 + l] = true;
                        isGameContinue = true;
                    }
                }

                if (k == 6) {
                    if (boxes[(k - 2) * 8 + l].innerText == "") {
                        if (isSaveKing) {
                            boxes[(k - 2) * 8 + l].innerText = boxes[k * 8 + l].innerText;
                            boxes[k * 8 + l].innerText = "";
                            isMove = isThisRightMove(black);
                            boxes[k * 8 + l].innerText = boxes[(k - 2) * 8 + l].innerText;
                            boxes[(k - 2) * 8 + l].innerText = "";

                            if (isMove) {
                                canArmyMove[(k - 2) * 8 + l] = true;
                            }
                        }
                    }
                }
            }
        } catch (error) { }

        for (let i = 0; i < 6; i++) {
            try {
                // console.log(boxes[((k-1))*8+l-1].innerText+black[i]+" "+(boxes[((k-1))*8+l-1].innerText == black[i]) );
                if (boxes[(k - 1) * 8 + l - 1].innerText == black[i]) {
                    let isMove = true;
                    if (isSaveKing) {

                        let oppoText = boxes[(k - 1) * 8 + l - 1].innerText;
                        let pown = boxes[k * 8 + l].innerText;
                        boxes[(k - 1) * 8 + l - 1].innerText = boxes[k * 8 + l].innerText;
                        boxes[k * 8 + l].innerText = "";
                        isMove = isThisRightMove(black);
                        boxes[k * 8 + l].innerText = pown;
                        boxes[(k - 1) * 8 + l - 1].innerText = oppoText;
                    }

                    if (isMove) {
                        if (isSaveKing && l - 1 >= 0) {
                            canArmyAttack[(k - 1) * 8 + l - 1] = true;
                            isGameContinue = true;
                        }
                        // oneBox[(k-1) * 8 +l-1].setDisable(false);
                        if (i == 3) {
                            if (isCheckPaint) {
                                storeIndexOfChackedKing[0] = (k - 1) * 8 + l - 1;
                            }
                            return true;
                        }
                    }
                }
            } catch (error) { }


            try {
                // console.log(boxes[((k-1))*8+l-1].innerText+black[i]+" "+(boxes[((k-1))*8+l-1].innerText == black[i]) );
                if (boxes[(k - 1) * 8 + l + 1].innerText == black[i]) {
                    let isMove = true;
                    if (isSaveKing) {
                        let oppoText = boxes[(k - 1) * 8 + l + 1].innerText;
                        let pown = boxes[k * 8 + l].innerText;
                        boxes[(k - 1) * 8 + l + 1].innerText = boxes[k * 8 + l].innerText;
                        boxes[k * 8 + l].innerText = "";
                        isMove = isThisRightMove(black);
                        boxes[k * 8 + l].innerText = pown;
                        boxes[(k - 1) * 8 + l + 1].innerText = oppoText;
                    }

                    if (isMove) {
                        console.log(l + " " + (l + 1 < 8));
                        if (isSaveKing && l + 1 < 8) {
                            canArmyAttack[(k - 1) * 8 + l + 1] = true;
                            isGameContinue = true;
                        }
                        // oneBox[(k-1) * 8 +l-1].setDisable(false);
                        if (i == 3) {
                            console.log("check");
                            if (isCheckPaint) {
                                storeIndexOfChackedKing[0] = (k - 1) * 8 + l + 1;
                            }
                            return true;
                        }
                    }
                }
            } catch (error) { }
        }


        if (isSaveKing) {
            circleClean(true);
            colorClean(true);
        }
        else {
            // colorClean(false);
        }
        return false;
    }


    function blackpown(isSaveKing, isCheckPaint, k, l) {
        try {
            if (boxes[(k + 1) * 8 + l].innerText == "") {
                let isMove = true;

                if (isSaveKing) {
                    boxes[(k + 1) * 8 + l].innerText = boxes[k * 8 + l].innerText;
                    boxes[k * 8 + l].innerText = "";
                    isMove = isThisRightMove(white);
                    boxes[k * 8 + l].innerText = boxes[(k + 1) * 8 + l].innerText;
                    boxes[(k + 1) * 8 + l].innerText = "";
                }

                if (isMove) {
                    if (isSaveKing) {
                        canArmyMove[(k + 1) * 8 + l] = true;
                        isGameContinue = true;
                    }
                }

                if (k == 1) {
                    if (boxes[(k + 2) * 8 + l].innerText == "") {
                        if (isSaveKing) {
                            boxes[(k + 2) * 8 + l].innerText = boxes[k * 8 + l].innerText;
                            boxes[k * 8 + l].innerText = "";
                            isMove = isThisRightMove(white);
                            boxes[k * 8 + l].innerText = boxes[(k + 2) * 8 + l].innerText;
                            boxes[(k + 2) * 8 + l].innerText = "";

                            if (isMove) {
                                canArmyMove[(k + 2) * 8 + l] = true;
                            }
                        }
                    }
                }
            }
        } catch (error) { }

        for (let i = 0; i < 6; i++) {
            try {
                if (boxes[(k + 1) * 8 + l - 1].innerText == white[i]) {
                    let isMove = true;
                    if (isSaveKing) {

                        let oppoText = boxes[(k + 1) * 8 + l - 1].innerText;
                        let pown = boxes[k * 8 + l].innerText;
                        boxes[(k + 1) * 8 + l - 1].innerText = boxes[k * 8 + l].innerText;
                        boxes[k * 8 + l].innerText = "";
                        isMove = isThisRightMove(white);
                        boxes[k * 8 + l].innerText = pown;
                        boxes[(k + 1) * 8 + l - 1].innerText = oppoText;
                    }

                    if (isMove) {
                        if (isSaveKing && l - 1 >= 0) {
                            canArmyAttack[(k + 1) * 8 + l - 1] = true;
                            isGameContinue = true;
                        }
                        // oneBox[(k-1) * 8 +l-1].setDisable(false);
                        if (i == 3) {
                            if (isCheckPaint) {
                                console.log("i =3 : " + (k + 1) * 8 + l - 1);
                                storeIndexOfChackedKing[0] = (k + 1) * 8 + l - 1;
                            }
                            return true;
                        }
                    }
                }
            } catch (error) { }


            try {
                // console.log(boxes[((k-1))*8+l-1].innerText+black[i]+" "+(boxes[((k-1))*8+l-1].innerText == black[i]) );
                if (boxes[(k + 1) * 8 + l + 1].innerText == white[i]) {
                    let isMove = true;
                    if (isSaveKing) {

                        let oppoText = boxes[(k + 1) * 8 + l + 1].innerText;
                        let pown = boxes[k * 8 + l].innerText;
                        boxes[(k + 1) * 8 + l + 1].innerText = boxes[k * 8 + l].innerText;
                        boxes[k * 8 + l].innerText = "";
                        isMove = isThisRightMove(white);
                        boxes[k * 8 + l].innerText = pown;
                        boxes[(k + 1) * 8 + l + 1].innerText = oppoText;
                    }

                    if (isMove) {
                        console.log(l + " " + (l + 1 < 8));
                        if (isSaveKing && l + 1 < 8) {
                            canArmyAttack[(k + 1) * 8 + l + 1] = true;
                            isGameContinue = true;
                        }
                        // oneBox[(k-1) * 8 +l-1].setDisable(false);
                        if (i == 3) {
                            if (isCheckPaint) {
                                storeIndexOfChackedKing[0] = (k + 1) * 8 + l + 1;
                            }
                            return true;
                        }
                    }
                }
            } catch (error) { }
        }


        if (isSaveKing) {
            circleClean(true);
            colorClean(true);
        }
        else {
            // colorClean(false);
        }
        return false;
    }

    function rook(isSaveKing, isCheckPaint, k, l, oppoArmy) {
        try {
            let down = k;
            let isNeed = true;
            if (down != 7) {
                while (boxes[(++down) * 8 + l].innerText == "") {
                    let isMove = true;
                    if (isSaveKing) {
                        isMove = isChangePlace(k, l, down, l, oppoArmy);
                        if (isMove) {
                            console.log(down * 8 + l);
                            canArmyMove[down * 8 + l] = true;
                        }
                    }
                    if (down == 7) {
                        isNeed = false;
                        break;
                    }
                }
            } else {
                isNeed = false;
            }
            if (isNeed && isCheckORAttack(isSaveKing, isCheckPaint, k, l, down, l, oppoArmy)) // it is return true if it give chack to oppoKing , if it will attack then paint color to yellow
            {
                return true;
            }

        } catch (error) { }

        try {
            let up = k
            let isNeed = true;
            if (up != 0) {
                while (boxes[(--up) * 8 + l].innerText == "") {
                    let isMove = true;
                    if (isSaveKing) {
                        isMove = isChangePlace(k, l, up, l, oppoArmy);
                        if (isMove) {
                            console.log(up * 8 + l);
                            canArmyMove[up * 8 + l] = true;
                        }
                    }

                    if (up == 0) {
                        isNeed = false;
                    }
                }
            } else {
                isNeed = false;
            }

            if (isNeed && isCheckORAttack(isSaveKing, isCheckPaint, k, l, up, l, oppoArmy)) // it is return true if it give chack to oppoKing , if it will attack then paint color to yellow
            {
                return true;
            }
        } catch (error) { ; }

        try {
            let right = l;
            let isNeed = true;

            if (right != 7) {
                while (boxes[k * 8 + (++right)].innerText == "") {
                    let isMove = true;
                    if (isSaveKing) {
                        isMove = isChangePlace(k, l, k, right, oppoArmy);
                        if (isMove) {
                            console.log(k * 8 + right);
                            canArmyMove[k * 8 + right] = true;
                        }
                    }
                    if (right == 7) {
                        isNeed = false;
                        break;
                    }
                }
            } else {
                isNeed = false;
            }

            if (isNeed && isCheckORAttack(isSaveKing, isCheckPaint, k, l, k, right, oppoArmy)) // it is return true if it give chack to oppoKing , if it will attack then paint color to yellow
            {
                return true;
            }
        } catch (error) { }

        try {
            let left = l;
            let isNeed = true;
            if (left != 0) {
                while (boxes[k * 8 + (--left)].innerText == "") {
                    let isMove = true;
                    if (isSaveKing) {
                        isMove = isChangePlace(k, l, k, left, oppoArmy);
                        if (isMove) {
                            console.log(k * 8 + left);
                            canArmyMove[k * 8 + left] = true;
                        }
                    }
                    if (left == 0) {
                        isNeed = false;
                        break;
                    }
                }
            } else {
                isNeed = false;
            }
            if (isNeed && isCheckORAttack(isSaveKing, isCheckPaint, k, l, k, left, oppoArmy)) // it is return true if it give chack to oppoKing , if it will attack then paint color to yellow
            {
                return true;
            }
        } catch (error) { }

        if (isSaveKing) {
            circleClean(true);
            colorClean(true);
        }
        else {
            colorClean(false);
        }
        return false;
    }

    function horse(isSaveKing, isCheckPaint, k, l, oppoArmy) {
        try {
            let down = k + 2;
            let downR = l + 1;
            if (down < 8 && downR < 8) {
                if (boxes[down * 8 + downR].innerText == "") {
                    let isMove = true;
                    if (isSaveKing) {
                        isMove = isChangePlace(k, l, down, downR, oppoArmy);
                        if (isMove) {
                            canArmyMove[down * 8 + downR] = true;
                        }
                    }
                }
                else {
                    if (isCheckORAttack(isSaveKing, isCheckPaint, k, l, down, downR, oppoArmy)) // it is return true if it give chack to oppoKing , if it will attack then paint color to yellow
                    {
                        return true;
                    }
                }
            }
        } catch (error) { }

        try {
            let up = k - 2;
            let upR = l + 1;
            if (up >= 0 && upR < 8) {
                if (boxes[up * 8 + upR].innerText == "") {
                    let isMove = true;
                    if (isSaveKing) {
                        isMove = isChangePlace(k, l, up, upR, oppoArmy);
                        if (isMove) {

                            canArmyMove[up * 8 + upR] = true;
                        }
                    }
                }
                else {
                    if (isCheckORAttack(isSaveKing, isCheckPaint, k, l, up, upR, oppoArmy)) // it is return true if it give chack to oppoKing , if it will attack then paint color to yellow
                    {
                        return true;
                    }
                }
            }

        } catch (error) { }

        try {
            let down = k + 2;
            let downL = l - 1;
            if (down < 8 && downL >= 0) {
                if (boxes[down * 8 + downL].innerText == "") {
                    let isMove = true;
                    if (isSaveKing) {
                        isMove = isChangePlace(k, l, down, downL, oppoArmy);
                        if (isMove) {
                            canArmyMove[down * 8 + downL] = true;
                        }
                    }
                }
                else {
                    if (isCheckORAttack(isSaveKing, isCheckPaint, k, l, down, downL, oppoArmy)) // it is return true if it give chack to oppoKing , if it will attack then paint color to yellow
                    {
                        return true;
                    }
                }
            }
        } catch (error) { }

        try {
            let up = k - 2;
            let upL = l - 1;
            if (up >= 0 && upL >= 0) {
                if (boxes[up * 8 + upL].innerText == "") {
                    let isMove = true;
                    if (isSaveKing) {
                        isMove = isChangePlace(k, l, up, upL, oppoArmy);
                        if (isMove) {
                            canArmyMove[up * 8 + upL] = true;
                        }
                    }
                }
                else {
                    if (isCheckORAttack(isSaveKing, isCheckPaint, k, l, up, upL, oppoArmy)) // it is return true if it give chack to oppoKing , if it will attack then paint color to yellow
                    {
                        return true;
                    }
                }
            }
        } catch (error) { }

        //  

        try {
            let rightU = k - 1;
            let right = l + 2;
            if (rightU >= 0 && right < 8) {
                if (boxes[rightU * 8 + right].innerText == "") {
                    let isMove = true;
                    if (isSaveKing) {
                        isMove = isChangePlace(k, l, rightU, right, oppoArmy);
                        if (isMove) {
                            canArmyMove[rightU * 8 + right] = true;
                        }
                    }
                }
                else {
                    if (isCheckORAttack(isSaveKing, isCheckPaint, k, l, rightU, right, oppoArmy)) // it is return true if it give chack to oppoKing , if it will attack then paint color to yellow
                    {
                        return true;
                    }
                }
            }
        } catch (error) { }

        try {
            let rightD = k + 1;
            let right = l + 2;
            if (rightD < 8 && right < 8) {
                if (boxes[rightD * 8 + right].innerText == "") {
                    let isMove = true;
                    if (isSaveKing) {
                        isMove = isChangePlace(k, l, rightD, right, oppoArmy);
                        if (isMove) {
                            canArmyMove[rightD * 8 + right] = true;
                        }
                    }
                }
                else {
                    if (isCheckORAttack(isSaveKing, isCheckPaint, k, l, rightD, right, oppoArmy)) // it is return true if it give chack to oppoKing , if it will attack then paint color to yellow
                    {
                        return true;
                    }
                }
            }
        } catch (error) { }

        try {
            let leftU = k - 1;
            let left = l - 2;
            if (leftU >= 0 && left >= 0) {
                if (boxes[leftU * 8 + left].innerText == "") {
                    let isMove = true;
                    if (isSaveKing) {
                        isMove = isChangePlace(k, l, leftU, left, oppoArmy);
                        if (isMove) {
                            canArmyMove[leftU * 8 + left] = true;
                        }
                    }
                }
                else {
                    if (isCheckORAttack(isSaveKing, isCheckPaint, k, l, leftU, left, oppoArmy)) // it is return true if it give chack to oppoKing , if it will attack then paint color to yellow
                    {
                        return true;
                    }
                }
            }
        } catch (error) { }

        try {
            let leftD = k + 1;
            let left = l - 2;
            if (left < 8 && left >= 0) {
                if (boxes[leftD * 8 + left].innerText == "") {
                    let isMove = true;
                    if (isSaveKing) {
                        isMove = isChangePlace(k, l, leftD, left, oppoArmy);
                        if (isMove) {
                            canArmyMove[leftD * 8 + left] = true;
                        }
                    }
                }
                else {
                    if (isCheckORAttack(isSaveKing, isCheckPaint, k, l, leftD, left, oppoArmy)) // it is return true if it give chack to oppoKing , if it will attack then paint color to yellow
                    {
                        return true;
                    }
                }
            }
        } catch (error) { }

        if (isSaveKing) {
            circleClean(true);
            colorClean(true);
        }
        else {
            colorClean(false);
        }
        return false;
    }

    function camel(isSaveKing, isCheckPaint, k, l, oppoArmy) {
        try {
            let down = k;
            let downR = l;
            while (boxes[(++down) * 8 + (++downR)].innerText == "" && down < 8 && downR < 8) {
                if (isSaveKing) {
                    let isMove = isChangePlace(k, l, down, downR, oppoArmy);
                    if (isMove) {
                        canArmyMove[down * 8 + downR] = true;
                    }
                }
            }

            if (down != 8 && downR != 8 && isCheckORAttack(isSaveKing, isCheckPaint, k, l, down, downR, oppoArmy)) // it is return true if it give chack to oppoKing , if it will attack then paint color to yellow
            {
                return true;
            }
        } catch (error) { }

        try {
            let up = k;
            let upR = l;
            while (boxes[(--up) * 8 + (++upR)].innerText == "" && up >= 0 && upR < 8) {
                let isMove = true;
                if (isSaveKing) {
                    isMove = isChangePlace(k, l, up, upR, oppoArmy);
                    if (isMove) {
                        canArmyMove[up * 8 + upR] = true;
                    }
                }
            }
            if (up != -1 && upR != 8 && isCheckORAttack(isSaveKing, isCheckPaint, k, l, up, upR, oppoArmy)) // it is return true if it give chack to oppoKing , if it will attack then paint color to yellow
            {
                return true;
            }
        } catch (error) { }

        try {
            let down = k;
            let downL = l;
            while (boxes[(++down) * 8 + (--downL)].innerText == "" && down < 8 && downL >= 0) {
                let isMove = true;
                if (isSaveKing) {
                    isMove = isChangePlace(k, l, down, downL, oppoArmy);
                    if (isMove) {
                        canArmyMove[down * 8 + downL] = true;
                    }
                }
            }
            if (down != 8 && downL != -1 && isCheckORAttack(isSaveKing, isCheckPaint, k, l, down, downL, oppoArmy)) // it is return true if it give chack to oppoKing , if it will attack then paint color to yellow
            {
                return true;
            }
        } catch (error) { }

        try {
            let up = k;
            let upL = l;
            while (boxes[(--up) * 8 + (--upL)].innerText == "" && up >= 0 && upL >= 0) {
                let isMove = true;
                if (isSaveKing) {
                    isMove = isChangePlace(k, l, up, upL, oppoArmy);
                    if (isMove) {
                        canArmyMove[up * 8 + upL] = true;
                    }
                }
            }
            if (up != -1 && upL != -1 && isCheckORAttack(isSaveKing, isCheckPaint, k, l, up, upL, oppoArmy)) // it is return true if it give chack to oppoKing , if it will attack then paint color to yellow
            {
                return true;
            }
        } catch (error) { }

        if (isSaveKing) {
            circleClean(true);
            colorClean(true);
        }
        else {
            colorClean(false);
        }
        return false;
    }

    function queen(isSaveKing, isCheckPaint, k, l, oppoArmy) {
        try {
            let down = k;
            if (down < 7) {
                while (boxes[(++down) * 8 + l].innerText == "" && down < 8) {
                    let isMove = true;
                    if (isSaveKing) {
                        isMove = isChangePlace(k, l, down, l, oppoArmy);
                        if (isMove) {
                            canArmyMove[down * 8 + l] = true;
                        }
                    }
                }
                if (down != 8 && isCheckORAttack(isSaveKing, isCheckPaint, k, l, down, l, oppoArmy)) // it is return true if it give chack to oppoKing , if it will attack then paint color to yellow
                {
                    return true;
                }
            }
        } catch (error) { }
        try {
            let up = k;
            while ((boxes[(--up) * 8 + l].innerText == "") && up >= 0) {
                let isMove = true;
                if (isSaveKing) {
                    isMove = isChangePlace(k, l, up, l, oppoArmy);
                    if (isMove) {
                        canArmyMove[up * 8 + l] = true;
                    }
                }
            }
            if (up != -1 && isCheckORAttack(isSaveKing, isCheckPaint, k, l, up, l, oppoArmy)) // it is return true if it give chack to oppoKing , if it will attack then paint color to yellow
            {
                return true;
            }

        } catch (error) { }

        try {
            let right = l;
            while (boxes[k * 8 + (++right)].innerText == "" && right < 8) {
                let isMove = true;
                if (isSaveKing) {
                    isMove = isChangePlace(k, l, k, right, oppoArmy);
                    if (isMove) {
                        canArmyMove[k * 8 + right] = true;
                    }
                }
            }
            if (right != 8 && isCheckORAttack(isSaveKing, isCheckPaint, k, l, k, right, oppoArmy)) // it is return true if it give chack to oppoKing , if it will attack then paint color to yellow
            {
                return true;
            }

        } catch (error) { }

        try {
            let left = l;
            while (boxes[k * 8 + (--left)].innerText == "" && left >= 0) {
                let isMove = true;
                if (isSaveKing) {
                    isMove = isChangePlace(k, l, k, left, oppoArmy);
                    if (isMove) {
                        canArmyMove[k * 8 + left] = true;
                    }
                }
            }
            if (left != -1 && isCheckORAttack(isSaveKing, isCheckPaint, k, l, k, left, oppoArmy)) // it is return true if it give chack to oppoKing , if it will attack then paint color to yellow
            {
                return true;
            }

        } catch (error) { }

        try {
            let down = k;
            let downR = l;
            while (boxes[(++down) * 8 + (++downR)].innerText == "" && down < 8 && downR < 8) {
                let isMove = true;
                if (isSaveKing) {
                    isMove = isChangePlace(k, l, down, downR, oppoArmy);
                    if (isMove) {
                        canArmyMove[down * 8 + downR] = true;
                    }
                }
            }
            if (down != 8 && downR != 8 && isCheckORAttack(isSaveKing, isCheckPaint, k, l, down, downR, oppoArmy)) // it is return true if it give chack to oppoKing , if it will attack then paint color to yellow
            {
                return true;
            }

        } catch (error) { }

        try {
            let up = k;
            let upR = l;
            while (boxes[(--up) * 8 + (++upR)].innerText == "" && up >= 0 && upR < 8) {
                let isMove = true;
                if (isSaveKing) {
                    isMove = isChangePlace(k, l, up, upR, oppoArmy);
                    if (isMove) {
                        canArmyMove[up * 8 + upR] = true;
                    }
                }
            }
            if (up != -1 && upR != 8 && isCheckORAttack(isSaveKing, isCheckPaint, k, l, up, upR, oppoArmy)) // it is return true if it give chack to oppoKing , if it will attack then paint color to yellow
            {
                return true;
            }

        } catch (error) { }

        try {
            let down = k;
            let downL = l;
            while (boxes[++down * 8 + --downL].innerText == "" && down < 8 && downL >= 0) {
                let isMove = true;
                if (isSaveKing) {
                    isMove = isChangePlace(k, l, down, downL, oppoArmy);
                    if (isMove) {
                        canArmyMove[down * 8 + downL] = true;
                    }
                }
            }
            if (down != 8 && downL != -1 && isCheckORAttack(isSaveKing, isCheckPaint, k, l, down, downL, oppoArmy)) // it is return true if it give chack to oppoKing , if it will attack then paint color to yellow
            {
                return true;
            }

        } catch (error) { }

        try {
            let up = k;
            let upL = l;
            while (boxes[(--up) * 8 + (--upL)].innerText == "" && up >= 0 && upL >= 0) {
                let isMove = true;
                if (isSaveKing) {
                    isMove = isChangePlace(k, l, up, upL, oppoArmy);
                    if (isMove) {
                        canArmyMove[up * 8 + upL] = true;
                    }
                }
            }
            if (up != -1 && upL != -1 && isCheckORAttack(isSaveKing, isCheckPaint, k, l, up, upL, oppoArmy)) // it is return true if it give chack to oppoKing , if it will attack then paint color to yellow
            {
                return true;
            }

        } catch (error) { }

        if (isSaveKing) {
            circleClean(true);
            colorClean(true);
        }
        else {
            colorClean(false);
        }

        return false;
    }


    function king(k, l, oppoArmy) {
        try {
            let down = k;
            if (down < 7) {
                kingProcess(k, l, ++down, l, oppoArmy);
            }

        } catch (error) { }

        try {
            let up = k;
            if (up > 0) {
                kingProcess(k, l, --up, l, oppoArmy);
            }

        } catch (error) { }

        try {
            let right = l;
            if (right < 7) {
                kingProcess(k, l, k, ++right, oppoArmy);
            }

        } catch (error) { }

        try {
            let left = l;
            if (left > 0) {
                kingProcess(k, l, k, --left, oppoArmy);
            }
        } catch (error) { }

        try {
            let down = k;
            let downR = l;
            if (down < 7 && downR < 7) {
                kingProcess(k, l, ++down, ++downR, oppoArmy);
            }
        } catch (error) { }

        try {
            let up = k;
            let upR = l;
            if (up > 0 && upR < 7) {
                kingProcess(k, l, --up, ++upR, oppoArmy);
            }
        } catch (error) { }

        try {
            let down = k;
            let downL = l;
            if (down < 7 && downL > 0) {
                kingProcess(k, l, ++down, --downL, oppoArmy);
            }
        } catch (error) { }

        try {
            let up = k;
            let upL = l;
            if (up > 0 && upL > 0) {
                kingProcess(k, l, --up, --upL, oppoArmy);
            }
        } catch (error) { }

        circleClean(true);
        colorClean(true);
    }


    function kingProcess(k, l, newk, newl, oppoArmy) {
        if (boxes[newk * 8 + newl].innerText == "") {
            console.log(newk + " " + newl);
            let attacker = boxes[k * 8 + l].innerText;
            boxes[newk * 8 + newl].innerText = attacker;
            boxes[k * 8 + l].innerText = "";

            if (!moveCheck(false, false, oppoArmy)) {
                canArmyMove[newk * 8 + newl] = true;
                isGameContinue = true;
            }
            else {
                boxes[newk * 8 + newl].innerText = "";
            }
            boxes[k * 8 + l].innerText = attacker;
            colorClean(false);

        } else {
            for (let temp = 0; temp < 6; temp++) {
                if (boxes[newk * 8 + newl].innerText == oppoArmy[temp]) {
                    let attacker = boxes[k * 8 + l].innerText;
                    let defender = boxes[newk * 8 + newl].innerText;
                    boxes[newk * 8 + newl].innerText = attacker;
                    boxes[k * 8 + l].innerText = "";

                    let willDath = false;
                    if (moveCheck(false, false, oppoArmy)) {
                        willDath = true;
                    }
                    boxes[newk * 8 + newl].innerText = defender;
                    boxes[k * 8 + l].innerText = attacker;
                    colorClean(false);
                    if (!willDath) {
                        isGameContinue = true;
                        canArmyAttack[newk * 8 + newl] = true;
                    }
                }
            }
        }
    }

    function isBehindeKing(k, l, oppoKing) {
        try {
            if (boxes[(k - 1) * 8 + l - 1].innerText == oppoKing) return true;
        } catch (error) { }
        try {
            if (boxes[(k - 1) * 8 + l].innerText == oppoKing) return true;
        } catch (error) { }
        try {
            if (boxes[(k - 1) * 8 + l + 1].innerText == oppoKing) return true;
        } catch (error) { }
        try {
            if (boxes[k * 8 + l - 1].innerText == oppoKing) return true;
        } catch (error) { }
        try {
            if (boxes[k * 8 + l + 1].innerText == oppoKing) return true;
        } catch (error) { }
        try {
            if (boxes[(k + 1) * 8 + l - 1].innerText == oppoKing) return true;
        } catch (error) { }
        try {
            if (boxes[(k + 1) * 8 + l].innerText == oppoKing) return true;
        } catch (error) { }
        try {
            if (boxes[(k + 1) * 8 + l + 1].innerText == oppoKing) return true;
        } catch (error) { }

        return false;
    }















    function isThisRightMove(oppoArmy) {
        let isMove;
        // see , if there is check for me then don't move
        if (moveCheck(false, false, oppoArmy)) {
            isMove = false;
        }
        else {
            isMove = true;
        }
        circleClean(false);
        colorClean(false);

        return isMove;
    }

    function isChangePlace(k, l, newk, newl, oppoArmy) {

        let isMove;

        let attacker = boxes[k * 8 + l].innerText;
        let defender = boxes[newk * 8 + newl].innerText;
        boxes[newk * 8 + newl].innerText = attacker;
        boxes[k * 8 + l].innerText = "";

        isMove = isThisRightMove(oppoArmy);

        boxes[newk * 8 + newl].innerText = defender;
        boxes[k * 8 + l].innerText = attacker;

        if (isMove) {
            isGameContinue = true;
        }
        return isMove;
    }

    function isCheckORAttack(isSaveKing, isCheckPaint, k, l, newk, newl, oppoArmy) {
        for (let i = 0; i < 6; i++) {
            if (boxes[newk * 8 + newl].innerText == oppoArmy[i]) {
                let isMove = true;
                if (isSaveKing) {
                    isMove = isChangePlace(k, l, newk, newl, oppoArmy);
                }

                if (isMove) {
                    if (isSaveKing) {
                        canArmyAttack[newk * 8 + newl] = true;
                    }

                    if (i == 3) {
                        if (isCheckPaint) {
                            storeIndexOfChackedKing[0] = newk * 8 + newl;
                        }
                        return true;
                    }
                }
            }
        }
        return false;
    }


    function circleClean(isMakeCircle) {
        for (let i = 0; i < 64; i++) {
            if (isMakeCircle && canArmyMove[i]) {
                boxes[i].innerText = "o";
                boxes[i].style.pointerEvents = "auto";
                canArmyMove[i] = false;
                continue;
            }
            if (boxes[i].innerText == "o") {
                boxes[i].innerText = "";
                boxes[i].style.pointerEvents = "none";
            }

        }
    }

    function colorClean(isCanPaint) {
        for (let i = 0; i < 64; i++) {
            // console.log(i+" "+(canArmyAttack [i]==true));
            if (isCanPaint && canArmyAttack[i] == true) {
                boxes[i].style.backgroundColor = "yellow";
                boxes[i].style.pointerEvents = "auto";
                canArmyAttack[i] = false;
                continue;
            }
            // console.log(boxes[i].style.backgroundColor+" "+(boxes[i].style.backgroundColor == "yellow"));
            if (boxes[i].style.backgroundColor == "yellow") {
                // oneBox[i * 8 +j].setDisable(true);
                if (Math.floor(i / 8) % 2 == 0) {
                    boxes[i].style.backgroundColor = i % 2 == 0 ? "rgb(200, 99, 99)" : "antiquewhite";
                }
                else {
                    boxes[i].style.backgroundColor = i % 2 == 0 ? "antiquewhite" : "rgb(200, 99, 99)";
                }
                boxes[i].style.pointerEvents = "none";
            }
        }
    }

    function twoColorClean(c1, c2) {
        for (let i = 0; i < 64; i++) {
            // console.log(i+" "+(canArmyAttack [i]==true));
            if (boxes[i].style.backgroundColor == c1 || boxes[i].style.backgroundColor == c2) {
                if (Math.floor(i / 8) % 2 == 0) {
                    boxes[i].style.backgroundColor = i % 2 == 0 ? "rgb(200, 99, 99)" : "antiquewhite";
                }
                else {
                    boxes[i].style.backgroundColor = i % 2 == 0 ? "antiquewhite" : "rgb(200, 99, 99)";
                }
                boxes[i].style.pointerEvents = "none";
            }
        }
    }



    function checkChecker(oldArmy, newArmy) {
        console.log("in checkchecker");
        try {
            if (moveCheck(false, true, oldArmy)) {
                console.log("checked");
                try {
                    (boxes[storeIndexOfChackedKing[0]].style.backgroundColor = "red");
                    storeIndexOfChackedKing[0] = null;
                    circleClean(false);
                    colorClean(false);
                } catch (error) {
                }

                if (!defanceToChack(newArmy, oldArmy)) {
                    console.log("checkmate");
                    gameOver(oldArmy);
                    return;
                }
            }
            else {
                circleClean(false);
                colorClean(false);
                if (!defanceToChack(newArmy, oldArmy)) {
                    gameOver(null);
                    return;
                }
            }
        } catch (error) { console.log(error) }
        circleClean(false);
        colorClean(false);


        //set enable to black
        console.log("out checkchecker");
    }

    function defanceToChack(myArmy, oppoArmy) {
        isGameContinue = false;
        let numberOfArmy = 0;
        for (let i = 0; i < 64; i++) {

            for (let z = 0; z < 6; z++) {
                if (boxes[i].innerText == oppoArmy[z]) numberOfArmy++;
                if (boxes[i].innerText == myArmy[z]) {
                    numberOfArmy++;
                    if (z == 0) {
                        rook(true, false, Math.floor(i / 8), i % 8, oppoArmy);
                    }
                    else if (z == 1) {
                        horse(true, false, Math.floor(i / 8), i % 8, oppoArmy);
                    }
                    else if (z == 2) {
                        camel(true, false, Math.floor(i / 8), i % 8, oppoArmy);
                    }
                    else if (z == 3) {
                        king(Math.floor(i / 8), i % 8, oppoArmy);
                    }
                    else if (z == 4) {
                        queen(true, false, Math.floor(i / 8), i % 8, oppoArmy);
                    }
                    else {
                        if (myArmy[5] == white[5]) {
                            whitepown(true, false, Math.floor(i / 8), i % 8);
                        }
                        else {
                            blackpown(true, false, Math.floor(i / 8), i % 8);
                        }
                    }
                }
            }
            if (isGameContinue) {
                if (numberOfArmy < 3) continue; // if, in numberOfArmy only two value then may be it is kings
                return true;
            }

        }

        if (numberOfArmy == 2) return false;

        return isGameContinue;
    }


    function moveCheck(isSaveKing, isCheckPaint, oppoArmy) {
        for (let i = 0; i < 64; i++) {
            for (let z = 0; z < 6; z++) {
                try {
                    if (boxes[i].innerText == oppoArmy[z]) {
                        if (z == 0) {
                            if (oppoArmy[0] == white[0])//if true then color of rook is white, oppArmy for rook is black
                            {
                                if (rook(isSaveKing, isCheckPaint, Math.floor(i / 8), i % 8, black)) {
                                    console.log("rook");
                                    return true;
                                }
                            }
                            else {
                                if (rook(isSaveKing, isCheckPaint, Math.floor(i / 8), i % 8, white)) {
                                    console.log("rook");
                                    return true;
                                }
                            }
                        }
                        else if (z == 1) {
                            if (oppoArmy[1] == white[1])//if true then color of horse is white, oppArmy for horse is black
                            {
                                if (horse(isSaveKing, isCheckPaint, Math.floor(i / 8), i % 8, black)) {
                                    console.log("horse");
                                    return true;
                                }
                            }
                            else {
                                if (horse(isSaveKing, isCheckPaint, Math.floor(i / 8), i % 8, white)) {
                                    console.log("horse");
                                    return true;
                                }
                            }
                        }
                        else if (z == 2) {
                            if (oppoArmy[2] == white[2])//if true then color of camel is white, oppArmy for camel is black
                            {
                                if (camel(isSaveKing, isCheckPaint, Math.floor(i / 8), i % 8, black)) {
                                    console.log("camel");
                                    return true;
                                }
                            }
                            else {
                                if (camel(isSaveKing, isCheckPaint, Math.floor(i / 8), i % 8, white)) {
                                    console.log("camel");
                                    return true;
                                }
                            }
                        }
                        else if (z == 3) {
                            if (oppoArmy[3] == white[3])//if true then color of king is white, oppArmy for king is black
                            {
                                if (isBehindeKing(Math.floor(i / 8), i % 8, black[3])) {
                                    console.log("king");
                                    return true;
                                }
                            }
                            else {
                                if (isBehindeKing(Math.floor(i / 8), i % 8, white[3])) {
                                    console.log("king");
                                    return true;
                                }
                            }
                        }
                        else if (z == 4) {
                            if (oppoArmy[4] == white[4]) // if true then color of queen is white. so,oppoarmy is black
                            {
                                if (queen(isSaveKing, isCheckPaint, Math.floor(i / 8), i % 8, black)) {
                                    console.log("queen");
                                    return true;
                                }
                            }
                            else {
                                if (queen(isSaveKing, isCheckPaint, Math.floor(i / 8), i % 8, white)) {
                                    console.log("queen");
                                    return true;
                                }
                            }
                        }
                        else if (oppoArmy[5] == white[5]) // if true then color of oppopown is white
                        {
                            if (whitepown(isSaveKing, isCheckPaint, Math.floor(i / 8), i % 8)) {
                                console.log("whitepown");
                                return true;
                            }
                        }
                        else if (oppoArmy[5] == black[5]) {
                            if (blackpown(isSaveKing, isCheckPaint, Math.floor(i / 8), i % 8)) {
                                console.log("blackpown");
                                return true;
                            }
                        }
                        circleClean(false);
                    }
                } catch (error) {

                }
            }
        }
        return false;
    }



    function updateTurn() {
        let chessBoxHTML = chessBox.innerHTML;
        dissable();

        // Store to Firebase under gameId
        db.ref("games/" + gameId).set({
            player: playerId,
            isGameOver: !isGameContinue,
            result: typeof result !== "undefined" ? result : null,
            chessBoxHTML: chessBoxHTML
        }).then(() => {
            retriveUpdatedBox();
        }).catch((error) => {
            console.error("Firebase write error:", error);
        });
    }



    function retriveUpdatedBox() {
        // if (isOpponentLeft) return;
        indicator.style.display = "none";

        opponentRef.once("value").then((snapshot) => {
            const isOnline = snapshot.val();
            if (isOnline === false) {
                window.location = "./index.php";
                alert("Opponent has left the game.");
                // Optionally: auto win or wait
                isOpponentLeft = true;

            }
        }).then(() => {
            db.ref("games/" + gameId).on("value", (snapshot) => {
                const data = snapshot.val();

                if (data && data.player !== playerId && typeof data.chessBoxHTML === "string") {
                    chessBox.innerHTML = data.chessBoxHTML;
                    boxes = document.querySelectorAll(".chess_inner_box");

                    if (data.isGameOver === true) {
                        gameOver(data.result);
                    } else {
                        if (data.player !== "player1") {
                            enableBox(white);
                        } else {
                            enableBox(black);
                        }
                    }
                } else {
                    // keep checking every second if it's not updated yet
                    setTimeout(retriveUpdatedBox, 1000);
                }
            }, (error) => {
                console.error("Firebase read error:", error);
                setTimeout(retriveUpdatedBox, 1000);
            });
        })

    }



    function gameOver(winArmy) {
        isGameContinue = false;
        result = winArmy;
        console.log("Hello");
        if (playerId == "player2") {
            enableBox(black); // for rotate individual army
        }
        dissable();
        let resultDiv = document.querySelector("#gameOver");
        resultDiv.style.display = "block";
        if (winArmy != null) {
            //may winarmy : ♖,♘,♗,♔,♕,♙ : include (,)
            if ((winArmy[3] == white[3]) || (winArmy[6] == white[3])) {
                resultDiv.innerText = "White Win !";
            }
            else {
                resultDiv.innerText = "Black Win !";
            }
        }
        else {
            resultDiv.innerText = "Match Drow !";
        }
    }


    function dissable() {
        boxes.forEach((element) => {
            element.style.opacity = "0.8";
            element.style.pointerEvents = "none";
        });
    }


    // other functios
    playerRef.onDisconnect(playerRef).set({ online: false });
}

//     // On refresh or close
// window.addEventListener("beforeunload", () => {
//     if (playerRef) playerRef.update({ online: false });
// });

// window.addEventListener("beforeunload", (event) => {



//     if (playerId === "player1") {
//         gameRef.onDisconnect().remove();
//     }
//     navigator.sendBeacon("session_destroy.php");
// });