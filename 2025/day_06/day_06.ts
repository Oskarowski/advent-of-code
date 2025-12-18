const puzzleContent = await Bun.file('./t.txt')
    .text()
    .then((d) => d.trim());

function solvePart1(puzzleContent: string): number {
    const transpose = (arr) => arr[0].map((_, colIndex) => arr.map((row) => row[colIndex]));

    const originalMathWorksheet: string[][] = puzzleContent.split('\n').map((l) => l.trim().split(/\s+/));

    const mathWorksheet: string[][] = transpose(originalMathWorksheet);
    console.log(mathWorksheet);

    let grantTotalResult = 0;
    for (const mathProblem of mathWorksheet) {
        const operator = mathProblem.at(-1);
        const numbers = mathProblem.slice(0, mathProblem.length - 1).map(Number);

        let operationsResult = 0;
        switch (operator) {
            case '+':
                operationsResult = numbers.reduce((a, b) => a + b, 0);
                break;
            case '*':
                operationsResult = numbers.reduce((acc, curr) => acc * curr, 1);
                break;
            default:
                throw new Error('Upsik something went because operator is unknown: ' + operator);
        }

        grantTotalResult += operationsResult;
    }

    return grantTotalResult;
}

console.log('Part 1 solution:', solvePart1(puzzleContent));

function solvePart2(puzzleContent: string): number {
    const transpose = (arr) => arr[0].map((_, colIndex) => arr.map((row) => row[colIndex]));

    const originalMathWorksheet: string[][] = puzzleContent.split('\n').map((l) => l.trim().split(/\s+/));

    const mathWorksheet: string[][] = transpose(originalMathWorksheet);

    let grantTotalResult = 0;
    for (const mathProblem of mathWorksheet) {
        const operator = mathProblem.at(-1);

        let maxPseudoNumLength = 0;
        const pseudoNumbers = mathProblem
            .slice(0, mathProblem.length - 1)
            .map((pn) => {
                if (pn.length > maxPseudoNumLength) maxPseudoNumLength = pn.length;
                return pn;
            })
            .map((pn) => {
                return pn.padStart(maxPseudoNumLength, '#');
            });

        console.log('Pseudo numbers:', pseudoNumbers, 'Operator:', operator);

        const numbers: number[] = [];

        for (let pos = maxPseudoNumLength - 1; pos >= 0; pos--) {
            let numStr = '';
            for (const ps of pseudoNumbers) {
                const char = ps.charAt(pos);
                if (char !== '#') {
                    numStr += char;
                }
            }
            numbers.push(Number(numStr));
        }

        console.log('Parsed numbers:', numbers);

        let operationsResult = 0;
        switch (operator) {
            case '+':
                operationsResult = numbers.reduce((a, b) => a + b, 0);
                break;
            case '*':
                operationsResult = numbers.reduce((acc, curr) => acc * curr, 1);
                break;
            default:
                throw new Error('Upsik something went because operator is unknown: ' + operator);
        }

        grantTotalResult += operationsResult;
    }

    return grantTotalResult;
}

console.log('Part 2 solution:', solvePart2(puzzleContent));
