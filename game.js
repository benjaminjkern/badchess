import { SQUARE_SIZE } from "./constants.js";

let pieceSelected;
let currentTurn = "W";
const nextTurn = () => {
    currentTurn = currentTurn === "W" ? "B" : "W";
};

export const drawSelectedPiece = (ctx) => {
    if (!pieceSelected) return;
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.rect(
        pieceSelected.boardX * SQUARE_SIZE,
        pieceSelected.boardY * SQUARE_SIZE,
        SQUARE_SIZE,
        SQUARE_SIZE
    );
    ctx.stroke();
};

export const setupBoardControls = (boardPieces, redraw) => {
    window.onclick = (e) => {
        const boardX = Math.floor(e.x / SQUARE_SIZE);
        const boardY = Math.floor(e.y / SQUARE_SIZE);
        const boardPiece = boardPieces[boardY][boardX];
        const newSpace = {
            boardX,
            boardY,
            boardPiece,
        };
        if (!pieceSelected) {
            if (boardPiece[0] === currentTurn && boardPiece !== "")
                pieceSelected = newSpace;
        } else {
            if (validMove(pieceSelected, newSpace, boardPieces)) {
                boardPieces[pieceSelected.boardY][pieceSelected.boardX] = "";
                boardPieces[boardY][boardX] = pieceSelected.boardPiece;
                nextTurn();
            }
            pieceSelected = undefined;
        }
        redraw();
    };
};

const validMove = (fromSpace, toSpace) => {
    if (toSpace.boardPiece[0] === fromSpace.boardPiece[0]) return false;
    return true;
};
