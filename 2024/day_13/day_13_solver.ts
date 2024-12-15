import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getDefaultResultOrder } from 'dns';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const targetPath = __dirname + '/../data/day_13/t13.txt';

const puzzleInput = fs.readFileSync(targetPath).toString().replace(/\r/g, '').trim().split('\n\n');

type Machine = {
    btnA: { dx: number; dy: number; cost: number };
    btnB: { dx: number; dy: number; cost: number };
    prize: { x: number; y: number };
    pushes?: { btnA: number; btnB: number };
    tokensToWin?: number;
};

const mapPuzzleInputIntoMachines = (puzzleInput: string[]): Machine[] => {
    const machines: Machine[] = [];

    const btnRegex = /\b[XY]\+(\d+)\b/g;
    const prizeRegex = /X\=(\d+), Y\=(\d+)/;

    for (const machineData of puzzleInput) {
        const [btnAData, btnBData, prizeData] = machineData.split('\n');

        const btnA = {
            dx: parseInt(btnAData.match(btnRegex)[0].split('+')[1]),
            dy: parseInt(btnAData.match(btnRegex)[1].split('+')[1]),
            cost: 3,
        };

        const btnB = {
            dx: parseInt(btnBData.match(btnRegex)[0].split('+')[1]),
            dy: parseInt(btnBData.match(btnRegex)[1].split('+')[1]),
            cost: 1,
        };

        const prizeMatch = prizeRegex.exec(prizeData);
        const prize = {
            x: parseInt(prizeMatch[1]),
            y: parseInt(prizeMatch[2]),
        };

        machines.push({ btnA, btnB, prize });
    }

    return machines;
};

const machines = mapPuzzleInputIntoMachines(puzzleInput);

const computeWinableMachines = (machines: Machine[], applyMeasurementsCorrection = false): Machine[] => {
    const winableMachines: Machine[] = [];

    for (const machine of machines) {
        const { btnA, btnB, prize } = machine;

        if (applyMeasurementsCorrection) {
            prize.x += 10000000000000;
            prize.y += 10000000000000;
        }

        const B = (btnA.dx * prize.y - prize.x * btnA.dy) / (btnA.dx * btnB.dy - btnB.dx * btnA.dy);
        const A = (prize.x - B * btnB.dx) / btnA.dx;

        if (A >= 0 && B >= 0 && Number.isInteger(A) && Number.isInteger(B)) {
            machine.pushes = { btnA: A, btnB: B };
            machine.tokensToWin = A * btnA.cost + B * btnB.cost;
            winableMachines.push(machine);
        }
    }

    return winableMachines;
};

const windableMachinesWithErrors = computeWinableMachines(machines);

const computeTotalTokensNeeded = (machines: Machine[]): number => {
    return machines.reduce((acc, machine) => acc + machine.tokensToWin, 0);
};

console.log(`Total tokens needed to win all prizes: ${computeTotalTokensNeeded(windableMachinesWithErrors)}`);

const windableMachinesWithoutErrors = computeWinableMachines(machines, true);

console.log(
    `Total tokens needed to win all prizes with measurements error applied: ${computeTotalTokensNeeded(
        windableMachinesWithoutErrors
    )}`
);
