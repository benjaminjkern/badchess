import { GRID_SIZE, SQUARE_SIZE } from "./constants.js";

let pieceSelected;
let currentTurn = "W";

export const getNextTurn = (turn) => (turn === "W" ? "B" : "W");
const goToNextTurn = () => {
    currentTurn = getNextTurn(currentTurn);
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

export const playMove = ([sx, sy, tx, ty], boardPieces) => {
    console.log(
        boardPieces[sy][sx],
        "(",
        sx,
        sy,
        ")",
        "->",
        boardPieces[ty][tx],
        "(",
        tx,
        ty,
        ")"
    );
    boardPieces[ty][tx] = boardPieces[sy][sx];
    boardPieces[sy][sx] = "";
    goToNextTurn();
};

export const setupBoardControls = (boardPieces, redraw, afterMoveCallback) => {
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
            if (pieceSelected.boardPiece[0] === newSpace.boardPiece[0])
                pieceSelected = newSpace;
            else {
                if (validMove(pieceSelected, newSpace, boardPieces)) {
                    playMove(
                        [
                            pieceSelected.boardX,
                            pieceSelected.boardY,
                            boardX,
                            boardY,
                        ],
                        boardPieces
                    );
                    afterMoveCallback(currentTurn);
                }
                pieceSelected = undefined;
            }
        }
        redraw();
    };
};

export const validMove = (
    fromSpace,
    toSpace,
    boardPieces,
    requireNoChecks = true
) => {
    if (toSpace.boardPiece[0] === fromSpace.boardPiece[0]) return false;

    if (requireNoChecks) {
        // Check for check
        const thisTurn = fromSpace.boardPiece[0];
        const nextBoard = playSimulatedMove(
            [
                fromSpace.boardX,
                fromSpace.boardY,
                toSpace.boardX,
                toSpace.boardY,
            ],
            boardPieces
        );
        if (findCheck(thisTurn, nextBoard)) return false;
    }

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

export const playSimulatedMove = ([sx, sy, tx, ty], boardPieces) => {
    const newBoardPieces = [...boardPieces];
    newBoardPieces[ty] = [...newBoardPieces[ty]];
    newBoardPieces[sy] = [...newBoardPieces[sy]];
    newBoardPieces[ty][tx] = newBoardPieces[sy][sx];
    newBoardPieces[sy][sx] = "";
    return newBoardPieces;
};

const scramble = (list) => {
    const newList = [...list];
    for (let i = 0; i < list.length; i++) {
        const r = Math.floor(Math.random() * list.length);
        [newList[i], newList[r]] = [newList[r], newList[i]];
    }
    return newList;
};

export const getMoves = (turn, boardPieces, requireNoChecks = true) => {
    const validMoves = [];
    for (let sx = 0; sx < GRID_SIZE; sx++) {
        for (let sy = 0; sy < GRID_SIZE; sy++) {
            if (boardPieces[sy][sx] === "" || boardPieces[sy][sx][0] !== turn)
                continue;
            for (let tx = 0; tx < GRID_SIZE; tx++) {
                for (let ty = 0; ty < GRID_SIZE; ty++) {
                    if (
                        validMove(
                            {
                                boardX: sx,
                                boardY: sy,
                                boardPiece: boardPieces[sy][sx],
                            },
                            {
                                boardX: tx,
                                boardY: ty,
                                boardPiece: boardPieces[ty][tx],
                            },
                            boardPieces,
                            requireNoChecks
                        )
                    )
                        validMoves.push([sx, sy, tx, ty]);
                }
            }
        }
    }
    return scramble(validMoves);
};

export const findCheck = (turn, boardPieces) => {
    const nextTurn = getNextTurn(turn);
    const moves = getMoves(nextTurn, boardPieces, false);

    for (const move of moves) {
        const nextBoard = playSimulatedMove(move, boardPieces);

        if (
            nextBoard.every((row) => row.every((piece) => piece !== `${turn}K`))
        )
            return true;
    }
    return false;
};

export const findCheckmate = (turn, boardPieces) => {
    const moves = getMoves(turn, boardPieces);
    return moves.every((move) => {
        const nextBoard = playSimulatedMove(move, boardPieces);
        return findCheck(turn, nextBoard);
    });
};
