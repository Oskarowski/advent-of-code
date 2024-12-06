import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const targetPath = __dirname + '/../data/day_06/t06.txt';

const puzzleInput = fs.readFileSync(targetPath).toString().replace(/\r/g, '').trim().split('\n');

const laboratoryGrid = puzzleInput.map((line) => line.split(''));
const laboratoryGridHeight = laboratoryGrid.length;
const laboratoryGridWidth = laboratoryGrid[0].length;

// based on puzzle input we can assume gourd always attempt to go up, so we don't need to worry about the direction (for now)
const findGuardStartingPoint = (): [number, number] => {
    for (let y = 0; y < laboratoryGridHeight; y++) {
        for (let x = 0; x < laboratoryGridWidth; x++) {
            if (laboratoryGrid[y][x] === '^') {
                console.log(`Guard starting point: [${x}, ${y}]`);
                return [x, y];
            }
        }
    }

    throw new Error('Cannot start simulation: Guard starting point is missing.');
};

const inLaboratoryBounds = (x: number, y: number): boolean => {
    return x >= 0 && x < laboratoryGridWidth && y >= 0 && y < laboratoryGridHeight;
};

const isValidSpace = (x: number, y: number): boolean => {
    return inLaboratoryBounds(x, y) && laboratoryGrid[y][x] !== '#';
};

const guardMovesPattern = [
    [0, -1], // up
    [1, 0], // first turn right
    [0, 1], // second turn right
    [-1, 0], // third turn right
];

let [guardColumn, guardRow] = findGuardStartingPoint();

// Marks if there is any possibility for the guard to move
let tuttoFinito = false;
let guardMovesPatternIndex = 0;
const guardPath = new Map<string, number>();
do {
    let [dx, dy] = guardMovesPattern[guardMovesPatternIndex];
    let [dxr, dyr] = guardMovesPattern[(guardMovesPatternIndex + 1) % 4];

    guardPath.set(`${guardColumn},${guardRow}`, (guardPath.get(`${guardColumn},${guardRow}`) || 0) + 1);

    if (isValidSpace(guardColumn + dx, guardRow + dy)) {
        guardColumn += dx;
        guardRow += dy;
    } else if (isValidSpace(guardColumn + dxr, guardRow + dyr)) {
        guardMovesPatternIndex = (guardMovesPatternIndex + 1) % 4;
        guardColumn += dxr;
        guardRow += dyr;
    } else {
        tuttoFinito = true;
        console.log(`Guard is stuck at [${guardColumn}, ${guardRow}], with pattern index ${guardMovesPatternIndex}`);
    }
} while (!tuttoFinito);

const pathIterator = guardPath.entries();

for (const [key, value] of pathIterator) {
    const [x, y] = key.split(',').map(Number);
    laboratoryGrid[y][x] = 'X';
}

const laboratoryMap = laboratoryGrid.map((line) => line.join('')).join('\n');
console.log(`Unique guard path length: ${guardPath.size}`);
