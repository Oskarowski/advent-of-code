import { PuzzleSolver, RunResults } from '../../interfaces/PuzzleSolver.js';
import { logInfo } from '../helpers/ConsoleMessages.js';
import { display } from '../helpers/displayResultsInConsole.js';
import { loadPuzzleFromFile } from '../helpers/loadPuzzleFromFile.js';
import { timeFunction } from '../helpers/timeFunction.js';

type Point = { x: number; y: number };

class PriorityQueue {
    private values: { element: any; priority: number }[] = [];

    // we need to sort each element by priority in our case by lower heat loss value
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

function isWithinGridBounds(point: Point, grid: number[][]): boolean {
    return point.x >= 0 && point.x < grid.length && point.y >= 0 && point.y < grid[0].length;
}

function getHeatLoss(grid: number[][], point: Point): number {
    return grid[point.x][point.y];
}

function getNeighbors(
    point: Point,
    direction: number,
    stepsInSameDirection: number
): { point: Point; direction: number; stepsInSameDirection: number }[] {
    const moves = [
        { x: 1, y: 0 },
        { x: 0, y: 1 }, 
        { x: -1, y: 0 }, 
        { x: 0, y: -1 }, 
    ];

    const neighbors: { point: Point; direction: number; stepsInSameDirection: number }[] = [];

    // If we've moved 3 steps in the same direction, we must turn
    if (stepsInSameDirection < 3) {
        // Continue moving in the same direction
        const nextStraight = {
            x: point.x + moves[direction].x,
            y: point.y + moves[direction].y,
        };
        neighbors.push({ point: nextStraight, direction, stepsInSameDirection: stepsInSameDirection + 1 });
    }

    // Turning left and right
    const leftTurnDir = (direction + 3) % 4;
    const rightTurnDir = (direction + 1) % 4;

    const nextLeft = {
        x: point.x + moves[leftTurnDir].x,
        y: point.y + moves[leftTurnDir].y,
    };
    const nextRight = {
        x: point.x + moves[rightTurnDir].x,
        y: point.y + moves[rightTurnDir].y,
    };

    neighbors.push({ point: nextLeft, direction: leftTurnDir, stepsInSameDirection: 1 });
    neighbors.push({ point: nextRight, direction: rightTurnDir, stepsInSameDirection: 1 });

    return neighbors;
}

function dijkstra(grid: number[][]): { cost: number; path: Point[] } {
    const rows = grid.length;
    const cols = grid[0].length;

    const start: Point = { x: 0, y: 0 };
    const end: Point = { x: rows - 1, y: cols - 1 };

    const pq = new PriorityQueue();

    pq.enqueue({ point: start, direction: 0, cost: 0, path: [start], stepsInSameDirection: 0 }, 0);
    pq.enqueue({ point: start, direction: 1, cost: 0, path: [start], stepsInSameDirection: 0 }, 0);
    pq.enqueue({ point: start, direction: 2, cost: 0, path: [start], stepsInSameDirection: 0 }, 0);
    pq.enqueue({ point: start, direction: 3, cost: 0, path: [start], stepsInSameDirection: 0 }, 0);

    const visited: Set<string> = new Set();

    while (!pq.isEmpty()) {
        const { point, cost, direction, path, stepsInSameDirection } = pq.dequeue();

        if (point.x === end.x && point.y === end.y) {
            return { cost, path };
        }

        const pointKey = `${point.x},${point.y},${direction},${stepsInSameDirection}`;
        if (visited.has(pointKey)) continue;
        visited.add(pointKey);

        const neighbors = getNeighbors(point, direction, stepsInSameDirection);

        for (const {
            point: neighbor,
            direction: newDirection,
            stepsInSameDirection: newStepsInSameDirection,
        } of neighbors) {
            if (!isWithinGridBounds(neighbor, grid)) continue;

            const newCost = cost + getHeatLoss(grid, neighbor);
            pq.enqueue(
                {
                    point: neighbor,
                    direction: newDirection,
                    cost: newCost,
                    path: [...path, neighbor],
                    stepsInSameDirection: newStepsInSameDirection,
                },
                newCost
            );
        }
    }

    return { cost: -1, path: [] };
}

export class Day_17_Solver implements PuzzleSolver {
    inputData: string[];
    parsedData: number[][];
    part1Result: { cost: number; path: Point[] };

    async loadInputData(filename: string = 'day_17'): Promise<void> {
        this.inputData = await loadPuzzleFromFile(17, filename);
    }

    async parseInputData(): Promise<void> {
        this.parsedData = this.inputData.map((line) => line.split('').map((e) => Number(e)));
    }

    pathTostring(path: Point[], grid: number[][]) {
        const visualGrid = grid.map((row) => row.map((value) => value.toString()));

        for (let i = 0; i < path.length - 1; i++) {
            const current = path[i];
            const next = path[i + 1];

            if (next.x > current.x) {
                visualGrid[current.x][current.y] = 'v';
            } else if (next.x < current.x) {
                visualGrid[current.x][current.y] = '^';
            } else if (next.y > current.y) {
                visualGrid[current.x][current.y] = '>';
            } else if (next.y < current.y) {
                visualGrid[current.x][current.y] = '<';
            }
        }

        const lastPosition = path[path.length - 1];
        const startPosition = path[0];
        visualGrid[lastPosition.x][lastPosition.y] = 'E';
        visualGrid[startPosition.x][startPosition.y] = 'S';

        const stringGrid = visualGrid.map((row) => row.join('')).join('\n');
        return stringGrid;
    }

    async solvePart1(): Promise<number> {
        this.part1Result = dijkstra(this.parsedData);
        return this.part1Result.cost;
    }

    async solvePart2(): Promise<any> {
        return -1;
    }

    async run(filename?: string): Promise<RunResults> {
        await this.loadInputData(filename);
        await this.parseInputData();

        const part1Result = await timeFunction(() => this.solvePart1());
        const part2Result = await timeFunction(() => this.solvePart2());

        return {
            part1Result,
            part2Result,
        };
    }
}

(async () => {
    logInfo('Day_17_Solver');
    const day17Solver = new Day_17_Solver();
    // const result = await day17Solver.run('example');
    // console.log(day17Solver.pathTostring(day17Solver.part1Result.path, day17Solver.parsedData));
    const result = await day17Solver.run();
    display(result);
})();
