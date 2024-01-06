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

const validMove = (fromSpace, toSpace, boardPieces) => {
    if (toSpace.boardPiece[0] === fromSpace.boardPiece[0]) return false;
    const yDiff = toSpace.boardY - fromSpace.boardY;
    const xDiff = toSpace.boardX - fromSpace.boardX;
    switch (fromSpace.boardPiece[1]) {
        case "P":
            if (fromSpace.boardPiece[0] === "W") {
                // 6 is HARDCODED WONT WORK WITH DIFFERENT SIZED BOARDS
                if (
                    xDiff === 0 &&
                    (yDiff === -1 ||
                        (fromSpace.boardY === 6 && yDiff === -2)) &&
                    toSpace.boardPiece === ""
                )
                    return true;
                if (
                    (xDiff === 1 || xDiff === -1) &&
                    yDiff === -1 &&
                    toSpace.boardPiece !== ""
                )
                    return true;
            } else {
                // 6 is HARDCODED WONT WORK WITH DIFFERENT SIZED BOARDS
                if (
                    xDiff === 0 &&
                    (yDiff === 1 || (fromSpace.boardY === 1 && yDiff === 2)) &&
                    toSpace.boardPiece === ""
                )
                    return true;
                if (
                    (xDiff === 1 || xDiff === -1) &&
                    yDiff === 1 &&
                    toSpace.boardPiece !== ""
                )
                    return true;
            }
            // TODO: En passant
            break;
    }
    return true;
};
