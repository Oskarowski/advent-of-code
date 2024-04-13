import { getPuzzleInput } from '../helpers/getPuzzleInput.js';

class CosmicObject {
    x: number;
    y: number;

    setCoordinates(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class Galaxy extends CosmicObject {
    id: number;

    constructor(id: number, x: number, y: number) {
        super();
        this.id = id;
        this.x = x;
        this.y = y;
    }

    toString() {
        return `${this.id} x:${this.x} y:${this.y}\n`;
    }
}

class Void extends CosmicObject {
    constructor(x?: number, y?: number) {
        super();
        this.x = x || -1;
        this.y = y || -1;
    }
}

class Node {
    galaxyOrVoid: Galaxy | Void;
    neighbors: Node[] = [];
    gScore: number = Infinity;
    fScore: number = Infinity;

    constructor(galaxyOrVoid: Galaxy | Void) {
        this.galaxyOrVoid = galaxyOrVoid;
    }
}

class SolutionDay11 {
    private puzzleInput: string[];
    galaxyGrid: Array<Array<Galaxy | Void>>;
    galaxiesMap: Map<number, Galaxy> = new Map();
    cosmicSpaceGraph: Map<string, Node> = new Map();
    countGalaxies: number = 0;

    setPuzzleInput(providedInput: string[]) {
        this.puzzleInput = providedInput;
    }

    parsePuzzleInputIntoGalaxyGrid() {
        this.galaxyGrid = this.puzzleInput.map((line, y) => {
            return line.split('').map((cell, x) => {
                if (cell === '.') {
                    return new Void(x, y);
                } else {
                    const galaxy = new Galaxy(this.countGalaxies + 1, x, y);
                    this.galaxiesMap.set(galaxy.id, galaxy);
                    this.countGalaxies++;
                    return galaxy;
                }
            });
        });
    }

    processCosmicExpansion() {
        let newGalaxyGrid: Array<Array<Galaxy | Void>> = [];

        const isEmpty = (row: Array<Galaxy | Void>) => {
            return row.every((cell) => cell instanceof Void);
        };

        for (let wRow = 0; wRow < this.galaxyGrid.length; wRow++) {
            const row = this.galaxyGrid[wRow];

            if (isEmpty(row)) {
                newGalaxyGrid.push(row);
            }
            newGalaxyGrid.push(row);
        }

        this.galaxyGrid = newGalaxyGrid;

        const indexesOfEmptyColumns: number[] = [];

        for (let wColumn = 0; wColumn < this.galaxyGrid[0].length; wColumn++) {
            const column = this.galaxyGrid.map((row) => row[wColumn]);

            if (isEmpty(column)) {
                indexesOfEmptyColumns.push(wColumn);
            }
        }

        const colInsert = [new Void()];
        const modifiedGalaxyGrid: Array<Array<Galaxy | Void>> = [];

        for (const row of newGalaxyGrid) {
            const newRow = [...row];
            for (let i = 0; i < indexesOfEmptyColumns.length; i++) {
                const index = indexesOfEmptyColumns[i] + i;
                newRow.splice(index, 0, ...colInsert);
            }
            modifiedGalaxyGrid.push(newRow);
        }

        // this.printGalaxyMap(newGalaxyGrid);
        this.galaxyGrid = modifiedGalaxyGrid;

        this.remapSpaceObjectsCoordinates();
    }

    remapSpaceObjectsCoordinates() {
        for (let y = 0; y < this.galaxyGrid.length; y++) {
            for (let x = 0; x < this.galaxyGrid[y].length; x++) {
                const cell = this.galaxyGrid[y][x];
                cell.setCoordinates(x, y);
            }
        }
    }

    buildGraph(): Map<string, Node> {
        const graph = new Map<string, Node>();

        // Create nodes for galaxies and voids
        for (let row = 0; row < this.galaxyGrid.length; row++) {
            for (let col = 0; col < this.galaxyGrid[row].length; col++) {
                const galaxyOrVoid = this.galaxyGrid[row][col];
                const node = new Node(galaxyOrVoid);
                graph.set(`${row},${col}`, node);
            }
        }

        // Connect neighboring nodes
        for (const [coords, node] of graph.entries()) {
            const [row, col] = coords.split(',').map(Number);
            const neighborsCoords = [
                [row - 1, col],
                [row + 1, col],
                [row, col - 1],
                [row, col + 1],
            ];
            for (const [neighborRow, neighborCol] of neighborsCoords) {

                const neighborKey = `${neighborRow},${neighborCol}`;
                if (graph.has(neighborKey)) {
                    const neighbor = graph.get(neighborKey)!;
                    node.neighbors.push(neighbor);
                }
            }
        }

        this.cosmicSpaceGraph = graph;
        return graph;
    }

    private static heuristic(node: Node, goal: Node): number {
        // A* heuristic function (Euclidean distance)
        const dx = node.galaxyOrVoid.x - goal.galaxyOrVoid.x;
        const dy = node.galaxyOrVoid.y - goal.galaxyOrVoid.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    public findShortestPath(start: Node, goal: Node): Node[] | null {
        const openSet: Set<Node> = new Set([start]);

        const cameFrom: Map<Node, Node | null> = new Map();
        const gScore: Map<Node, number> = new Map();
        const fScore: Map<Node, number> = new Map();

        gScore.set(start, 0);
        fScore.set(start, SolutionDay11.heuristic(start, goal));

        while (openSet.size > 0) {
            let current: Node | undefined = undefined;
            let minFScore = Infinity;

            for (const node of openSet) {
                const score = fScore.get(node) || Infinity;
                if (score < minFScore) {
                    minFScore = score;
                    current = node;
                }
            }

            if (current == goal) {
                const path: Node[] = [];
                let node: Node | null = current;
                while (node) {
                    path.unshift(node);
                    node = cameFrom.get(node) || null;
                }
                return path;
            }

            if (current === undefined) {
                // Handle the case where current is still undefined
                throw new Error('No node found in the open set.');
            }

            openSet.delete(current);

            // Explore neighbors of the current node
            for (const neighbor of current.neighbors) {
                // Initialize scores for the neighbor if not already initialized
                if (!gScore.has(neighbor)) {
                    gScore.set(neighbor, Infinity);
                    fScore.set(neighbor, Infinity);
                }

                const tentativeGScore = (gScore.get(current) || 0) + 1; // Assuming uniform edge cost
                // console.log('Tentative G score:', tentativeGScore, '\n');

                // Update scores if this path to the neighbor is better
                if (tentativeGScore < (gScore.get(neighbor) || 0)) {
                    cameFrom.set(neighbor, current);
                    gScore.set(neighbor, tentativeGScore);
                    fScore.set(
                        neighbor,
                        tentativeGScore +
                            SolutionDay11.heuristic(neighbor, goal)
                    );

                    // Add the neighbor to the open set if it's not already there
                    if (!openSet.has(neighbor)) {
                        openSet.add(neighbor);
                    }
                }
            }
        }

        return null;
    }

    countAmountOfPairsOfGalaxies(): number {
        return (this.countGalaxies * (this.countGalaxies - 1)) / 2;
    }

    sumLengthOfShortestPathsForEachGalaxy() {
        const pairs: [Galaxy, Galaxy][] = [];
        const galaxyKeys = Array.from(this.galaxiesMap.keys());

        let sumOfShortestPaths = 0;

        // Iterate over all combinations of galaxies
        for (let i = 0; i < galaxyKeys.length; i++) {
            for (let j = i + 1; j < galaxyKeys.length; j++) {
                const galaxyA = this.galaxiesMap.get(galaxyKeys[i])!;
                const galaxyB = this.galaxiesMap.get(galaxyKeys[j])!;

                const toGraphKey = (galaxy: Galaxy) => `${galaxy.y},${galaxy.x}`;

                const startNode = this.cosmicSpaceGraph.get(toGraphKey(galaxyA));
                const goalNode = this.cosmicSpaceGraph.get(toGraphKey(galaxyB));

                if(!startNode || !goalNode) {
                    throw new Error('Start or goal node not found in the graph.');
                }

                const shortestPath = this.findShortestPath(startNode, goalNode);

                if (shortestPath) {
                    sumOfShortestPaths += shortestPath.length-1;
                }

                // console.log(`Galaxy A ${galaxyA.id} -> Galaxy B ${galaxyB.id}:`, shortestPath?.length, '\n')

                pairs.push([galaxyA, galaxyB]);
            }
        }

        return sumOfShortestPaths;
    }

    info(){
        console.log('Galaxies:', this.countGalaxies);

        console.log('Amount of pairs of galaxies:', this.countAmountOfPairsOfGalaxies());

        console.log('Width of the galaxy grid:', this.galaxyGrid[0].length);
        console.log('Height of the galaxy grid:', this.galaxyGrid.length);
    }

    printGalaxyMap(grid: Array<Array<Galaxy | Void>> = this.galaxyGrid) {
        for (const line of grid as Array<Array<Galaxy | Void>>) {
            for (const cell of line) {
                if (cell instanceof Galaxy) {
                    process.stdout.write(cell.id.toString());
                } else {
                    process.stdout.write('.');
                }
            }
            console.log();
        }
        console.log();
    }

    printGalaxyMapWithCoordinates() {
        for (let y = 0; y < this.galaxyGrid.length; y++) {
            for (let x = 0; x < this.galaxyGrid[y].length; x++) {
                const cell = this.galaxyGrid[y][x];
                if (cell instanceof Galaxy) {
                    process.stdout.write(cell.toString());
                }
            }
        }
    }
}

(function () {
    console.log('Day 11');
    const solution = new SolutionDay11();

    solution.setPuzzleInput(getPuzzleInput('day_11_t_input'));
    // solution.setPuzzleInput(getPuzzleInput('day_11_input'));
    solution.parsePuzzleInputIntoGalaxyGrid();
    solution.processCosmicExpansion();
    solution.buildGraph();
    // solution.printGalaxyMap();


    solution.info();
    console.log(solution.sumLengthOfShortestPathsForEachGalaxy());

    // solution.printGalaxyMapWithCoordinates();
})();
