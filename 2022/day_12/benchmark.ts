import { WorkerPool } from './worker_pool.ts';
import { findShortestPathIterative } from './iterative_pathfinder.ts';

interface WorkerMessage {
    heightMap: number[][];
    start: [number, number];
    end: [number, number];
}

interface PathResult {
    steps: number;
    path: [number, number][];
}

interface BenchmarkResult {
    method: string;
    timeMs: number;
    result: number;
    memoryUsed?: number;
    details?: any;
}

class PathfindingBenchmark {
    private heightMap: number[][];
    private startPositions: [number, number][];
    private end: [number, number];

    constructor(private inputData: string) {
        this.parseInput();
    }

    private parseInput(): void {
        const lines = this.inputData.trim().split('\n');
        this.startPositions = [];
        let end: [number, number] | null = null;

        this.heightMap = lines.map((line, y) => {
            return line.split('').map((char, x) => {
                if (char === 'S') {
                    this.startPositions.push([x, y]);
                    return 'a'.charCodeAt(0) - 'a'.charCodeAt(0);
                }
                if (char === 'E') {
                    end = [x, y];
                    return 'z'.charCodeAt(0) - 'a'.charCodeAt(0);
                }
                if (char === 'a') {
                    this.startPositions.push([x, y]);
                    return 'a'.charCodeAt(0) - 'a'.charCodeAt(0);
                }
                return char.charCodeAt(0) - 'a'.charCodeAt(0);
            });
        });

        if (!end) {
            throw new Error('End position not found');
        }
        this.end = end;
    }

    async benchmarkIterative(): Promise<BenchmarkResult> {
        console.log('🔄 Running iterative benchmark...');
        const startTime = performance.now();
        const memBefore = this.getMemoryUsage();

        const results: PathResult[] = [];
        for (const start of this.startPositions) {
            const result = findShortestPathIterative(start, this.end, this.heightMap);
            results.push(result);
        }

        const endTime = performance.now();
        const memAfter = this.getMemoryUsage();

        const validResults = results.filter((r) => r.steps !== -1);
        validResults.sort((a, b) => a.steps - b.steps);

        return {
            method: 'Iterative (Single Thread)',
            timeMs: endTime - startTime,
            result: validResults[0]?.steps || -1,
            memoryUsed: memAfter - memBefore,
            details: {
                startPositions: this.startPositions.length,
                validPaths: validResults.length,
            },
        };
    }

    async benchmarkWorkerPool(poolSize: number = navigator.hardwareConcurrency || 4): Promise<BenchmarkResult> {
        console.log(`🔄 Running worker pool benchmark (pool size: ${poolSize})...`);
        const startTime = performance.now();
        const memBefore = this.getMemoryUsage();

        const workerPool = new WorkerPool<WorkerMessage, PathResult>(
            new URL('./path_finder_worker.ts', import.meta.url).href,
            poolSize
        );

        let completed = 0;
        const total = this.startPositions.length;

        const promises = this.startPositions.map(async (start) => {
            const result = await workerPool.execute({
                heightMap: this.heightMap,
                start,
                end: this.end,
            });
            completed++;
            if (completed % Math.max(1, Math.floor(total / 10)) === 0) {
                console.log(`  Progress: ${completed}/${total} (${Math.round((completed / total) * 100)}%)`);
            }
            return result;
        });

        const results = await Promise.all(promises);
        workerPool.terminate();

        const endTime = performance.now();
        const memAfter = this.getMemoryUsage();

        const validResults = results.filter((r) => r.steps !== -1);
        validResults.sort((a, b) => a.steps - b.steps);

        return {
            method: `Worker Pool (${poolSize} workers)`,
            timeMs: endTime - startTime,
            result: validResults[0]?.steps || -1,
            memoryUsed: memAfter - memBefore,
            details: {
                poolSize,
                startPositions: this.startPositions.length,
                validPaths: validResults.length,
            },
        };
    }

    async benchmarkIndividualWorkers(): Promise<BenchmarkResult> {
        console.log('🔄 Running individual workers benchmark...');
        const startTime = performance.now();
        const memBefore = this.getMemoryUsage();

        let completed = 0;
        const total = this.startPositions.length;

        const workerPromises = this.startPositions.map((start) => {
            return new Promise<PathResult>((resolve, reject) => {
                const worker = new Worker(new URL('./path_finder_worker.ts', import.meta.url), { type: 'module' });

                worker.onmessage = (event) => {
                    completed++;
                    if (completed % Math.max(1, Math.floor(total / 10)) === 0) {
                        console.log(`  Progress: ${completed}/${total} (${Math.round((completed / total) * 100)}%)`);
                    }
                    resolve(event.data as PathResult);
                    worker.terminate();
                };

                worker.onerror = (error) => {
                    completed++;
                    reject(error);
                    worker.terminate();
                };

                worker.postMessage({ start, end: this.end, heightMap: this.heightMap });
            });
        });

        const results = await Promise.all(workerPromises);

        const endTime = performance.now();
        const memAfter = this.getMemoryUsage();

        const validResults = results.filter((r) => r.steps !== -1);
        validResults.sort((a, b) => a.steps - b.steps);

        return {
            method: 'Individual Workers',
            timeMs: endTime - startTime,
            result: validResults[0]?.steps || -1,
            memoryUsed: memAfter - memBefore,
            details: {
                workersSpawned: this.startPositions.length,
                validPaths: validResults.length,
            },
        };
    }

    private getMemoryUsage(): number {
        return process.memoryUsage?.()?.heapUsed || 0;
    }

    async runAllBenchmarks(): Promise<BenchmarkResult[]> {
        console.log(`\n🚀 Starting comprehensive pathfinding benchmark`);
        console.log(`📊 Dataset: ${this.startPositions.length} start positions`);
        console.log(`🎯 Target: [${this.end[0]}, ${this.end[1]}]`);
        console.log(`🗺️  Map size: ${this.heightMap[0].length}x${this.heightMap.length}\n`);

        const results: BenchmarkResult[] = [];

        results.push(await this.benchmarkIterative());
        console.log();

        const poolSizes = [2, 4, 8, Math.max(16, navigator.hardwareConcurrency || 4)];
        for (const poolSize of poolSizes) {
            results.push(await this.benchmarkWorkerPool(poolSize));
            console.log();
        }

        results.push(await this.benchmarkIndividualWorkers());
        console.log();

        return results;
    }

    displayResults(results: BenchmarkResult[]): void {
        console.log('📈 BENCHMARK RESULTS');
        console.log('='.repeat(100));
        console.log('Method'.padEnd(30) + 'Time (ms)'.padEnd(12) + 'Result'.padEnd(8) + 'Details');
        console.log('-'.repeat(100));

        const fastestTime = Math.min(...results.map((r) => r.timeMs));

        results.forEach((result) => {
            const timeStr = result.timeMs.toFixed(1);
            const speedup = fastestTime === result.timeMs ? '🏆' : `${(result.timeMs / fastestTime).toFixed(2)}x`;

            console.log(
                result.method.padEnd(30) +
                    timeStr.padEnd(12) +
                    result.result.toString().padEnd(8) +
                    `${speedup} ${JSON.stringify(result.details || {})}`
            );
        });

        console.log('-'.repeat(50));

        const fastest = results.reduce((prev, current) => (prev.timeMs < current.timeMs ? prev : current));

        console.log(`🏆 Fastest method: ${fastest.method} (${fastest.timeMs.toFixed(1)}ms)`);
    }
}

export { PathfindingBenchmark, type BenchmarkResult };
