import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const targetPath = __dirname + '/../data/day_19/t19.txt';

const [availableTowelsInput, desiredDesignsInput] = fs
    .readFileSync(targetPath)
    .toString()
    .replace(/\r/g, '')
    .trim()
    .split('\n\n');

const towelPatterns = availableTowelsInput.split(', ');
const designPatterns = desiredDesignsInput.split('\n');

const countPossibleDesigns = (towelPatterns: string[], designs: string[]): number => {
    const patternsSet = new Set(towelPatterns);
    const memo: Map<string, boolean> = new Map();

    function canFormDesign(design: string): boolean {
        if (design === '') return true;

        if (memo.has(design)) return memo.get(design)!;

        for (let i = 1; i <= design.length; i++) {
            const prefix = design.substring(0, i);
            const suffix = design.substring(i);

            if (patternsSet.has(prefix) && canFormDesign(suffix)) {
                memo.set(design, true);
                return true;
            }
        }

        memo.set(design, false);
        return false;
    }

    let possibleCount = 0;
    for (const design of designs) {
        if (canFormDesign(design)) {
            possibleCount++;
        }
    }

    return possibleCount;
};

const result = countPossibleDesigns(towelPatterns, designPatterns);
console.log('Number of possible designs:', result);
