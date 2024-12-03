import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const targetPath = __dirname + '/../data/day_03/03.txt';

const puzzleInput = fs.readFileSync(targetPath).toString().replace(/\r/g, '').trim().split('\n');

const mulPattern = /mul\((\d{1,3})\,(\d{1,3})\)/;
const instructionPattern = /(mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\))/g;

let allMulExecutedResult = 0;
let conditionalMulExecutedResult = 0;
let allowInstructionExecution = true;

for (const line of puzzleInput) {
    const matches = line.match(instructionPattern);
    if (!matches) {
        continue;
    }

    for (const instruction of matches) {
        if (mulPattern.test(instruction)) {
            const [x, y] = instruction.match(/\d{1,3}/g).map(Number);
            allMulExecutedResult += x * y;

            if (allowInstructionExecution) {
                conditionalMulExecutedResult += x * y;
            }
        } else if (instruction === 'do()') {
            allowInstructionExecution = true;
        } else if (instruction === "don't()") {
            allowInstructionExecution = false;
        }
    }
}

console.log(`Mul Instruction Executions Result: ${allMulExecutedResult}`);
console.log(`Conditional Mul Instruction Executions Result: ${conditionalMulExecutedResult}`);
