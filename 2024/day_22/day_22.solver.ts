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

function secretNumberGenerator(initialValue: number, iterations: number): number {
    let secretNumber = initialValue;

    for (let i = 0; i < iterations; i++) {
        let newNumber = secretNumber;

        let mixArgument = newNumber * MIX_MULTIPLY_1;
        newNumber = mix(newNumber, mixArgument);

        newNumber = prune(newNumber, PRUNE_MODULUS);

        mixArgument = Math.floor(newNumber / MIX_DIVIDE);
        newNumber = mix(newNumber, mixArgument);

        newNumber = prune(newNumber, PRUNE_MODULUS);

        mixArgument = newNumber * MIX_MULTIPLY_2;
        newNumber = mix(newNumber, mixArgument);
        newNumber = prune(newNumber, PRUNE_MODULUS);

        secretNumber = newNumber;
    }

    return secretNumber;
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

    for (const testCase of testCases) {
        const { initialSecretNumber, iterations, expectedSecretNumber } = testCase;
        const result = secretNumberGenerator(initialSecretNumber, iterations);
        if (result !== expectedSecretNumber) {
            console.error(
                `❌ Test failed for initial value ${initialSecretNumber} with ${iterations} iterations: expected ${expectedSecretNumber}, got ${result}`
            );
        } else {
            console.log(
                `✅ Test passed for initial value ${initialSecretNumber} with ${iterations} iterations: got ${result}`
            );
        }
    }
}

(() => {
    testPart1();

    return;
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
