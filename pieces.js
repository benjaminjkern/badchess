import { GRID_SIZE, SQUARE_SIZE, TOTAL_SIZE } from "./constants.js";

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

const PIECES = ["P", "N", "K", "Q", "R", "B"];

let images;

const getPieceColor = (piece) => (piece[0] === "B" ? "black" : "white");
const getPieceType = (piece) => {
    switch (piece) {
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

export const newImages = async () => {
    images = [
        new Image(SQUARE_SIZE, SQUARE_SIZE),
        new Image(SQUARE_SIZE, SQUARE_SIZE),
        new Image(SQUARE_SIZE, SQUARE_SIZE),
        new Image(SQUARE_SIZE, SQUARE_SIZE),
        new Image(SQUARE_SIZE, SQUARE_SIZE),
        new Image(SQUARE_SIZE, SQUARE_SIZE),
        new Image(SQUARE_SIZE, SQUARE_SIZE),
        new Image(SQUARE_SIZE, SQUARE_SIZE),
        new Image(SQUARE_SIZE, SQUARE_SIZE),
        new Image(SQUARE_SIZE, SQUARE_SIZE),
        new Image(SQUARE_SIZE, SQUARE_SIZE),
        new Image(SQUARE_SIZE, SQUARE_SIZE),
    ];
    for (let i = 0; i < 6; i++) {
        images[i * 2].src = `${getPieceColor("B")}-${getPieceType(
            PIECES[i]
        )}.png`;
        images[i * 2 + 1].src = `${getPieceColor("W")}-${getPieceType(
            PIECES[i]
        )}.png`;
    }
    return await Promise.all(
        images.map((image) => {
            return new Promise((resolve) => (image.onload = resolve));
        })
    );
};

export const drawBoardPieces = (boardPieces) => {
    const canvas = document.getElementById("pieces");
    const ctx = canvas.getContext("2d");
    canvas.width = TOTAL_SIZE;
    canvas.height = TOTAL_SIZE;

    for (const {
        piece,
        pos: [x, y],
    } of boardPieces) {
        const image =
            images[
                2 *
                    PIECES.findIndex(
                        (pieceTemplate) => pieceTemplate === piece[1]
                    ) +
                    (piece[0] === "W")
            ];

        ctx.drawImage(
            image,
            x * SQUARE_SIZE,
            y * SQUARE_SIZE,
            SQUARE_SIZE,
            SQUARE_SIZE
        );
    }
};
