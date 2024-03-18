import { getPuzzleInput } from '../helpers/getPuzzleInput';

class Node {
    L: string;
    R: string;

    constructor(L: string, R: string) {
        this.L = L;
        this.R = R;
    }

    toString() {
        return `L: ${this.L} R: ${this.R}`;
    }
}

class Graph {
    nodes: { [key: string]: Node };

    constructor() {
        this.nodes = {};
    }

    addNode(key: string, L: string, R: string) {
        this.nodes[key] = new Node(L, R);
    }

    getNode(key: string): Node | undefined {
        return this.nodes[key];
    }
}

function parseInputGraph(input: string[]): Graph {
    const regex = /([A-Z]+) = \(([A-Z]+), ([A-Z]+)\)/;

    const graph = new Graph();

    for (const line of input) {
        const match = line.match(regex);

        if (!match) {
            throw new Error('Invalid input');
        }

        const [, key, L, R] = match;

        graph.addNode(key, L, R);
    }

    return graph;
}

function parseInputMap(input: string[]): Map<string, Node> {
    const regex = /\b[A-Z]+\b/g;

    const nodes = new Map<string, Node>();

    for (const line of input) {
        const match = line.match(regex);

        if (!match) {
            throw new Error('Invalid input');
        }

        const [key, L, R] = match;

        nodes.set(key, new Node(L, R));
    }

    return nodes;
}

function parseInput(input: string[]): any {
    const regex = /\b[A-Z]+\b/g;

    const nodes = {};

    for (const line of input) {
        const match = line.match(regex);

        if (!match) {
            throw new Error('Invalid input');
        }

        const [key, L, R] = match;

        nodes[key] = { L, R };
    }

    return nodes;
}

// DONE EASY WAY WITH OBJECTS
// function part1(input: string[]) {
//     console.log('------------------- PART 1 -------------------');
//     console.time('How much time to process Part 1');

//     const instructions = input.splice(0, 2)[0].split('');

//     const allNodes: { [key: string]: { [key: string]: string } } =
//         parseInput(input);

//     const desirableKey = 'ZZZ';
//     let currentKey = 'AAA';
//     let steps = 0;

//     while (currentKey !== desirableKey) {
//         steps++;

//         if (steps >= 1_147_483_641) {
//             throw new Error(
//                 'Exceeded maximum steps, likely in an infinite loop.'
//             );
//         }

//         const node = allNodes[currentKey];

//         if (!node) {
//             throw new Error(`Node ${currentKey} not found.`);
//         }

//         const instruction = instructions[(steps - 1) % instructions.length];

//         currentKey = node[instruction];
//     }

//     console.timeEnd('How much time to process Part 1');
//     console.log(`Starting at AAA ${steps} steps are required to reach ZZZ`);
//     console.log('----------------------------------------------');
// }

function part1(input: string[]) {
    console.log('------------------- PART 1 -------------------');
    console.time('How much time to process Part 1');

    const instructions = input.splice(0, 2)[0].split('');

    const graph: Graph = parseInputGraph(input);

    const desirableKey = 'ZZZ';
    let currentKey = 'AAA';
    let steps = 0;

    while (currentKey !== desirableKey) {
        steps++;

        if (steps >= 1_147_483_641) {
            throw new Error(
                'Exceeded maximum steps, likely in an infinite loop.'
            );
        }

        const node: Node | undefined = graph.getNode(currentKey);

        if (!node) {
            throw new Error(`Node ${currentKey} not found.`);
        }

        const instruction = instructions[(steps - 1) % instructions.length];

        currentKey = node[instruction];
    }

    console.timeEnd('How much time to process Part 1');
    console.log(`Starting at AAA: ${steps} steps are required to reach ZZZ`);
    console.log('----------------------------------------------');
}

// part1(getPuzzleInput('day_08_t_input')); // 2
// part1(getPuzzleInput('day_08_t1_input')); // 6
part1(getPuzzleInput('day_08_input'));
