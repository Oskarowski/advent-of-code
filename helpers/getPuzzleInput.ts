const fs = require('fs');

const getPuzzleInput = (fileName: string) =>
    fs
        .readFileSync(`${__dirname}/../data/${fileName}.txt`)
        .toString()
        .replace(/\r/g, '')
        .trim()
        .split('\n');

export { getPuzzleInput };