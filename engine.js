import { GRID_SIZE } from "./constants.js";
import { playMove, validMove } from "./game.js";

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
    return validMoves;
};

export const playRandomMove = (turn, boardPieces, redraw) => {
    const moves = getMoves(turn, boardPieces);

    playMove(moves[Math.floor(Math.random() * moves.length)], boardPieces);

    redraw();
};
