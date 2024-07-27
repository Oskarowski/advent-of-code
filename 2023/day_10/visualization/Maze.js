import { SolutionDay10, Tile } from './solution.js';

class Maze {
    static instance = null;

    solver = new SolutionDay10();

    tilesElementsGrid = [];

    constructor() {
        if (Maze.instance) {
            return Maze.instance;
        }
        Maze.instance = this;
    }

    static getInstance() {
        if (!Maze.instance) {
            Maze.instance = new Maze();
        }
        return Maze.instance;
    }

    setMazeStartTilePipeShape(shapeChar) {
        const possibleShapes = ['|', '-', 'L', 'J', '7', 'F'];

        if (!possibleShapes.includes(shapeChar)) {
            throw new Error('Invalid pipe shape: ' + shapeChar);
        }

        this.solver.setPipeTypeOfStart(shapeChar);
    }

    setPuzzleInput(input) {
        if (input.length === 0) {
            return;
        }

        input = input.split('\n').map((l) => l.trim());

        this.solver.setPuzzleInput(input);
    }

    processPuzzle() {
        this.solver.processPuzzle();
    }

    generateTilesElementsGrid() {
        const logicalTilesGrid = this.solver.tilesGrid;
        const rows = logicalTilesGrid.length;
        const cols = logicalTilesGrid[0].length;

        this.tilesElementsGrid = [];

        // Generate the the 2D array of TilesElements which are presentations form of Tiles from solver
        for (let i = 0; i < rows; i++) {
            const rowTiles = []; // Array to hold tiles for this row

            for (let j = 0; j < cols; j++) {
                const tile = new TileRepresentation(j, i);
                rowTiles.push(tile);
            }

            this.tilesElementsGrid.push(rowTiles); 
        }

        // Add border classes to border tiles
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const tile = this.tilesElementsGrid[i][j];
                if (i === 0) {
                    tile.element.classList.add('border-tile', 'top');
                }
                if (i === rows - 1) {
                    tile.element.classList.add('border-tile', 'bottom');
                }
                if (j === 0) {
                    tile.element.classList.add('border-tile', 'left');
                }
                if (j === cols - 1) {
                    tile.element.classList.add('border-tile', 'right');
                }
            }
        }

        this.displayMaze();
    }

    displayMaze() {
        const mazeContainer = document.getElementById('maze-container');
        mazeContainer.innerHTML = ''; // Clear previous maze

        for (let whichRow = 0; whichRow < this.tilesElementsGrid.length; whichRow++) {
            const rowElement = document.createElement('div');
            rowElement.className = 'row';
            const row = this.tilesElementsGrid[whichRow];

            for (let whichCol = 0; whichCol < row.length; whichCol++) {
                const logicalTile = this.solver.tilesGrid[whichRow][whichCol];
                const tile = row[whichCol];

                tile.element.textContent = logicalTile.char;

                if (logicalTile.isFormingLoop) {
                    tile.element.classList.add('forming-loop');
                }

                if (logicalTile.isEnclosedByLoop) {
                    tile.element.classList.add('enclosed-by-loop');
                }

                rowElement.appendChild(tile.element);
            }

            mazeContainer.appendChild(rowElement);
        }
    }
}

class TileRepresentation extends Tile {
    constructor(x, y) {
        super(x, y);
        this.element = document.createElement('div');
        this.element.className = 'cell';
        this.element.setAttribute('data-x', x);
        this.element.setAttribute('data-y', y);
        this.element.addEventListener('click', this.togglePipe.bind(this));
    }

    togglePipe() {
        console.log('Toggling pipe');
        // if (this.element.classList.contains('pipe')) {
        //     this.element.classList.remove('pipe');
        //     this.marked = false;
        // } else {
        //     this.element.classList.add('pipe');
        //     this.marked = true;
        // }
    }
}

export { Maze };
