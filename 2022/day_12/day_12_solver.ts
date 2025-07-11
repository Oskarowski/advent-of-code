// const rawData = await Bun.file(new URL('../data/day_12/t01.txt', import.meta.url)).text();
const rawData = await Bun.file(new URL('../data/day_12/puzzle_input.txt', import.meta.url)).text();
console.log(rawData);

const lines = rawData.trim().split('\n');

let start: [number, number] | null = null;
let end: [number, number] | null = null;

const heightMap = lines.map((line, y) => {
    return line.split('').map((char, x) => {
        if (char === 'S') {
            start = [x, y];
            return 'a'.charCodeAt(0) - 'a'.charCodeAt(0);
        }
        if (char === 'E') {
            end = [x, y];
            return 'z'.charCodeAt(0) - 'a'.charCodeAt(0);
        }

        return char.charCodeAt(0) - 'a'.charCodeAt(0);
    });
});

if (!start || !end) {
    throw new Error('Upsik - totally nor correct');
}
console.log(`Start: ${start}, End: ${end}`);

interface PathResult {
    steps: number;
    path: [number, number][];
}

const findShortestPath = (start: [number, number], end: [number, number], heightMap: number[][]): PathResult => {
    const height = heightMap.length;
    const width = heightMap[0].length;

    const queue: [number, number, number][] = [[start[0], start[1], 0]];

    const visited = new Set<string>();
    visited.add(`${start[0]},${start[1]}`);

    const prev = new Map<string, [number, number] | null>();

    const directions = [
        [0, -1], // Up
        [0, 1], // Down
        [-1, 0], // Left
        [1, 0], // Right
    ];

    while (queue.length > 0) {
        const [x, y, steps] = queue.shift()!;

        if (x === end[0] && y === end[1]) {
            let path: [number, number][] = [];
            let current: [number, number] | null = [x, y];
            while (current) {
                path.push(current);
                const key = `${current[0]},${current[1]}`;
                current = prev.get(key) || null;
            }
            path.reverse();
            return { steps, path };
        }

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const key = `${nx},${ny}`;
                if (visited.has(key)) continue;

                const diff = heightMap[ny][nx] - heightMap[y][x];
                if (diff <= 1) {
                    visited.add(key);
                    queue.push([nx, ny, steps + 1]);
                    prev.set(key, [x, y]);
                }
            }
        }
    }

    return { steps: -1, path: [] };
};

const fewestStepsResult = findShortestPath(start, end, heightMap);

console.log(`Part 1: Fewest steps from 'S' to 'E': ${fewestStepsResult.steps}`);
console.log(`Path: ${fewestStepsResult.path.map((p) => `(${p[0]}, ${p[1]})`).join(' -> ')}`);
