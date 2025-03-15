import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getDefaultResultOrder } from 'dns';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const targetPath = __dirname + '/../data/day_12/t12.txt';

const garden = fs
    .readFileSync(targetPath)
    .toString()
    .replace(/\r/g, '')
    .trim()
    .split('\n')
    .map((row) => row.split(''));

type Sides = {
    top: number;
    right: number;
    bottom: number;
    left: number;
    total: number;
};

type Region = {
    plant: string;
    plots: { x: number; y: number }[];
    area: number;
    perimeter: number;
    fencingCost?: number;
    sides?: Sides;
};

const DIRECTIONS = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
];

const isOutOfBounds = (grid: string[][], x: number, y: number): boolean => {
    return x < 0 || x >= grid[0].length || y < 0 || y >= grid.length;
};

const getNeighbors = (grid: string[][], x: number, y: number): [number, number][] => {
    return DIRECTIONS.map(([dx, dy]): [number, number] => [x + dx, y + dy]);
};

const divideGarden = (garden: string[][]): Region[] => {
    const regions: Region[] = [];

    const visitedPlots = new Set<string>();

    for (let y = 0; y < garden.length; y++) {
        for (let x = 0; x < garden[0].length; x++) {
            const plotPlant = garden[y][x];
            const key = `${x},${y}`;

            if (visitedPlots.has(key)) {
                continue;
            }

            const plotsQueue: [number, number][] = [[x, y]];
            const region: Region = {
                plant: plotPlant,
                plots: [],
                area: 0,
                perimeter: 0,
            };

            while (plotsQueue.length > 0) {
                const [cx, cy] = plotsQueue.pop()!;
                const currentKey = `${cx},${cy}`;

                if (visitedPlots.has(currentKey)) {
                    continue;
                }

                visitedPlots.add(currentKey);
                region.plots.push({ x: cx, y: cy });
                region.area++;

                for (const [nx, ny] of getNeighbors(garden, cx, cy)) {
                    if (isOutOfBounds(garden, nx, ny)) {
                        region.perimeter++;
                        continue;
                    }

                    if (garden[ny][nx] === plotPlant) {
                        const neighborKey = `${nx},${ny}`;
                        if (!visitedPlots.has(neighborKey)) {
                            plotsQueue.push([nx, ny]);
                        }
                    } else {
                        region.perimeter++;
                    }
                }
            }

            regions.push(region);
        }
    }

    return regions;
};

const computeFencingCosts = (regions: Region[]): number => {
    return regions.reduce((acc, region) => {
        if (region.fencingCost) {
            return acc + region.fencingCost;
        }

        const cost = region.area * region.perimeter;
        region.fencingCost = cost;
        return acc + cost;
    }, 0);
};

const dividedGarden = divideGarden(garden);

const totalFencingCost = computeFencingCosts(dividedGarden);
console.log(`Total fencing cost: ${totalFencingCost}`);

const computeRegionSides = (region: Region) => {
    const maxX = Math.max(...region.plots.map((plot) => plot.x));
    const maxY = Math.max(...region.plots.map((plot) => plot.y));
    const width = maxX + 1;
    const height = maxY + 1;

    const grid = Array.from({ length: height }, () => Array(width).fill(0));

    for (const { x, y } of region.plots) {
        grid[y][x] = 1;
    }

    let topSegments = 0;
    let bottomSegments = 0;

    for (let y = 0; y < height; y++) {
        let inTopSegment = false;
        let inBottomSegment = false;

        for (let x = 0; x < width; x++) {
            const topExposed = grid[y][x] === 1 && (y === 0 || grid[y - 1][x] === 0);

            if (topExposed) {
                if (!inTopSegment) {
                    topSegments++;
                    inTopSegment = true;
                }
            } else {
                inTopSegment = false;
            }

            const bottomExposed = grid[y][x] === 1 && (y === height - 1 || grid[y + 1][x] === 0);

            if (bottomExposed) {
                if (!inBottomSegment) {
                    bottomSegments++;
                    inBottomSegment = true;
                }
            } else {
                inBottomSegment = false;
            }
        }
    }

    let leftSegments = 0;
    let rightSegments = 0;

    for (let x = 0; x < width; x++) {
        let inLeftSegment = false;
        let inRightSegment = false;

        for (let y = 0; y < height; y++) {
            const leftExposed = grid[y][x] === 1 && (x === 0 || grid[y][x - 1] === 0);
            
            if (leftExposed) {
                if (!inLeftSegment) {
                    leftSegments++;
                    inLeftSegment = true;
                }
            } else {
                inLeftSegment = false;
            }

            const rightExposed = grid[y][x] === 1 && (x === width - 1 || grid[y][x + 1] === 0);

            if (rightExposed) {
                if (!inRightSegment) {
                    rightSegments++;
                    inRightSegment = true;
                }
            } else {
                inRightSegment = false;
            }
        }
    }

    const totalSides = topSegments + bottomSegments + leftSegments + rightSegments;
    region.sides = {
        top: topSegments,
        right: rightSegments,
        bottom: bottomSegments,
        left: leftSegments,
        total: totalSides
    };
};

for (const region of dividedGarden) {
    computeRegionSides(region);
}

const computeFencingCostWithDiscount = (regions: Region[]): number => {
    return regions.reduce((acc, region) => {
        const cost = region.area * region.sides.total;
        region.fencingCost = cost;
        return acc + cost;
    }, 0);
};

const totalFencingCostWithDiscount = computeFencingCostWithDiscount(dividedGarden);
console.log(`Total fencing cost with discount: ${totalFencingCostWithDiscount}`);
