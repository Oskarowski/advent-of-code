import { getPuzzleInput } from '../helpers/getPuzzleInput';

const Move = {
    Up: { x: 0, y: -1 },
    Down: { x: 0, y: 1 },
    Left: { x: -1, y: 0 },
    Right: { x: 1, y: 0 },
};

class Tile {
    x: number;
    y: number;
    char: string = '';
    possibleMoves: { x: number; y: number }[] = [];
    entryPoints: { x: number; y: number }[] = [];
    distanceTraveled: number = 0;
    isFormingLoop: boolean = false;
    isEnclosedByLoop: boolean = false;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `Tile {${this.char}} x(${this.x}, y${this.y}):`;
    }
}

function parseInputToGrid(input: string[]): Tile[][] {
    const xBorderLimit = input[0].length - 1;
    const yBorderLimit = input.length - 1;

    const grid: Tile[][] = [];

    // Initialize the grid with Tile instances
    for (let i = 0; i < input.length; i++) {
        grid[i] = [];
        for (let j = 0; j < input[i].length; j++) {
            grid[i][j] = new Tile(j, i);
        }
    }

    const isWithinBorders = (
        x: number,
        y: number,
        move: { x: number; y: number }
    ) => {
        return (
            x + move.x >= 0 &&
            x + move.x <= xBorderLimit &&
            y + move.y >= 0 &&
            y + move.y <= yBorderLimit
        );
    };

    for (let i = 0; i < input.length; i++) {
        const row = input[i];

        for (let j = 0; j < row.length; j++) {
            const char = row[j];
            const tile = grid[i][j];
            tile.char = char;

            switch (char) {
                case '.':
                    break;
                case '|':
                    if (isWithinBorders(j, i, Move.Up)) {
                        tile.possibleMoves.push(Move.Up);
                        tile.entryPoints.push({
                            x: j + Move.Up.x,
                            y: i + Move.Up.y,
                        });
                    }

                    if (isWithinBorders(j, i, Move.Down)) {
                        tile.possibleMoves.push(Move.Down);
                        tile.entryPoints.push({
                            x: j + Move.Down.x,
                            y: i + Move.Down.y,
                        });
                    }

                    break;
                case '-':
                    if (isWithinBorders(j, i, Move.Left)) {
                        tile.possibleMoves.push(Move.Left);
                        tile.entryPoints.push({
                            x: j + Move.Left.x,
                            y: i + Move.Left.y,
                        });
                    }
                    if (isWithinBorders(j, i, Move.Right)) {
                        tile.possibleMoves.push(Move.Right);
                        tile.entryPoints.push({
                            x: j + Move.Right.x,
                            y: i + Move.Right.y,
                        });
                    }
                    break;
                case 'L':
                    if (isWithinBorders(j, i, Move.Up)) {
                        tile.possibleMoves.push(Move.Up);
                        tile.entryPoints.push({
                            x: j + Move.Up.x,
                            y: i + Move.Up.y,
                        });
                    }

                    if (isWithinBorders(j, i, Move.Right)) {
                        tile.possibleMoves.push(Move.Right);
                        tile.entryPoints.push({
                            x: j + Move.Right.x,
                            y: i + Move.Right.y,
                        });
                    }

                    break;
                case 'J':
                    if (isWithinBorders(j, i, Move.Up)) {
                        tile.possibleMoves.push(Move.Up);
                        tile.entryPoints.push({
                            x: j + Move.Up.x,
                            y: i + Move.Up.y,
                        });
                    }

                    if (isWithinBorders(j, i, Move.Left)) {
                        tile.possibleMoves.push(Move.Left);
                        tile.entryPoints.push({
                            x: j + Move.Left.x,
                            y: i + Move.Left.y,
                        });
                    }

                    break;
                case '7':
                    if (isWithinBorders(j, i, Move.Down)) {
                        tile.possibleMoves.push(Move.Down);
                        tile.entryPoints.push({
                            x: j + Move.Down.x,
                            y: i + Move.Down.y,
                        });
                    }

                    if (isWithinBorders(j, i, Move.Left)) {
                        tile.possibleMoves.push(Move.Left);
                        tile.entryPoints.push({
                            x: j + Move.Left.x,
                            y: i + Move.Left.y,
                        });
                    }

                    break;
                case 'F':
                    if (isWithinBorders(j, i, Move.Down)) {
                        tile.possibleMoves.push(Move.Down);
                        tile.entryPoints.push({
                            x: j + Move.Down.x,
                            y: i + Move.Down.y,
                        });
                    }

                    if (isWithinBorders(j, i, Move.Right)) {
                        tile.possibleMoves.push(Move.Right);
                        tile.entryPoints.push({
                            x: j + Move.Right.x,
                            y: i + Move.Right.y,
                        });
                    }

                    break;
                case 'S':
                    if (isWithinBorders(j, i, Move.Down)) {
                        tile.possibleMoves.push(Move.Down);
                        tile.entryPoints.push({
                            x: j + Move.Down.x,
                            y: i + Move.Down.y,
                        });
                    }
                    if (isWithinBorders(j, i, Move.Right)) {
                        tile.possibleMoves.push(Move.Right);
                        tile.entryPoints.push({
                            x: j + Move.Right.x,
                            y: i + Move.Right.y,
                        });
                    }
                    if (isWithinBorders(j, i, Move.Left)) {
                        tile.possibleMoves.push(Move.Left);
                        tile.entryPoints.push({
                            x: j + Move.Left.x,
                            y: i + Move.Left.y,
                        });
                    }
                    if (isWithinBorders(j, i, Move.Up)) {
                        tile.possibleMoves.push(Move.Up);
                        tile.entryPoints.push({
                            x: j + Move.Up.x,
                            y: i + Move.Up.y,
                        });
                    }

                    break;
                default:
                    throw new Error('Invalid character in input');
            }
        }
    }

    return grid;
}

function findStartingPoint(grid: Tile[][]): { x: number; y: number } {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j].char === 'S') {
                return { x: j, y: i };
            }
        }
    }

    throw new Error('Starting point not found');
}

const positionToString = (pos: { x: number; y: number }) => `${pos.x}-${pos.y}`;

const canEnterTile = (tileFrom: Tile, tileTo: Tile) => {
    return tileTo.entryPoints.some(
        (entryPoint) =>
            entryPoint.x === tileFrom.x && entryPoint.y === tileFrom.y
    );
};

function defineLoop(grid: Tile[][]): Tile[] {
    const start = findStartingPoint(grid);
    let current = start;
    let visited = new Set();

    const tilesAlongLoop = [] as Tile[];

    let iterations = 1;
    do {
        const currentTile = grid[current.y][current.x];
        const nearbyFields = currentTile.entryPoints;

        if (nearbyFields.length === 0) {
            console.log('No more moves');
            break;
        }

        for (const nearbyField of nearbyFields) {
            const nearbyFieldString = positionToString(nearbyField);
            if (!visited.has(nearbyFieldString)) {
                const maybeNextTile = grid[nearbyField.y][nearbyField.x];

                if (maybeNextTile.char === 'S') {
                    continue;
                }

                if (canEnterTile(currentTile, maybeNextTile)) {
                    // console.log(
                    //     `Moving from {${currentTile.char}} (${current.x}, ${current.y}) to {${maybeNextTile.char}} (${maybeNextTile.x}, ${maybeNextTile.y})`
                    // );
                    maybeNextTile.distanceTraveled = iterations;
                    maybeNextTile.isFormingLoop = true;
                    tilesAlongLoop.push(maybeNextTile);
                    visited.add(nearbyFieldString);
                    current = nearbyField;
                    break;
                }
            }
        }

        iterations++;
    } while (iterations <= 1_123_123);

    return tilesAlongLoop;
}

function part1(input: string[]) {
    console.log('------------------- PART 1 -------------------');
    console.time('How much time to process Part 1');
    const grid: Tile[][] = parseInputToGrid(input);

    const tilesAlongLoop = defineLoop(grid);

    console.timeEnd('How much time to process Part 1');
    console.log(
        `Farthest point from start: ${Math.ceil(
            tilesAlongLoop.slice(-1)[0].distanceTraveled / 2
        )}`
    );
    console.log('----------------------------------------------');
}

part1(getPuzzleInput('day_10_input'));
// part1(getPuzzleInput('day_10_t2_input'));

function getAllTilesInDirection(
    grid: Tile[][],
    tile: Tile,
    { x, y }: { x: number; y: number }
) {
    const tiles = [] as Tile[];
    let current = tile;

    do {
        const nextX = current.x + x;
        const nextY = current.y + y;

        if (
            nextX < 0 ||
            nextX >= grid[0].length ||
            nextY < 0 ||
            nextY >= grid.length
        ) {
            break;
        }

        const nextTile = grid[nextY][nextX];
        if (
            nextTile.char !== '.' &&
            nextTile.char !== '-' &&
            (nextTile.isFormingLoop || nextTile.char === 'S')
        ) {
            tiles.push(nextTile);
        }
        current = nextTile;
    } while (true);

    return tiles;
}

function countAllPassedPipes(tilesInDirection: Tile[]): Record<string, number> {
    const passedPipes: Record<string, number> = {};

    for (const tile of tilesInDirection) {
        const char = tile.char;
        if (passedPipes[char]) {
            passedPipes[char]++;
        } else {
            passedPipes[char] = 1;
        }
    }
    return passedPipes;
}

function isCountOfCrossingOdd(countedPipes: Record<string, number>): boolean {
    let countedCrossings = 0;

    if (countedPipes['|']) {
        countedCrossings += countedPipes['|'];
    }

    const pairedPipes: Record<string, string[]> = {
        '7': ['L'],
        L: ['7'],
        J: ['F'],
        F: ['J'],
    };

    // Increment crossings for each paired pipe character
    for (const pipe in countedPipes) {
        if (pairedPipes[pipe]) {
            for (const pairedPipe of pairedPipes[pipe]) {
                const minCount = Math.min(
                    countedPipes[pipe],
                    countedPipes[pairedPipe] || 0
                );
                countedCrossings += minCount;
                countedPipes[pipe] -= minCount;
                if (countedPipes[pairedPipe]) {
                    countedPipes[pairedPipe] -= minCount;
                }
            }
        }
    }

    return countedCrossings % 2 === 1;
}

function rayCastTiles(grid: Tile[][]) {
    let ans = 0;

    for (let i = 0; i < grid.length; i++) {
        const row = grid[i];
        for (let j = 0; j < row.length; j++) {
            const tile = grid[i][j];

            if (tile.isFormingLoop) continue;

            const tilesToLeft: Tile[] = getAllTilesInDirection(
                grid,
                tile,
                Move.Left
            );

            const countedPipes = countAllPassedPipes(tilesToLeft);

            if (isCountOfCrossingOdd(countedPipes) && tile.char === '.') {
                tile.isEnclosedByLoop = true;
                ans++;
            }
        }
    }
    return ans;
}

function printWholeMaze(grid: Tile[][]) {
    for (const row of grid) {
        let rowString = '';
        for (const tile of row) {
            if (tile.isFormingLoop) {
                rowString += '*';
            } else if (tile.isEnclosedByLoop) {
                rowString += 'I';
                continue;
            } else if (!tile.isEnclosedByLoop && tile.char === '.') {
                rowString += '0';
            } else {
                rowString += '%';
            }
        }
        console.log(rowString);
    }
}

function findTileWithS(grid: Tile[][]): Tile | null {
    for (let i = 0; i < grid.length; i++) {
        const row = grid[i];
        for (let j = 0; j < row.length; j++) {
            const tile = row[j];
            if (tile.char === 'S') {
                return tile;
            }
        }
    }
    return null;
}

function part2(input: string[], shapeOfS: string) {
    console.log('------------------- PART 2 -------------------');
    console.time('How much time to process Part 2');
    const grid: Tile[][] = parseInputToGrid(input);

    defineLoop(grid);

    const tileWithS = findTileWithS(grid);

    if (tileWithS) {
        tileWithS.isFormingLoop = true;
        tileWithS.char = shapeOfS;
    }

    // tile that isn't part of the main loop can count as being enclosed so just mark them as empty ^-^
    for (const row of grid) {
        for (const tile of row) {
            if (!tile.isFormingLoop) {
                tile.char = '.';
            }
        }
    }

    const ans = rayCastTiles(grid);

    // printWholeMaze(grid);

    console.timeEnd('How much time to process Part 2');
    console.log(`Tiles enclosed by loop: ${ans}`);
    console.log('----------------------------------------------');
}

// part2(getPuzzleInput('day_10_t2_input'), '7'); // 4
// part2(getPuzzleInput('day_10_t3_input'), 'F'); // 8
// part2(getPuzzleInput('day_10_t4_input'), '7'); // 10
part2(getPuzzleInput('day_10_input'), '|');
