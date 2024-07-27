import inquirer from 'inquirer';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import fs from 'node:fs';

// Derive __dirname from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function addNewDay() {
    const { day } = await inquirer.prompt([
        {
            type: 'input',
            name: 'day',
            message: 'Enter the day number:',
        },
    ]);

    const dayDir = join(__dirname, 'days', `day${day}`);
    if (!fs.existsSync(dayDir)) {
        fs.mkdirSync(dayDir, { recursive: true });
    }

    fs.writeFileSync(join(dayDir, 'input.txt'), '');
    fs.writeFileSync(
        join(dayDir, 'solution.ts'),
        `
    export function solve(input: string) {
      // Your solution here
    }
  `
    );

    console.log(`Day ${day} created successfully.`);
}

export async function chooseExistingDay() {
    const days = fs
        .readdirSync(join(__dirname, 'days'))
        .filter((dir: string) => dir.startsWith('day'));

    const { day } = await inquirer.prompt([
        {
            type: 'list',
            name: 'day',
            message: 'Choose a day:',
            choices: days,
        },
    ]);

    const input = fs.readFileSync(
        join(__dirname, 'days', day, 'input.txt'),
        'utf-8'
    );

    // Import the solve function dynamically
    const { solve } = await import(
        `file://${join(__dirname, 'days', day, 'solution.ts')}`
    );

    const startTime = Date.now();
    const result = solve(input);
    const endTime = Date.now();

    console.log(`Result: ${result}`);
    console.log(`Execution time: ${endTime - startTime}ms`);
}

export async function provideInputPath() {
    const { filePath } = await inquirer.prompt([
        {
            type: 'input',
            name: 'filePath',
            message: 'Provide the path to the puzzle input file:',
        },
    ]);

    const input = fs.readFileSync(filePath, 'utf-8');
    const { day } = await inquirer.prompt([
        {
            type: 'input',
            name: 'day',
            message: 'Enter the day number for which to use this input:',
        },
    ]);

    const dayDir = join(__dirname, 'days', `day${day}`);
    if (!fs.existsSync(dayDir)) {
        console.error(`Day ${day} does not exist.`);
        return;
    }

    const { solve } = await import(`file://${join(dayDir, 'solution.ts')}`);

    const startTime = Date.now();
    const result = solve(input);
    const endTime = Date.now();

    console.log(`Result: ${result}`);
    console.log(`Execution time: ${endTime - startTime}ms`);
}

export async function pasteInput() {
    const { input } = await inquirer.prompt([
        {
            type: 'editor',
            name: 'input',
            message: 'Paste your puzzle input:',
        },
    ]);

    const { day } = await inquirer.prompt([
        {
            type: 'input',
            name: 'day',
            message: 'Enter the day number for which to use this input:',
        },
    ]);

    const dayDir = join(__dirname, 'days', `day${day}`);
    if (!fs.existsSync(dayDir)) {
        console.error(`Day ${day} does not exist.`);
        return;
    }

    const { solve } = await import(`file://${join(dayDir, 'solution.ts')}`);

    const startTime = Date.now();
    const result = solve(input);
    const endTime = Date.now();

    console.log(`Result: ${result}`);
    console.log(`Execution time: ${endTime - startTime}ms`);
}

export async function printHello(){
    console.log("Hi, Hello World");
}