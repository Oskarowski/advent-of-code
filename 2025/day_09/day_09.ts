const puzzleContent = await Bun.file('./t.txt')
    .text()
    .then((d) => d.trim());

const computeArea = (x1: number, y1: number, x2: number, y2: number) => {
    return (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1);
};

function solvePart1(puzzleContent: string): number {
    const points = puzzleContent.split('\n').map((line) =>
        line
            .trim()
            .split(',')
            .map((e) => Number.parseInt(e, 10))
    );

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

// console.log('Part 1 solution:', solvePart1(puzzleContent));

function drawLine(grid: string[][], x1: number, y1: number, x2: number, y2: number) {
    if (x1 === x2) {
        const startY = Math.min(y1, y2);
        const endY = Math.max(y1, y2);
        for (let y = startY; y <= endY; y++) {
            if (grid[y][x1] === '.') grid[y][x1] = 'X';
        }
    } else {
        const startX = Math.min(x1, x2);
        const endX = Math.max(x1, x2);
        for (let x = startX; x <= endX; x++) {
            if (grid[y1][x] === '.') grid[y1][x] = 'X';
        }
    }
}

function floodFillOutside(grid: string[][]) {
    const height = grid.length;
    const width = grid[0].length;

    const inBounds = (x: number, y: number) => x >= 0 && x < width && y >= 0 && y < height;

    const queue: [number, number][] = [];

    // Start from all border cells that are '.'
    for (let x = 0; x < width; x++) {
        if (grid[0][x] === '.') {
            grid[0][x] = 'O';
            queue.push([x, 0]);
        }
        if (grid[height - 1][x] === '.') {
            grid[height - 1][x] = 'O';
            queue.push([x, height - 1]);
        }
    }
    for (let y = 0; y < height; y++) {
        if (grid[y][0] === '.') {
            grid[y][0] = 'O';
            queue.push([0, y]);
        }
        if (grid[y][width - 1] === '.') {
            grid[y][width - 1] = 'O';
            queue.push([width - 1, y]);
        }
    }

    const dirs = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
    ];

    while (queue.length > 0) {
        const [cx, cy] = queue.shift()!;
        for (const [dx, dy] of dirs) {
            const nx = cx + dx;
            const ny = cy + dy;
            if (inBounds(nx, ny) && grid[ny][nx] === '.') {
                grid[ny][nx] = 'O';
                queue.push([nx, ny]);
            }
        }
    }
}

function solvePart2(puzzleContent: string): number {
    const points = puzzleContent.split('\n').map((line) =>
        line
            .trim()
            .split(',')
            .map((e) => Number.parseInt(e, 10))
    );

    let width = -Infinity;
    let height = -Infinity;
    points.forEach(([x, y]) => {
        if (x > width) width = x;
        if (y > height) height = y;
    });
    width += 1;
    height += 1;

    const grid = Array.from({ length: height }, () => Array.from({ length: width }, () => '.'));

    points.forEach(([x, y]) => {
        grid[y][x] = '#';
    });

    for (let i = 0; i < points.length; i++) {
        const [x1, y1] = points[i];
        const [x2, y2] = points[(i + 1) % points.length];
        drawLine(grid, x1, y1, x2, y2);
    }

    floodFillOutside(grid);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (grid[y][x] === '.') {
                grid[y][x] = 'X';
            } else if (grid[y][x] === 'O') {
                grid[y][x] = '.';
            }
        }
    }

    const binaryValueMap = grid.map((line) => line.map((e) => (e === '#' || e === 'X' ? 1 : 0)));
    const sumTable = Array.from({ length: height }, () => Array.from({ length: width }, () => 0));

    for (let y = 0; y < sumTable.length; y++) {
        for (let x = 0; x < sumTable[0].length; x++) {
            sumTable[y][x] =
                binaryValueMap[y][x] +
                (y > 0 ? sumTable[y - 1][x] : 0) +
                (x > 0 ? sumTable[y][x - 1] : 0) -
                (x > 0 && y > 0 ? sumTable[y - 1][x - 1] : 0);
        }
    }

    let maxValidArea = -Infinity;

    for (let i = 0; i < points.length; i++) {
        const [x1, y1] = points[i];
        for (let j = i + 1; j < points.length - 1; j++) {
            const [x2, y2] = points[j];
            const expectedArea = computeArea(x1, y1, x2, y2);

            if (expectedArea < maxValidArea) continue;

            const xMax = Math.max(x1, x2);
            const xMin = Math.min(x1, x2);
            const yMax = Math.max(y1, y2);
            const yMin = Math.min(y1, y2);

            const cArea =
                sumTable[yMax][xMax] -
                sumTable[yMin - 1][xMax] -
                sumTable[yMax][xMin - 1] +
                sumTable[yMin - 1][xMin - 1];

            if (cArea === expectedArea) maxValidArea = expectedArea;
        }
    }

    return maxValidArea;
}
console.log('Part 2 solution:', solvePart2(puzzleContent));
