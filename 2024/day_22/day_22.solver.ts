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

function secretNumberGenerator(initialValue: number, iterations: number): number {
    let secretNumber = initialValue;

    for (let i = 0; i < iterations; i++) {
        let newNumber = secretNumber;

        let mixArgument = newNumber * 64;
        let mixingValue = mix(newNumber, mixArgument);
        newNumber = mixingValue;

        const pruneArgument = 16777216;
        const prunedValue = prune(newNumber, pruneArgument);

        newNumber = prunedValue;

        mixArgument = Math.floor(newNumber / 32);
        newNumber = mix(newNumber, mixArgument);

        newNumber = prune(newNumber, pruneArgument);

        let result = newNumber * 2048;
        newNumber = mix(newNumber, result);
        newNumber = prune(newNumber, pruneArgument);

        secretNumber = newNumber;
    }

    return secretNumber;
}

(() => {
    const ITERATIONS = 2000;
    const secretNumberMapping = new Map<number, number>();
    for (const line of lines) {
        const initialValue = parseInt(line, 10);
        const secretNumber = secretNumberGenerator(initialValue, ITERATIONS);
        secretNumberMapping.set(initialValue, secretNumber);
    }

    console.log('Secret Number Mapping:');
    for (const [initialValue, secretNumber] of secretNumberMapping.entries()) {
        console.log(`Initial Value: ${initialValue}, Secret Number: ${secretNumber}`);
    }

    console.log(
        `Sum of ${ITERATIONS}th secret numbers: by each buyer = ${Array.from(secretNumberMapping.values()).reduce(
            (acc, val) => acc + val,
            0
        )}`
    );
})();
