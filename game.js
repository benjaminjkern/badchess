import { GRID_SIZE } from "./constants.js";
import { drawBoardPieces, startPiecesToBoardPieces } from "./pieces.js";

export let currentBoard = { pieces: startPiecesToBoardPieces(), turn: "W" };

export const drawCurrentBoard = (ctx) => {
    drawBoardPieces(ctx, currentBoard.pieces);
};

export const getNextTurn = (turn) => (turn === "W" ? "B" : "W");

export const playMove = ([sx, sy, tx, ty]) => {
    if (!validMove([sx, sy, tx, ty], currentBoard))
        return { invalidMove: true };

    console.log(
        currentBoard.pieces[sy][sx],
        "(",
        sx,
        sy,
        ")",
        "->",
        currentBoard.pieces[ty][tx],
        "(",
        tx,
        ty,
        ")"
    );
    currentBoard.pieces[ty][tx] = currentBoard.pieces[sy][sx];
    currentBoard.pieces[sy][sx] = "";

    currentBoard.turn = getNextTurn(currentBoard.turn);
    const gameOver = findGameEnd(currentBoard);
    if (gameOver) return { winner: getNextTurn(currentBoard.turn) };
    if (gameOver === null) return { draw: true };

    return { nextTurn: currentBoard.turn };
};

export const validMove = ([sx, sy, tx, ty], board, requireNoChecks = true) => {
    const fromPiece = board.pieces[sy][sx];
    const toPiece = board.pieces[ty][tx];

    if (toPiece[0] === fromPiece[0]) return false;
    if (fromPiece === "") return false;
    if (fromPiece[0] !== board.turn) return false;

    const yDiff = ty - sy;
    const xDiff = tx - sx;

    const pieceType = fromPiece[1];

    if (pieceType === "P") {
        if (fromPiece[0] === "W") {
            if (
                !(
                    xDiff === 0 &&
                    // 6 is HARDCODED WONT WORK WITH DIFFERENT SIZED BOARDS
                    (yDiff === -1 || (sy === 6 && yDiff === -2)) &&
                    toPiece === ""
                ) &&
                !(
                    (xDiff === 1 || xDiff === -1) &&
                    yDiff === -1 &&
                    toPiece !== ""
                )
            )
                return false;
        } else {
            if (
                !(
                    xDiff === 0 &&
                    // 1 is HARDCODED WONT WORK WITH DIFFERENT SIZED BOARDS
                    (yDiff === 1 || (sy === 1 && yDiff === 2)) &&
                    toPiece === ""
                ) &&
                !(
                    (xDiff === 1 || xDiff === -1) &&
                    yDiff === 1 &&
                    toPiece !== ""
                )
            )
                return false;
        }
        // TODO: En passant
        // TODO: Turn pawn into queen or whatever
    } else if (pieceType === "N") {
        if (
            Math.max(Math.abs(yDiff), Math.abs(xDiff)) !== 2 ||
            Math.min(Math.abs(yDiff), Math.abs(xDiff)) !== 1
        )
            return false;
    } else if (pieceType === "K") {
        if (Math.abs(yDiff) > 1 || Math.abs(xDiff) > 1) return false;
        // TODO: Castling
    } else if (["R", "B", "Q"].includes(pieceType)) {
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
                board.pieces[sy + direction[1] * i][sx + direction[0] * i] !==
                ""
            )
                return false;
        }
    }
    if (!requireNoChecks) return true;

    const nextBoard = playSimulatedMove([sx, sy, tx, ty], board);

    // Check for check
    return !findCheck({ turn: board.turn, pieces: nextBoard.pieces });
};

export const playSimulatedMove = ([sx, sy, tx, ty], board) => {
    const newBoard = {
        turn: getNextTurn(board.turn),
        pieces: [...board.pieces],
    };
    newBoard.pieces[ty] = [...newBoard.pieces[ty]];
    if (sy !== ty) newBoard.pieces[sy] = [...newBoard.pieces[sy]];
    newBoard.pieces[ty][tx] = newBoard.pieces[sy][sx];
    newBoard.pieces[sy][sx] = "";
    return newBoard;
};

export function* getMovesGenerator(board, requireNoChecks = true) {
    for (let sx = 0; sx < GRID_SIZE; sx++) {
        for (let sy = 0; sy < GRID_SIZE; sy++) {
            if (
                board.pieces[sy][sx] === "" ||
                board.pieces[sy][sx][0] !== board.turn
            )
                continue;
            for (let tx = 0; tx < GRID_SIZE; tx++) {
                for (let ty = 0; ty < GRID_SIZE; ty++) {
                    if (validMove([sx, sy, tx, ty], board, requireNoChecks))
                        yield [sx, sy, tx, ty];
                }
            }
        }
    }
}

export const getMoves = (board, requireNoChecks = true) => {
    const moves = getMovesGenerator(board, requireNoChecks);
    const list = [];
    let item = moves.next();
    while (!item.done) {
        list.push(item.value);
        item = moves.next();
    }
    return list;
};

export const findCheck = (board) => {
    const nextTurn = getNextTurn(board.turn);
    const movesGenerator = getMovesGenerator(
        { turn: nextTurn, pieces: board.pieces },
        false
    );

    while (true) {
        const move = movesGenerator.next().value;
        if (!move) return false;
        const [sx, sy, tx, ty] = move;
        if (board.pieces[ty][tx] === `${board.turn}K`) return true;
    }
};

export const findGameEnd = (board) => {
    const movesGenerator = getMovesGenerator(board);
    const move = movesGenerator.next().value;
    if (move) return false;
    return findCheck(board) || null;
};
