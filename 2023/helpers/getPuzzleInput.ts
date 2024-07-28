import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getPuzzleInput = (fileName: string): string[] =>
    fs
        .readFileSync(`${__dirname}/../data/${fileName}.txt`)
        .toString()
        .replace(/\r/g, '')
        .trim()
        .split('\n');

export { getPuzzleInput };