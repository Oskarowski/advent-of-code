var fs = require('fs');
var puzzleInput = fs
    .readFileSync("".concat(__dirname, "/p_input.txt"))
    .toString()
    .replace(/\r/g, '')
    .trim()
    .split('\n');
var part1 = function () {
    console.log('------------------- PART 1 -------------------');
    console.time('How much time to process Part 1');
    var mappedValues = puzzleInput.map(function (line) {
        var regex = /\d/g;
        var matchedDigits = Array.from(line.matchAll(regex), function (match) { return match[0]; });
        if (matchedDigits.length === 0)
            return 0;
        var numberRepresentation = matchedDigits.length > 1
            ? matchedDigits[0] + matchedDigits[matchedDigits.length - 1]
            : matchedDigits[0] + matchedDigits[0];
        return Number(numberRepresentation);
    });
    var calibratedSum = mappedValues.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
    }, 0);
    console.timeEnd('How much time to process Part 1');
    console.log("Sum of all calibration values: ".concat(calibratedSum));
    console.log('----------------------------------------------');
};
part1();
