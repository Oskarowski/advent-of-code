import chalk from "chalk";
import { RunResults } from "../../interfaces/PuzzleSolver";

export async function display(results: RunResults): Promise<void> {
    const formatResult = (label: string, result: any, executionTime: number) => {
        return (
            `${chalk.cyan(label)} ${chalk.bold.yellow(result)}\n` +
            `${chalk.cyan('Execution time:')} ${chalk.bold.cyanBright(`${executionTime} ms`)}`
        );
    };

    // Format and display the results
    console.log(chalk.bold('--- Part 1 Results ---'));
    console.log(
        formatResult(
            'Part 1 Result:',
            results.part1Result.result,
            results.part1Result.executionTime
        )
    );
    console.log(); // as '\n'

    console.log(chalk.bold('--- Part 2 Results ---'));
    console.log(
        formatResult(
            'Part 2 Result:',
            results.part2Result.result,
            results.part2Result.executionTime
        )
    );
}