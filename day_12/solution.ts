import { getPuzzleInput } from '../helpers/getPuzzleInput.js';

enum SpringState {
    DAMAGED = '#',
    OPERATIONAL = '.',
    UNKNOWN = '?',
}

class ConditionRecord {
    row: string;
    providedGroups: number[];
    validRecordCombinations: string[] = [];
    countValidRecordCombinations: number = 0;

    constructor(row: string, providedGroups: number[]) {
        this.row = row;
        this.providedGroups = providedGroups;
    }

    addValidRecordCombination(combination: string) {
        this.validRecordCombinations.push(combination);
        this.countValidRecordCombinations++;
    }
}

class SolutionDay12 {
    puzzleInput: string[];
    parsedPuzzleInput: ConditionRecord[];

    setPuzzleInput(input: string[]) {
        this.puzzleInput = input;
    }

    parsePuzzleInput() {
        this.parsedPuzzleInput = [];

        for (let i = 0; i < this.puzzleInput.length; i++) {
            const row = this.puzzleInput[i];

            const [springsString, providedGroupsString] = row.split(' ');
            const providedGroups = providedGroupsString.split(',').map(Number);

            const conditionRecord = new ConditionRecord(
                springsString,
                providedGroups
            );

            this.parsedPuzzleInput.push(conditionRecord);
        }
    }

    generateCombinationsAndCount() {
        const areArraysEqual = (arr1: number[], arr2: number[]) => {
            if (arr1.length !== arr2.length) {
                return false;
            }

            return arr1.every((value, index) => value === arr2[index]);
        };

        for (const record of this.parsedPuzzleInput) {
            const combinations = this.generateSpringRecordCombinations(
                record.row
            );

            // console.log('Record:', record.row);

            for (const combination of combinations) {
                // console.log('Combination:', combination);

                const countedConDamagedSprings =
                    this.countContinuousDamagedSprings(combination);

                if (
                    areArraysEqual(
                        record.providedGroups,
                        countedConDamagedSprings
                    )
                ) {
                    // console.log('\n Valid combination:', combination, `\n`);
                    record.addValidRecordCombination(combination);
                }
            }

            // console.log(
            //     'Valid combinations count:',
            //     record.countValidRecordCombinations,
            //     '\n'
            // );
        }
    }

    countContinuousDamagedSprings(line: string): number[] {
        const counts: number[] = [];
        let continuousCount = 0;

        for (const char of line) {
            if (char === '#') {
                continuousCount++;
            } else {
                if (continuousCount > 0) {
                    counts.push(continuousCount);
                    continuousCount = 0;
                }
            }
        }

        if (continuousCount > 0) {
            counts.push(continuousCount);
        }

        return counts;
    }

    generateSpringRecordCombinations(
        springRecord: string,
        index: number = 0
    ): string[] {
        if (index >= springRecord.length) {
            return [springRecord];
        }

        if (springRecord[index] === SpringState.UNKNOWN) {
            // replace '?' with '.' and combine results
            const withOperational = this.generateSpringRecordCombinations(
                springRecord.substring(0, index) +
                    SpringState.OPERATIONAL +
                    springRecord.substring(index + 1),
                index + 1
            );
            // replace '?' with '#' and combine results
            const withDamaged = this.generateSpringRecordCombinations(
                springRecord.substring(0, index) +
                    SpringState.DAMAGED +
                    springRecord.substring(index + 1),
                index + 1
            );
            return withOperational.concat(withDamaged);
        } else {
            // continue recursion for next index
            return this.generateSpringRecordCombinations(
                springRecord,
                index + 1
            );
        }
    }

    sumAllValidRecordCombinations(): number {
        return this.parsedPuzzleInput.reduce((acc, record) => {
            return acc + record.countValidRecordCombinations;
        }, 0);
    }

    printParsedPuzzleInput() {
        for (const record of this.parsedPuzzleInput) {
            console.log(record);
        }
    }
}

(() => {
    console.log('Day 12');
    const solution = new SolutionDay12();
    solution.setPuzzleInput(getPuzzleInput('day_12_input'));
    solution.parsePuzzleInput();
    solution.generateCombinationsAndCount();
    // solution.printParsedPuzzleInput();

    console.log("The sum of all possible combinations is:", solution.sumAllValidRecordCombinations())
})();
