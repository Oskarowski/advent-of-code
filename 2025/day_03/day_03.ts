const puzzleContent = await Bun.file('./p.txt')
    .text()
    .then((data) => data.trim());

function solvePart1(puzzleContent: string): number {
    const maxTotalJoltage = puzzleContent
        .split('\n')
        .map((r) => r.trim())
        .reduce((acc: number, curr: string, index: number) => {
            const possibleJoltages = curr.split('');

            let max = -Infinity;
            for (let l = 0; l < possibleJoltages.length; l++) {
                for (let ll = l + 1; ll < possibleJoltages.length; ll++) {
                    const joltage = Number(possibleJoltages[l] + possibleJoltages[ll]);
                    if (joltage > max) {
                        max = joltage;
                    }
                }
            }

            return acc + max;
        }, 0);

    return maxTotalJoltage;
}

console.log('Part 1 solution:', solvePart1(puzzleContent));

function solvePart2(puzzleContent: string): number {
    const lines = puzzleContent.split('\n').map((r) => r.trim());

    const findMaxKDigits = (line: string, k = 12): number => {
        const lineLength = line.length;
        const result: string[] = [];
        let srcIndex = 0;

        for (let i = 0; i < k; i++) {
            const maxSearchIndex = lineLength - k + i;
            let maxDigit = '-1';
            let maxDigitIndex = srcIndex;

            for (let j = srcIndex; j <= maxSearchIndex; j++) {
                if (line[j] > maxDigit) {
                    maxDigit = line[j];
                    maxDigitIndex = j;
                }
            }
            result.push(maxDigit);
            srcIndex = maxDigitIndex + 1;
        }
        return Number(result.join(''));
    };

    const totalMaxJoltage = lines.reduce((acc: number, curr: string) => {
        const maxLineJoltage = findMaxKDigits(curr, 12);
        return acc + maxLineJoltage;
    }, 0);

    return totalMaxJoltage;
}

console.log('Part 2 solution:', solvePart2(puzzleContent));
