import { drawBoard } from "./board.js";
import { TOTAL_SIZE } from "./constants.js";
import { drawBoardPieces, startPiecesToBoardPieces } from "./pieces.js";
import "./game.js";
import { setupBoardControls } from "./game.js";

let canvas, ctx;

window.onload = () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = TOTAL_SIZE;
    canvas.height = TOTAL_SIZE;

    const boardPieces = startPiecesToBoardPieces();
    drawBoard(ctx);
    drawBoardPieces(ctx, boardPieces);
    setupBoardControls(boardPieces, () => {
        drawBoard(ctx);
        drawBoardPieces(ctx, boardPieces);
    });
};

const drawEverything = (ctx, boardPieces) => {};
