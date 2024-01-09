import { drawBoard } from "./board.js";
import { SQUARE_SIZE, TOTAL_SIZE, setSize } from "./constants.js";
import { getWorstMove } from "./engine.js";
import { currentBoardState, drawCurrentBoard, playMove } from "./game.js";
import { newImages } from "./pieces.js";

let pieceSelected;

const drawSelectedPiece = () => {
    const canvas = document.getElementById("selectedpiece");
    const ctx = canvas.getContext("2d");

    canvas.width = TOTAL_SIZE;
    canvas.height = TOTAL_SIZE;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!pieceSelected) return;

    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.rect(
        pieceSelected[0] * SQUARE_SIZE,
        pieceSelected[1] * SQUARE_SIZE,
        SQUARE_SIZE,
        SQUARE_SIZE
    );
    ctx.stroke();
};

window.onload = async () => {
    setSize(Math.min(window.innerWidth, window.innerHeight));

    await newImages();

    // setTimeout(() => {
    //     let time = 0;
    //     for (let i = 0; i <= 10; i++) {
    //         console.log(i);
    //         const start = new Date().getTime();
    //         getWorstMove(currentBoardState);
    //         time += new Date().getTime() - start;
    //     }
    //     console.log(time);
    // }, 3000);

    drawBoard();
    drawEverything();
    // engineLoop();
};
window.onresize = async () => {
    setSize(Math.min(window.innerWidth, window.innerHeight));

    await newImages();
    drawBoard();
    drawEverything();
};

const doMove = (move) => {
    const result = playMove(move);
    if (result.draw) alert("DRAW");
    if (result.winner) alert(result.winner + " WINS");
    return !result.nextTurn;
};

const engineLoop = () => {
    setTimeout(() => {
        if (doMove(getWorstMove(currentBoardState))) return;
        drawEverything();
        engineLoop();
    }, 3000);
};

window.onclick = (e) => {
    const boardX = Math.floor(e.x / SQUARE_SIZE);
    const boardY = Math.floor(e.y / SQUARE_SIZE);

    if (!pieceSelected) {
        pieceSelected = [boardX, boardY];
    } else {
        if (!doMove([...pieceSelected, boardX, boardY])) {
            setTimeout(() => {
                doMove(getWorstMove(currentBoardState));
                drawEverything();
            }, 1);
        }
        pieceSelected = undefined;
    }
    drawEverything();
};

const drawEverything = () => {
    drawCurrentBoard();
    drawSelectedPiece();
};
