import { GRID_SIZE } from "./constants.js";
import { drawBoardPieces, pieceStringToBoard } from "./pieces.js";

export let currentBoardState = { board: pieceStringToBoard(), turn: "W" };

export const drawCurrentBoard = (ctx) => {
    drawBoardPieces(ctx, currentBoardState.board.pieces);
};

export const getNextTurn = (turn) => (turn === "W" ? "B" : "W");

export const playMove = ([sx, sy, tx, ty]) => {
    if (!validMove([sx, sy, tx, ty], currentBoardState))
        return { invalidMove: true };

    console.log(
        currentBoardState.board.grid[sy][sx].piece,
        "(",
        sx,
        sy,
        ")",
        "->",
        currentBoardState.board.grid[ty][tx].piece,
        "(",
        tx,
        ty,
        ")"
    );

    moveBoard([sx, sy, tx, ty], currentBoardState);

    const gameOver = findGameEnd(currentBoardState);
    if (gameOver) return { winner: getNextTurn(currentBoardState.turn) };
    if (gameOver === null) return { draw: true };

    return { nextTurn: currentBoardState.turn };
};

export const playSimulatedMove = ([sx, sy, tx, ty], boardState) => {
    const newBoardState = {
        turn: boardState.turn,
        board: {
            grid: [...boardState.board.grid],
            pieces: boardState.board.pieces,
        },
    };
    const fromPiece = { ...newBoardState.board.grid[sy][sx] };
    const toPiece = { ...newBoardState.board.grid[ty][tx] };

    newBoardState.board.grid[sy] = [...newBoardState.board.grid[sy]];
    if (sy !== ty)
        newBoardState.board.grid[ty] = [...newBoardState.board.grid[ty]];

    newBoardState.board.grid[sy][sx] = fromPiece;
    newBoardState.board.grid[ty][tx] = toPiece;
    newBoardState.board.pieces = newBoardState.board.pieces.map(
        (pieceObject) => {
            if (pieceObject.id === fromPiece.id) return fromPiece;
            if (pieceObject.id === toPiece.id) return toPiece;
            return pieceObject;
        }
    );

    moveBoard([sx, sy, tx, ty], newBoardState);

    return newBoardState;
};

const moveBoard = ([sx, sy, tx, ty], boardState) => {
    const fromPiece = boardState.board.grid[sy][sx];
    const toPiece = boardState.board.grid[ty][tx];

    boardState.board.grid[ty][tx] = fromPiece;
    boardState.board.grid[sy][sx] = { piece: "", pos: [sx, sy] };

    fromPiece.pos = [tx, ty];
    if (toPiece.piece !== "")
        boardState.board.pieces = boardState.board.pieces.filter(
            ({ id }) => id !== toPiece.id // TODO: Make this remember indices (Probably makes almost no difference lol)
        );

    boardState.turn = getNextTurn(boardState.turn);
};

export const validMove = (
    [sx, sy, tx, ty],
    boardState,
    requireNoChecks = true
) => {
    const fromPiece = boardState.board.grid[sy][sx].piece;
    const toPiece = boardState.board.grid[ty][tx].piece;

    if (toPiece[0] === fromPiece[0]) return false;
    if (fromPiece === "") return false;
    if (fromPiece[0] !== boardState.turn) return false;

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
                boardState.board.grid[sy + direction[1] * i][
                    sx + direction[0] * i
                ].piece !== ""
            )
                return false;
        }
    }
    if (!requireNoChecks) return true;

    const nextBoardState = playSimulatedMove([sx, sy, tx, ty], boardState);

    // Check for check
    return !findCheck({ turn: boardState.turn, board: nextBoardState.board });
};

export function* getMovesGenerator(boardState, requireNoChecks = true) {
    for (let sx = 0; sx < GRID_SIZE; sx++) {
        for (let sy = 0; sy < GRID_SIZE; sy++) {
            if (
                boardState.board.grid[sy][sx].piece === "" ||
                boardState.board.grid[sy][sx].piece[0] !== boardState.turn
            )
                continue;
            for (let tx = 0; tx < GRID_SIZE; tx++) {
                for (let ty = 0; ty < GRID_SIZE; ty++) {
                    if (
                        validMove([sx, sy, tx, ty], boardState, requireNoChecks)
                    )
                        yield [sx, sy, tx, ty];
                }
            }
        }
    }
}

export const getMoves = (boardState, requireNoChecks = true) => {
    const moves = getMovesGenerator(boardState, requireNoChecks);
    const list = [];
    let item = moves.next();
    while (!item.done) {
        list.push(item.value);
        item = moves.next();
    }
    return list;
};

export const findCheck = (boardState) => {
    const nextTurn = getNextTurn(boardState.turn);
    const movesGenerator = getMovesGenerator(
        { turn: nextTurn, board: boardState.board },
        false
    );

    while (true) {
        const move = movesGenerator.next().value;
        if (!move) return false;
        const [sx, sy, tx, ty] = move;
        if (boardState.board.grid[ty][tx].piece === `${boardState.turn}K`)
            return true;
    }
};

export const findGameEnd = (boardState) => {
    const movesGenerator = getMovesGenerator(boardState);
    const move = movesGenerator.next().value;
    if (move) return false;
    return findCheck(boardState) || null;
};
