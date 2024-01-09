export let SQUARE_SIZE = 50;
export const GRID_SIZE = 8;
export let TOTAL_SIZE = SQUARE_SIZE * GRID_SIZE;

export const setSize = (size) => {
    SQUARE_SIZE = size / GRID_SIZE;
    TOTAL_SIZE = SQUARE_SIZE * GRID_SIZE;
};
