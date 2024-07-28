import { getPuzzleInput } from '../helpers/getPuzzleInput.js';

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
    const regex = /([A-Z\d]+) = \(([A-Z\d]+), ([A-Z\d]+)\)/;

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

class Ghost {
    startingKey: string;
    endingKey: string;
    cycleLength: number;

    constructor(startingKey: string) {
        this.startingKey = startingKey;
        this.endingKey = '-1';
        this.cycleLength = -1;
    }

    toString() {
        return `Starting at ${this.startingKey} it takes ${this.cycleLength} steps to reach ${this.endingKey}`;
    }
}

function parseInputIntoGhosts(input: string[]): Ghost[] {
    const ghosts = [];

    const regex = /([A-Z\d]+) = \(([A-Z\d]+), ([A-Z\d]+)\)/;

    for (const line of input) {
        const match = line.match(regex);

        if (!match) {
            throw new Error('Invalid input in parsing ghosts.');
        }

        const [, key, L, R] = match;

        if (key[2] === 'A') {
            const ghost = new Ghost(key);
            ghosts.push(ghost);
        }
    }

    return ghosts;
}

function part2(input: string[]) {
    console.log('------------------- PART 2 -------------------');
    console.time('How much time to process Part 2');

    const instructions = input.splice(0, 2)[0].split('');
    const graph: Graph = parseInputGraph(input);
    const ghosts: Ghost[] = parseInputIntoGhosts(input);

    ghosts.forEach((ghost) => {
        let steps = 0;
        let currentKey = ghost.startingKey;

        while (currentKey[2] !== 'Z') {
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

            if (currentKey[2] === 'Z') {
                ghost.endingKey = currentKey;
                ghost.cycleLength = steps;
            }
        }
    });

    function gcd(a, b) {
        for (let temp = b; b !== 0; ) {
            b = a % b;
            a = temp;
            temp = b;
        }
        return a;
    }

    function lcmFunction(a, b) {
        const gcdValue = gcd(a, b);
        return (a * b) / gcdValue;
    }

    function findLCMOfGhosts(ghosts: Ghost[]) {
        if (ghosts.length === 0) {
            throw new Error('No ghosts to find LCM of.');
        }

        let lcm = ghosts[0].cycleLength;

        for (let i = 1; i < ghosts.length; i++) {
            lcm = lcmFunction(lcm, ghosts[i].cycleLength);
        }

        return lcm;
    }

    const lcm = findLCMOfGhosts(ghosts);

    console.timeEnd('How much time to process Part 2');
    console.log(`Starting at **A: ${lcm} steps to end nodes that end with Z`);
    console.log('----------------------------------------------');
}

// part2(getPuzzleInput('day_08_t2_input'));
part2(getPuzzleInput('day_08_input'));
