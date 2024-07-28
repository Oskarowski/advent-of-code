import { getPuzzleInput } from '../helpers/getPuzzleInput.js';

class History {
    layers: number[][] = [];

    constructor(surfaceLayer: number[]) {
        this.layers.push(surfaceLayer);
    }

    toString() {
        return this.layers.map((layer) => layer.join(' ')).join('\n');
    }
}

function extrapolate(history: History) {
    for (let i = history.layers.length - 2; i > 0; i--) {
        const layer = history.layers[i];
        const deeperLayer = history.layers[i - 1];

        const extrapolatedRight: number =
            layer[layer.length - 1] + deeperLayer[deeperLayer.length - 1];

        const extrapolatedLeft: number = deeperLayer[0] - layer[0];

        deeperLayer.push(extrapolatedRight);
        deeperLayer.unshift(extrapolatedLeft);
    }
}

const calculateDifferences = (history: History) => {
    let inWhichLayer = 0;
    let allZeros = false;
    let steps = 0;

    do {
        const layerIn = history.layers[inWhichLayer];
        const deeperLayer: number[] = [];

        for (let i = 0; i < layerIn.length - 1; i++) {
            const difference = layerIn[i + 1] - layerIn[i];
            deeperLayer.push(difference);
        }

        const isZero = (n: number) => n === 0;
        allZeros = deeperLayer.every(isZero);

        inWhichLayer++;
        history.layers.push(deeperLayer);

        steps++;
        if (steps >= 1_147_483_641) {
            throw new Error(
                'Exceeded maximum steps, likely in an infinite loop.'
            );
        }
    } while (allZeros === false);
};

function parseInputIntoHistories(input: string[]): History[] {
    const histories: History[] = [];
    for (const line of input) {
        const history = new History(line.split(' ').map(Number));
        calculateDifferences(history);
        extrapolate(history);
        histories.push(history);
    }
    return histories;
}

function part1(input: string[]) {
    console.log('------------------- PART 1 -------------------');
    console.time('How much time to process Part 1');

    const histories = parseInputIntoHistories(input);

    const sum = histories.reduce((a, c) => {
        a += c.layers[0][c.layers[0].length - 1];
        return a;
    }, 0);

    console.timeEnd('How much time to process Part 1');
    console.log(`Sum of these extrapolated values from right: ${sum}`);
    console.log('----------------------------------------------');
}

// part1(getPuzzleInput('day_09_t_input'));
part1(getPuzzleInput('day_09_input'));

function part2(input: string[]) {
    console.log('------------------- PART 2 -------------------');
    console.time('How much time to process Part 2');
    const histories = parseInputIntoHistories(input);

    const sum = histories.reduce((a, c) => {
        a += c.layers[0][0];
        return a;
    }, 0);

    console.timeEnd('How much time to process Part 2');
    console.log(`Sum of these extrapolated values from left: ${sum}`);
    console.log('----------------------------------------------');
}

// part2(getPuzzleInput('day_09_t_input'));
part2(getPuzzleInput('day_09_input'));
