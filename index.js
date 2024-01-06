let canvas, ctx;
const SQUARE_SIZE = 50;
const GRID_SIZE = 8;
const TOTAL_SIZE = SQUARE_SIZE * GRID_SIZE;

window.onload = () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = TOTAL_SIZE;
    canvas.height = TOTAL_SIZE;

    draw();
};

const color1 = "#bb7700";
const color2 = "#995500";

const draw = () => {
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
