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

export const getWorstMove = (boardState, lookahead = 0) => {
    let list = randomListFrontier();
    let nextList = randomListFrontier();

    list.add([null, null, gridToString(boardState.board.grid), 0]);

    const start = new Date().getTime();

    let movesahead = 0;

    while (true) {
        if (new Date().getTime() - start > 10000) {
            console.log("Time ran out");
            break;
        }
        if (list.isEmpty()) {
            if (nextList.isEmpty()) break;
            movesahead++;
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
    console.log("Playing random move after looking", movesahead, "moves ahead");
    return getRandomMove(boardState);
};
