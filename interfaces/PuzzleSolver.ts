export type PuzzleSolutionResult<T> = {
    result: T;
    executionTime: number;
};

export type RunResults = {
    part1Result: PuzzleSolutionResult<string | number>;
    part2Result: PuzzleSolutionResult<string | number>;
};

export interface PuzzleSolver {
    inputData: string | string[];
    parsedData: any;

    loadInputData(): Promise<void>;
    parseInputData(): Promise<void>;

    solvePart1(): Promise<any>;
    solvePart2(): Promise<any>;

    run(filename?: string): Promise<RunResults>;
}
