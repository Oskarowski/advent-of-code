"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPuzzleInput = void 0;
const fs = require('fs');
const getPuzzleInput = (fileName) => fs
    .readFileSync(`${__dirname}/../data/${fileName}.txt`)
    .toString()
    .replace(/\r/g, '')
    .trim()
    .split('\n');
exports.getPuzzleInput = getPuzzleInput;
