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

    const pieceType = fromSpace.boardPiece[1];

    if (pieceType === "P") {
        if (fromSpace.boardPiece[0] === "W") {
            // 6 is HARDCODED WONT WORK WITH DIFFERENT SIZED BOARDS
            if (
                xDiff === 0 &&
                (yDiff === -1 || (fromSpace.boardY === 6 && yDiff === -2)) &&
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
        return false;
        // TODO: En passant
        // TODO: Turn pawn into queen or whatever
    }

    if (pieceType === "N")
        return (
            Math.max(Math.abs(yDiff), Math.abs(xDiff)) === 2 &&
            Math.min(Math.abs(yDiff), Math.abs(xDiff)) === 1
        );

    if (pieceType === "K") return Math.abs(yDiff) <= 1 && Math.abs(xDiff) <= 1;
    // TODO: Castling

    if (["R", "B", "Q"].includes(pieceType)) {
        if (pieceType === "R" && yDiff !== 0 && xDiff !== 0) return false;
        if (pieceType === "B" && Math.abs(yDiff) !== Math.abs(xDiff))
            return false;
        if (
            pieceType === "Q" &&
            yDiff !== 0 &&
            xDiff !== 0 &&
            Math.abs(yDiff) !== Math.abs(xDiff)
        )
            return false;

        const dist = Math.max(Math.abs(yDiff), Math.abs(xDiff));
        const direction = [
            xDiff ? Math.abs(xDiff) / xDiff : 0,
            yDiff ? Math.abs(yDiff) / yDiff : 0,
        ];
        for (let i = 1; i < dist; i++) {
            if (
                boardPieces[fromSpace.boardY + direction[1] * i][
                    fromSpace.boardX + direction[0] * i
                ] !== ""
            )
                return false;
        }
        return true;
    }
    return true;
};
