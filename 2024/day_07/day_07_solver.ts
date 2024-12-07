import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const targetPath = __dirname + '/../data/day_07/t07.txt';

const puzzleInput = fs.readFileSync(targetPath).toString().replace(/\r/g, '').trim().split('\n');

const evaluateBinaryEquations = (equationsList: string[]): number[] => {
    const possibleEquationResults = [] as number[];
    for (const line of equationsList) {
        let [leftSiteOfEquation, numbersList] = line.split(':');
        const numbers = numbersList.trim().split(' ').map(Number);
        const resultNumber = parseInt(leftSiteOfEquation);

        const possibleSpaces = numbers.length - 1;

        const operatorsCombinations = [];
        for (let i = 0; i < 2 ** possibleSpaces; i++) {
            let binary = i.toString(2);
            let binaryLength = binary.length;
            let binaryWithZeros = '0'.repeat(possibleSpaces - binaryLength) + binary;
            operatorsCombinations.push(binaryWithZeros.split(''));
        }

        for (const combination of operatorsCombinations) {
            let numbersCopy = [...numbers];
            let operatorsCopy = [...combination];
            let result = numbersCopy.shift();
            while (numbersCopy.length > 0) {
                let operator = operatorsCopy.shift();
                let number = numbersCopy.shift();

                if (operator === '0') {
                    result += number;
                } else {
                    result *= number;
                }

                if (result > resultNumber || result === resultNumber) {
                    break;
                }
            }

            if (result === resultNumber) {
                possibleEquationResults.push(result);
                break;
            }
        }
    }

    return possibleEquationResults;
};

const totalCalibrationResult = evaluateBinaryEquations(puzzleInput).reduce(
    (acc, resultNumber) => acc + resultNumber,
    0
);
console.log('Total calibration result:', totalCalibrationResult);
