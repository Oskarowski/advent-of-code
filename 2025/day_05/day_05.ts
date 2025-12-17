const puzzleContent = await Bun.file('./p.txt')
    .text()
    .then((d) => d.trim());

function solvePart1(puzzleContent: string): number {
    const [rangesSection, idsSection] = puzzleContent.split(/\r?\n\r?\n/);

    const ranges = rangesSection
        .split('\n')
        .map((line) => {
            const [start, end] = line.trim().split('-').map(Number);
            return [start, end] as [number, number];
        })
        .sort((a, b) => a[0] - b[0]);

    const mergedRanges: [number, number][] = [];

    for (const [start, end] of ranges) {
        if (mergedRanges.length === 0 || mergedRanges.at(-1)[1] < start - 1) {
            mergedRanges.push([start, end]);
        } else {
            mergedRanges.at(-1)[1] = Math.max(mergedRanges.at(-1)[1], end);
        }
    }

    const isFresh = (id: number): boolean => {
        let left = 0;
        let right = mergedRanges.length - 1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const [start, end] = mergedRanges[mid];

            if (id < start) {
                right = mid - 1;
            } else if (id > end) {
                left = mid + 1;
            } else {
                return true;
            }
        }

        return false;
    };

    const freshIngredientCount = idsSection
        .split('\n')
        .map((line) => Number(line.trim()))
        .reduce((acc, curr) => {
            return isFresh(curr) ? acc + 1 : acc;
        }, 0);

    return freshIngredientCount;
}

console.log('Part 1 solution:', solvePart1(puzzleContent));

function solvePart2(puzzleContent: string): number {
    const [rangesSection, _] = puzzleContent.split(/\r?\n\r?\n/);

    const ranges = rangesSection
        .split('\n')
        .map((line) => {
            const [start, end] = line.trim().split('-').map(Number);
            return [start, end] as [number, number];
        })
        .sort((a, b) => a[0] - b[0]);

    const mergedRanges: [number, number][] = [];

    for (const [start, end] of ranges) {
        if (mergedRanges.length === 0 || mergedRanges.at(-1)[1] < start - 1) {
            mergedRanges.push([start, end]);
        } else {
            mergedRanges.at(-1)[1] = Math.max(mergedRanges.at(-1)[1], end);
        }
    }

    let totalFreshIngredientCount = 0;
    for (const [start, end] of mergedRanges) {
        totalFreshIngredientCount += end - start + 1;
    }

    return totalFreshIngredientCount;
}

console.log('Part 2 solution:', solvePart2(puzzleContent));
