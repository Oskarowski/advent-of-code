import inquirer from 'inquirer';
import { printDayDirectoriesByYear } from './handlers.js';

async function main() {
    const actionAnswer = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: ['List all days with solutions'],
        },
    ]);

    const yearAnswer = await inquirer.prompt([
        {
            type: 'input',
            name: 'year',
            message: 'Enter the year:',
            validate: (input) => {
                return /^\d{4}$/.test(input)
                    ? true
                    : 'Please enter a valid year.';
            },
        },
    ]);

    switch (actionAnswer.action) {
        case 'List all days with solutions':
            await printDayDirectoriesByYear(yearAnswer.year);
            break;
    }
}

main().catch(console.error);
