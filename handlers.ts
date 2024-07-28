import inquirer from 'inquirer';
import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';

// Derive __dirname from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Function to list all day directories for a specific year
 *
 * @export
 * @param {string} chosenYear
 * @return {Promise<void>}  {Promise<void>}
 */
export async function printDayDirectoriesByYear(
    chosenYear: string
): Promise<void> {
    const solutionsYearDir = path.join(__dirname, chosenYear);

    if (!fs.existsSync(solutionsYearDir)) {
        console.log(
            chalk.red(
                `The directory for the year ${chosenYear} does not exist.`
            )
        );
        return;
    }

    const allDirentInDir = fs.readdirSync(solutionsYearDir, {
        withFileTypes: true,
    });

    const daySolutionsDirs = allDirentInDir
        .filter(
            (dirent) => dirent.isDirectory() && dirent.name.startsWith('day_')
        )
        .map((dirent) => dirent.name);

    if (daySolutionsDirs.length > 0) {
        console.log(
            chalk.green(
                `Days with solutions for year ${chalk.bold(chosenYear)}:`
            )
        );
        daySolutionsDirs.forEach((dir) => {
            const [dayPart, ...rest] = dir.split('_');
            const formattedDayPart = chalk.cyan(dayPart + '_'); // Color day
            const formattedDay = chalk.yellow(rest.join('_')); // Color which day
            console.log(`- ${formattedDayPart}${formattedDay}`);
        });
    } else {
        console.log(
            chalk.red(`No days with solutions found for year ${chosenYear}.`)
        );
    }
}
