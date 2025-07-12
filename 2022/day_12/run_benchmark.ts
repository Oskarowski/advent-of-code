import { PathfindingBenchmark } from './benchmark.ts';

async function main() {
    console.log('🔬 Advent of Code 2022 Day 12 - Pathfinding Performance Benchmark\n');

    // const inputFile = '../data/day_12/t01.txt';
    const inputFile = '../data/day_12/puzzle_input.txt';

    const rawData = await Bun.file(new URL(inputFile, import.meta.url)).text();

    const benchmark = new PathfindingBenchmark(rawData);

    try {
        const results = await benchmark.runAllBenchmarks();
        benchmark.displayResults(results);
    } catch (error) {
        console.error('❌ Benchmark failed:', error);
        process.exit(1);
    }
}

if (import.meta.main) {
    main();
}
