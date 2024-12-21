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

function dijkstra(grid: string[][]): any {
    const start: Point = findPosition(grid, 'S');
    const end: Point = findPosition(grid, 'E');

    const pq = new PriorityQueue();
    const visited: Set<string> = new Set();
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

    const endKey = gKey(end.x, end.y, 3);
    if (!backtrack.has(endKey)) return null;

    const paths: Point[][] = [];
    const reconstruct = (key: string, path: Point[]) => {
        const [x, y, dir] = key.split(',').map(Number);
        path.unshift({ x, y });

        if (
            key === gKey(start.x, start.y, 0) ||
            key === gKey(start.x, start.y, 1) ||
            key === gKey(start.x, start.y, 2) ||
            key === gKey(start.x, start.y, 3)
        ) {
            paths.push([...path]);
            return;
        }

        const parents = backtrack.get(key) ?? [];
        for (const parent of parents) {
            reconstruct(gKey(parent.point.x, parent.point.y, parent.direction), path);
        }
        path.shift();
    };

    reconstruct(endKey, []);

    return { scoreCost: lowestCost.get(endKey)!, paths };
}

const pathString = (path: Point[], maze: string[][]) => {
    const visualGrid = maze.map((row) => row.map((value) => value.toString()));

    for (const point of path) {
        visualGrid[point.y][point.x] = '/';
    }

    const lastPosition = path[0];
    const startPosition = path[path.length - 1];
    visualGrid[lastPosition.x][lastPosition.y] = 'E';
    visualGrid[startPosition.x][startPosition.y] = 'S';

    const stringGrid = visualGrid.map((row) => row.join('')).join('\n');
    console.log(stringGrid);
};

const result = dijkstra(maze);

if (result) {
    console.log(`Shortest path cost: ${result.scoreCost}`);
    console.log(`Number of paths: ${result.paths.length}`);

    for (let i = 0; i < result.paths.length; i++) {
        console.log(`Path ${i + 1}`);
        pathString(result.paths[i], maze);
    }
}
