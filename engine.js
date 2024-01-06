import {
    findCheckmate,
    getMoves,
    getNextTurn,
    playMove,
    playSimulatedMove,
} from "./game.js";

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

const getRandomMove = (turn, boardPieces) => {
    const moves = getMoves(turn, boardPieces);
    return moves[Math.floor(Math.random() * moves.length)];
};

export const playEngineMove = (turn, boardPieces, redraw) => {
    const move = getWorstMove(turn, boardPieces);
    playMove(move, boardPieces);

    redraw();
};

const getWorstMove = (turn, boardPieces, lookahead = 2) => {
    console.log("getWorstMove");
    const list = new Queue();
    list.enqueue([undefined, turn, boardPieces, 0]);
    while (list.peek()) {
        const [originalMove, thisTurn, thisBoard, movesAhead] = list.dequeue();
        // console.log(originalMove, movesAhead);
        if (movesAhead >= lookahead) continue;
        const moves = getMoves(thisTurn, thisBoard);
        const nextTurn = getNextTurn(thisTurn);
        while (moves.length) {
            const move = moves.pop();
            // console.log(move);
            const nextBoard = playSimulatedMove(move, thisBoard);
            if (originalMove && findCheckmate(turn, nextBoard))
                return originalMove;
            list.enqueue([
                originalMove ?? move,
                nextTurn,
                nextBoard,
                movesAhead + 1,
            ]);
        }
    }
    console.log("Playing random move");
    return getRandomMove(turn, boardPieces);
};
