import { getPuzzleInput } from '../helpers/getPuzzleInput.js';

interface Coordinates {
    x: number;
    y: number;
}

interface NumberDigit {
    number: number;
    coordinates: Coordinates;
}

class ParsedNumber {
    number: number;
    digits: NumberDigit[];
    border: Coordinates[] | null;
    wasSummed: boolean = false;

    constructor(digits: NumberDigit[], wholeNumber: number) {
        this.number = wholeNumber;
        this.border = null;
        this.digits = digits;
    }

    toString(): string {
        const digits = this.digits
            .map((digit) => {
                return `{ number: ${digit.number}, coordinates: { x: ${digit.coordinates.x}, y: ${digit.coordinates.y} } }`;
            })
            .join(',');

        return `ParsedNumber: ${this.number}, digits: [${digits}]`;
    }
}

class Gear {
    coordinates: Coordinates;
    gearRatio: number;
    adjacentTo: ParsedNumber[];

    constructor(coordinates: Coordinates) {
        this.coordinates = coordinates;
        this.gearRatio = -1;
        this.adjacentTo = [];
    }

    toString(): string {
        const adjacentTo = this.adjacentTo
            .map((adTo) => {
                return ` ${adTo.number} `;
            })
            .join(',');

        return `Gear: { x: ${this.coordinates.x}, y: ${this.coordinates.y} } \n Adjacent to: [${adjacentTo}] \n Gear Ratio: ${this.gearRatio} \n`;
    }
}

function isNumber(char: string): boolean {
    return !isNaN(parseInt(char));
}

function isSymbol(char: string): boolean {
    const symbolChars = '!@#$%^&*()-=_+[]{}|;:,<>?/\\`~\'"';

    return symbolChars.includes(char);
}

let BORDER_WIDTH = null;
let BORDER_HEIGHT = null;

function extractNumbersWithCoordinates(input: string[]): any {
    let parsedNumbers: ParsedNumber[] = [];

    for (let row = 0; row < BORDER_HEIGHT; row++) {
        const line = input[row];

        let aggregatedDigits: NumberDigit[] = [];

        for (let col = 0; col < BORDER_WIDTH; col++) {
            const char = line[col];

            const isCharNumber = isNumber(char);

            if (isCharNumber) {
                const number = parseInt(char);
                const coordinates = {
                    x: col,
                    y: row,
                };

                aggregatedDigits.push({
                    number,
                    coordinates,
                });
            }

            if (!isCharNumber || col === BORDER_WIDTH - 1) {
                if (aggregatedDigits.length !== 0) {
                    let wholeNumber = aggregatedDigits
                        .map((aggregation: any) => {
                            return aggregation.number;
                        })
                        .join('');

                    const parsedNumber: ParsedNumber = new ParsedNumber(
                        aggregatedDigits,
                        parseInt(wholeNumber)
                    );

                    parsedNumbers.push(parsedNumber);
                    aggregatedDigits = [];
                }
            }
        }
    }

    return parsedNumbers;
}

function extractGearsFromSchematic(schematic: string[]): Gear[] {
    const GEAR_SYMBOL = '*' as const;

    const gears: Gear[] = [];

    for (let row = 0; row < BORDER_HEIGHT; row++) {
        const line = schematic[row];

        for (let col = 0; col < BORDER_WIDTH; col++) {
            const char = line[col];

            if (char === GEAR_SYMBOL) {
                gears.push(new Gear({ x: col, y: row }));
            }
        }
    }

    return gears;
}

function getAdjacentNumberCoordinates(
    parsedNumber: ParsedNumber
): Coordinates[] {
    const borderCoordinates = new Set();

    parsedNumber.digits.forEach((aggregation: any) => {
        const { x, y } = aggregation.coordinates;

        const directions = [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [0, -1],
            [0, 1],
            [1, -1],
            [1, 0],
            [1, 1],
        ];

        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;

            if (
                !parsedNumber.digits.some(
                    (d) => d.coordinates.x === newX && d.coordinates.y === newY
                ) &&
                newX >= 0 &&
                newX < BORDER_WIDTH &&
                newY >= 0 &&
                newY < BORDER_HEIGHT
            ) {
                borderCoordinates.add(`${newX},${newY}`);
            }
        }
    });

    // Convert the set of coordinates to an array of Coordinates objects
    return Array.from(borderCoordinates).map((coord: string) => {
        const [x, y] = coord.split(',').map((c) => parseInt(c));
        return { x, y };
    });
}

function part1(input: string[]): void {
    console.log('------------------- PART 1 -------------------');
    console.time('How much time to process Part 1');

    const schematic: string[] = input;

    BORDER_WIDTH = schematic[0].length;
    BORDER_HEIGHT = schematic.length;

    const extractedParsedNumbers = extractNumbersWithCoordinates(schematic);

    let sum = 0;

    for (const parsedNumber of extractedParsedNumbers) {
        const border = getAdjacentNumberCoordinates(parsedNumber);
        parsedNumber.border = border;

        for (const { x, y } of border) {
            if (isSymbol(schematic[y][x]) && !parsedNumber.wasSummed) {
                parsedNumber.wasSummed = true;
                sum += parsedNumber.number;
            }
            if (parsedNumber.wasSummed) {
                break;
            }
        }
    }

    console.timeEnd('How much time to process Part 1');
    console.log(
        `Sum of all of the part numbers in the engine schematic: ${sum}`
    );
    console.log('----------------------------------------------');
}

function part2(input: string[]): void {
    console.log('------------------- PART 2 -------------------');
    console.time('How much time to process Part 2');

    const schematic: string[] = input;

    BORDER_WIDTH = schematic[0].length;
    BORDER_HEIGHT = schematic.length;

    const gears: Gear[] = extractGearsFromSchematic(schematic);

    const gearMap = new Map<string, Gear>();
    gears.forEach((gear) => {
        gearMap.set(`${gear.coordinates.x},${gear.coordinates.y}`, gear);
    });

    const extractedParsedNumbers: ParsedNumber[] =
        extractNumbersWithCoordinates(schematic);

    // This is the old way of doing it, but it's not efficient in compression to the way with using Map
    /* 
    for (const parsedNumber of extractedParsedNumbers) {
        const border = getAdjacentNumberCoordinates(parsedNumber);
        parsedNumber.border = border;

        for (const { x, y } of border) {
            const foundGear = gears.find(
                (gear) => gear.coordinates.x === x && gear.coordinates.y === y
            );
            if (foundGear) {
                foundGear.adjacentTo.push(parsedNumber);
            }
        }
    } 
    */

    extractedParsedNumbers.forEach((parsedNumber) => {
        const border = getAdjacentNumberCoordinates(parsedNumber);
        parsedNumber.border = border;

        for (const { x, y } of border) {
            const gear = gearMap.get(`${x},${y}`);
            if (gear) {
                gear.adjacentTo.push(parsedNumber);
            }
        }
    });

    const properGears = gears.filter((gear) => {
        if (gear.adjacentTo.length === 2) {
            gear.gearRatio =
                gear.adjacentTo[0].number * gear.adjacentTo[1].number;
            return gear;
        }
    });

    const sum = properGears.reduce((acc, gear) => {
        return acc + gear.gearRatio;
    }, 0);

    console.timeEnd('How much time to process Part 2');
    console.log(`Sum of all of the gear ratios in engine schematic: ${sum}`);
    console.log('----------------------------------------------');
}

part1(getPuzzleInput('day_3_input'));
part2(getPuzzleInput('day_3_input'));
