import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const targetPath = __dirname + '/../data/day_11/t11.txt';

const stones = fs.readFileSync(targetPath).toString().replace(/\r/g, '').trim().split(' ');

const handleFirstRule = (stone: string): { engraving: string; handled: boolean } => {
    if (stone === '0') {
        return { engraving: '1', handled: true };
    }

    return { engraving: stone, handled: false };
};

const handleSecondRule = (stone: string): { leftStone: string; rightStone: string; handled: boolean } => {
    const amountOfDigits = stone.length;

    if (amountOfDigits % 2 === 0) {
        const leftStone = stone.slice(0, amountOfDigits / 2);
        const rightStone = String(Number(stone.slice(amountOfDigits / 2)));

        return { leftStone, rightStone, handled: true };
    }

    return { leftStone: '', rightStone: '', handled: false };
};

const handleDefaultRule = (stone: string): { engraving: string; handled: boolean } => {
    return { engraving: String(Number(stone) * 2024), handled: true };
};

const handleBlinks = (stones: string[], blinksCount: number): string[] => {
    let afterBlinkStones = [...stones];

    while (blinksCount > 0) {
        const updatedStones = afterBlinkStones.flatMap((stone) => {
            const { engraving, handled } = handleFirstRule(stone);

            if (handled) {
                return [engraving];
            }

            const { leftStone, rightStone, handled: secondRuleHandled } = handleSecondRule(stone);

            if (secondRuleHandled) {
                return [leftStone, rightStone];
            }

            const { engraving: defaultEngraving, handled: defaultHandled } = handleDefaultRule(stone);

            if (defaultHandled) {
                return [defaultEngraving];
            }

            return [stone];
        })

        afterBlinkStones = updatedStones;
        blinksCount--;
    }

    return afterBlinkStones;
};

const stonesAfterBlinks = handleBlinks(stones, 25);
console.log(`Stones after 25 blinks: ${stonesAfterBlinks.length}`);