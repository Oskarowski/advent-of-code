import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const targetPath = __dirname + '/../data/day_05/t05.txt';

const [firstSection, secondSection] = fs.readFileSync(targetPath).toString().replace(/\r/g, '').trim().split('\n\n');

const rulesBook = new Map();

for (const ruleLine of firstSection.split('\n')) {
    const [number, marginalNumber] = ruleLine.split('|').map(Number);

    if (!rulesBook.has(number)) {
        rulesBook.set(number, []);
    }

    rulesBook.get(number).push(marginalNumber);
    rulesBook.get(number).sort((a, b) => a - b);
}

const correctUpdates = [] as number[][];
const incorrectUpdates = [] as number[][];

for (const updates of secondSection.split('\n')) {
    const updatePages = updates.split(',').map(Number);

    let correctOrder = true;
    for (let i = 0; i < updatePages.length; i++) {
        const currentPage = updatePages[i];
        const rulesForCurrentPage = rulesBook.get(currentPage);

        if (!rulesForCurrentPage) continue;

        for (const rule of rulesForCurrentPage) {
            const marginalNumberIndex = updatePages.indexOf(rule);

            if (marginalNumberIndex === -1) continue;

            if (marginalNumberIndex < i) {
                correctOrder = false;
                break;
            }
        }

        if (!correctOrder) break;
    }

    if (correctOrder) {
        correctUpdates.push(updatePages);
    } else {
        incorrectUpdates.push(updatePages);
    }
}

const middlePageNumbersForCorrectUpdates = correctUpdates.map(
    (updatePages) => updatePages[Math.floor(updatePages.length / 2)]
);
const sumMiddlePageNumbersFromCorrectUpdates = middlePageNumbersForCorrectUpdates.reduce(
    (acc, number) => acc + number,
    0
);

console.log(`Sum of middle page numbers for correct updates: ${sumMiddlePageNumbersFromCorrectUpdates}`);

const correctedUpdates = [] as number[][];
for (const incorrectUpdate of incorrectUpdates) {
    const correctedUpdate = [...incorrectUpdate];
    let swapsMade: boolean;

    do {
        swapsMade = false;

        for (let i = 0; i < correctedUpdate.length; i++) {
            const currentPage = correctedUpdate[i];
            const rulesForCurrentPage = rulesBook.get(currentPage);

            if (!rulesForCurrentPage) continue;

            for (const rule of rulesForCurrentPage) {
                const marginalNumberIndex = correctedUpdate.indexOf(rule);

                if (marginalNumberIndex !== -1 && marginalNumberIndex < i) {
                    [correctedUpdate[i], correctedUpdate[marginalNumberIndex]] = [
                        correctedUpdate[marginalNumberIndex],
                        correctedUpdate[i],
                    ];
                    swapsMade = true;
                }
            }
        }
    } while (swapsMade);

    correctedUpdates.push(correctedUpdate);
}

const middlePageNumbersForCorrectedUpdates = correctedUpdates.map(
    (updatePages) => updatePages[Math.floor(updatePages.length / 2)]
);
const sumMiddlePageNumbersForCorrectedUpdates = middlePageNumbersForCorrectedUpdates.reduce(
    (acc, number) => acc + number,
    0
);

console.log(`Sum of middle page numbers for corrected updates: ${sumMiddlePageNumbersForCorrectedUpdates}`);
