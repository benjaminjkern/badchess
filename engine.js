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

const queueFrontier = () => {
    const list = new Queue();
    return {
        isEmpty: () => list.peek() === undefined,
        getNext: (...args) => list.dequeue(...args),
        add: (...args) => list.enqueue(...args),
    };
};

const randomListFrontier = () => {
    const list = [];
    return {
        isEmpty: () => list.length === 0,
        getNext: () =>
            list.splice(Math.floor(Math.random() * list.length), 1)[0],
        add: (...args) => list.push(...args),
    };
};

export const getWorstMove = (boardState, lookahead = 4) => {
    let list = randomListFrontier();
    let nextList = randomListFrontier();

    list.add([null, null, gridToString(boardState.board.grid), 0]);

    while (true) {
        if (list.isEmpty()) {
            if (nextList.isEmpty()) break;
            list = nextList;
            nextList = randomListFrontier();
        }
        const [originalMove, thisMove, thisPieceString, movesAhead] =
            list.getNext();

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

            if (Math.random() * 10000 < 1)
                console.log(originalMove, thisMove, thisBoardState, movesAhead);

            boardAfterMove = playSimulatedMove(thisMove, thisBoardState);
            if (findGameEnd(boardAfterMove)) {
                if (currentTurn !== boardState.turn) {
                    console.log(
                        "Found checkmate",
                        movesAhead,
                        "moves away",
                        originalMove,
                        boardAfterMove
                    );
                    return originalMove;
                }
                continue;
            }
        }

        if (lookahead && movesAhead >= lookahead) continue;

        const nextPossibleMoves = getMovesGenerator(boardAfterMove);

        let move = nextPossibleMoves.next().value;
        while (move) {
            nextList.add([
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
