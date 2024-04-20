import { getPuzzleInput } from '../helpers/getPuzzleInput.js';

enum SpringState {
    DAMAGED = '#',
    OPERATIONAL = '.',
    UNKNOWN = '?',
}

class SolutionDay12 {
    puzzleInput: string[];

    setPuzzleInput(input: string[]) {
        this.puzzleInput = input;
    }

    sumSpringRecordCombinations(springConditionRecords: string, unfold: boolean = false): number {
        let totalCombinations = 0;
        const records = springConditionRecords.split('\n');

        for (const springRecord of records) {
            const [springState, damagedSpringRecord] = springRecord.split(' ');
            const damagedSpringRecordArray = damagedSpringRecord
                .split(',')
                .map(Number);

            if (unfold) {
                // Unfold spring state and damaged spring record
                const unfoldedSpringState = Array(5).fill(springState).join('?');
                const unfoldedDamagedSpringRecord = Array(5)
                    .fill(damagedSpringRecordArray)
                    .flat();
    
                totalCombinations += this.getValidSpringRecordCombinations(
                    unfoldedSpringState,
                    unfoldedDamagedSpringRecord
                );
            }
            else {
                totalCombinations += this.getValidSpringRecordCombinations(
                    springState,
                    damagedSpringRecordArray
                );
            }

        }

        return totalCombinations;
    }

    cache: Map<string, number> = new Map();

    getValidSpringRecordCombinations(
        springState: string,
        damagedSpringRecord: number[]
    ): number {
        const key = springState + '|' + damagedSpringRecord.join(',');

        // Check if the result is already cached
        if (this.cache.has(key)) {
            return this.cache.get(key)!;
        }

        if (damagedSpringRecord.length === 0) {
            if (springState.includes(SpringState.DAMAGED)) {
                return 0;
            } else {
                return 1;
            }
        }

        if (springState.length === 0) {
            if (damagedSpringRecord.length === 0) {
                return 1;
            } else {
                return 0;
            }
        }

        let totalCombinations = 0;

        // if "." or "?"
        if (
            springState[0] === SpringState.OPERATIONAL ||
            springState[0] === SpringState.UNKNOWN
        ) {
            totalCombinations += this.getValidSpringRecordCombinations(
                springState.substring(1),
                damagedSpringRecord
            );
        }

        // if "#" or "?"
        if (
            springState[0] === SpringState.DAMAGED ||
            springState[0] === SpringState.UNKNOWN
        ) {
            if (this.isValidCondition(springState, damagedSpringRecord)) {
                totalCombinations += this.getValidSpringRecordCombinations(
                    springState.substring(damagedSpringRecord[0] + 1),
                    damagedSpringRecord.slice(1)
                );
            }
        }

        // Cache the result
        this.cache.set(key, totalCombinations);

        return totalCombinations;
    }

    isValidCondition(
        springState: string,
        damagedSpringRecord: number[]
    ): boolean {
        return (
            damagedSpringRecord[0] <= springState.length &&
            !springState
                .substring(0, damagedSpringRecord[0])
                .includes(SpringState.OPERATIONAL) &&
            (damagedSpringRecord[0] === springState.length ||
                springState[damagedSpringRecord[0]] !== SpringState.DAMAGED)
        );
    }
}


const processTests = () => {
    console.log('T E S T S')

    const solver1 = new SolutionDay12();
    const solvedPuzzle1 = getPuzzleInput('day_12_input').reduce(
        (acc, record) =>
            (acc += solver1.sumSpringRecordCombinations(record, true)),
        0
    )
    if(solvedPuzzle1 === 1738259948652){
        console.log(`✅ Test passed for day_12_input output: ${solvedPuzzle1}`);
    }else{
        console.log(`❌ Test failed for day_12_input expected output to be 1738259948652 but got ${solvedPuzzle1}`);
    }

    const solver2 = new SolutionDay12();
    const solvedPuzzle2 = getPuzzleInput('day_12_t2_input').reduce(
        (acc, record) =>
            (acc += solver2.sumSpringRecordCombinations(record, true)),
        0
    )
    if(solvedPuzzle2 === 525152){
        console.log(`✅ Test passed for day_12_t2_input output: ${solvedPuzzle2}`);
    }else{
        console.log(`❌ Test failed for day_12_t2_input expected output to be 525152 but got ${solvedPuzzle2}`);
    }

    const solver3 = new SolutionDay12();
    const solvedPuzzle3 = getPuzzleInput('day_12_t2_input').reduce(
        (acc, record) =>
            (acc += solver3.sumSpringRecordCombinations(record)),
        0
    )
    if(solvedPuzzle3 === 21){
        console.log(`✅ Test passed for day_12_t2_input output: ${solvedPuzzle3}`);
    }else{
        console.log(`❌ Test failed for day_12_t2_input expected output to be 21 but got ${solvedPuzzle3}`);
    }
}

(() => {
    console.log('------------------- Day 12 -------------------');
    console.time('How much time to process Puzzle');
    const solution = new SolutionDay12();
    console.time('How much time to process combination');
    console.log('The sum of all possible combinations is:',
        getPuzzleInput('day_12_input').reduce(
            (acc, record) =>
                (acc += solution.sumSpringRecordCombinations(record, true)),
            0
        )
    );

    console.timeEnd('How much time to process combination');
    // solution.printParsedPuzzleInput();
    console.timeEnd('How much time to process Puzzle');

    processTests();
})();

