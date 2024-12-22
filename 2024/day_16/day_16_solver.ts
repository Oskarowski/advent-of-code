import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// const targetPath = __dirname + '/../data/day_16/t16.txt';
const targetPath = __dirname + '/../data/day_16/t161.txt';

const maze = fs
    .readFileSync(targetPath)
    .toString()
    .replace(/\r/g, '')
    .trim()
    .split('\n')
    .map((row) => row.split(''));

const findPosition = (maze: string[][], char: string): Point => {
    for (let y = 0; y < maze.length; y++) {
        const x = maze[y].indexOf(char);
        if (x !== -1) return { x, y };
    }
    throw new Error(`${char} not found`);
};

const MOVES = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 0, y: -1 },
];

type Point = { x: number; y: number };

class PriorityQueue {
    private values: { element: any; priority: number }[] = [];

    enqueue(element: any, priority: number) {
        this.values.push({ element, priority });
        this.values.sort((a, b) => a.priority - b.priority);
    }

    dequeue(): any | undefined {
        return this.values.shift()?.element;
    }

    isEmpty(): boolean {
        return this.values.length === 0;
    }
}

const isValidMove = (maze: string[][], point: Point): boolean => {
    return (
        point.x >= 0 &&
        point.x < maze[0].length &&
        point.y >= 0 &&
        point.y < maze.length &&
        maze[point.y][point.x] !== '#'
    );
};

function getNeighbors(point: Point, direction: number): { point: Point; direction: number; scoreCost: number }[] {
    const neighbors: { point: Point; direction: number; scoreCost: number }[] = [];

    const forward = {
        x: point.x + MOVES[direction].x,
        y: point.y + MOVES[direction].y,
    };
    neighbors.push({ point: forward, direction: direction, scoreCost: 1 });

    const leftDirection = (direction + 3) % 4;
    neighbors.push({ point: { ...point }, direction: leftDirection, scoreCost: 1000 });

    const rightDirection = (direction + 1) % 4;
    neighbors.push({ point: { ...point }, direction: rightDirection, scoreCost: 1000 });

    return neighbors;
}

function pathfinder(grid: string[][]): any {
    const start: Point = findPosition(grid, 'S');
    const end: Point = findPosition(grid, 'E');

    const pq = new PriorityQueue();
    const lowestCost: Map<string, number> = new Map();
    const backtrack: Map<string, { point: Point; direction: number }[]> = new Map();

    const gKey = (x: number, y: number, direction: number) => `${x},${y},${direction}`;

    pq.enqueue({ point: start, direction: 0, cost: 0 }, 0);

    while (!pq.isEmpty()) {
        const { point, cost, direction } = pq.dequeue();

        const neighbors = getNeighbors(point, direction);

        for (const { point: neighbor, direction: neighborDirection, scoreCost } of neighbors) {
            if (!isValidMove(grid, neighbor)) continue;

            const newCost = cost + scoreCost;
            const neighborKey = gKey(neighbor.x, neighbor.y, neighborDirection);
            const neighborCost = lowestCost.get(neighborKey) ?? Infinity;

            if (newCost < neighborCost) {
                lowestCost.set(neighborKey, newCost);
                backtrack.set(neighborKey, [{ point, direction }]);

                pq.enqueue(
                    {
                        point: neighbor,
                        direction: neighborDirection,
                        cost: newCost,
                    },
                    newCost
                );
            }

            if (newCost === neighborCost) {
                if (backtrack.has(neighborKey)) {
                    backtrack.get(neighborKey)?.push({ point, direction });
                } else {
                    backtrack.set(neighborKey, [{ point, direction }]);
                }
            }
        }
    }

    const reconstruct = (
        key: string,
        path: Point[],
        paths: { path: Point[]; direction: number; cost: number }[],
        endDirection: number,
        endCost: number
    ) => {
        const [x, y, dir] = key.split(',').map(Number);
        path.unshift({ x, y });

        if (
            key === gKey(start.x, start.y, 0) ||
            key === gKey(start.x, start.y, 1) ||
            key === gKey(start.x, start.y, 2) ||
            key === gKey(start.x, start.y, 3)
        ) {
            paths.push({
                path: [...path],
                direction: endDirection,
                cost: endCost,
            });
            return;
        }

        const parents = backtrack.get(key) ?? [];
        for (const parent of parents) {
            reconstruct(gKey(parent.point.x, parent.point.y, parent.direction), path, paths, endDirection, endCost);
        }

        path.shift();
    };

    const reconstructedPathsForEnds: { path: Point[]; direction: number; cost: number }[] = [];

    for (let endDirection = 0; endDirection < 4; endDirection++) {
        const possibleEndKey = gKey(end.x, end.y, endDirection);
        if (!backtrack.has(possibleEndKey)) continue;

        const paths: { path: Point[]; direction: number; cost: number }[] = [];
        const endCost = lowestCost.get(possibleEndKey) ?? Infinity;
        reconstruct(possibleEndKey, [], paths, endDirection, endCost);

        reconstructedPathsForEnds.push(...paths);
    }

    return reconstructedPathsForEnds;
}

const result = pathfinder(maze);

const combineOptimalPaths = (
    maze: string[][],
    paths: { path: Point[]; direction: number }[],
    cost: number
): { totalTiles: number; cost: number; pathStringified: string } => {
    const mazeCopy = maze.map((row) => row.map((value) => value.toString()));

    let totalTiles = 0;
    for (const { path } of paths) {
        for (const point of path) {
            if (mazeCopy[point.y][point.x] !== 'O') {
                mazeCopy[point.y][point.x] = 'O';
                totalTiles++;
            }
        }
    }

    return {
        totalTiles,
        cost,
        pathStringified: mazeCopy.map((row) => row.join('')).join('\n'),
    };
};

if (result) {
    let lowestCost = result.reduce((acc: number, { cost }) => {
        return Math.min(acc, cost);
    }, Infinity);

    console.log(`Lowest cost across all paths: ${lowestCost}`);

    const lowestCostPaths = result.filter(({ cost }) => cost === lowestCost);

    const { totalTiles, cost, pathStringified } = combineOptimalPaths(maze, lowestCostPaths, lowestCost);

    console.log(`Total tiles: ${totalTiles}`);
    console.log(`Cost: ${cost}`);
    console.log(pathStringified);
}
