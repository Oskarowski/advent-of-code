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
