import { PuzzleSolver, RunResults } from '../../interfaces/PuzzleSolver.js';
import { display } from '../helpers/displayResultsInConsole.js';
import { loadPuzzleFromFile } from '../helpers/loadPuzzleFromFile.js';
import { timeFunction } from '../helpers/timeFunction.js';

type Grid = string[][];

class Day_14_Solver implements PuzzleSolver {
    inputData: string[];
    parsedData: Grid;

    canMoveUp(grid: Grid, row: number, col: number): boolean {
        return row > 0 && grid[row - 1][col] === '.';
    }

    moveRockUp(grid: Grid, row: number, col: number): boolean {
        if (!this.canMoveUp(grid, row, col)) {
            return false;
        }

        grid[row][col] = '.';
        grid[row - 1][col] = 'O';

        return true;
    }

    moveAllRocksToNorthEdge(): void {
        let grid = this.parsedData;
        let moved = false;
        do {
            moved = false;
            for (let row = grid.length - 1; row >= 0; row--) {
                for (let col = 0; col < grid[row].length; col++) {
                    if (grid[row][col] === 'O') {
                        if (this.moveRockUp(grid, row, col)) {
                            moved = true;
                        }
                    }
                }
            }
        } while (moved);
    }

    canMoveRight(grid: Grid, row: number, col: number): boolean {
        return col < grid[row].length - 1 && grid[row][col + 1] === '.';
    }

    moveRockRight(grid: Grid, row: number, col: number): boolean {
        if (!this.canMoveRight(grid, row, col)) {
            return false;
        }

        grid[row][col] = '.';
        grid[row][col + 1] = 'O';

        return true;
    }

    moveAllRocksToEastEdge(): void {
        let grid = this.parsedData;
        let moved = false;
        do {
            moved = false;
            for (let row = 0; row < grid.length; row++) {
                for (let col = 0; col < grid[row].length; col++) {
                    if (grid[row][col] === 'O') {
                        if (this.moveRockRight(grid, row, col)) {
                            moved = true;
                        }
                    }
                }
            }
        } while (moved);
    }

    canMoveLeft(grid: Grid, row: number, col: number): boolean {
        return col > 0 && grid[row][col - 1] === '.';
    }

    moveRockLeft(grid: Grid, row: number, col: number): boolean {
        if (!this.canMoveLeft(grid, row, col)) {
            return false;
        }

        grid[row][col] = '.';
        grid[row][col - 1] = 'O';

        return true;
    }

    moveAllRocksToWestEdge(): void {
        let grid = this.parsedData;
        let moved = false;
        do {
            moved = false;
            for (let row = 0; row < grid.length; row++) {
                for (let col = grid[row].length - 1; col >= 0; col--) {
                    if (grid[row][col] === 'O') {
                        if (this.moveRockLeft(grid, row, col)) {
                            moved = true;
                        }
                    }
                }
            }
        } while (moved);
    }

    canMoveDown(grid: Grid, row: number, col: number): boolean {
        return row < grid.length - 1 && grid[row + 1][col] === '.';
    }

    moveRockDown(grid: Grid, row: number, col: number): boolean {
        if (!this.canMoveDown(grid, row, col)) {
            return false;
        }

        grid[row][col] = '.';
        grid[row + 1][col] = 'O';

        return true;
    }

    moveAllRocksToSouthEdge(): void {
        let grid = this.parsedData;
        let moved = false;
        do {
            moved = false;
            for (let row = 0; row < grid.length; row++) {
                for (let col = 0; col < grid[row].length; col++) {
                    if (grid[row][col] === 'O') {
                        if (this.moveRockDown(grid, row, col)) {
                            moved = true;
                        }
                    }
                }
            }
        } while (moved);
    }

    calculateTotalLoadOnNorthBeam(): number {
        let totalDamage = 0;
        const amountOfRows = this.parsedData.length;
        this.parsedData.forEach((row, whichRow) => {
            row.forEach((tile) => {
                if (tile === 'O') {
                    totalDamage += amountOfRows - whichRow;
                }
            });
        });

        return totalDamage;
    }

    async loadInputData(): Promise<void> {
        this.inputData = await loadPuzzleFromFile(14, 'day_14');
    }

    async parseInputData(): Promise<void> {
        if (!this.inputData || this.inputData.length === 0) {
            throw new Error('Input data is not loaded or empty');
        }

        this.parsedData = this.inputData.map((row) => row.split(''));
    }

    async solvePart1(): Promise<number> {
        this.moveAllRocksToNorthEdge();
        return this.calculateTotalLoadOnNorthBeam();
    }

    async solvePart2(): Promise<any> {
        const cache = new Map();

        const totalCycles = 1000000000;

        for (let cycle = 0; cycle < totalCycles; cycle++) {
            for (let direction = 0; direction < 4; direction++) {
                const platformState = this.parsedData.map((row) => row.join('')).join('\n');

                const cacheKey = `${platformState}-${direction}`;

                if (cache.has(cacheKey)) {
                    const [firstCycle, firstDirection] = cache.get(cacheKey);
                    const cycleDifference = cycle - firstCycle;

                    const whenRepeats = (totalCycles - cycle) / cycleDifference;
                    if (Number.isInteger(whenRepeats)) {
                        return this.calculateTotalLoadOnNorthBeam();
                    }
                } else {
                    cache.set(cacheKey, [cycle, direction]);
                }

                switch (direction) {
                    case 0:
                        this.moveAllRocksToNorthEdge();
                        break;
                    case 1:
                        this.moveAllRocksToWestEdge();
                        break;
                    case 2:
                        this.moveAllRocksToSouthEdge();
                        break;
                    case 3:
                        this.moveAllRocksToEastEdge();
                        break;
                }
            }
        }

        throw new Error('Could not find a repeating pattern');
    }

    async run(): Promise<RunResults> {
        await this.loadInputData();
        await this.parseInputData();

        const part1Result = await timeFunction(() => this.solvePart1());

        await this.parseInputData();
        const part2Result = await timeFunction(() => this.solvePart2());

        return {
            part1Result,
            part2Result,
        };
    }
}

const day14Solver = new Day_14_Solver();
const results = await day14Solver.run();
display(results);
