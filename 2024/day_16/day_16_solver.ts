import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const targetPath = __dirname + '/../data/day_16/t16.txt';
// const targetPath = __dirname + '/../data/day_16/t161.txt';

const maze = fs
    .readFileSync(targetPath)
    .toString()
    .replace(/\r/g, '')
    .trim()
    .split('\n')
    .map((row) => row.split(''));

// always is facing East
const findStart = (maze: string[][]): Point => {
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            if (maze[y][x] === 'S') {
                return { x, y };
            }
        }
    }

    throw new Error('Start not found');
};

const findEnd = (maze: string[][]): Point => {
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            if (maze[y][x] === 'E') {
                return { x, y };
            }
        }
    }

    throw new Error('End not found');
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

    private sort() {
        this.values.sort((a, b) => a.priority - b.priority);
    }

    enqueue(element: any, priority: number) {
        this.values.push({ element, priority });
        this.sort();
    }

    dequeue(): any | undefined {
        return this.values.shift()?.element;
    }

    isEmpty(): boolean {
        return this.values.length === 0;
    }
}

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

const isValidMove = (maze: string[][], point: Point): boolean => {
    return (
        point.x >= 0 &&
        point.x < maze[0].length &&
        point.y >= 0 &&
        point.y < maze.length &&
        maze[point.y][point.x] !== '#'
    );
};

function dijkstra(grid: string[][]): { lowestScoreCost: number; path: Point[] } {
    const start: Point = findStart(grid);
    const end: Point = findEnd(grid);

    const pq = new PriorityQueue();

    pq.enqueue({ point: start, direction: 0, cost: 0, path: [start] }, 0);

    const visited: Set<string> = new Set();

    while (!pq.isEmpty()) {
        const { point, cost, direction, path } = pq.dequeue();

        if (point.x === end.x && point.y === end.y) {
            return { lowestScoreCost: cost, path };
        }

        const pointKey = `${point.x},${point.y},${direction}`;
        if (visited.has(pointKey)) continue;
        visited.add(pointKey);

        const neighbors = getNeighbors(point, direction);

        for (const { point: neighbor, direction: newDirection, scoreCost } of neighbors) {
            if (!isValidMove(grid, neighbor)) continue;

            const newCost = cost + scoreCost;
            pq.enqueue(
                {
                    point: neighbor,
                    direction: newDirection,
                    cost: newCost,
                    path: [...path, neighbor],
                },
                newCost
            );
        }
    }

    return { lowestScoreCost: -69, path: [] };
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

const { lowestScoreCost, path } = dijkstra(maze);
console.log(`Lowest score cost: ${lowestScoreCost}`);

pathString(path, maze);
