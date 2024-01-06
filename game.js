import { SQUARE_SIZE } from "./constants.js";

export const setupBoardControls = (boardPieces, callback) => {
    let pieceSelected;
    window.onclick = (e) => {
        const boardX = Math.floor(e.x / SQUARE_SIZE);
        const boardY = Math.floor(e.y / SQUARE_SIZE);
        if (!pieceSelected) {
            pieceSelected = {
                boardX,
                boardY,
                boardPiece: boardPieces[boardY][boardX],
            };
        } else {
            console.log(pieceSelected);
            boardPieces[pieceSelected.boardY][pieceSelected.boardX] = "";
            boardPieces[boardY][boardX] = pieceSelected.boardPiece;
            pieceSelected = undefined;
            callback();
        }
        console.log(pieceSelected);
    };
};
