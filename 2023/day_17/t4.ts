type Point = { x: number; y: number };

class PriorityQueue {
    private values: { element: any; priority: number }[] = [];

    private sort() {
        this.values.sort((a, b) => a.priority - b.priority);
    }

    enqueue(element: any, priority: number) {
        this.values.push({ element, priority });
        this.sort();
    }

    dequeue(): any | undefined {
        return this.values.shift()?.element;
    }

    isEmpty(): boolean {
        return this.values.length === 0;
    }
}

function isWithinGridBounds(point: Point, grid: number[][]): boolean {
    return point.x >= 0 && point.x < grid.length && point.y >= 0 && point.y < grid[0].length;
}

function getHeatLoss(grid: number[][], point: Point): number {
    return grid[point.x][point.y];
}

function getNeighbors(
    point: Point,
    direction: number,
    stepsInSameDirection: number
): { point: Point; direction: number; stepsInSameDirection: number }[] {
    const moves = [
        { x: 1, y: 0 }, // right
        { x: 0, y: 1 }, // down
        { x: -1, y: 0 }, // left
        { x: 0, y: -1 }, // up
    ];

    let neighbors: { point: Point; direction: number; stepsInSameDirection: number }[] = [];

    // If we've moved 3 steps in the same direction, we must turn
    if (stepsInSameDirection < 3) {
        // Continue moving in the same direction
        let nextStraight = {
            x: point.x + moves[direction].x,
            y: point.y + moves[direction].y,
        };
        neighbors.push({ point: nextStraight, direction, stepsInSameDirection: stepsInSameDirection + 1 });
    }

    // Turning left and right
    let leftTurnDir = (direction + 3) % 4; // Turn left
    let rightTurnDir = (direction + 1) % 4; // Turn right

    let nextLeft = {
        x: point.x + moves[leftTurnDir].x,
        y: point.y + moves[leftTurnDir].y,
    };
    let nextRight = {
        x: point.x + moves[rightTurnDir].x,
        y: point.y + moves[rightTurnDir].y,
    };

    neighbors.push({ point: nextLeft, direction: leftTurnDir, stepsInSameDirection: 1 });
    neighbors.push({ point: nextRight, direction: rightTurnDir, stepsInSameDirection: 1 });

    return neighbors;
}

function dijkstra(grid: number[][]): any {
    const rows = grid.length;
    const cols = grid[0].length;

    const start: Point = { x: 0, y: 0 };
    const end: Point = { x: rows - 1, y: cols - 1 };

    const pq = new PriorityQueue();
    pq.enqueue({ point: start, direction: 0, cost: 0, path: [start], stepsInSameDirection: 0 }, 0);
    pq.enqueue({ point: start, direction: 1, cost: 0, path: [start], stepsInSameDirection: 0 }, 0);
    // pq.enqueue({ point: start, direction: 1, cost: 0, path: [start] }, 0);

    const visited: Set<string> = new Set();

    while (!pq.isEmpty()) {
        const { point, cost, direction, path, stepsInSameDirection } = pq.dequeue();

        if (point.x === end.x && point.y === end.y) {
            return { cost, path };
        }

        const pointKey = `${point.x},${point.y},${direction},${stepsInSameDirection}`;
        if (visited.has(pointKey)) continue;
        visited.add(pointKey);

        const neighbors =
            direction === -1
                ? [{ point, direction: 0, stepsInSameDirection: 1 }] // Start with initial direction
                : getNeighbors(point, direction, stepsInSameDirection);

        for (const {
            point: neighbor,
            direction: newDirection,
            stepsInSameDirection: newStepsInSameDirection,
        } of neighbors) {
            if (isWithinGridBounds(neighbor, grid)) {
                const newCost = cost + getHeatLoss(grid, neighbor);
                pq.enqueue(
                    {
                        point: neighbor,
                        direction: newDirection,
                        cost: newCost,
                        path: [...path, neighbor],
                        stepsInSameDirection: newStepsInSameDirection,
                    },
                    newCost
                );
            }
        }
    }

    return -1;
}

// const inputData = `14999
// 23456
// 99997`;

const inputData = `14999
23111
99991`;

const grid = inputData.split('\n').map((line) => line.split('').map((e) => Number(e)));

console.table(grid);

const result = dijkstra(grid);
console.log('Cost:', result.cost);

const displayPath = (path: Point[]) => {
    let stringPath = '';
    path.map((element) => {
        stringPath += `(${grid[element.x][element.y]}) -> `;
    });

    console.log(stringPath.slice(0, -4));
};
displayPath(result.path);
