export {};
const puzzleInputPath = '../data/day_22/t22.txt';
const file = Bun.file(puzzleInputPath);

const data = await file.text();
const lines = data.split('\n').filter(Boolean);

function bitwiseXOR(a: number, b: number): number {
    return a ^ b;
}

function modulo(a: number, b: number): number {
    return ((a % b) + b) % b;
}

const mix = bitwiseXOR;
const prune = modulo;

const PRUNE_MODULUS = 16777216; // 2^24
const MIX_MULTIPLY_1 = 64; // 2^6
const MIX_DIVIDE = 32; // 2^5
const MIX_MULTIPLY_2 = 2048; // 2^11

function generateOneStepSecretNumber(initialSecret: number): number {
    let newNumber = initialSecret;

    let mixArgument = newNumber * MIX_MULTIPLY_1;
    newNumber = mix(newNumber, mixArgument);

    newNumber = prune(newNumber, PRUNE_MODULUS);

    mixArgument = Math.floor(newNumber / MIX_DIVIDE);
    newNumber = mix(newNumber, mixArgument);

    newNumber = prune(newNumber, PRUNE_MODULUS);

    mixArgument = newNumber * MIX_MULTIPLY_2;
    newNumber = mix(newNumber, mixArgument);
    newNumber = prune(newNumber, PRUNE_MODULUS);

    return newNumber;
}

function getLastDigit(number: number): number {
    return number % 10;
}

type MonkeyBuyerData = {
    initialSecretValue: number; // aka Monkey Buyer ID
    computedSecretValue: number;
    prices: number[];
    changes: number[];
};

function generateDataForMonkey(initialSecretValue: number, iterations: number): MonkeyBuyerData {
    const prices: number[] = [];
    let currentSecretValue = initialSecretValue;

    prices.push(getLastDigit(currentSecretValue));

    for (let i = 0; i < iterations; i++) {
        currentSecretValue = generateOneStepSecretNumber(currentSecretValue);
        prices.push(getLastDigit(currentSecretValue));
    }

    const changes: number[] = [];

    for (let i = 0; i < prices.length - 1; i++) {
        const change = prices[i + 1] - prices[i];
        changes.push(change);
    }

    return {
        initialSecretValue,
        computedSecretValue: currentSecretValue,
        prices,
        changes,
    };
}

function testPart1() {
    const testCases = [
        {
            initialSecretNumber: 123,
            iterations: 10,
            expectedSecretNumber: 5908254,
        },
        {
            initialSecretNumber: 1,
            iterations: 2000,
            expectedSecretNumber: 8685429,
        },
        {
            initialSecretNumber: 10,
            iterations: 2000,
            expectedSecretNumber: 4700978,
        },
        {
            initialSecretNumber: 100,
            iterations: 2000,
            expectedSecretNumber: 15273692,
        },
        {
            initialSecretNumber: 2024,
            iterations: 2000,
            expectedSecretNumber: 8667524,
        },
    ];
    console.log('\n');

    for (const testCase of testCases) {
        const { initialSecretNumber, iterations, expectedSecretNumber } = testCase;
        const result = generateDataForMonkey(initialSecretNumber, iterations);
        const { computedSecretValue } = result;
        if (computedSecretValue !== expectedSecretNumber) {
            console.error(
                `❌ Test failed for initial value ${initialSecretNumber} with ${iterations} iterations: expected ${expectedSecretNumber}, got ${computedSecretValue}`
            );
        } else {
            console.log(
                `✅ Test passed for initial value ${initialSecretNumber} with ${iterations} iterations: got ${computedSecretValue}`
            );
        }
    }

    console.log('\n\n');
}

function generateAllPossibleChangeSequences(): number[][] {
    const allSequences: number[][] = [];
    const min = -9;
    const max = 9;

    for (let c1 = min; c1 <= max; c1++) {
        for (let c2 = min; c2 <= max; c2++) {
            for (let c3 = min; c3 <= max; c3++) {
                for (let c4 = min; c4 <= max; c4++) {
                    allSequences.push([c1, c2, c3, c4]);
                }
            }
        }
    }

    return allSequences;
}

function computeTotalBananasForSequence(targetSequence: number[], allMonkeyBuyersData: MonkeyBuyerData[]): number {
    let totalBananas = 0;

    for (const monkeyBuyer of allMonkeyBuyersData) {
        const { prices, changes } = monkeyBuyer;

        for (let i = 0; i < prices.length - targetSequence.length; i++) {
            let isMatching = true;
            for (let k = 0; k < targetSequence.length; k++) {
                if (changes[i + k] !== targetSequence[k]) {
                    isMatching = false;
                    break;
                }
            }

            if (isMatching) {
                const sellingPrice = prices[i + targetSequence.length];
                totalBananas += sellingPrice;
                break;
            }
        }
    }

    return totalBananas;
}

(() => {
    testPart1();
    const initialSecretNumbers = lines.map((line) => parseInt(line, 10));
    const ITERATIONS = 2000;
    const allMonkeysData = initialSecretNumbers.map((secret) => generateDataForMonkey(secret, ITERATIONS));

    // allMonkeysData.forEach((monkey) => {
    //     console.log(`Monkey initialSecretValue: ${monkey.initialSecretValue}, | changes: ${monkey.changes.join(',')}`);
    // });

    const allSequencesPossible = generateAllPossibleChangeSequences();

    let maxBananas = -1;
    let bestSequence: number[] | null = null;
    let sequencesChecked = 0;

    const totalSequencesToCheck = allSequencesPossible.length;

    const startTime = performance.now();

    for (const targetSequence of allSequencesPossible) {
        const totalBananas = computeTotalBananasForSequence(targetSequence, allMonkeysData);

        if (totalBananas > maxBananas) {
            maxBananas = totalBananas;
            bestSequence = [...targetSequence];
        }

        sequencesChecked++;

        if (sequencesChecked % 10000 === 0 || sequencesChecked === totalSequencesToCheck) {
            const elapsedTime = performance.now() / 1000;
            const percentComplete = (sequencesChecked / totalSequencesToCheck) * 100;
            console.log(
                `Checked ${sequencesChecked}/${totalSequencesToCheck} sequences (${percentComplete.toFixed(
                    2
                )}%). Current max bananas: ${maxBananas}. Elapsed: ${elapsedTime.toFixed(1)}s`
            );
        }
    }

    const endTime = performance.now();
    const executionTime = Math.round(endTime - startTime);

    console.log(`Total evaluation time: ${executionTime / 1000} seconds.`);

    console.log('\n--- Puzzle Solution ---');
    if (bestSequence) {
        console.log(`The best sequence of four price changes is: [${bestSequence.join(', ')}]`);
        console.log(`This sequence yields a total of: ${maxBananas} bananas.`);
    } else {
        console.log('No profitable sequence found (or no buyers/data to process).');
    }

    let sumOfSecretNumbers = 0;
    for (const monkey of allMonkeysData) {
        sumOfSecretNumbers += monkey.computedSecretValue;
    }

    console.log(`Sum of ${ITERATIONS}th secret numbers of each Monkey = ${sumOfSecretNumbers}`);
})();
