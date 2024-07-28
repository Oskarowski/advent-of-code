import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getPuzzleInput = (fileName: string): string[] =>
    fs
        .readFileSync(`${__dirname}/../data/${fileName}.txt`)
        .toString()
        .replace(/\r/g, '')
        .trim()
        .split('\n\n');

class Pattern {
    pattern: string;
    horizontalPointOfReflection: number | null = null;
    verticalPointOfReflection: number | null = null;

    constructor(input: string) {
        this.pattern = input;
    }
}
enum SearchingMode {
    ROW = 235,
    COLUMN = 346,
}

class SolutionDay13 {
    patterns: Pattern[] = [];

    constructor(input: string[]) {
        this.constructPatterns(input);
    }

    constructPatterns(input: string[]) {
        for (const stringStream of input) {
            this.patterns.push(new Pattern(stringStream));
        }
        // this.printPatterns();
    }

    isFullReflection(
        left: number,
        right: number,
        pattern: string[],
        mode: SearchingMode
    ): boolean {
        const amountOfRows = pattern.length;
        const amountOfColumns = pattern[0].length;

        if (mode === SearchingMode.ROW) {
            while (left >= 0 && right < amountOfRows) {
                if (pattern[left] !== pattern[right]) {
                    return false;
                }
                left--;
                right++;
            }
            return true;
        }

        if (mode === SearchingMode.COLUMN) {
            while (left >= 0 && right < amountOfColumns) {
                for (let i = 0; i < pattern.length; i++) {
                    if (pattern[i][left] !== pattern[i][right]) {
                        return false;
                    }
                }
                left--;
                right++;
            }
            return true;
        }

        throw new Error('Invalid Search Mode');
    }

    findPointOfReflection(
        pattern: string[],
        mode: SearchingMode
    ): number | null {
        const amountOfRows = pattern.length;
        const amountOfColumns = pattern[0].length;

        if (mode === SearchingMode.ROW) {
            for (let i = 1; i < amountOfRows; i++) {
                if (pattern[i - 1] === pattern[i]) {
                    if (
                        this.isFullReflection(
                            i - 1,
                            i,
                            pattern,
                            SearchingMode.ROW
                        )
                    ) {
                        return i;
                    }
                }
            }
        }

        if (mode === SearchingMode.COLUMN) {
            for (let j = 1; j < amountOfColumns; j++) {
                const leftColumn: string[] = [];
                const rightColumn: string[] = [];

                for (let i = 0; i < amountOfRows; i++) {
                    leftColumn.push(pattern[i][j - 1]);
                    rightColumn.push(pattern[i][j]);
                }

                // Check if the columns are equal by joining them as strings
                if (leftColumn.join('') === rightColumn.join('')) {
                    if (
                        this.isFullReflection(
                            j - 1,
                            j,
                            pattern,
                            SearchingMode.COLUMN
                        )
                    ) {
                        return j;
                    }
                }
            }
        }

        // No point of reflection found
        return null;
    }

    analyzePattern(pattern: Pattern) {
        const patternGrid = pattern.pattern.trim().split('\n');

        const horizontalPointOfReflection = this.findPointOfReflection(
            patternGrid,
            SearchingMode.ROW
        );

        const verticalPointOfReflection = this.findPointOfReflection(
            patternGrid,
            SearchingMode.COLUMN
        );

        pattern.horizontalPointOfReflection = horizontalPointOfReflection;
        pattern.verticalPointOfReflection = verticalPointOfReflection;

        if (
            horizontalPointOfReflection === null &&
            verticalPointOfReflection === null
        ) {
            throw new Error('No point of reflection found');
        }
    }

    performAnalyzeOverPatterns(): number {
        const magicMultiplicator = 100;

        let summarizingResult = 0;

        for (const pattern of this.patterns) {
            this.analyzePattern(pattern);

            if (pattern.horizontalPointOfReflection !== null) {
                summarizingResult +=
                    pattern.horizontalPointOfReflection * magicMultiplicator;
            }

            if (pattern.verticalPointOfReflection !== null) {
                summarizingResult += pattern.verticalPointOfReflection;
            }
        }

        return summarizingResult;
    }

    printPatterns() {
        for (const pattern of this.patterns) {
            console.log(pattern);
        }
    }
}

const processTests = () => {
    console.log('<===> T_E_S_T_S <===>');

    const fileName1 = 'day_13_t_input';
    const solver1 = new SolutionDay13(getPuzzleInput(fileName1));
    const solvedPuzzle1 = solver1.performAnalyzeOverPatterns();
    const expected1 = 405;

    if (solvedPuzzle1 === 405) {
        console.log(`✅ Test passed for ${fileName1} output: ${solvedPuzzle1}`);
    } else {
        console.log(
            `❌ Test failed for ${fileName1} expected output to be ${expected1} but got ${solvedPuzzle1}`
        );
    }
};

function processPuzzle() {
    console.log('\n\n------------------- Day 13 -------------------');
    console.time('How much time to process Puzzle');
    const solver = new SolutionDay13(getPuzzleInput('day_13_input'));
    const solvedPuzzle = solver.performAnalyzeOverPatterns();
    console.log('Puzzle result:', solvedPuzzle);
    console.timeEnd('How much time to process Puzzle');
}

(() => {
    processTests();
    processPuzzle();
})();
