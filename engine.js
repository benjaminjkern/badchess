import { findGameEnd, getMoves, playSimulatedMoves } from "./game.js";

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

export const getWorstMove = (board, lookahead = 3) => {
    // const list = [];
    const list = new Queue();

    // list.push('');
    list.enqueue("");
    // while (list.length) {
    while (list.peek() !== undefined) {
        // const moves = list.pop();
        const movesString = list.dequeue();
        const moves = movesString
            .split("")
            .map((x) => Number(x))
            .reduce((p, c, i) => {
                if (i % 4 === 0) return [...p, [c]];
                return [...p.slice(0, -1), [...p[p.length - 1], c]];
            }, []);

        const boardAfterMoves = playSimulatedMoves(moves, board);
        if (findGameEnd(boardAfterMoves)) return moves[0];

        if (moves.length >= lookahead) continue;

        const nextPossibleMoves = getMoves(boardAfterMoves);

        while (nextPossibleMoves.length) {
            const move = nextPossibleMoves.pop();
            // list.push(movesString + move.join(''));
            list.enqueue(movesString + move.join(""));
        }
    }
    console.log("Playing random move");
    return getRandomMove(board);
};
