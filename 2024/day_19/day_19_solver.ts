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

const possibleDesigns = (towelPatterns: string[], desiredDesigns: string[]): [number, number] => {
    const patternsSet = new Set(towelPatterns);
    const memo: Map<string, number> = new Map();

    function countArrangements(design: string): number {
        if (design === '') return 1;

        if (memo.has(design)) return memo.get(design)!;

        let arrangementsWays = 0;

        for (let i = 1; i <= design.length; i++) {
            const prefix = design.substring(0, i);
            const suffix = design.substring(i);

            if (patternsSet.has(prefix)) {
                arrangementsWays += countArrangements(suffix);
            }
        }

        memo.set(design, arrangementsWays);
        return arrangementsWays;
    }

    let totalArrangements = 0;
    for (const design of desiredDesigns) {
        totalArrangements += countArrangements(design);
    }

    const possibleDesignsCount = desiredDesigns.filter((design) => countArrangements(design) > 0).length;

    return [totalArrangements, possibleDesignsCount];
};

const [totalArrangementsCount, possibleDesignsCount] = possibleDesigns(towelPatterns, designPatterns);
console.log(`Possible designs: ${possibleDesignsCount} and can be arranged in ${totalArrangementsCount} ways`);
