import { GRID_SIZE, SQUARE_SIZE } from "./constants.js";

const START_PIECES = `
BRBNBBBQBKBBBNBR
BPBPBPBPBPBPBPBP




WPWPWPWPWPWPWPWP
WRWNWBWQWKWBWNWR
`;

export const startPiecesToBoardPieces = (startPieces = START_PIECES) => {
    return startPieces
        .split("\n")
        .slice(1, -1)
        .map((row) => {
            const returnArray = [];
            for (let i = 0; i < GRID_SIZE; i++) {
                returnArray.push(row.slice(i * 2, i * 2 + 2));
            }
            return returnArray;
        });
};

export const drawBoardPieces = (ctx, boardPieces) => {
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    for (const [y, row] of boardPieces.entries()) {
        for (const [x, piece] of row.entries()) {
            ctx.fillStyle = piece[0] === "B" ? "#000" : "#fff";
            ctx.fillText(
                piece,
                x * SQUARE_SIZE + SQUARE_SIZE / 2,
                y * SQUARE_SIZE + SQUARE_SIZE / 2
            );
        }
    }
};
