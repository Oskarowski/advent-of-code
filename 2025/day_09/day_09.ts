const puzzleContent = await Bun.file('./t.txt')
    .text()
    .then((d) => d.trim());

function solvePart1(puzzleContent: string): number {
    const points = puzzleContent.split('\n').map((line) =>
        line
            .trim()
            .split(',')
            .map((e) => Number.parseInt(e, 10))
    );

    const computeArea = (x1: number, y1: number, x2: number, y2: number) => {
        return (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1);
    };

    let maxArea = -Infinity;
    for (let i = 0; i < points.length; i++) {
        const [x1, y1] = points[i];
        for (let j = i + 1; j < points.length - 1; j++) {
            const [x2, y2] = points[j];
            const area = computeArea(x1, y1, x2, y2);
            if (area > maxArea) maxArea = area;
        }
    }

    return maxArea;
}

console.log('Part 1 solution:', solvePart1(puzzleContent));

function solvePart2(puzzleContent: string): number {
    return -1;
}

// console.log('Part 2 solution:', solvePart2(puzzleContent));
