import {
    findGameEnd,
    getMoves,
    getMovesGenerator,
    playSimulatedMove,
} from "./game.js";
import { boardPiecesToString, startPiecesToBoardPieces } from "./pieces.js";

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
    const list = new Queue();

    list.enqueue([null, null, boardPiecesToString(board.pieces), 0]);
    while (list.peek() !== undefined) {
        const [originalMove, thisMove, thisBoardString, movesAhead] =
            list.dequeue();

        const thisBoard = {
            turn: movesAhead === 0 || movesAhead % 2 === 0 ? "W" : "B",
            pieces: startPiecesToBoardPieces(thisBoardString),
        };

        let boardAfterMove = board;
        if (thisMove) {
            boardAfterMove = playSimulatedMove(thisMove, thisBoard);
            if (findGameEnd(boardAfterMove)) return originalMove;
        }

        if (movesAhead >= lookahead) continue;

        const nextPossibleMoves = getMovesGenerator(boardAfterMove);

        let move = nextPossibleMoves.next().value;
        while (move) {
            list.enqueue([
                originalMove ?? move,
                move,
                boardPiecesToString(boardAfterMove.pieces),
                movesAhead + 1,
            ]);
            move = nextPossibleMoves.next().value;
        }
    }
    console.log("Playing random move");
    return getRandomMove(board);
};
