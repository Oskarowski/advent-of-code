const puzzleContent = await Bun.file('./t.txt')
    .text()
    .then((d) => d.trim());

const transformIntoMatrix = (puzzleContent: string) => puzzleContent.split('\n').map((line) => line.trim());

function solvePart1(puzzleContent: string): number {
    let puzzleMatrix = transformIntoMatrix(puzzleContent);
    let totalSplits = 0;

    for (let y = 0; y < puzzleMatrix.length - 1; y++) {
        const currentLine = puzzleMatrix[y];
        const ny = y + 1;
        let nextLine = puzzleMatrix[ny].split('');

        for (let cx = 0; cx < currentLine.length; cx++) {
            if (currentLine[cx] === '|' || currentLine[cx] === 'S') {
                const downChar = nextLine[cx];
                if (downChar === '.') {
                    nextLine[cx] = '|';
                } else if (downChar === '^') {
                    const nxl = cx - 1;
                    const nxr = cx + 1;
                    try {
                        if (nextLine[nxl] === '.') {
                            nextLine[nxl] = '|';
                        }
                        if (nextLine[nxr] === '.') {
                            nextLine[nxr] = '|';
                        }
                        totalSplits++;
                    } catch (e) {
                        // ignore out of bounce
                    }
                }
            }
        }
        puzzleMatrix[ny] = nextLine.join('');
    }

    return totalSplits;
}

console.log('Part 1 solution:', solvePart1(puzzleContent));

function solvePart2(puzzleContent: string): number {
    return -1;
}

// console.log('Part 2 solution:', solvePart2(puzzleContent));
