export {};
const codesPath = '../data/day_21/t21.txt';
const file = Bun.file(codesPath);
const data = await file.text();

const codes = data.split('\n').filter(Boolean);

type Position = { x: number; y: number };
type QueueItem = { position: Position; path: string[] };

const numericKeypad = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['X', '0', 'A'],
];

const numericKeypadToPosition = new Map<string, Position>();
numericKeypad.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol !== 'X') {
            numericKeypadToPosition.set(symbol, { x, y });
        }
    });
});

const directionalKeypad = [
    ['X', 'U', 'A'],
    ['L', 'D', 'R'],
];

const directionalKeypadToPosition = new Map<string, Position>();
directionalKeypad.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol !== 'X') {
            directionalKeypadToPosition.set(symbol, { x, y });
        }
    });
});

const DIRECTIONS = {
    U: { x: 0, y: -1 },
    D: { x: 0, y: 1 },
    L: { x: -1, y: 0 },
    R: { x: 1, y: 0 },
};

function findAllShortestPaths(
    keypad: string[][],
    start: Position,
    target: Position,
    directions: Record<string, { x: number; y: number }>
) {
    const queue: QueueItem[] = [{ position: { ...start }, path: [] }];
    const visited = new Map<string, number>();
    const allPaths: string[][] = [];
    let minPathLength = Infinity;

    while (queue.length > 0) {
        const { position, path } = queue.shift()!;
        const posKey = `${position.x},${position.y}`;

        if (visited.has(posKey) && visited.get(posKey)! < path.length) continue;
        visited.set(posKey, path.length);

        if (position.x === target.x && position.y === target.y) {
            if (minPathLength === Infinity || path.length <= minPathLength) {
                if (path.length < minPathLength) {
                    allPaths.length = 0;
                    minPathLength = path.length;
                }
                allPaths.push([...path]);
            }
            continue;
        }

        if (minPathLength !== Infinity && path.length > minPathLength) continue;

        for (const [dirName, dir] of Object.entries(directions)) {
            const newX = position.x + dir.x;
            const newY = position.y + dir.y;

            if (
                newX >= 0 &&
                newX < keypad[newY]?.length &&
                newY >= 0 &&
                newY < keypad.length &&
                keypad[newY][newX] !== 'X'
            ) {
                queue.push({
                    position: { x: newX, y: newY },
                    path: [...path, dirName],
                });
            }
        }
    }

    return allPaths;
}

const directionToKeypress = {
    U: '^',
    D: 'v',
    L: '<',
    R: '>',
    A: 'A',
};

const keypressToDirection = {
    '^': 'U',
    v: 'D',
    '<': 'L',
    '>': 'R',
    A: 'A',
};

function computeNumericKeypadCombinations(code: string) {
    // console.log(`Computing combinations for code: ${code}`);
    let pointer = { x: 2, y: 3 };

    const pathsToSymbols: Map<string, string[][]> = new Map();

    code.split('').forEach((symbol) => {
        if (!numericKeypadToPosition.has(symbol)) {
            console.log(`Symbol ${symbol} not found on the numeric keypad.`);
            return;
        }

        const target = numericKeypadToPosition.get(symbol)!;
        const paths = findAllShortestPaths(numericKeypad, pointer, target, DIRECTIONS);

        // const translated = paths.map((path) => [...path.map((d) => directionToKeypress[d]), 'A']);
        pathsToSymbols.set(
            symbol,
            paths.map((path) => [...path, 'A'])
        );
        pointer = { ...target };
    });

    // console.log('Paths to symbols:', pathsToSymbols);

    const allCombinations: string[] = [];
    const keys = Array.from(pathsToSymbols.keys());

    function generateCombinations(index: number, currentCombination: string[]) {
        if (index === keys.length) {
            allCombinations.push(currentCombination.join(''));
            return;
        }

        const key = keys[index];
        const paths = pathsToSymbols.get(key)!;

        for (const path of paths) {
            generateCombinations(index + 1, [...currentCombination, ...path]);
        }
    }

    generateCombinations(0, []);
    // console.log(`Total combinations for code ${code}: ${allCombinations.length}`);
    return allCombinations;
}

function transcribeToArrowNotation(series: string | string[]): string[] {
    if (typeof series === 'string') {
        return series.split('').map((char) => directionToKeypress[char] || char);
    }
    return series.map((char) => directionToKeypress[char] || char);
}

(() => {
    console.log('-----------------------------------');
    const testCode = '029A';
    console.log(`TEST COMPUTATION FOR CODE: ${testCode}`);
    const testCombinations = computeNumericKeypadCombinations(testCode)
        .map(transcribeToArrowNotation)
        .map((c) => c.join(''));
    if (testCombinations.length !== 3) {
        console.error(`Test failed for code ${testCode}. Expected 3 combinations, got ${testCombinations.length}`);
    }

    const expectedCombinations = ['<A^A>^^AvvvA', '<A^A^>^AvvvA', '<A^A^^>AvvvA'];
    // const expectedCombinations = ['LAUARUUADDDA', 'LAUAURUADDDA', 'LAUAUURADDDA'];
    expectedCombinations.map(transcribeToArrowNotation).forEach((expected) => {
        const expectedCombinationStr = expected.join('');
        if (!testCombinations.includes(expectedCombinationStr)) {
            console.error(
                `Test failed for code ${testCode}. Expected combination ${expectedCombinationStr} not found. Got ${expectedCombinationStr}`
            );
        }
    });

    console.log('TEST COMPUTATION PASSED ');
    console.log('-----------------------------------');
})();

codes.forEach((code) => {
    const allCombinations = computeNumericKeypadCombinations(code);

    // console.log('-----------------------------------');
    // console.log(`All combinations for code ${code}:`);
    // console.log(`Total combinations: ${allCombinations.length}`);
    // allCombinations.forEach((combination) => {
    //     console.log(`  ${combination} | ${transcribeToArrowNotation(combination).join('')}`);
    // });
    // console.log('-----------------------------------');

    for (const combination of allCombinations) {
        let pointer = { x: 2, y: 0 };

        const pathsToSymbol = new Map<string, string[][]>();
        combination.split('').forEach((symbol) => {
            if (!pathsToSymbol.has(symbol)) {
                pathsToSymbol.set(symbol, []);
            }

            const target = directionalKeypadToPosition.get(symbol);
            if (!target) {
                console.log(`Symbol ${symbol} not found on the directionalKeypadToPosition.`);
                return;
            }

            const paths = findAllShortestPaths(directionalKeypad, pointer, target, DIRECTIONS);

            console.log(`Paths to ${symbol} (from ${directionalKeypad[pointer.y][pointer.x]}):`);
            console.log(paths.map((path) => path.join(' ')).join('\n'));

            pathsToSymbol.set(
                symbol,
                paths.map((path) => [...path, 'A'])
            );

            pointer = { ...target };
        });

        console.log(pathsToSymbol);

        const allCombinations: string[] = [];
        const keys = Array.from(pathsToSymbol.keys());

        function generateCombinations(index: number, currentCombination: string[]) {
            if (index === keys.length) {
                allCombinations.push(currentCombination.join(''));
                return;
            }

            const key = keys[index];
            const paths = pathsToSymbol.get(key)!;

            for (const path of paths) {
                generateCombinations(index + 1, [...currentCombination, ...path]);
            }
        }

        generateCombinations(0, []);

        console.log('-----------------------------------');
        console.log(
            `All directional combinations for code ${code}: for combination ${transcribeToArrowNotation(
                combination
            ).join('')}`
        );
        console.log(`Total directional combinations: ${allCombinations.length}`);
        allCombinations.forEach((combination) => {
            console.log(`  ${combination} | ${transcribeToArrowNotation(combination).join('')}`);
        });
        console.log('-----------------------------------');
    }
});
