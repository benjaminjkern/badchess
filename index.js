import { drawBoard } from "./board.js";
import { SQUARE_SIZE, TOTAL_SIZE, setSize } from "./constants.js";
import { getWorstMove } from "./engine.js";
import { currentBoardState, drawCurrentBoard, playMove } from "./game.js";
import { newImages } from "./pieces.js";

let pieceSelected;

const drawSelectedPiece = () => {
    const canvas = document.getElementById("selectedpiece");
    const ctx = canvas.getContext("2d");

    canvas.width = TOTAL_SIZE;
    canvas.height = TOTAL_SIZE;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!pieceSelected) return;

    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.rect(
        pieceSelected[0] * SQUARE_SIZE,
        pieceSelected[1] * SQUARE_SIZE,
        SQUARE_SIZE,
        SQUARE_SIZE
    );
    ctx.stroke();
};

let thinking = false,
    thinkingDiv;

window.onload = async () => {
    setSize(Math.min(window.innerWidth, window.innerHeight));

    await newImages();

    // setTimeout(() => {
    //     let time = 0;
    //     for (let i = 0; i <= 10; i++) {
    //         console.log(i);
    //         const start = new Date().getTime();
    //         getWorstMove(currentBoardState);
    //         time += new Date().getTime() - start;
    //     }
    //     console.log(time);
    // }, 3000);

    drawBoard();
    drawEverything();
    // engineLoop();
    thinkingDiv = document.getElementById("thinking");

    if (Math.random() < 0.5) engineMove();
};
window.onresize = async () => {
    setSize(Math.min(window.innerWidth, window.innerHeight));

    await newImages();
    drawBoard();
    drawEverything();
};

const engineMove = () => {
    thinking = true;
    thinkingDiv.style.opacity = 1;
    setTimeout(() => {
        doMove(getWorstMove(currentBoardState));
        thinking = false;
        thinkingDiv.style.opacity = 0;
        drawEverything();
    }, 1);
};

const doMove = (move) => {
    const result = playMove(move);
    if (result.draw) alert("DRAW");
    if (result.winner)
        alert((result.winner === "W" ? "White" : "Black") + " WINS");
    return !result.nextTurn;
};

const engineLoop = () => {
    setTimeout(() => {
        if (doMove(getWorstMove(currentBoardState))) return;
        drawEverything();
        engineLoop();
    }, 3000);
};

window.onclick = window.ontouchend = (e) => {
    if (thinking) return;
    let boardX, boardY;
    if (window.innerWidth < window.innerHeight) {
        boardX = Math.floor(e.x / SQUARE_SIZE);
        boardY = Math.floor(
            (e.y - window.innerHeight / 2 + TOTAL_SIZE / 2) / SQUARE_SIZE
        );
    } else {
        boardX = Math.floor(
            (e.x - window.innerWidth / 2 + TOTAL_SIZE / 2) / SQUARE_SIZE
        );
        boardY = Math.floor(e.y / SQUARE_SIZE);
    }

    if (!pieceSelected) {
        pieceSelected = [boardX, boardY];
    } else {
        if (!doMove([...pieceSelected, boardX, boardY])) {
            engineMove();
        }
        pieceSelected = undefined;
    }
    drawEverything();
};

const drawEverything = () => {
    drawCurrentBoard();
    drawSelectedPiece();
};
