"use strict";
const fs = require('fs');
const getPuzzleInput = (fileName) => fs
    .readFileSync(`${__dirname}/${fileName}.txt`)
    .toString()
    .replace(/\r/g, '')
    .trim()
    .split('\n');
const getDoubleDigitsFromInput = (input) => {
    return input.map((line) => {
        const regex = /\d/g;
        const matchedDigits = Array.from(line.matchAll(regex), (match) => match[0]);
        if (matchedDigits.length === 0)
            return 0;
        const numberRepresentation = matchedDigits.length > 1
            ? matchedDigits[0] + matchedDigits[matchedDigits.length - 1]
            : matchedDigits[0] + matchedDigits[0];
        return Number(numberRepresentation);
    });
};
const calculateCalibrationSum = (input) => {
    return input.reduce((a, cv) => a + cv, 0);
};
const part1 = () => {
    console.log('------------------- PART 1 -------------------');
    console.time('How much time to process Part 1');
    const puzzleInput = getPuzzleInput('p_input');
    const doubleDigitsFromInput = getDoubleDigitsFromInput(puzzleInput);
    const calibrationSum = calculateCalibrationSum(doubleDigitsFromInput);
    console.timeEnd('How much time to process Part 1');
    console.log(`Sum of all calibration values: ${calibrationSum}`);
    console.log('----------------------------------------------');
};
part1();
const part2 = () => {
    console.log('------------------- PART 2 -------------------');
    console.time('How much time to process Part 2');
    const puzzleInput = getPuzzleInput('p_input').map((line) => {
        return line.toLowerCase();
    });
    const digitsSpelledOut = {
        one: '1',
        two: '2',
        three: '3',
        four: '4',
        five: '5',
        six: '6',
        seven: '7',
        eight: '8',
        nine: '9',
    };
    const digitSpelled = Object.keys(digitsSpelledOut);
    const mappedSpelledToDigits = [];
    for (const line of puzzleInput) {
        let transformPieces = [];
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (Number.isInteger(Number(char))) {
                transformPieces.push(char);
                continue;
            }
            for (const word of digitSpelled) {
                if (line.startsWith(word, i)) {
                    transformPieces.push(digitsSpelledOut[word]);
                }
            }
        }
        mappedSpelledToDigits.push(transformPieces.join(''));
    }
    /*
    IMPORTANT:
        const regex = new RegExp(Object.keys(digitsSpelledOut).join('|'), 'g');

        this won't work because of case: "eightwo" which will be transformed to "88" instead of "82"
        const mappedValues = puzzleInput.map((line: string) => {
            return line.replaceAll(regex, (match) => digitsSpelledOut[match]);
        });
    */
    const doubleDigitsFromInput = getDoubleDigitsFromInput(mappedSpelledToDigits);
    const calibrationSum = calculateCalibrationSum(doubleDigitsFromInput);
    console.timeEnd('How much time to process Part 2');
    console.log(`Sum of all calibration values: ${calibrationSum}`);
    console.log('----------------------------------------------');
};
part2();
