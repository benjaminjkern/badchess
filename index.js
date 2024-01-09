import { drawBoard } from "./board.js";
import { SQUARE_SIZE, TOTAL_SIZE, setSize } from "./constants.js";
import { getWorstMove } from "./engine.js";
import { currentBoardState, drawCurrentBoard, playMove } from "./game.js";

let canvas, ctx;

let pieceSelected;

const drawSelectedPiece = (ctx) => {
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

window.onload = () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    setSize(Math.min(window.innerWidth, window.innerHeight));
    canvas.width = TOTAL_SIZE;
    canvas.height = TOTAL_SIZE;

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

    drawEverything();
    playEngineMove();
};
window.onresize = () => {
    setSize(Math.min(window.innerWidth, window.innerHeight));
    canvas.width = TOTAL_SIZE;
    canvas.height = TOTAL_SIZE;
    drawEverything();
};

const playEngineMove = () => {
    setTimeout(() => {
        const result = playMove(getWorstMove(currentBoardState));
        if (result.draw) alert("DRAW");
        if (result.winner) alert(result.winner + " WINS");
        drawEverything();
        playEngineMove();
    }, 3000);
};

window.onclick = (e) => {
    const boardX = Math.floor(e.x / SQUARE_SIZE);
    const boardY = Math.floor(e.y / SQUARE_SIZE);

    if (!pieceSelected) {
        pieceSelected = [boardX, boardY];
    } else {
        const result = playMove([...pieceSelected, boardX, boardY]);
        if (result.draw) alert("DRAW");
        if (result.winner) alert(result.winner + " WINS");
        pieceSelected = undefined;
    }
    drawEverything();
};

const drawEverything = () => {
    drawBoard(ctx);
    drawCurrentBoard(ctx);
    drawSelectedPiece(ctx);
};
