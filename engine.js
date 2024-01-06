import { GRID_SIZE } from "./constants.js";
import { playMove, validMove } from "./game.js";

const scramble = (list) => {
    const newList = [...list];
    for (let i = 0; i < list.length; i++) {
        const r = Math.floor(Math.random() * list.length);
        [newList[i], newList[r]] = [newList[r], newList[i]];
    }
    return newList;
};

export const getMoves = (turn, boardPieces) => {
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
                            boardPieces
                        )
                    )
                        validMoves.push([sx, sy, tx, ty]);
                }
            }
        }
    }
    return scramble(validMoves);
};

// https://codereview.stackexchange.com/questions/255698/queue-with-o1-enqueue-and-dequeue-with-js-arrays
function Queue() {
    var head, tail;
    return Object.freeze({
        enqueue(value) {
            const link = { value, next: undefined };
            tail = head ? (tail.next = link) : (head = link);
        },
        dequeue() {
            if (head) {
                const value = head.value;
                head = head.next;
                return value;
            }
        },
        peek() {
            return head?.value;
        },
    });
}

const playSimulatedMove = ([sx, sy, tx, ty], boardPieces) => {
    const newBoardPieces = [...boardPieces];
    newBoardPieces[ty] = [...newBoardPieces[ty]];
    newBoardPieces[sy] = [...newBoardPieces[sy]];
    newBoardPieces[ty][tx] = newBoardPieces[sy][sx];
    newBoardPieces[sy][sx] = "";
    return newBoardPieces;
};

const getRandomMove = (turn, boardPieces) => {
    const moves = getMoves(turn, boardPieces);
    return moves[Math.floor(Math.random() * moves.length)];
};

export const playEngineMove = (turn, boardPieces, redraw) => {
    const move = getWorstMove(turn, boardPieces);
    playMove(move, boardPieces);

    redraw();
};

const getWorstMove = (turn, boardPieces) => {
    const list = new Queue();
    list.enqueue([undefined, turn, boardPieces]);
    while (list.peek()) {
        const [originalMove, thisTurn, thisBoard] = list.dequeue();
        const moves = getMoves(thisTurn, thisBoard);
        const nextTurn = thisTurn === "W" ? "B" : "W";
        while (moves.length) {
            const move = moves.pop();
            const nextBoard = playSimulatedMove(move, thisBoard);
            if (
                originalMove &&
                nextBoard.every((row) =>
                    row.every((piece) => piece !== `${turn}K`)
                )
            )
                return originalMove;
            list.enqueue([originalMove ?? move, nextTurn, nextBoard]);
        }
    }
};
