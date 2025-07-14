// const rawData = await Bun.file(new URL('../data/day_23/t23.txt', import.meta.url)).text();
const rawData = await Bun.file(new URL('../data/day_23/puzzle_input.txt', import.meta.url)).text();
const lines = rawData.split('\n').filter((line) => line.trim() !== '');

type Computer = {
    id: string;
    connections: Set<string>;
};

function addConnection(computers: Map<string, Computer>, from: string, to: string) {
    if (!computers.has(from)) {
        computers.set(from, { id: from, connections: new Set() });
    }
    computers.get(from)!.connections.add(to);
}

const buildNetwork = (lines: string[]): Map<string, Computer> => {
    const computers = new Map<string, Computer>();

    lines.forEach((line) => {
        const [idA, idB] = line.split('-').map((part) => part.trim());

        addConnection(computers, idA, idB);
        addConnection(computers, idB, idA);
    });

    return computers;
};

function findLanParties(network: Map<string, Computer>): [string, string, string][] {
    const parties: [string, string, string][] = [];

    const keys = Array.from(network.keys());

    for (let i = 0; i < keys.length; i++) {
        const compA = keys[i];
        for (let j = i + 1; j < keys.length; j++) {
            const compB = keys[j];

            if (!network.get(compA)!.connections.has(compB)) continue;

            for (let k = j + 1; k < keys.length; k++) {
                const compC = keys[k];

                if (network.get(compA)!.connections.has(compC) && network.get(compB)!.connections.has(compC)) {
                    parties.push([compA, compB, compC]);
                }
            }
        }
    }

    return parties;
}

const computersNetwork = buildNetwork(lines);
const lanParties = findLanParties(computersNetwork);

console.log('Total LAN Parties:', lanParties.length);

const partiesContainingT = lanParties.filter((computers) => computers.some((computer) => computer[0] === 't'));

console.log('LAN Parties containing "t":', partiesContainingT.length);
// partiesContainingT.forEach((party) => {
//     console.log('Party:', party.join(', '));
// });

/**
 * Bron–Kerbosch algorithm
 * @param network
 */
function findLargestConnectedSet(network: Map<string, Computer>): string[] {
    const cliques: Array<Set<string>> = [];

    /**
     * Recursively finds maximal cliques using Bron–Kerbosch.
     *
     * @param R - Currently growing clique.
     * @param P - Potential nodes that can be added.
     * @param X - Nodes already processed.
     */
    function bronKerbosch(R: Set<string>, P: Set<string>, X: Set<string>): void {
        if (P.size === 0 && X.size === 0) {
            cliques.push(new Set(R));
            return;
        }

        for (const v of Array.from(P)) {
            const neighbors = network.get(v)!.connections;
            const newP = new Set<string>([...P].filter((w) => neighbors.has(w)));
            const newX = new Set<string>([...X].filter((w) => neighbors.has(w)));
            bronKerbosch(new Set([...R, v]), newP, newX);
            P.delete(v);
            X.add(v);
        }
    }

    const allNodes = new Set<string>(network.keys());
    bronKerbosch(new Set(), allNodes, new Set());

    let maxClique = new Set<string>();
    cliques.forEach((clique) => {
        if (clique.size > maxClique.size) {
            maxClique = clique;
        }
    });

    return Array.from(maxClique);
}

const largestConnectedSet = findLargestConnectedSet(computersNetwork);
console.log('Largest Connected Set:', largestConnectedSet);
console.log('Size of Largest Connected Set:', largestConnectedSet.length);

const lanPartyPassword = largestConnectedSet.sort((a, b) => a.localeCompare(b)).join(',');
console.log('LAN Party Password:', lanPartyPassword);
