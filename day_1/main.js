var fs = require('fs');
var getPuzzleInput = function (fileName) {
    return fs
        .readFileSync("".concat(__dirname, "/").concat(fileName, ".txt"))
        .toString()
        .replace(/\r/g, '')
        .trim()
        .split('\n');
};
var getDoubleDigitsFromInput = function (input) {
    return input.map(function (line) {
        var regex = /\d/g;
        var matchedDigits = Array.from(line.matchAll(regex), function (match) { return match[0]; });
        if (matchedDigits.length === 0)
            return 0;
        var numberRepresentation = matchedDigits.length > 1
            ? matchedDigits[0] + matchedDigits[matchedDigits.length - 1]
            : matchedDigits[0] + matchedDigits[0];
        return Number(numberRepresentation);
    });
};
var calculateCalibrationSum = function (input) {
    return input.reduce(function (a, cv) { return a + cv; }, 0);
};
var part1 = function () {
    console.log('------------------- PART 1 -------------------');
    console.time('How much time to process Part 1');
    var puzzleInput = getPuzzleInput('p_input');
    var doubleDigitsFromInput = getDoubleDigitsFromInput(puzzleInput);
    var calibrationSum = calculateCalibrationSum(doubleDigitsFromInput);
    console.timeEnd('How much time to process Part 1');
    console.log("Sum of all calibration values: ".concat(calibrationSum));
    console.log('----------------------------------------------');
};
part1();
var part2 = function () {
    console.log('------------------- PART 2 -------------------');
    console.time('How much time to process Part 2');
    var puzzleInput = getPuzzleInput('p_input').map(function (line) {
        return line.toLowerCase();
    });
    var digitsSpelledOut = {
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
    var digitSpelled = Object.keys(digitsSpelledOut);
    var mappedSpelledToDigits = [];
    for (var _i = 0, puzzleInput_1 = puzzleInput; _i < puzzleInput_1.length; _i++) {
        var line = puzzleInput_1[_i];
        var transformPieces = [];
        for (var i = 0; i < line.length; i++) {
            var char = line[i];
            if (Number.isInteger(Number(char))) {
                transformPieces.push(char);
                continue;
            }
            for (var _a = 0, digitSpelled_1 = digitSpelled; _a < digitSpelled_1.length; _a++) {
                var word = digitSpelled_1[_a];
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
    var doubleDigitsFromInput = getDoubleDigitsFromInput(mappedSpelledToDigits);
    var calibrationSum = calculateCalibrationSum(doubleDigitsFromInput);
    console.timeEnd('How much time to process Part 2');
    console.log("Sum of all calibration values: ".concat(calibrationSum));
    console.log('----------------------------------------------');
};
part2();
