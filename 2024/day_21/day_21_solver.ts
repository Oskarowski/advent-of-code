export {};
const codesPath = '../data/day_21/t21.txt';
const file = Bun.file(codesPath);
const data = await file.text();

const codes = data.split('\n');

const numericKeypad = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['X', '0', 'A'],
];

const directionalKeypad = [
    ['X', 'U', 'A'],
    ['L', 'D', 'R'],
];

const DIRECTIONS = {
    U: { x: 0, y: -1 },
    D: { x: 0, y: 1 },
    L: { x: -1, y: 0 },
    R: { x: 1, y: 0 },
};

type Position = { x: number; y: number };
type QueueItem = { position: Position; path: string[] };

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
            if (minPathLength === Infinity) minPathLength = path.length;
            if (path.length === minPathLength) {
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
};

codes.forEach((code) => {
    console.log(`Code: ${code}`);
    let pointer = {
        x: 2,
        y: 3,
    };
    let numericKeypadSymbol = numericKeypad[pointer.y][pointer.x];
    console.log(`Starting at ${numericKeypadSymbol}`);

    const symbolToPos = new Map<string, Position>();
    numericKeypad.forEach((row, y) => {
        row.forEach((symbol, x) => {
            if (symbol !== 'X') {
                symbolToPos.set(symbol, { x, y });
            }
        });
    });

    const symbolToPath = new Map<string, any[]>();
    code.split('').forEach((symbol) => {
        if (!symbolToPath.has(symbol)) {
            symbolToPath.set(symbol, []);
        }

        const target = symbolToPos.get(symbol);
        if (!target) {
            console.log(`Symbol ${symbol} not found on the keypad.`);
            return;
        }
        const paths = findAllShortestPaths(numericKeypad, pointer, target, DIRECTIONS);
        console.log(`Paths to ${symbol} (from ${numericKeypad[pointer.y][pointer.x]}):`);

        const translated = paths.map((path) => [...path.map((d) => directionToKeypress[d]), 'A']);
        symbolToPath.get(symbol)!.push(...translated);
        translated.forEach((p) => console.log(`  ${p.join('')}`));

        pointer = { ...target };
    });

    console.log(symbolToPath);

    const allCombinations: string[] = [];
    const keys = Array.from(symbolToPath.keys());

    function generateCombinations(index: number, currentCombination: string[]) {
        if (index === keys.length) {
            allCombinations.push(currentCombination.join(''));
            return;
        }

        const key = keys[index];
        const paths = symbolToPath.get(key)!;

        for (const path of paths) {
            generateCombinations(index + 1, [...currentCombination, ...path]);
        }
    }
    generateCombinations(0, []);

    console.log('-----------------------------------');
    console.log(`All combinations for code ${code}:`);
    console.log(`Total combinations: ${allCombinations.length}`);
    allCombinations.forEach((combination) => {
        console.log(`  ${combination}`);
    });
    console.log('-----------------------------------');
});
