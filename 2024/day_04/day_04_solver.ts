import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const targetPath = __dirname + '/../data/day_04/04.txt';

const puzzleInput = fs.readFileSync(targetPath).toString().replace(/\r/g, '').trim().split('\n');

const lettersGrid = puzzleInput.map((row) => row.split(''));

const inBounds = (i: number, j: number) => {
    return i >= 0 && i < lettersGrid.length && j >= 0 && j < lettersGrid[i].length;
};

const directions = [
    { dx: 0, dy: -1 }, // up
    { dx: 1, dy: -1 }, // up-right
    { dx: 1, dy: 0 }, // right
    { dx: 1, dy: 1 }, // down-right
    { dx: 0, dy: 1 }, // down
    { dx: -1, dy: 1 }, // down-left
    { dx: -1, dy: 0 }, // left
    { dx: -1, dy: -1 }, // up-left
];

const wordsInGrid = [];
for (let y = 0; y < lettersGrid.length; y++) {
    for (let x = 0; x < lettersGrid[y].length; x++) {
        for (const direction of directions) {
            let currentX = x;
            let currentY = y;
            const current = lettersGrid[currentY][currentX];

            const lettersInDirection = [];
            lettersInDirection.push(current);

            if (inBounds(currentY + direction.dy, currentX + direction.dx)) {
                lettersInDirection.push(lettersGrid[currentY + direction.dy][currentX + direction.dx]);

                let nextInDirectionX = currentX + direction.dx;
                let nextInDirectionY = currentY + direction.dy;
                for (let i = 0; i < 2; i++) {
                    nextInDirectionX += direction.dx;
                    nextInDirectionY += direction.dy;
                    if (inBounds(nextInDirectionY, nextInDirectionX)) {
                        const nextLetter = lettersGrid[nextInDirectionY][nextInDirectionX];
                        lettersInDirection.push(nextLetter);
                    }
                }
            }

            const word = lettersInDirection.join('');
            if (word === 'XMAS') {
                wordsInGrid.push(word);
            }
        }
    }
}

console.log(`Words XMAS found: ${wordsInGrid.length}`);
