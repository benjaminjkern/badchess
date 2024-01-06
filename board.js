import { GRID_SIZE, SQUARE_SIZE } from "./constants.js";

const color1 = "#bb7700";
const color2 = "#995500";

export const drawBoard = (ctx) => {
    for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
            ctx.fillStyle = (x + y) % 2 ? color2 : color1;
            ctx.fillRect(
                x * SQUARE_SIZE,
                y * SQUARE_SIZE,
                SQUARE_SIZE,
                SQUARE_SIZE
            );
        }
    }
};
