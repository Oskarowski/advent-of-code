import chalk from 'chalk';
import { PuzzleSolver, RunResults } from '../../interfaces/PuzzleSolver.js';
import { loadPuzzleFromFile } from '../helpers/loadPuzzleFromFile.js';

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

    async display(results: RunResults): Promise<void> {
        const formatResult = (
            label: string,
            result: any,
            startTime: number,
            endTime: number
        ) => {
            return (
                `${chalk.cyan(label)} ${chalk.bold.yellow(result)}\n` +
                `${chalk.cyan('Execution time:')} ${chalk.bold.cyanBright(
                    `${endTime - startTime} ms`
                )}`
            );
        };

        // Format and display the results
        console.log(chalk.bold('--- Part 1 Results ---'));
        console.log(
            formatResult(
                'Part 1 Result:',
                results.part1Result,
                results.part1StartTime,
                results.part1EndTime
            )
        );
        console.log(); // as '\n'

        console.log(chalk.bold('--- Part 2 Results ---'));
        console.log(
            formatResult(
                'Part 2 Result:',
                results.part2Result,
                results.part2StartTime,
                results.part2EndTime
            )
        );
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

        const totalCycles = 1000000000
        for (let cycle = 0; cycle < totalCycles; cycle++) {
            // if (cycle % 1000 === 0) {
            //     console.log(`Cycle: ${cycle}`);
            // }
            this.moveAllRocksToNorthEdge();
            this.moveAllRocksToWestEdge();
            this.moveAllRocksToSouthEdge();
            this.moveAllRocksToEastEdge();
        }

        return this.calculateTotalLoadOnNorthBeam();
    }

    async run(): Promise<RunResults> {
        await this.loadInputData();
        await this.parseInputData();

        const part1StartTime = Date.now();
        const part1Result = await this.solvePart1();
        const part1EndTime = Date.now();

        const part2StartTime = Date.now();
        const part2Result = await this.solvePart2();
        const part2EndTime = Date.now();

        return {
            part1Result,
            part1StartTime,
            part1EndTime,
            part2Result,
            part2StartTime,
            part2EndTime,
        };
    }
}

const day14Solver = new Day_14_Solver();
const results = await day14Solver.run();
day14Solver.display(results);
