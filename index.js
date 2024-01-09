import { drawBoard } from "./board.js";
import { SQUARE_SIZE, TOTAL_SIZE } from "./constants.js";
import { drawCurrentBoard, playMove } from "./game.js";

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
    canvas.width = TOTAL_SIZE;
    canvas.height = TOTAL_SIZE;

    // (turn, gameState) => {
    //     if (gameOver) console.log("GAME OVER");
    //     else playEngineMove(turn, boardPieces, drawEverything);
    // };

    drawEverything();
};

window.onclick = (e) => {
    const boardX = Math.floor(e.x / SQUARE_SIZE);
    const boardY = Math.floor(e.y / SQUARE_SIZE);

    if (!pieceSelected) {
        pieceSelected = [boardX, boardY];
    } else {
        const result = playMove([...pieceSelected, boardX, boardY]);
        if (result.draw) console.log("DRAW");
        if (result.winner) console.log(result.winner, "WINS");
        pieceSelected = undefined;
    }
    drawEverything();
};

const drawEverything = () => {
    drawBoard(ctx);
    drawCurrentBoard(ctx);
    drawSelectedPiece(ctx);
};
