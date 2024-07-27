"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPuzzleInput = void 0;
var fs = require('fs');
var getPuzzleInput = function (fileName) {
    return fs
        .readFileSync("".concat(__dirname, "/../data/").concat(fileName, ".txt"))
        .toString()
        .replace(/\r/g, '')
        .trim()
        .split('\n');
};
exports.getPuzzleInput = getPuzzleInput;
