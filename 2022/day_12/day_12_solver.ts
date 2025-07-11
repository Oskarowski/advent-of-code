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
    throw new Error('Upsik - totally nor correct');
}
console.log(`Found ${startPositions.length} candidate start positions.`);
console.log(`End: ${end}`);

interface PathResult {
    steps: number;
    path: [number, number][];
}

const totalWorkers = startPositions.length;
let completedWorkers = 0;

const workerPromises: Promise<{ start: [number, number]; result: PathResult }>[] = startPositions.map((start) => {
    return new Promise<{ start: [number, number]; result: PathResult }>((resolve, reject) => {
        const worker = new Worker(new URL('./path_finder_worker.ts', import.meta.url), { type: 'module' });

        worker.onmessage = (event) => {
            completedWorkers++;
            console.log(`Progress: ${completedWorkers}/${totalWorkers} workers finished`);
            resolve({
                start,
                result: event.data as PathResult,
            });
            worker.terminate();
        };

        worker.onerror = (error) => {
            completedWorkers++;
            console.log(`Progress (with error): ${completedWorkers}/${totalWorkers} workers finished`);
            reject(error);
            worker.terminate();
        };

        worker.postMessage({ start, end, heightMap });
    });
});

const results: { start: [number, number]; result: PathResult }[] = await Promise.all(workerPromises);

const validResults = results.filter((r) => r.result.steps !== -1);

validResults.sort((a, b) => a.result.steps - b.result.steps);
console.log(`Part 2: Fewest steps from any 'a' to 'E': ${validResults[0].result.steps}`);
