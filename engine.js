import {
    findGameEnd,
    getMoves,
    playSimulatedMove,
    playSimulatedMovesFromMovesString,
} from "./game.js";

// https://codereview.stackexchange.com/questions/255698/queue-with-o1-enqueue-and-dequeue-with-js-arrays
function Queue() {
    let head, tail;
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

export const getRandomMove = (board) => {
    const moves = getMoves(board);
    return moves[Math.floor(Math.random() * moves.length)];
};

// 9094 (11 times)
export const getWorstMoveStrings = (board, lookahead = 3) => {
    const list = new Queue();

    list.enqueue("");
    while (list.peek() !== undefined) {
        const movesString = list.dequeue();

        const boardAfterMoves = playSimulatedMovesFromMovesString(
            movesString,
            board
        );
        if (findGameEnd(boardAfterMoves))
            return movesString
                .slice(0, 4)
                .split("")
                .map((x) => Number(x));

        if (movesString.length / 4 >= lookahead) continue;

        const nextPossibleMoves = getMoves(boardAfterMoves);

        while (nextPossibleMoves.length) {
            const move = nextPossibleMoves.pop();
            list.enqueue(movesString + move.join(""));
        }
    }
    console.log("Playing random move");
    return getRandomMove(board);
};

// 7674 (11 times)
// 7822 (11 times)
// 7690 (11 times)
export const getWorstMove = (board, lookahead = 4) => {
    const list = new Queue();

    list.enqueue([null, null, board, 0]);
    while (list.peek() !== undefined) {
        const [originalMove, thisMove, thisBoard, movesAhead] = list.dequeue();

        let boardAfterMove = board;
        if (thisMove) {
            boardAfterMove = playSimulatedMove(thisMove, thisBoard);
            if (findGameEnd(boardAfterMove)) return originalMove;
        }

        if (movesAhead >= lookahead) continue;

        const nextPossibleMoves = getMoves(thisBoard);

        while (nextPossibleMoves.length) {
            const move = nextPossibleMoves.pop();
            list.enqueue([
                originalMove ?? move,
                move,
                boardAfterMove,
                movesAhead + 1,
            ]);
        }
    }
    console.log("Playing random move");
    return getRandomMove(board);
};
