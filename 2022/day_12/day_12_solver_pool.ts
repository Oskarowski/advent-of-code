import { WorkerPool } from './worker_pool.ts';

interface WorkerMessage {
    heightMap: number[][];
    start: [number, number];
    end: [number, number];
}

interface PathResult {
    steps: number;
    path: [number, number][];
}

// Load input data
// const rawData = await Bun.file(new URL('../data/day_12/t01.txt', import.meta.url)).text();
const rawData = await Bun.file(new URL('../data/day_12/puzzle_input.txt', import.meta.url)).text();

const lines = rawData.trim().split('\n');

const startPositions: [number, number][] = [];
let end: [number, number] | null = null;

const heightMap = lines.map((line, y) => {
    return line.split('').map((char, x) => {
        if (char === 'S') {
            startPositions.push([x, y]);
            return 'a'.charCodeAt(0) - 'a'.charCodeAt(0);
        }
        if (char === 'E') {
            end = [x, y];
            return 'z'.charCodeAt(0) - 'a'.charCodeAt(0);
        }

        // For PART 2
        if (char === 'a') {
            startPositions.push([x, y]);
            return 'a'.charCodeAt(0) - 'a'.charCodeAt(0);
        }

        return char.charCodeAt(0) - 'a'.charCodeAt(0);
    });
});

if (!end || startPositions.length === 0) {
    throw new Error('Invalid input: missing start or end positions');
}

console.log(`Found ${startPositions.length} candidate start positions.`);
console.log(`End: ${end}`);

// Create worker pool with optimal size
const poolSize = Math.min(navigator.hardwareConcurrency || 4, startPositions.length);
const workerPool = new WorkerPool<WorkerMessage, PathResult>(
    new URL('./path_finder_worker.ts', import.meta.url).href,
    poolSize
);

console.log(`Using worker pool with ${poolSize} workers`);

const startTime = performance.now();
let completed = 0;

// Process all start positions using the worker pool
const promises = startPositions.map(async (start, index) => {
    const result = await workerPool.execute({
        heightMap,
        start,
        end,
    });

    completed++;
    if (completed % Math.max(1, Math.floor(startPositions.length / 10)) === 0 || completed === startPositions.length) {
        const progress = Math.round((completed / startPositions.length) * 100);
        const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
        console.log(`Progress: ${completed}/${startPositions.length} (${progress}%) - ${elapsed}s elapsed`);
    }

    return { start, result };
});

const results = await Promise.all(promises);

// Clean up
workerPool.terminate();

const endTime = performance.now();
const totalTime = ((endTime - startTime) / 1000).toFixed(2);

// Find the shortest path
const validResults = results.filter((r) => r.result.steps !== -1);
validResults.sort((a, b) => a.result.steps - b.result.steps);

console.log(`\n🎉 Completed in ${totalTime}s using worker pool`);
console.log(`✅ Found ${validResults.length} valid paths out of ${startPositions.length} start positions`);
console.log(`🏆 Part 2: Fewest steps from any 'a' to 'E': ${validResults[0].result.steps}`);

if (validResults.length > 1) {
    console.log(
        `📊 Path lengths: min=${validResults[0].result.steps}, max=${
            validResults[validResults.length - 1].result.steps
        }`
    );
}
