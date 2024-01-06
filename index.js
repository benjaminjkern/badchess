import { drawBoard } from "./board.js";
import { TOTAL_SIZE } from "./constants.js";
import { drawBoardPieces, startPiecesToBoardPieces } from "./pieces.js";

let canvas, ctx;

window.onload = () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = TOTAL_SIZE;
    canvas.height = TOTAL_SIZE;

    drawBoard(ctx);

    const boardPieces = startPiecesToBoardPieces();
    drawBoardPieces(ctx, boardPieces);
};
