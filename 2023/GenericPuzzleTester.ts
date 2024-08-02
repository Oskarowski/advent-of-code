import { readFile } from 'fs/promises';
import { PuzzleSolver } from '../interfaces/PuzzleSolver';
import { PuzzleTester, TestCase, TestResult } from '../interfaces/PuzzleTester';
import { Day_14_Solver } from './day_14/Day_14_Solver.js';
import { logError, logInfo } from './helpers/ConsoleMessages.js';
import path from 'path';
import chalk from 'chalk';

function isPuzzleSolver(obj: any): obj is PuzzleSolver {
    return (
        obj &&
        typeof obj.loadInputData === 'function' &&
        typeof obj.parseInputData === 'function' &&
        typeof obj.solvePart1 === 'function' &&
        typeof obj.solvePart2 === 'function' &&
        typeof obj.run === 'function'
    );
}

export class GenericPuzzleTester implements PuzzleTester {
    solvers: { [key: number]: PuzzleSolver };

    constructor() {
        // TODO go through days dir and check for classes implementing PuzzleSolver interface and instance them here
        this.solvers = {
            14: new Day_14_Solver(),
        };
    }

    /**
     * Loads test cases from a JSON file and validates their structure.
     *
     * @private
     * @param {string} filePath - The path to the JSON file containing the test cases.
     * @return {Promise<TestCase[]>} - A promise that resolves to an array of `TestCase` objects.
     * @throws {Error} - Throws an error if the file cannot be read, if JSON parsing fails,
     *                    or if the data does not match the expected format.
     * @memberof GenericPuzzleTester
     */
    private async loadTestCases(filePath: string): Promise<TestCase[]> {
        let testCasesInfo: TestCase[] = [];

        try {
            const fileContent = await readFile(path.resolve(filePath), 'utf-8');
            try {
                testCasesInfo = JSON.parse(fileContent);
            } catch (jsonError) {
                throw new Error(`Error parsing JSON from file ${filePath}: ${jsonError.message}`);
            }

            // Validate the structure of the test cases
            if (!Array.isArray(testCasesInfo)) {
                throw new Error(
                    `Test cases should be an array. Received type: ${typeof testCasesInfo}`
                );
            }

            for (const testCase of testCasesInfo) {
                if (
                    typeof testCase.day !== 'string' ||
                    typeof testCase.description !== 'string' ||
                    typeof testCase.expectedPart1 !== 'number' ||
                    typeof testCase.expectedPart2 !== 'number' ||
                    typeof testCase.filename !== 'string'
                ) {
                    throw new Error(`Invalid test case format: ${JSON.stringify(testCase)}`);
                }
            }
        } catch (error) {
            console.error(`Error loading test cases from ${filePath}: ${error.message}`);
        }

        return testCasesInfo;
    }

    /**
     * Runs tests for specified puzzle days using test cases loaded from a JSON file.

     *
     * @param {number[]} days - An array of day numbers to run tests for.
     * @param {string} testCasesFilePath - The path to the JSON file containing the test cases.
     * @return {Promise<TestResult[]>} - A promise that resolves to an array of `TestResult` objects.
     * @memberof GenericPuzzleTester
     */
    async runTests(days: number[], testCasesFilePath: string): Promise<TestResult[]> {
        const testCases = await this.loadTestCases(testCasesFilePath);

        const testsResults: TestResult[] = [];

        for (const day of days) {
            const solver = this.solvers[day];
            if (!solver) {
                logError(`Solver for day ${day} not found.`);
                continue;
            }

            if (!isPuzzleSolver(solver)) {
                logError(`Solver for day ${day} does not implement PuzzleSolver interface.`);
                continue;
            }

            logInfo(`Testing Day ${day}...`);

            for (const testCase of testCases.filter((tc) => tc.day === day)) {
                if (!(testCase.day === day)) {
                    continue;
                }

                const result: TestResult = {
                    description: testCase.description,
                    part1: { successful: true, executionTime: -1 },
                    part2: { successful: true, executionTime: -1 },
                };

                try {
                    const solverRunResults = await solver.run(testCase.filename);
                    result.part1.executionTime = solverRunResults.part1Result.executionTime;
                    result.part2.executionTime = solverRunResults.part2Result.executionTime;

                    if (solverRunResults.part1Result.result !== testCase.expectedPart1) {
                        result.part1.successful = false;
                        result.part1.error = `Expected ${testCase.expectedPart1} but got ${solverRunResults.part1Result.result}.`;
                    }

                    if (solverRunResults.part2Result.result !== testCase.expectedPart2) {
                        result.part2.successful = false;
                        result.part2.error = `Expected ${testCase.expectedPart2} but got ${solverRunResults.part2Result.result}.`;
                    }
                } catch (error) {
                    // TODO should fail both parts or just mark whole day as unprocessable and failed?
                    result.part1.successful = false;
                    result.part1.error = `Error running part 1: ${error.message}`;
                    result.part2.successful = false;
                    result.part2.error = `Error running part 2: ${error.message}`;
                }

                testsResults.push(result);
            }
        }

        return testsResults;
    }

    /**
     *  Displays in console the results of the tests in a formatted and color-coded manner.
     *
     * @static
     * @param {TestResult[]} testsResults
     * @memberof GenericPuzzleTester
     * @return {Promise<void>}
     */
    public static async displayTestResults(testsResults: TestResult[]): Promise<void> {
        testsResults.forEach((result, index) => {
            console.log(chalk.blue(`${chalk.bold('Test ' + (index + 1))}: ${result.description}`));
            if (result.part1.successful) {
                console.log(
                    chalk.green(
                        `  ${chalk.bold('Part 1: Passed')} in ${chalk.yellow(
                            result.part1.executionTime
                        )}_ms`
                    )
                );
            } else {
                console.error(
                    chalk.red(`  ${chalk.bold('Part 1: Failed')} - ${result.part1.error}`)
                );
            }

            if (result.part2.successful) {
                console.log(
                    chalk.green(
                        `  ${chalk.bold('Part 2: Passed')} in ${chalk.yellow(
                            result.part2.executionTime
                        )}_ms`
                    )
                );
            } else {
                console.error(
                    chalk.red(`  ${chalk.bold('Part 2: Failed')} - ${result.part2.error}`)
                );
            }
        });
    }
}
