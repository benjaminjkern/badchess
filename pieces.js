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

const getPieceColor = (piece) => (piece[0] === "B" ? "black" : "white");
const getPieceType = (piece) => {
    switch (piece[1]) {
        case "P":
            return "pawn";
        case "N":
            return "knight";
        case "K":
            return "king";
        case "Q":
            return "queen";
        case "R":
            return "rook";
        case "B":
            return "bishop";
    }
};

export const drawBoardPieces = (ctx, boardPieces) => {
    const drawImage = (image, x, y) => {
        ctx.drawImage(
            image,
            x * SQUARE_SIZE,
            y * SQUARE_SIZE,
            SQUARE_SIZE,
            SQUARE_SIZE
        );
    };
    for (const {
        piece,
        pos: [x, y],
    } of boardPieces) {
        const image = new Image(SQUARE_SIZE, SQUARE_SIZE);
        image.onload = () => drawImage(image, x, y);
        image.src = `${getPieceColor(piece)}-${getPieceType(piece)}.png`;
    }
};
