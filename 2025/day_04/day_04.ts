const puzzleContent = await Bun.file('./p.txt')
    .text()
    .then((d) => d.trim());

function solvePart1(puzzleContent: string): number {
    let rollsOfPaperGrid = puzzleContent.split('\n').map((line) => line.trim().split(''));

    const computeRollsOfPaperSet = (grid: string[][]) => {
        const set = new Set<string>();

        for (let ri = 0; ri < grid.length; ri++) {
            const row = grid[ri];
            for (let ci = 0; ci < row.length; ci++) {
                if (row[ci] === '@') {
                    set.add(`${ci}-${ri}`);
                }
            }
        }

        return set;
    };

    let rollsOfPaperSet = computeRollsOfPaperSet(rollsOfPaperGrid);

    const DIRECTIONS = [
        // x, y aka col, row
        [-1, 0],
        [-1, -1],
        [0, -1],
        [1, -1],
        [1, 0],
        [1, 1],
        [0, 1],
        [-1, 1],
    ] as const;

    const computeAccessibleRollsOfPaperGrid = (grid: string[][], rollsSet: Set<string>): [string[][], number] => {
        let rollsMarkedAsAccessible = 0;
        for (const key of rollsSet) {
            const [col, row] = key.split('-').map(Number);

            let adjacentRollsCount = 0;
            for (const [dc, dr] of DIRECTIONS) {
                const adjR = row + dr;
                const adjC = col + dc;
                if (rollsSet.has(`${adjC}-${adjR}`)) {
                    adjacentRollsCount++;
                    if (adjacentRollsCount >= 4) break;
                }
            }

            if (adjacentRollsCount < 4) {
                grid[row][col] = 'X';
                rollsMarkedAsAccessible++;
            }
        }

        return [grid, rollsMarkedAsAccessible];
    };

    let rollsMarkedAsAccessible = 0;
    [rollsOfPaperGrid, rollsMarkedAsAccessible] = computeAccessibleRollsOfPaperGrid(rollsOfPaperGrid, rollsOfPaperSet);

    return rollsMarkedAsAccessible;
}

console.log('Part 1 solution:', solvePart1(puzzleContent));

function solvePart2(puzzleContent: string): number {
    let rollsOfPaperGrid = puzzleContent.split('\n').map((line) => line.trim().split(''));

    const computeRollsOfPaperSet = (grid: string[][]) => {
        const set = new Set<string>();

        for (let ri = 0; ri < grid.length; ri++) {
            const row = grid[ri];
            for (let ci = 0; ci < row.length; ci++) {
                if (row[ci] === '@') {
                    set.add(`${ci}-${ri}`);
                }
            }
        }

        return set;
    };

    let rollsOfPaperSet = computeRollsOfPaperSet(rollsOfPaperGrid);

    const DIRECTIONS = [
        // x, y aka col, row
        [-1, 0],
        [-1, -1],
        [0, -1],
        [1, -1],
        [1, 0],
        [1, 1],
        [0, 1],
        [-1, 1],
    ] as const;

    const computeAccessibleRollsOfPaperGrid = (grid: string[][], rollsSet: Set<string>): [string[][], number] => {
        let rollsMarkedAsAccessible = 0;
        for (const key of rollsSet) {
            const [col, row] = key.split('-').map(Number);

            let adjacentRollsCount = 0;
            for (const [dc, dr] of DIRECTIONS) {
                const adjR = row + dr;
                const adjC = col + dc;
                if (rollsSet.has(`${adjC}-${adjR}`)) {
                    adjacentRollsCount++;
                    if (adjacentRollsCount >= 4) break;
                }
            }

            if (adjacentRollsCount < 4) {
                grid[row][col] = 'X';
                rollsMarkedAsAccessible++;
            }
        }

        return [grid, rollsMarkedAsAccessible];
    };

    const removeAccessibleRollsOfPaper = (grid: string[][]) => {
        for (let ri = 0; ri < grid.length; ri++) {
            const row = grid[ri];
            for (let ci = 0; ci < row.length; ci++) {
                if (row[ci] === 'X') {
                    row[ci] = '.';
                }
            }
        }
        return grid;
    };

    let rollsAccessibleByForklift = 0;
    let rollsMarkedAsAccessible = 0;
    [rollsOfPaperGrid, rollsMarkedAsAccessible] = computeAccessibleRollsOfPaperGrid(rollsOfPaperGrid, rollsOfPaperSet);
    while (rollsMarkedAsAccessible > 0) {
        rollsAccessibleByForklift += rollsMarkedAsAccessible;
        rollsOfPaperSet = computeRollsOfPaperSet(rollsOfPaperGrid);
        rollsOfPaperGrid = removeAccessibleRollsOfPaper(rollsOfPaperGrid);
        [rollsOfPaperGrid, rollsMarkedAsAccessible] = computeAccessibleRollsOfPaperGrid(
            rollsOfPaperGrid,
            rollsOfPaperSet
        );
    }

    return rollsAccessibleByForklift;
}

console.log('Part 2 solution:', solvePart2(puzzleContent));
