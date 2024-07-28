export type RunResults = {
    part1Result: any;
    part1StartTime: number;
    part1EndTime: number;
    part2Result: any;
    part2StartTime: number;
    part2EndTime: number;
};

export interface PuzzleSolver {
    inputData: string | string[];
    parsedData: any;

    loadInputData(): Promise<void>;
    parseInputData(): Promise<void>;

    solvePart1(): Promise<any>;
    solvePart2(): Promise<any>;

    run(): Promise<RunResults>;
    display(results: RunResults): Promise<void>;
}
