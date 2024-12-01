import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const targetPath = __dirname + '/../data/day_01/01.txt';

const puzzleInput = fs.readFileSync(targetPath).toString().replace(/\r/g, '').trim().split('\n');

const lists = puzzleInput.map((pair) => pair.split('   ').map(Number));

const sortedLists = lists.slice().sort((a, b) => a[0] - b[0]);
const leftListSorted = sortedLists.map((pair) => pair[0]);
const rightListSorted = lists.map((pair) => pair[1]).sort((a, b) => a - b);

let distanceBetween = 0;
const rightListFrequency = new Map();

for (let i = 0; i < lists.length; i++) {
    const [left, right] = lists[i];

    if (rightListFrequency.has(right)) {
        rightListFrequency.set(right, rightListFrequency.get(right) + 1);
    } else {
        rightListFrequency.set(right, 1);
    }

    distanceBetween += Math.abs(rightListSorted[i] - leftListSorted[i]);
}

console.log(distanceBetween);

const similarityScore = lists.reduce((acc, [left]) => {
    const freq = rightListFrequency.get(left) || 0;
    return acc + left * freq;
}, 0);

console.log(similarityScore);
