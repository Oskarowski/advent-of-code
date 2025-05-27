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

type MonkeyBuyerData = {
    initialSecretValue: number; // aka Monkey Buyer ID
    computedSecretValue: number;
    prices: number[];
    changes: number[];
};

class TrieNode {
    children: Map<number, TrieNode> = new Map();
    sum: number = 0;
    monkeys: Set<number> = new Set();
}

function buildTrie(allMonkeyBuyersData: MonkeyBuyerData[], seqLen = 4) {
    const root = new TrieNode();

    for (let monkeyIdx = 0; monkeyIdx < allMonkeyBuyersData.length; monkeyIdx++) {
        const { prices, changes } = allMonkeyBuyersData[monkeyIdx];

        for (let i = 0; i <= changes.length - seqLen; i++) {
            let node = root;
            let key = '';
            for (let j = 0; j < seqLen; j++) {
                const change = changes[i + j];
                key += change + ',';
                if (!node.children.has(change)) {
                    node.children.set(change, new TrieNode());
                }
                node = node.children.get(change)!;
            }
            // Only count first occurrence per monkey
            if (!node.monkeys.has(monkeyIdx)) {
                node.monkeys.add(monkeyIdx);
                node.sum += prices[i + seqLen];
            }
        }
    }
    return root;
}

function findBestSequence(root: TrieNode, seqLen = 4) {
    let maxSum = -Infinity;
    let bestSeq: number[] = [];

    function dfs(node: TrieNode, path: number[]) {
        if (path.length === seqLen) {
            if (node.sum > maxSum) {
                maxSum = node.sum;
                bestSeq = [...path];
            }
            return;
        }
        for (const [change, child] of node.children) {
            path.push(change);
            dfs(child, path);
            path.pop();
        }
    }

    dfs(root, []);
    return { bestSeq, maxSum };
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

function trieToJson(node: TrieNode, label: string = 'root', depth: number = 0, maxDepth: number = 4): any {
    if (depth > maxDepth) return null;

    const children: any = [];
    for (const [key, child] of node.children) {
        const childJson = trieToJson(child, key.toString(), depth + 1, maxDepth);
        if (childJson) children.push(childJson);
    }
    return {
        name: label + (depth === maxDepth ? ` (sum: ${node.sum})` : ''),
        sum: node.sum,
        monkeys: node.monkeys.size,
        children: children.length > 0 ? children : undefined,
    };
}

(() => {
    testPart1();
    const initialSecretNumbers = lines.map((line) => parseInt(line, 10));
    const ITERATIONS = 2000;
    const allMonkeysData = initialSecretNumbers.map((secret) => generateDataForMonkey(secret, ITERATIONS));

    // allMonkeysData.forEach((monkey) => {
    //     console.log(`Monkey initialSecretValue: ${monkey.initialSecretValue}, | changes: ${monkey.changes.join(',')}`);
    // });

    const trieRoot = buildTrie(allMonkeysData);

    const trieJson = trieToJson(trieRoot, 'root', 0, 4);
    Bun.write('trie.json', JSON.stringify(trieJson, null, 2));

    const startTime = performance.now();

    const { bestSeq, maxSum } = findBestSequence(trieRoot, 2);

    const endTime = performance.now();
    const executionTime = Math.round(endTime - startTime);

    console.log(`Total evaluation time: ${executionTime / 1000} seconds.`);

    console.log('\n--- Puzzle Solution ---');
    console.log(`The best sequence of four price changes is: [${bestSeq.join(', ')}]`);
    console.log(`This sequence yields a total of: ${maxSum} bananas.`);

    const sumOfSecretNumbers = allMonkeysData.reduce((acc, monkey) => {
        return acc + monkey.computedSecretValue;
    }, 0);

    console.log(`Sum of ${ITERATIONS}th secret numbers of each Monkey is ${sumOfSecretNumbers}`);
})();
