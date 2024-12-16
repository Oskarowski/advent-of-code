import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const targetPath = __dirname + '/../data/day_14/t14.txt';

const puzzleInput = fs.readFileSync(targetPath).toString().replace(/\r/g, '').trim().split('\n');

const gridWidth = 11;
// const gridWidth = 101;
const gridHeight = 7;
// const gridHeight = 103;

type Robot = {
    x: number;
    y: number;
    dx: number;
    dy: number;
};

const computeRobotsFromInput = (puzzleInput: string[]): Robot[] => {
    const robots: Robot[] = [];

    const regex = /[-]?\d+/g;

    for (const line of puzzleInput) {
        const matches = line.match(regex);

        if (matches) {
            const [x, y, dx, dy] = matches.map(Number);
            robots.push({ x, y, dx, dy });
        }
    }

    return robots;
};

const drawGridWithRobots = (robots, width, height) => {
    const grid: string[][] = Array.from({ length: height }, () => Array.from({ length: width }, () => '.'));

    for (const robot of robots) {
        if (robot.y >= 0 && robot.y < height && robot.x >= 0 && robot.x < width) {
            if (grid[robot.y][robot.x] === '.') {
                grid[robot.y][robot.x] = '1';
            } else {
                grid[robot.y][robot.x] = String(Number(grid[robot.y][robot.x]) + 1);
            }
        }
    }

    return grid;
};

const robots = computeRobotsFromInput(puzzleInput);

const computeRobotsPositionAfterDeltaTime = (robots: Robot[], seconds: number) => {
    const mvdRobots = [];

    for (const robot of robots) {
        const newX = (robot.x + robot.dx * seconds) % gridWidth;
        const newY = (robot.y + robot.dy * seconds) % gridHeight;

        const wrappedX = ((newX % gridWidth) + gridWidth) % gridWidth;
        const wrappedY = ((newY % gridHeight) + gridHeight) % gridHeight;

        mvdRobots.push({
            ...robot,
            x: wrappedX,
            y: wrappedY,
        });
    }

    return mvdRobots;
};

const robotsAfterSomeTime = computeRobotsPositionAfterDeltaTime(robots, 100);

const robotsOnGrid = drawGridWithRobots(robotsAfterSomeTime, gridWidth, gridHeight);

console.log(`Grids width: ${robotsOnGrid[0].length} | height: ${robotsOnGrid.length}`);

const determineSafetyFactor = (robotsOnGrid: string[][], width, height): number => {
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);

    let topLeftCount = 0;
    let topRightCount = 0;
    let bottomLeftCount = 0;
    let bottomRightCount = 0;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (x === centerX || y === centerY) continue;

            if (robotsOnGrid[y][x] !== '.') {
                if (x < centerX && y < centerY) {
                    topLeftCount += Number(robotsOnGrid[y][x]); // Top-left quadrant
                } else if (x >= centerX && y < centerY) {
                    topRightCount += Number(robotsOnGrid[y][x]); // Top-right quadrant
                } else if (x < centerX && y >= centerY) {
                    bottomLeftCount += Number(robotsOnGrid[y][x]); // Bottom-left quadrant
                } else if (x >= centerX && y >= centerY) {
                    bottomRightCount += Number(robotsOnGrid[y][x]); // Bottom-right quadrant
                }
            }
        }
    }

    return topLeftCount * topRightCount * bottomLeftCount * bottomRightCount;
};

const safetyFactorOfGrid = determineSafetyFactor(robotsOnGrid, gridWidth, gridHeight);
console.log(`Safety factor is: ${safetyFactorOfGrid}`);
