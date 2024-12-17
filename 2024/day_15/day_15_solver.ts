import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const targetPath = __dirname + '/../data/day_15/t15.txt';

const [inputMap, inputRobotMoves] = fs.readFileSync(targetPath).toString().replace(/\r/g, '').trim().split('\n\n');

const warehouseGrid = inputMap.split('\n').map((row) => row.split(''));
const robotMoves = inputRobotMoves
    .split('\n')
    .map((row) => row.split(''))
    .flat();

const printGrid = (grid) => {
    console.log('-------------------');
    grid.forEach((row) => console.log(row.join('')));
};

const findRobot = (grid): [number, number] => {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === '@') {
                return [x, y];
            }
        }
    }

    throw new Error('Robot not found');
};

const robotMovesMapping = {
    '^': ([x, y]) => [x, y - 1],
    v: ([x, y]) => [x, y + 1],
    '<': ([x, y]) => [x - 1, y],
    '>': ([x, y]) => [x + 1, y],
};

const isInBounds = (x, y, grid) => y >= 0 && y < grid.length && x >= 0 && x < grid[0].length;

const computeWarehouseMap = (warehouseGrid: string[][], robotMoves: string[]): string[][] => {
    const newGrid = warehouseGrid.map((row) => [...row]);
    let [x, y] = findRobot(warehouseGrid);

    for (const move of robotMoves) {
        let [newX, newY] = robotMovesMapping[move]([x, y]);

        if (!isInBounds(newX, newY, warehouseGrid)) {
            continue;
        }

        const targetCell = newGrid[newY][newX];

        if (targetCell === '#') {
            continue;
        }

        if (targetCell === '.') {
            newGrid[newY][newX] = '@';
            newGrid[y][x] = '.';
            [x, y] = [newX, newY];
            continue;
        }

        if (targetCell === 'O') {
            let [boxX, boxY] = [newX, newY];
            let boxesToMove = [];

            while (true) {
                if (newGrid[boxY][boxX] === 'O') {
                    boxesToMove.push([boxX, boxY]);
                }

                let [nextBoxX, nextBoxY] = robotMovesMapping[move]([boxX, boxY]);

                if (!isInBounds(nextBoxX, nextBoxY, newGrid) || newGrid[nextBoxY][nextBoxX] === '#') {
                    boxesToMove = [];
                    break;
                }

                if (newGrid[nextBoxY][nextBoxX] === '.') {
                    break;
                }

                [boxX, boxY] = [nextBoxX, nextBoxY];
            }

            if (boxesToMove.length === 0) continue;

            for (const [boxX, boxY] of boxesToMove) {
                let [newBoxX, newBoxY] = robotMovesMapping[move]([boxX, boxY]);

                newGrid[newBoxY][newBoxX] = 'O';
            }

            newGrid[newY][newX] = '@';
            newGrid[y][x] = '.';
            [x, y] = [newX, newY];
        }
    }

    return newGrid;
};

const warehouseAfterRobotMoves = computeWarehouseMap(warehouseGrid, robotMoves);

const computeSumOfBoxesGPS = (warehouseGrid: string[][]): number => {
    let sum = 0;

    for (let y = 0; y < warehouseGrid.length; y++) {
        for (let x = 0; x < warehouseGrid[y].length; x++) {
            if (warehouseGrid[y][x] === 'O') {
                sum += y * 100 + x;
            }
        }
    }

    return sum;
}

console.log(`Sum of boxes GPS: ${computeSumOfBoxesGPS(warehouseAfterRobotMoves)}`);

