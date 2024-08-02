export type TestResult = {
    description?: string;
    part1: {
        successful: boolean;
        executionTime: number;
        error?: string;
    };
    part2: {
        successful: boolean;
        executionTime: number;
        error?: string;
    };
};

export type TestCase = {
    day: number;
    description?: string;
    expectedPart1?: string | number;
    expectedPart2?: string | number;
    filename: string;
};

export interface PuzzleTester {
    runTests(days: number[], testCasesFilePath: string): Promise<TestResult[]>;
}
