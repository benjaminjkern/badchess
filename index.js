import { drawBoard } from "./board.js";
import { TOTAL_SIZE } from "./constants.js";
import { drawBoardPieces, startPiecesToBoardPieces } from "./pieces.js";
import "./game.js";
import { drawSelectedPiece, setupBoardControls } from "./game.js";

let canvas, ctx, boardPieces;

window.onload = () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = TOTAL_SIZE;
    canvas.height = TOTAL_SIZE;

    boardPieces = startPiecesToBoardPieces();
    setupBoardControls(boardPieces, drawEverything);

    drawEverything();
};

const drawEverything = () => {
    drawBoard(ctx);
    drawBoardPieces(ctx, boardPieces);
    drawSelectedPiece(ctx);
};
