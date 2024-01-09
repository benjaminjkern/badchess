import {
    findGameEnd,
    getMoves,
    getMovesGenerator,
    getNextTurn,
    playSimulatedMove,
} from "./game.js";
import { gridToString, pieceStringToBoard } from "./pieces.js";

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

export const getWorstMove = (boardState, lookahead = 4) => {
    const list = new Queue();

    list.enqueue([null, null, gridToString(boardState.board.grid), 0]);

    while (list.peek()) {
        const [originalMove, thisMove, thisPieceString, movesAhead] =
            list.dequeue();

        let boardAfterMove = boardState;

        if (thisMove) {
            const currentTurn =
                movesAhead % 2 === 0
                    ? getNextTurn(boardState.turn)
                    : boardState.turn;
            const thisBoardState = {
                turn: currentTurn,
                board: pieceStringToBoard(thisPieceString),
            };
            boardAfterMove = playSimulatedMove(thisMove, thisBoardState);
            if (
                currentTurn !== boardState.turn &&
                findGameEnd(boardAfterMove)
            ) {
                console.log(
                    "Found checkmate",
                    movesAhead,
                    "moves away",
                    originalMove,
                    boardAfterMove
                );
                return originalMove;
            }
        }

        if (movesAhead >= lookahead) continue;

        const nextPossibleMoves = getMovesGenerator(boardAfterMove);

        let move = nextPossibleMoves.next().value;
        while (move) {
            list.enqueue([
                originalMove ?? move,
                move,
                gridToString(boardAfterMove.board.grid),
                movesAhead + 1,
            ]);
            move = nextPossibleMoves.next().value;
        }
    }
    console.log("Playing random move");
    return getRandomMove(boardState);
};
