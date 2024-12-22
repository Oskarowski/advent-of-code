import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const targetPath = __dirname + '/../data/day_18/t18.txt';

const fallingBytes: [number, number][] = fs
    .readFileSync(targetPath)
    .toString()
    .replace(/\r/g, '')
    .trim()
    .split('\n')
    .map((line) => {
        const [x, y] = line.split(',').map(Number);
        return [x, y];
    });

const puzzleConfig = Object.freeze({
    memorySpaceSize: 7,
    maxBytesToFall: 12,
    start: [0, 0],
    end: [6, 6],
});

const initMemorySpace = (size: number): string[][] => Array.from({ length: size }, () => Array(size).fill('.'));

const fillMemorySpace = (memorySpace: string[][], fallingBytes: [number, number][]): string[][] => {
    let bytesFallen = 0;

    for (const [x, y] of fallingBytes) {
        memorySpace[y][x] = '#';
        bytesFallen++;
        if (bytesFallen === puzzleConfig.maxBytesToFall) break;
    }

    return memorySpace;
};

const memorySpaceFilled = fillMemorySpace(initMemorySpace(puzzleConfig.memorySpaceSize), fallingBytes);

const printMemorySpace = (memorySpace: string[][]): void => memorySpace.forEach((row) => console.log(row.join('')));

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

function getNeighbors(
    point: [number, number],
    direction: number
): { x: number; y: number; cost: number; direction: number }[] {
    const MOVES = [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 0, y: -1 },
    ];

    return MOVES.map((move, index) => {
        return { x: point[0] + move.x, y: point[1] + move.y, cost: 1, direction: index };
    });
}

const isValidMove = (gridSpace: string[][], x: number, y: number): boolean => {
    return x >= 0 && x < gridSpace[0].length && y >= 0 && y < gridSpace.length && gridSpace[y][x] !== '#';
};

function dijkstra(gridSpace: string[][]): { pathScore: number; path: [number, number][] } {
    const { start, end } = puzzleConfig;

    const pq = new PriorityQueue();
    pq.enqueue({ point: start, direction: 0, cost: 0, path: [start] }, 0);

    const gKey = (x: number, y: number, direction: number) => `${x},${y},${direction}`;
    const visited: Set<string> = new Set();

    while (!pq.isEmpty()) {
        const { point, cost, direction, path } = pq.dequeue();

        if (point[0] === end[0] && point[1] === end[1]) {
            return { pathScore: cost, path };
        }

        const nodeKey = gKey(point[0], point[1], direction);
        if (visited.has(nodeKey)) continue;
        visited.add(nodeKey);

        const neighbors = getNeighbors(point, direction);
        for (const { x: nx, y: ny, cost: neighborCost, direction: newDirection } of neighbors) {
            if (!isValidMove(gridSpace, nx, ny)) continue;

            const newCost = cost + neighborCost;
            pq.enqueue(
                {
                    point: [nx, ny],
                    direction: newDirection,
                    cost: newCost,
                    path: [...path, [nx, ny]],
                },
                newCost
            );
        }
    }

    return { pathScore: -1, path: [] };
}

const { pathScore, path } = dijkstra(memorySpaceFilled);

console.log(`Minimum number of steps needed to reach the end: ${pathScore}`);

const mapPathOntoMemorySpace = (memorySpace: string[][], path: [number, number][]): string[][] => {
    const memorySpaceCopy = memorySpace.map((row) => [...row]);
    for (const [x, y] of path) {
        memorySpaceCopy[y][x] = 'O';
    }
    return memorySpaceCopy;
};

const processFallingBytes = (fallingBytes: [number, number][], memorySpace: string[][]): [number, number] => {
    let { pathScore, path } = dijkstra(memorySpace);

    for (const [x, y] of fallingBytes) {
        memorySpace[y][x] = '#';

        if (path.some(([px, py]) => px === x && py === y)) {
            const result = dijkstra(memorySpace);
            pathScore = result.pathScore;
            path = result.path;

            if (pathScore === -1) {
                return [x, y];
            }
        }
    }

    return [-69, -69];
};

console.log(
    `Coordinates of byte which will block the path: ${processFallingBytes(
        fallingBytes,
        initMemorySpace(puzzleConfig.memorySpaceSize)
    )}`
);
