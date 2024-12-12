import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { performance } from 'perf_hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const targetPath = __dirname + '/../data/day_11/t11.txt';

const stones = fs
    .readFileSync(targetPath)
    .toString()
    .replace(/\r/g, '')
    .trim()
    .split(' ')
    .map((stone) => ({ engraving: stone, amount: 1 }));

const handleFirstRule = (stone: { engraving: string; amount: number }): { engraving: string; amount: number }[] => {
    if (stone.engraving === '0') {
        return [{ engraving: '1', amount: stone.amount }];
    }
    return [];
};

const handleSecondRule = (stone: { engraving: string; amount: number }): { engraving: string; amount: number }[] => {
    const amountOfDigits = stone.engraving.length;

    if (amountOfDigits % 2 === 0) {
        const leftStone = stone.engraving.slice(0, amountOfDigits / 2);
        const rightStone = String(Number(stone.engraving.slice(amountOfDigits / 2)));

        return [
            { engraving: leftStone, amount: stone.amount },
            { engraving: rightStone, amount: stone.amount },
        ];
    }

    return [];
};

const handleDefaultRule = (stone: { engraving: string; amount: number }): { engraving: string; amount: number }[] => {
    const engraving = String(Number(stone.engraving) * 2024);

    return [{ engraving: engraving, amount: stone.amount }];
};

const handleBlinks = (
    stones: { engraving: string; amount: number }[],
    blinksCount: number
): Map<string, { engraving: string; amount: number }> => {
    let stonesMap = new Map<string, { engraving: string; amount: number }>();

    stones.forEach((stone) => {
        stonesMap.set(stone.engraving, stone);
    });

    while (blinksCount > 0) {
        const newStonesMap = new Map();

        stonesMap.forEach((stone) => {
            let generatedStones: { engraving: string; amount: number }[] = [];

            generatedStones = handleFirstRule(stone);
            if (!generatedStones.length) {
                generatedStones = handleSecondRule(stone);
            }
            if (!generatedStones.length) {
                generatedStones = handleDefaultRule(stone);
            }

            generatedStones.forEach((generatedStone) => {
                if (newStonesMap.has(generatedStone.engraving)) {
                    newStonesMap.get(generatedStone.engraving).amount += generatedStone.amount;
                } else {
                    newStonesMap.set(generatedStone.engraving, generatedStone);
                }
            });
        });

        stonesMap = newStonesMap;
        blinksCount--;
    }

    return stonesMap;
};

const countStones = (stones: Map<string, { engraving: string; amount: number }>): number => {
    let count = 0;

    for (const stone of stones.values()) {
        count += stone.amount;
    }

    return count;
};

const amountOfBlinks = 75;

const handleBlinksStart = performance.now();
const stonesAfterBlinks = handleBlinks(stones, amountOfBlinks);
const handleBlinksEnd = performance.now();
console.log(`handleBlinks Execution Time: ${(handleBlinksEnd - handleBlinksStart).toFixed(2)} ms`);

const countStonesStart = performance.now();
const totalStonesCount = countStones(stonesAfterBlinks);
const countStonesEnd = performance.now();
console.log(`countStones Execution Time: ${(countStonesEnd - countStonesStart).toFixed(2)} ms`);

console.log(`Stones after ${amountOfBlinks} blinks: ${totalStonesCount}`);
