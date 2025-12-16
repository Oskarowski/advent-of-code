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
            // console.log('For', curr, 'max joltages found:', max);

            return acc + max;
        }, 0);

    return maxTotalJoltage;
}

console.log(`Part 1 solution: ${solvePart1(puzzleContent)}`);
