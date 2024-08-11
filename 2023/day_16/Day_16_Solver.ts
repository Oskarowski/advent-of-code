import { PuzzleSolver, RunResults } from '../../interfaces/PuzzleSolver';
import { logInfo } from '../helpers/ConsoleMessages.js';
import { display } from '../helpers/displayResultsInConsole.js';
import { loadPuzzleFromFile } from '../helpers/loadPuzzleFromFile.js';
import { timeFunction } from '../helpers/timeFunction.js';

export class Day_16_Solver implements PuzzleSolver {
    inputData: string[];
    parsedData: string[][];
    maxCol: number;
    maxRow: number;

    async loadInputData(filename: string = 'day_16'): Promise<void> {
        this.inputData = await loadPuzzleFromFile(16, filename);
    }

    async parseInputData(): Promise<void> {
        this.parsedData = this.inputData.map((line) => line.split(''));

        this.maxRow = this.parsedData.length;
        this.maxCol = this.parsedData[0].length;
    }

    visitedTiles = new Map();
    pathTiles = new Map();

    traverseHorizontal(row: number, col: number, direction: string) {
        const pathKey = `${row}-${col}-${direction}`;
        // console.log(`\ntraverseHorizontal-${pathKey}`);

        if (this.pathTiles.has(pathKey)) {
            return;
        }

        this.pathTiles.set(pathKey, true);

        let index = col;
        const increment = direction === 'right' ? 1 : -1;
        const boundaryCheck =
            direction === 'right' ? (i: number) => i < this.maxCol : (i: number) => i >= 0;

        while (boundaryCheck(index)) {
            const char = this.parsedData[row][index];
            // console.log(`char-${char}`);
            const visitedKey = `${row}-${index}`;

            if (!this.visitedTiles.has(visitedKey)) {
                this.visitedTiles.set(visitedKey, true);
            }

            if (this.bounceBeam(char, direction, row, index)) {
                break;
            }

            index += increment;
        }
    }

    traverseVertical(row: number, col: number, direction: string) {
        const pathKey = `${row}-${col}-${direction}`;
        // console.log(`\ntraverseVertical-${pathKey}`);

        if (this.pathTiles.has(pathKey)) {
            return;
        }

        this.pathTiles.set(pathKey, true);

        let index = row;
        const increment = direction === 'down' ? 1 : -1;
        const boundaryCheck =
            direction === 'down' ? (i: number) => i < this.maxRow : (i: number) => i >= 0;

        while (boundaryCheck(index)) {
            const char = this.parsedData[index][col];
            // console.log(`char-${char}`);

            const visitedKey = `${index}-${col}`;

            if (!this.visitedTiles.has(visitedKey)) {
                this.visitedTiles.set(visitedKey, true);
            }

            if (this.bounceBeam(char, direction, index, col)) {
                break;
            }

            index += increment;
        }
    }

    bounceBeam(char: string, direction: string, row: number, col: number) {
        if (char === '|' && (direction === 'right' || direction === 'left')) {
            this.traverseVertical(row - 1, col, 'up');
            this.traverseVertical(row + 1, col, 'down');
            return true;
        }

        if (char === '-' && (direction === 'up' || direction === 'down')) {
            this.traverseHorizontal(row, col - 1, 'left');
            this.traverseHorizontal(row, col + 1, 'right');
            return true;
        }

        if (char === '/' && direction === 'left') {
            this.traverseVertical(row + 1, col, 'down');
            return true;
        }

        if (char === '\\' && direction === 'left') {
            this.traverseVertical(row - 1, col, 'up');
            return true;
        }

        if (char === '/' && direction === 'right') {
            this.traverseVertical(row - 1, col, 'up');
            return true;
        }

        if (char === '\\' && direction === 'right') {
            this.traverseVertical(row + 1, col, 'down');
            return true;
        }

        if (char === '/' && direction === 'up') {
            this.traverseHorizontal(row, col + 1, 'right');
            return true;
        }

        if (char === '\\' && direction === 'up') {
            this.traverseHorizontal(row, col - 1, 'left');
            return true;
        }

        if (char === '/' && direction === 'down') {
            this.traverseHorizontal(row, col - 1, 'left');
            return true;
        }

        if (char === '\\' && direction === 'down') {
            this.traverseHorizontal(row, col + 1, 'right');
            return true;
        }

        return false;
    }

    async solvePart1(): Promise<any> {
        this.traverseHorizontal(0, 0, 'right');

        return this.visitedTiles.size;
    }

    async solvePart2(): Promise<any> {
        return -1;
    }

    async run(filename?: string): Promise<RunResults> {
        await this.loadInputData(filename);
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

// (async () => {
//     logInfo('Day_16_Solver');
//     const day16Solver = new Day_16_Solver();
//     // const result = await day16Solver.run('example');
//     const result = await day16Solver.run();
//     display(result);
// })();
