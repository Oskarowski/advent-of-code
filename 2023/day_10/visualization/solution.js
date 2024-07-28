"use strict";
var Tile = /** @class */ (function () {
    function Tile(x, y) {
        this.char = '.';
        this.entryPoints = [];
        this.distanceTraveled = 0;
        this.isFormingLoop = false;
        this.isEnclosedByLoop = false;
        this.x = x;
        this.y = y;
    }
    Tile.prototype.toString = function () {
        return "Tile {".concat(this.char, "} x(").concat(this.x, ", y").concat(this.y, "):");
    };
    return Tile;
}());
var SolutionDay10 = /** @class */ (function () {
    function SolutionDay10() {
        this.Move = {
            Up: { x: 0, y: -1 },
            Down: { x: 0, y: 1 },
            Left: { x: -1, y: 0 },
            Right: { x: 1, y: 0 },
        };
        this.positionToString = function (pos) { return "".concat(pos.x, "-").concat(pos.y); };
        this.canEnterTile = function (tileFrom, tileTo) {
            return tileTo.entryPoints.some(function (entryPoint) {
                return entryPoint.x === tileFrom.x && entryPoint.y === tileFrom.y;
            });
        };
    }
    SolutionDay10.prototype.processPuzzle = function () {
        this.parseInputToGrid();
        this.defineLoop();
        this.calculateFarthestPointFromStart();
        this.findTileWithS().char = this.pipeTypeOfStart;
        this.erasePipesThatAreNotPartOfLoop();
        this.rayCastTiles();

        console.log("this.countTilesEnclosedByLoop",this.countTilesEnclosedByLoop);
        console.log("this.farthestPointFromStart",this.farthestPointFromStart);
    };
    SolutionDay10.prototype.setPuzzleInput = function (input) {
        this.puzzleInput = input;
    };
    SolutionDay10.prototype.setPipeTypeOfStart = function (pipeType) {
        this.pipeTypeOfStart = pipeType;
    };
    SolutionDay10.prototype.parseInputToGrid = function () {
        var input = this.puzzleInput;
        var xBorderLimit = input[0].length - 1;
        var yBorderLimit = input.length - 1;
        var grid = [];
        // Initialize the grid with Tile instances
        for (var i = 0; i < input.length; i++) {
            grid[i] = [];
            for (var j = 0; j < input[i].length; j++) {
                grid[i][j] = new Tile(j, i);
            }
        }
        var isWithinBorders = function (x, y, move) {
            return (x + move.x >= 0 &&
                x + move.x <= xBorderLimit &&
                y + move.y >= 0 &&
                y + move.y <= yBorderLimit);
        };
        for (var i = 0; i < input.length; i++) {
            var row = input[i];
            for (var j = 0; j < row.length; j++) {
                var char = row[j];
                var tile = grid[i][j];
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
    };
    SolutionDay10.prototype.findTileWithS = function () {
        for (var i = 0; i < this.tilesGrid.length; i++) {
            var row = this.tilesGrid[i];
            for (var j = 0; j < row.length; j++) {
                var tile = row[j];
                if (tile.char === 'S') {
                    return tile;
                }
            }
        }
    };
    SolutionDay10.prototype.erasePipesThatAreNotPartOfLoop = function () {
        // tile that isn't part of the main loop can count as being enclosed so just mark them as empty ^-^
        for (var _i = 0, _a = this.tilesGrid; _i < _a.length; _i++) {
            var row = _a[_i];
            for (var _b = 0, row_1 = row; _b < row_1.length; _b++) {
                var tile = row_1[_b];
                if (!tile.isFormingLoop) {
                    tile.char = '.';
                }
            }
        }
    };
    SolutionDay10.prototype.calculateFarthestPointFromStart = function () {
        this.farthestPointFromStart = Math.ceil(this.tilesAlongLoop.slice(-1)[0].distanceTraveled / 2);
    };
    SolutionDay10.prototype.defineLoop = function () {
        var grid = this.tilesGrid;
        var tileWithS = this.findTileWithS();
        var start = { x: tileWithS.x, y: tileWithS.y };
        var current = start;
        var visited = new Set();
        var tilesLoop = [];
        var iterations = 1;
        do {
            var currentTile = grid[current.y][current.x];
            var nearbyFields = currentTile.entryPoints;
            if (nearbyFields.length === 0) {
                break;
            }
            for (var _i = 0, nearbyFields_1 = nearbyFields; _i < nearbyFields_1.length; _i++) {
                var nearbyField = nearbyFields_1[_i];
                var nearbyFieldString = this.positionToString(nearbyField);
                if (!visited.has(nearbyFieldString)) {
                    var maybeNextTile = grid[nearbyField.y][nearbyField.x];
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
        } while (iterations <= 1123123);
        tileWithS.isFormingLoop = true;
        tilesLoop.unshift(tileWithS);
        this.tilesAlongLoop = tilesLoop;
    };
    SolutionDay10.prototype.getAllTilesInDirection = function (grid, tile, _a) {
        var x = _a.x, y = _a.y;
        var tiles = [];
        var current = tile;
        do {
            var nextX = current.x + x;
            var nextY = current.y + y;
            if (nextX < 0 ||
                nextX >= grid[0].length ||
                nextY < 0 ||
                nextY >= grid.length) {
                break;
            }
            var nextTile = grid[nextY][nextX];
            if (nextTile.char !== '.' &&
                nextTile.char !== '-' &&
                (nextTile.isFormingLoop || nextTile.char === 'S')) {
                tiles.push(nextTile);
            }
            current = nextTile;
        } while (true);
        return tiles;
    };
    SolutionDay10.prototype.countAllPassedPipes = function (tilesInDirection) {
        var passedPipes = {};
        for (var _i = 0, tilesInDirection_1 = tilesInDirection; _i < tilesInDirection_1.length; _i++) {
            var tile = tilesInDirection_1[_i];
            var char = tile.char;
            if (passedPipes[char]) {
                passedPipes[char]++;
            }
            else {
                passedPipes[char] = 1;
            }
        }
        return passedPipes;
    };
    SolutionDay10.prototype.isCountOfCrossingOdd = function (countedPipes) {
        var countedCrossings = 0;
        if (countedPipes['|']) {
            countedCrossings += countedPipes['|'];
        }
        var pairedPipes = {
            '7': ['L'],
            L: ['7'],
            J: ['F'],
            F: ['J'],
        };
        // Increment crossings for each paired pipe character
        for (var pipe in countedPipes) {
            if (pairedPipes[pipe]) {
                for (var _i = 0, _a = pairedPipes[pipe]; _i < _a.length; _i++) {
                    var pairedPipe = _a[_i];
                    var minCount = Math.min(countedPipes[pipe], countedPipes[pairedPipe] || 0);
                    countedCrossings += minCount;
                    countedPipes[pipe] -= minCount;
                    if (countedPipes[pairedPipe]) {
                        countedPipes[pairedPipe] -= minCount;
                    }
                }
            }
        }
        return countedCrossings % 2 === 1;
    };
    SolutionDay10.prototype.rayCastTiles = function () {
        var grid = this.tilesGrid;
        var ans = 0;
        for (var i = 0; i < grid.length; i++) {
            var row = grid[i];
            for (var j = 0; j < row.length; j++) {
                var tile = grid[i][j];
                if (tile.isFormingLoop)
                    continue;
                var tilesToLeft = this.getAllTilesInDirection(grid, tile, this.Move.Left);
                var countedPipes = this.countAllPassedPipes(tilesToLeft);
                if (this.isCountOfCrossingOdd(countedPipes) &&
                    tile.char === '.') {
                    tile.isEnclosedByLoop = true;
                    ans++;
                }
            }
        }
        this.countTilesEnclosedByLoop = ans;
    };
    return SolutionDay10;
}());


export { SolutionDay10, Tile }