import { drawBoard } from "./board.js";
import { GRID_SIZE, SQUARE_SIZE, TOTAL_SIZE } from "./constants.js";
import { getWorstMove } from "./engine.js";
import { currentBoard, drawCurrentBoard, playMove } from "./game.js";

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

    // setTimeout(() => {
    //     let time = 0;
    //     for (let i = 0; i <= 10; i++) {
    //         console.log(i);
    //         const start = new Date().getTime();
    //         getWorstMove(currentBoard);
    //         time += new Date().getTime() - start;
    //     }
    //     console.log(time);
    // }, 3000);

    drawEverything();
};

window.onclick = (e) => {
    const boardX = Math.floor(e.x / SQUARE_SIZE);
    const boardY = Math.floor(e.y / SQUARE_SIZE);
    if (boardX < 0 || boardX >= GRID_SIZE || boardY < 0 || boardY >= GRID_SIZE)
        return;

    if (!pieceSelected) {
        pieceSelected = [boardX, boardY];
    } else {
        const result = playMove([...pieceSelected, boardX, boardY]);
        if (result.draw) console.log("DRAW");
        if (result.winner) console.log(result.winner, "WINS");
        if (result.nextTurn === "B")
            setTimeout(() => {
                playMove(getWorstMove(currentBoard));
                drawEverything();
            }, 1);
        pieceSelected = undefined;
    }
    drawEverything();
};

const drawEverything = () => {
    drawBoard(ctx);
    drawCurrentBoard(ctx);
    drawSelectedPiece(ctx);
};
