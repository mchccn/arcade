import { Command } from "@aeroware/aeroclient/dist/types";
import Canvas from "canvas";

type player = {
    pos: {
        x: number,
        y: number
    },
    matrix: number[][] | null,
    score: number
}

type pieces = "I" | "L" | "J" | "O" | "Z" | "S" | "T"

export default {
    name: "tetris",
    callback() {

        const canvas = Canvas.createCanvas(0, 0); // we have to make this
        const context = canvas.getContext('2d');
        let displayScore: number = 0;

context.scale(20, 20);

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length -1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score += rowCount * 10;
        rowCount *= 2;
    }
}

/*
const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0,
};
*/
function collide(arena: number[][], player: player) {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < (m as number[][]).length; ++y) {
        for (let x = 0; x < (m as number[][])[y].length; ++x) {
            if (m && m[y][x] !== 0 &&
               (arena[y + o.y] &&
                arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function createMatrix(w: number, h: number) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function createPiece(type: pieces): number[][] | undefined
{
    if (type === 'I') {
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];
    } else if (type === 'L') {
        return [
            [0, 2, 0],
            [0, 2, 0],
            [0, 2, 2],
        ];
    } else if (type === 'J') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [3, 3, 0],
        ];
    } else if (type === 'O') {
        return [
            [4, 4],
            [4, 4],
        ];
    } else if (type === 'Z') {
        return [
            [5, 5, 0],
            [0, 5, 5],
            [0, 0, 0],
        ];
    } else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (type === 'T') {
        return [
            [0, 7, 0],
            [7, 7, 7],
            [0, 0, 0],
        ];
    }
    return undefined
}

function drawMatrix(matrix: number[][] | null, offset: { x: number, y: number }) {
    matrix?.forEach((row: number[], y: number) => {
        row.forEach((value: number, x: number) => {
            if (value !== 0) {
                (context.fillStyle as string | null) = colors[value];
                context.fillRect(x + offset.x,
                                 y + offset.y,
                                 1, 1);
            }
        });
    });
}

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}

function merge(arena: number[][], player: player) {
    player.matrix?.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function rotate(matrix: number[][] | null, dir: number) {
    for (let y = 0; y < (matrix as number[][]).length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                (matrix as number[][])[x][y],
                (matrix as number[][])[y][x],
            ] = [
                (matrix as number[][])[y][x],
                (matrix as number[][])[x][y],
            ];
        }
    }

    if (dir > 0) {
        (matrix as number[][]).forEach(row => row.reverse());
    } else {
        (matrix as number[][]).reverse();
    }
}

function playerPlace() {
	while (!collide(arena, player)) {
		player.pos.y++;
	}

	player.pos.y--;

	dropCounter = 1000;
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

function playerMove(offset: number) {
    player.pos.x += offset;
    if (collide(arena, player)) {
        player.pos.x -= offset;
    }
}

function playerReset() {
    const pieces = 'TJLOSZI';
    (player.matrix as player["matrix"] | undefined) = createPiece(pieces[pieces.length * Math.random() | 0] as pieces);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) -
                   (player.matrix?[0].length / 2 : 0);
    if (collide(arena, player)) {
        arena.forEach((row: number[]) => row.fill(0));
        player.score = 0;
        updateScore();
    }
}

function playerRotate(dir: number) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        const matrix: number[][] | null = player.matrix
        if (offset > ((matrix as number[][])[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

let dropCounter = 0;
const dropInterval = 1000;

let lastTime = 0;
function update(time = 0) {
    const deltaTime = time - lastTime;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }

    lastTime = time;

    draw();
    requestAnimationFrame(update);
}

function updateScore() {
    displayScore = player.score;
}

document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
        playerMove(-1);
    } else if (event.keyCode === 39) {
        playerMove(1);
    } else if (event.keyCode === 40) {
        playerDrop();
    } else if (event.keyCode === 38) {
		playerPlace();
	} else if (event.keyCode === 81) {
        playerRotate(-1);
    } else if (event.keyCode === 87) {
        playerRotate(1);
    }
});

const colors = [
    null,
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF',
];

const arena = createMatrix(12, 20);

const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0,
};

playerReset();
updateScore();
update();

    }
} as Command