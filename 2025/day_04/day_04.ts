const puzzleContent = await Bun.file('./p.txt')
    .text()
    .then((d) => d.trim());

function solvePart1(puzzleContent: string): number {
    const rollsOfPaperGrid = puzzleContent.split('\n').map((line) => line.trim().split(''));

    const rollsOfPaperSet = new Set();

    for (let ri = 0; ri < rollsOfPaperGrid.length; ri++) {
        const row = rollsOfPaperGrid[ri];
        for (let ci = 0; ci < row.length; ci++) {
            const char = row[ci];
            if (char === '@') {
                rollsOfPaperSet.add(`${ci}-${ri}`);
            }
        }
    }

    const adjacentFields = [
        // x, y aka col, row
        [-1, 0],
        [-1, -1],
        [0, -1],
        [1, -1],
        [1, 0],
        [1, 1],
        [0, 1],
        [-1, 1],
    ];

    let rollsAccessibleByForklift = 0;
    for (let ri = 0; ri < rollsOfPaperGrid.length; ri++) {
        const row = rollsOfPaperGrid[ri];
        for (let ci = 0; ci < row.length; ci++) {
            const char = row[ci];
            if (char === '@') {
                let adjacentRolls = 0;
                for (const [dc, dr] of adjacentFields) {
                    const adjR = ri + dr;
                    const adjC = ci + dc;
                    if (rollsOfPaperSet.has(`${adjC}-${adjR}`)) adjacentRolls++;
                }

                if (adjacentRolls < 4) {
                    rollsOfPaperGrid[ri][ci] = 'X';
                    rollsAccessibleByForklift++;
                }
            }
        }
    }

    // console.log(rollsOfPaperGrid.map((r) => r.join('')).join('\n'));

    return rollsAccessibleByForklift;
}

console.log('Part 1 solution:', solvePart1(puzzleContent));
