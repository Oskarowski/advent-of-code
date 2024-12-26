import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const targetPath = __dirname + '/../data/day_20/t20.txt';

const raceGrid = fs
    .readFileSync(targetPath)
    .toString()
    .replace(/\r/g, '')
    .trim()
    .split('\n')
    .map((row) => row.split(''));

const findPosition = (grid: string[][], field: 'S' | 'E'): [number, number] => {
    for (let y = 0; y < grid.length; y++) {
        const x = grid[y].indexOf(field);
        if (x !== -1) {
            return [x, y];
        }
    }

    throw new Error(`${field} not found`);
};

const getProperRacePath = (grid: string[][]): { path: [number, number][]; distanceGrid: number[][] } => {
    const [startX, startY] = findPosition(grid, 'S');
    const [endX, endY] = findPosition(grid, 'E');

    const visited = new Set<string>();

    const getKey = (x: number, y: number): string => `${x},${y}`;
    const isVisited = (x: number, y: number): boolean => visited.has(getKey(x, y));
    const markVisited = (x: number, y: number) => visited.add(getKey(x, y));

    const isValidField = (x: number, y: number): boolean => {
        return x >= 0 && x < grid[0].length && y >= 0 && y < grid.length && grid[y][x] !== '#';
    };

    const getNeighbors = (x: number, y: number): [number, number][] => {
        return [
            [x, y - 1],
            [x, y + 1],
            [x - 1, y],
            [x + 1, y],
        ];
    };

    const distanceGrid = grid.map((row) => row.map(() => -1));

    const queue: { x: number; y: number; path: [number, number][]; distance: number }[] = [
        { x: startX, y: startY, path: [[startX, startY]], distance: 0 },
    ];

    while (queue.length > 0) {
        const { x: cx, y: cy, path: cPath, distance: cDistance } = queue.shift()!;

        distanceGrid[cy][cx] = cDistance;

        if (cx === endX && cy === endY) {
            return { path: cPath, distanceGrid };
        }

        if (isVisited(cx, cy)) continue;
        markVisited(cx, cy);

        for (const [nx, ny] of getNeighbors(cx, cy)) {
            if (isValidField(nx, ny) && !isVisited(nx, ny)) {
                queue.push({ x: nx, y: ny, path: [...cPath, [nx, ny]], distance: cDistance + 1 });
            }
        }
    }

    throw new Error('No path found');
};

const { path, distanceGrid } = getProperRacePath(raceGrid);

const computeNumberOfCheats = (grid: number[][], desiredTimeSaved: number): number => {
    let cheatPathCount = 0;

    const getNeighbors = (x: number, y: number): [number, number][] => {
        return [
            [x, y - 2],
            [x + 1, y - 1],
            [x + 2, y],
            [x + 1, y + 1],
            [x, y + 2],
            [x - 1, y + 1],
            [x - 2, y],
            [x - 1, y - 1],
        ];
    };

    const isValidField = (x: number, y: number): boolean => {
        return x >= 0 && x < grid[0].length && y >= 0 && y < grid.length && grid[y][x] !== -1;
    };

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            if (grid[y][x] === -1) continue;

            for (const [nx, ny] of getNeighbors(x, y)) {
                if (isValidField(nx, ny)) {
                    const timeSaved = grid[ny][nx] - grid[y][x];

                    if (timeSaved >= desiredTimeSaved + 2) {
                        cheatPathCount++;
                    }
                }
            }
        }
    }

    return cheatPathCount;
};

const printPath = (grid: string[][], path: [number, number][]): void => {
    const pathGrid = grid.map((row) => [...row]);
    for (const [x, y] of path) {
        if (pathGrid[y][x] !== 'S' && pathGrid[y][x] !== 'E') {
            pathGrid[y][x] = '/';
        }
    }
    console.log(pathGrid.map((row) => row.join('')).join('\n'));
};

// console.log(distanceGrid.map((row) => row.join(' ')).join('\n'));
// printPath(raceGrid, path);

const desiredTimeSaved = 100;
console.log(
    `Number of cheats: ${computeNumberOfCheats(
        distanceGrid,
        desiredTimeSaved
    )} for desired time saved: ${desiredTimeSaved}`
);
