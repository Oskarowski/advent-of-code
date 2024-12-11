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

const isTrailhead = (point: string): boolean => point === '0';

const getNeighbors = (grid: string[][], point: [number, number]): [number, number][] => {
    const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
    ];

    const neighbors = [];

    for (const [dx, dy] of directions) {
        const [x, y] = point;
        const [nx, ny] = [x + dx, y + dy];

        if (nx >= 0 && nx < grid[0].length && ny >= 0 && ny < grid.length) {
            if (grid[ny][nx] !== '.') {
                if (Number(grid[ny][nx]) - Number(grid[y][x]) === 1) {
                    neighbors.push([nx, ny]);
                }
            }
        }
    }

    return neighbors;
};

const BFSTrail = (grid: string[][], start: [number, number]): number => {
    const visitedPoints = new Set<string>();
    const visitedPicks = new Set<string>();
    const queue = [start];

    while (queue.length > 0) {
        const [x, y] = queue.shift()!;

        const visitedKey = `${x},${y}`;
        if (visitedPoints.has(visitedKey)) {
            continue;
        }
        visitedPoints.add(visitedKey);

        const neighbors = getNeighbors(grid, [x, y]);

        for (const neighbor of neighbors) {
            if (grid[neighbor[1]][neighbor[0]] === '9') {
                const pickVisitedKey = `${neighbor[0]},${neighbor[1]}`;
                visitedPicks.add(pickVisitedKey);
            } else {
                queue.push(neighbor);
            }
        }
    }

    return visitedPicks.size;
};

type TrailheadInfo = {
    trailhead: [number, number];
    score: number;
};

const processTrailheads = (grid: string[][]): TrailheadInfo[] => {
    const trailheadsInfo: TrailheadInfo[] = [];

    for (let y = 0; y < topographicGrid.length; y++) {
        for (let x = 0; x < topographicGrid[0].length; x++) {
            const point = topographicGrid[y][x];

            if (!isTrailhead(point)) {
                continue;
            }

            const score = BFSTrail(topographicGrid, [x, y]);

            trailheadsInfo.push({
                trailhead: [x, y],
                score,
            });
        }
    }

    return trailheadsInfo;
};

const trailheadsInfo = processTrailheads(topographicGrid);

const sumScoreOfTrailheads = (trailheadsInfo: TrailheadInfo[]): number => {
    return trailheadsInfo.reduce((acc, trailheadInfo) => acc + trailheadInfo.score, 0);
};

console.log(`Sum of scores of all trailheads: ${sumScoreOfTrailheads(trailheadsInfo)}`);
