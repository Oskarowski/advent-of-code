import inquirer from 'inquirer';
import {
    addNewDay,
    chooseExistingDay,
    provideInputPath,
    pasteInput,
    printHello,
} from './handlers.js';

async function main() {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'Add new day',
                'Choose existing day',
                'Provide path to puzzle input',
                'Paste the input',
                'Print Hello World',
            ],
        },
    ]);

    switch (answers.action) {
        case 'Add new day':
            await addNewDay();
            break;
        case 'Choose existing day':
            await chooseExistingDay();
            break;
        case 'Provide path to puzzle input':
            await provideInputPath();
            break;
        case 'Paste the input':
            await pasteInput();
            break;
        case 'Print Hello World':
            await printHello();
            break;
    }
}

main().catch(console.error);
