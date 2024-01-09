import { GRID_SIZE, SQUARE_SIZE } from "./constants.js";

const START_PIECES = `
BRBNBBBQBKBBBNBR
BPBPBPBPBPBPBPBP




WPWPWPWPWPWPWPWP
WRWNWBWQWKWBWNWR
`;

export const gridToString = (grid) => {
    return `\n${grid
        .map((row) => row.map(({ piece }) => piece || "  ").join(""))
        .join("\n")}\n`;
};

export const pieceStringToBoard = (pieceString = START_PIECES) => {
    const board = { grid: [], pieces: [] };
    for (const [y, row] of pieceString.split("\n").slice(1, -1).entries()) {
        const rowArray = [];
        for (let x = 0; x < GRID_SIZE; x++) {
            const rawPiece = row.slice(x * 2, x * 2 + 2);
            const piece = rawPiece === "  " ? "" : rawPiece;
            const pieceObject = { piece, pos: [x, y] };
            if (piece !== "") pieceObject.id = board.pieces.push(pieceObject);
            rowArray.push(pieceObject);
        }
        board.grid.push(rowArray);
    }
    return board;
};

export const drawBoardPieces = (ctx, boardPieces) => {
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    for (const {
        piece,
        pos: [x, y],
    } of boardPieces) {
        ctx.fillStyle = piece[0] === "B" ? "#000" : "#fff";
        ctx.fillText(
            piece,
            x * SQUARE_SIZE + SQUARE_SIZE / 2,
            y * SQUARE_SIZE + SQUARE_SIZE / 2
        );
    }
};
