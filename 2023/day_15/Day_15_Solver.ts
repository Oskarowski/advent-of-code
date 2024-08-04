import { PuzzleSolver, RunResults } from '../../interfaces/PuzzleSolver';
import { loadPuzzleFromFile } from '../helpers/loadPuzzleFromFile.js';
import { timeFunction } from '../helpers/timeFunction.js';

export class Day_15_Solver implements PuzzleSolver {
    inputData: string;
    parsedData: string[];
    /**
     * The specified character based on which the inputData will be split during parsing.
     *
     * @memberof Day_15_Solver
     */
    sequenceSplitter = ',';

    async loadInputData(filename: string = 'day_15'): Promise<void> {
        const loadedData = await loadPuzzleFromFile(15, filename);
        this.inputData = loadedData[0];
    }

    /**
     * Splits the input string sequence based on the specified character in `sequenceSplitter`.
     * If there is nothing to split by`sequenceSplitter`, the entire input string is treated as a single entry.
     * Defaults to splitting by a comma (`','`).
     *
     * @return {Promise<void>} A promise that resolves when the input data has been parsed.
     * @memberof Day_15_Solver
     */
    async parseInputData(): Promise<void> {
        this.parsedData = this.inputData.split(this.sequenceSplitter);
    }

    /**
     * Get ASCII value for a given character.
     *
     * @private
     * @param {string} char - char for which the ASCII value should be returned.
     * @return {number} Returns the Unicode value of the character.
     * @memberof Day_15_Solver
     */
    private getAsciiCodeForCharacter(char: string): number {
        return char.charCodeAt(0);
    }

    /**
     * Computes a hash value for a given sequence of characters.
     *
     * @private
     * @param {string} sequence - The input string sequence to be hashed.
     * @return {number} The computed hash value.
     * @memberof Day_15_Solver
     */
    private hashHash(sequence: string): number {
        const divider = 256;
        let currentValue = 0;

        for (const char of sequence) {
            const asciiCodeValue = this.getAsciiCodeForCharacter(char);
            currentValue += asciiCodeValue;
            currentValue *= 17;
            currentValue = currentValue % divider;
        }

        return currentValue;
    }

    async solvePart1(): Promise<number> {
        const hashPromises = this.parsedData.map(async (sequence) => this.hashHash(sequence));
        const hashedSequencesValues = await Promise.all(hashPromises);
        const sumOfHashedValues = hashedSequencesValues.reduce((a, c) => a + c, 0);

        return sumOfHashedValues;
    }

    async solvePart2(): Promise<number> {
        const boxesArrangement: Map<number, Map<string, string>> = new Map();

        // populate each Box with slots for lenses
        for (let i = 0; i <= 255; i++) {
            boxesArrangement.set(i, new Map());
        }

        for (const sequence of this.parsedData) {
            if (sequence.includes('-')) {
                const label = sequence.slice(0, -1);
                const boxLabel = this.hashHash(label);

                boxesArrangement.get(boxLabel).delete(label);
            } else {
                const [label, focalLength] = sequence.split('=');
                const boxLabel = this.hashHash(label);

                boxesArrangement.get(boxLabel).set(label, focalLength);
            }
        }

        let totalFocusingPower = 0;

        for (const [boxLabel, boxContent] of boxesArrangement.entries()) {
            if (boxContent.size === 0) {
                continue;
            }

            let boxFocusingPower = 0;
            let lensIndex = 1;

            for (const [lensLabel, lensPower] of boxContent.entries()) {
                const boxPower = boxLabel + 1;
                const lensFocusingPower = boxPower * lensIndex * Number(lensPower);

                boxFocusingPower += lensFocusingPower;
                lensIndex++;
            }

            totalFocusingPower += boxFocusingPower;
        }

        return totalFocusingPower;
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
//     logInfo('Day_15_Solver');
//     const day15Solver = new Day_15_Solver();
// const result = await day15Solver.run('example_1');
//     const result = await day15Solver.run();
//     display(result);
// })();
