import { GRID_SIZE, SQUARE_SIZE, TOTAL_SIZE } from "./constants.js";

const color1 = "#bb7700";
const color2 = "#995500";

export const drawBoard = () => {
    const canvas = document.getElementById("board");
    const ctx = canvas.getContext("2d");
    canvas.width = TOTAL_SIZE;
    canvas.height = TOTAL_SIZE;

    for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
            ctx.fillStyle = (x + y) % 2 ? color2 : color1;
            ctx.fillRect(
                Math.floor(x * SQUARE_SIZE),
                Math.floor(y * SQUARE_SIZE),
                SQUARE_SIZE + 1,
                SQUARE_SIZE + 1
            );
        }
    }
};
