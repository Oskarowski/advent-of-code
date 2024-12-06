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
                return [x, y];
            }
        }
    }

    throw new Error('Cannot start simulation: Guard starting point is missing.');
};

const [startX, startY] = findGuardStartingPoint();

const isWithinBounds = (x: number, y: number): boolean => {
    return x >= 0 && x < laboratoryGridWidth && y >= 0 && y < laboratoryGridHeight;
};

const isValidSpace = (grid: string[][], x: number, y: number): boolean => {
    return isWithinBounds(x, y) && grid[y][x] !== '#';
};

const guardMovesPattern = [
    [0, -1], // up
    [1, 0], // first turn right
    [0, 1], // second turn right
    [-1, 0], // third turn right
];

const determineGuardPatrolPath = (grid: string[][], startX: number, startY: number): number[][] => {
    let tuttoFinito = false;
    let guardDirection = 0;
    const guardPath = new Map<string, number>();
    let [guardX, guardY] = [startX, startY];

    while (!tuttoFinito) {
        let [dx, dy] = guardMovesPattern[guardDirection];
        let [nextDX, nextDY] = guardMovesPattern[(guardDirection + 1) % 4];

        const positionKey = `${guardY},${guardX}`;
        guardPath.set(positionKey, (guardPath.get(positionKey) || 0) + 1);

        if (isValidSpace(grid, guardX + dx, guardY + dy)) {
            guardX += dx;
            guardY += dy;
        } else if (isValidSpace(grid, guardX + nextDX, guardY + nextDY)) {
            guardDirection = (guardDirection + 1) % 4;
            guardX += nextDX;
            guardY += nextDY;
        } else {
            tuttoFinito = true;
        }
    }

    return Array.from(guardPath.keys()).map((key) => key.split(',').map(Number).reverse());
};

const guardPath = determineGuardPatrolPath(laboratoryGrid, startX, startY);
console.log(`Distinct visited tiles by guard: ${guardPath.length}`);

// Part 2
const simulateGuardMovement = (grid: string[][], startX: number, startY: number): boolean => {
    const visitedStates = new Set<string>();
    let [guardX, guardY] = [startX, startY];
    let guardDirection = 0;

    while (true) {
        const [dx, dy] = guardMovesPattern[guardDirection];
        const [nextX, nextY] = [guardX + dx, guardY + dy];

        if (isWithinBounds(nextX, nextY)) {
            if (grid[nextY][nextX] === '#' || grid[nextY][nextX] === 'O') {
                guardDirection = (guardDirection + 1) % 4;
            } else {
                guardX = nextX;
                guardY = nextY;
            }
        } else {
            return false;
        }

        const state = `${guardX},${guardY},${guardDirection}`;
        if (visitedStates.has(state)) {
            return true;
        }

        visitedStates.add(state);
    }
};

const countObstructionPositions = (grid: string[][], startX: number, startY: number): number => {
    let validObstructionCount = 0;

    for (const [x, y] of guardPath) {
        grid[y][x] = 'O';

        if (simulateGuardMovement(grid, startX, startY)) {
            validObstructionCount++;
        }

        grid[y][x] = '.';
    }

    return validObstructionCount;
};

const obstructionPositions = countObstructionPositions(laboratoryGrid, startX, startY);
console.log(`Number of valid obstruction positions: ${obstructionPositions}`);
