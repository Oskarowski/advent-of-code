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

// console.log('Part 1 solution:', solvePart1(puzzleContent));

/*
    Draw a line on a grid using Bresenham's line algorithm
    @see https://www.geeksforgeeks.org/dsa/bresenhams-line-generation-algorithm
*/
function drawLine(grid: string[][], x1: number, y1: number, x2: number, y2: number) {
    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;

    let x = x1;
    let y = y1;

    while (true) {
        if (!(x === x1 && y === y1) && !(x === x2 && y === y2)) {
            if (grid[y][x] !== '#') {
                grid[y][x] = 'X';
            }
        }
        if (x === x2 && y === y2) break;
        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x += sx;
        }
        if (e2 < dx) {
            err += dx;
            y += sy;
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

    console.log(`Width: ${width}, Height: ${height}`);

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

    console.table(grid);

    return -1;
}

console.log('Part 2 solution:', solvePart2(puzzleContent));
