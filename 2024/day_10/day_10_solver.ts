import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const targetPath = __dirname + '/../data/day_10/t10.txt';

const topographicGrid = fs
    .readFileSync(targetPath)
    .toString()
    .replace(/\r/g, '')
    .trim()
    .split('\n')
    .map((line) => line.split(''));

const DIRECTIONS = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
];

const isTrailhead = (point: string): boolean => point === '0';

const getNeighbors = (grid: string[][], x: number, y: number): [number, number][] => {
    return DIRECTIONS.map(([dx, dy]): [number, number] => [x + dx, y + dy]).filter(
        ([nx, ny]) =>
            nx >= 0 &&
            nx < grid[0].length &&
            ny >= 0 &&
            ny < grid.length &&
            grid[ny][nx] !== '.' &&
            Number(grid[ny][nx]) - Number(grid[y][x]) === 1
    );
};

const calculateTrailheadMetrics = (
    grid: string[][],
    trailhead: [number, number]
): { score: number; rating: number } => {
    const foundNines = new Set<string>();
    let score = 0;
    let rating = 0;
    const queue: [number, number][] = [trailhead];

    while (queue.length > 0) {
        const [x, y] = queue.pop();
        const key = `${x},${y}`;

        for (const [nx, ny] of getNeighbors(grid, x, y)) {
            const neighborKey = `${nx},${ny}`;
            if (grid[ny][nx] === '9') {
                if (!foundNines.has(neighborKey)) {
                    foundNines.add(neighborKey);
                    score++;
                }
                rating++;
            } else {
                queue.push([nx, ny]);
            }
        }
    }

    return { score, rating };
};

type TrailheadInfo = {
    trailhead: [number, number];
    score: number;
    rating: number;
};

const processTrailheads = (grid: string[][]): TrailheadInfo[] => {
    const trailheadsInfo: TrailheadInfo[] = [];

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            if (!isTrailhead(grid[y][x])) {
                continue;
            }

            const { score, rating } = calculateTrailheadMetrics(grid, [x, y]);

            trailheadsInfo.push({
                trailhead: [x, y],
                score,
                rating: rating,
            });
        }
    }

    return trailheadsInfo;
};

const sumTrailheadProperty = (trailheadsInfo: TrailheadInfo[], property: 'score' | 'rating'): number => {
    return trailheadsInfo.reduce((acc, info) => acc + info[property], 0);
};

const trailheadsInfo = processTrailheads(topographicGrid);

console.log(`Sum of scores of all trailheads: ${sumTrailheadProperty(trailheadsInfo, 'score')}`);
console.log(`Sum of ratings of all trailheads: ${sumTrailheadProperty(trailheadsInfo, 'rating')}`);
