const puzzleContent = await Bun.file('./p.txt')
    .text()
    .then((d) => d.trim());

function solvePart1(puzzleContent: string): number {
    let puzzleMatrix = puzzleContent.split('\n').map((line) => line.trim().split(''));
    let totalSplits = 0;

    for (let y = 0; y < puzzleMatrix.length - 1; y++) {
        const currentLine = puzzleMatrix[y];
        const ny = y + 1;
        let nextLine = puzzleMatrix[ny];

        for (let cx = 0; cx < currentLine.length; cx++) {
            if (!(currentLine[cx] === '|' || currentLine[cx] === 'S')) continue;

            const downChar = nextLine[cx];
            if (downChar === '.') {
                nextLine[cx] = '|';
            } else if (downChar === '^') {
                const nxl = cx - 1;
                const nxr = cx + 1;
                if (nxl >= 0 && nextLine[nxl] === '.') {
                    nextLine[nxl] = '|';
                }
                if (nxr < nextLine.length && nextLine[nxr] === '.') {
                    nextLine[nxr] = '|';
                }
                totalSplits++;
            }
        }
    }

    return totalSplits;
}

console.log('Part 1 solution:', solvePart1(puzzleContent));

function solvePart2(puzzleContent: string): number {
    const puzzleMatrix = puzzleContent.split('\n').map((line) => line.trim().split(''));
    const timelinesMatrix = Array.from({ length: puzzleMatrix.length }, () =>
        Array.from({ length: puzzleMatrix[0].length }, () => 0)
    );

    for (let y = 0; y < puzzleMatrix[0].length; y++) {
        if (puzzleMatrix[0][y] === 'S') {
            timelinesMatrix[0][y] = 1;
            break;
        }
    }

    for (let y = 0; y < timelinesMatrix.length - 1; y++) {
        const timelineRow = timelinesMatrix[y];
        const dy = y + 1;
        const nextRow = puzzleMatrix[dy];

        for (let x = 0; x < timelineRow.length; x++) {
            const point = timelineRow[x];
            if (point === 0) continue;

            const downstreamChar = nextRow[x];
            if (downstreamChar === '.') {
                timelinesMatrix[dy][x] += timelinesMatrix[y][x];
                continue;
            }
            if (downstreamChar === '^') {
                const nxl = x - 1;
                const nxr = x + 1;
                if (nxl >= 0 && nextRow[nxl] === '.') {
                    timelinesMatrix[dy][nxl] += timelinesMatrix[y][x];
                }
                if (nxr < nextRow.length && nextRow[nxr] === '.') {
                    timelinesMatrix[dy][nxr] += timelinesMatrix[y][x];
                }
            }
        }
    }

    return timelinesMatrix.at(-1).reduce((acc, curr) => acc + curr, 0);
}

console.log('Part 2 solution:', solvePart2(puzzleContent));
