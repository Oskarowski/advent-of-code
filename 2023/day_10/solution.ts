import { getPuzzleInput } from '../helpers/getPuzzleInput.js';

class Tile {
    x: number;
    y: number;
    char: string = '';
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

class SolutionDay10 {
    puzzleInput: string[];
    tilesGrid: Tile[][];
    tilesAlongLoop: Tile[];
    pipeTypeOfStart: string;
    farthestPointFromStart: number;
    countTilesEnclosedByLoop: number;

    Move = {
        Up: { x: 0, y: -1 },
        Down: { x: 0, y: 1 },
        Left: { x: -1, y: 0 },
        Right: { x: 1, y: 0 },
    };

    processPuzzle() {
        this.parseInputToGrid();
        this.defineLoop();
        this.calculateFarthestPointFromStart();

        this.findTileWithS()!.char = this.pipeTypeOfStart;

        this.erasePipesThatAreNotPartOfLoop();
        this.rayCastTiles();
    }

    setPuzzleInput(input: string[]) {
        this.puzzleInput = input;
    }

    setPipeTypeOfStart(pipeType: string) {
        this.pipeTypeOfStart = pipeType;
    }

    parseInputToGrid() {
        const input = this.puzzleInput;
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
                        if (isWithinBorders(j, i, this.Move.Up)) {
                            tile.entryPoints.push({
                                x: j + this.Move.Up.x,
                                y: i + this.Move.Up.y,
                            });
                        }

                        if (isWithinBorders(j, i, this.Move.Down)) {
                            tile.entryPoints.push({
                                x: j + this.Move.Down.x,
                                y: i + this.Move.Down.y,
                            });
                        }

                        break;
                    case '-':
                        if (isWithinBorders(j, i, this.Move.Left)) {
                            tile.entryPoints.push({
                                x: j + this.Move.Left.x,
                                y: i + this.Move.Left.y,
                            });
                        }
                        if (isWithinBorders(j, i, this.Move.Right)) {
                            tile.entryPoints.push({
                                x: j + this.Move.Right.x,
                                y: i + this.Move.Right.y,
                            });
                        }
                        break;
                    case 'L':
                        if (isWithinBorders(j, i, this.Move.Up)) {
                            tile.entryPoints.push({
                                x: j + this.Move.Up.x,
                                y: i + this.Move.Up.y,
                            });
                        }

                        if (isWithinBorders(j, i, this.Move.Right)) {
                            tile.entryPoints.push({
                                x: j + this.Move.Right.x,
                                y: i + this.Move.Right.y,
                            });
                        }

                        break;
                    case 'J':
                        if (isWithinBorders(j, i, this.Move.Up)) {
                            tile.entryPoints.push({
                                x: j + this.Move.Up.x,
                                y: i + this.Move.Up.y,
                            });
                        }

                        if (isWithinBorders(j, i, this.Move.Left)) {
                            tile.entryPoints.push({
                                x: j + this.Move.Left.x,
                                y: i + this.Move.Left.y,
                            });
                        }

                        break;
                    case '7':
                        if (isWithinBorders(j, i, this.Move.Down)) {
                            tile.entryPoints.push({
                                x: j + this.Move.Down.x,
                                y: i + this.Move.Down.y,
                            });
                        }

                        if (isWithinBorders(j, i, this.Move.Left)) {
                            tile.entryPoints.push({
                                x: j + this.Move.Left.x,
                                y: i + this.Move.Left.y,
                            });
                        }

                        break;
                    case 'F':
                        if (isWithinBorders(j, i, this.Move.Down)) {
                            tile.entryPoints.push({
                                x: j + this.Move.Down.x,
                                y: i + this.Move.Down.y,
                            });
                        }

                        if (isWithinBorders(j, i, this.Move.Right)) {
                            tile.entryPoints.push({
                                x: j + this.Move.Right.x,
                                y: i + this.Move.Right.y,
                            });
                        }

                        break;
                    case 'S':
                        if (isWithinBorders(j, i, this.Move.Down)) {
                            tile.entryPoints.push({
                                x: j + this.Move.Down.x,
                                y: i + this.Move.Down.y,
                            });
                        }
                        if (isWithinBorders(j, i, this.Move.Right)) {
                            tile.entryPoints.push({
                                x: j + this.Move.Right.x,
                                y: i + this.Move.Right.y,
                            });
                        }
                        if (isWithinBorders(j, i, this.Move.Left)) {
                            tile.entryPoints.push({
                                x: j + this.Move.Left.x,
                                y: i + this.Move.Left.y,
                            });
                        }
                        if (isWithinBorders(j, i, this.Move.Up)) {
                            tile.entryPoints.push({
                                x: j + this.Move.Up.x,
                                y: i + this.Move.Up.y,
                            });
                        }

                        break;
                    default:
                        throw new Error('Invalid character in input');
                }
            }
        }

        this.tilesGrid = grid;
    }

    findTileWithS(): Tile | undefined {
        for (let i = 0; i < this.tilesGrid.length; i++) {
            const row = this.tilesGrid[i];
            for (let j = 0; j < row.length; j++) {
                const tile = row[j];
                if (tile.char === 'S') {
                    return tile;
                }
            }
        }
    }

    erasePipesThatAreNotPartOfLoop() {
        // tile that isn't part of the main loop can count as being enclosed so just mark them as empty ^-^
        for (const row of this.tilesGrid) {
            for (const tile of row) {
                if (!tile.isFormingLoop) {
                    tile.char = '.';
                }
            }
        }
    }

    calculateFarthestPointFromStart() {
        this.farthestPointFromStart = Math.ceil(
            this.tilesAlongLoop.slice(-1)[0].distanceTraveled / 2
        );
    }

    positionToString = (pos: { x: number; y: number }) => `${pos.x}-${pos.y}`;
    canEnterTile = (tileFrom: Tile, tileTo: Tile) => {
        return tileTo.entryPoints.some(
            (entryPoint) =>
                entryPoint.x === tileFrom.x && entryPoint.y === tileFrom.y
        );
    };

    defineLoop() {
        const grid = this.tilesGrid;
        const tileWithS = this.findTileWithS()!;
        const start = { x: tileWithS.x, y: tileWithS.y };

        let current = start;
        let visited = new Set();

        const tilesLoop = [] as Tile[];

        let iterations = 1;
        do {
            const currentTile = grid[current.y][current.x];
            const nearbyFields = currentTile.entryPoints;

            if (nearbyFields.length === 0) {
                break;
            }

            for (const nearbyField of nearbyFields) {
                const nearbyFieldString = this.positionToString(nearbyField);
                if (!visited.has(nearbyFieldString)) {
                    const maybeNextTile = grid[nearbyField.y][nearbyField.x];

                    if (maybeNextTile.char === 'S') {
                        continue;
                    }

                    if (this.canEnterTile(currentTile, maybeNextTile)) {
                        maybeNextTile.distanceTraveled = iterations;
                        maybeNextTile.isFormingLoop = true;
                        tilesLoop.push(maybeNextTile);
                        visited.add(nearbyFieldString);
                        current = nearbyField;
                        break;
                    }
                }
            }

            iterations++;
        } while (iterations <= 1_123_123);

        tileWithS.isFormingLoop = true;
        tilesLoop.unshift(tileWithS);
        this.tilesAlongLoop = tilesLoop;
    }

    getAllTilesInDirection(
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

    countAllPassedPipes(tilesInDirection: Tile[]): Record<string, number> {
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

    isCountOfCrossingOdd(countedPipes: Record<string, number>): boolean {
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
    rayCastTiles() {
        const grid = this.tilesGrid;
        let ans = 0;

        for (let i = 0; i < grid.length; i++) {
            const row = grid[i];
            for (let j = 0; j < row.length; j++) {
                const tile = grid[i][j];

                if (tile.isFormingLoop) continue;

                const tilesToLeft: Tile[] = this.getAllTilesInDirection(
                    grid,
                    tile,
                    this.Move.Left
                );

                const countedPipes = this.countAllPassedPipes(tilesToLeft);

                if (
                    this.isCountOfCrossingOdd(countedPipes) &&
                    tile.char === '.'
                ) {
                    tile.isEnclosedByLoop = true;
                    ans++;
                }
            }
        }

        this.countTilesEnclosedByLoop = ans;
    }
}

function part1(input: string[]) {
    console.log('------------------- PART 1 -------------------');
    console.time('How much time to process Part 1');

    const solution = new SolutionDay10();
    solution.setPuzzleInput(input);
    solution.processPuzzle();

    console.timeEnd('How much time to process Part 1');
    console.log(
        `Farthest point from start: ${solution.farthestPointFromStart}`
    );
    console.log('----------------------------------------------');
}

part1(getPuzzleInput('day_10_input'));
// part1(getPuzzleInput('day_10_t2_input'));

function part2(input: string[], shapeOfS: string) {
    console.log('------------------- PART 2 -------------------');
    console.time('How much time to process Part 2');

    const solution = new SolutionDay10();
    solution.setPuzzleInput(input);
    solution.setPipeTypeOfStart(shapeOfS);
    solution.processPuzzle();

    console.timeEnd('How much time to process Part 2');
    console.log(`Tiles enclosed by loop: ${solution.countTilesEnclosedByLoop}`);
    console.log('----------------------------------------------');
}

// part2(getPuzzleInput('day_10_t2_input'), '7'); // 4
// part2(getPuzzleInput('day_10_t3_input'), 'F'); // 8
// part2(getPuzzleInput('day_10_t4_input'), '7'); // 10
part2(getPuzzleInput('day_10_input'), '|');
