import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const targetPath = __dirname + '/../data/day_08/t08.txt';

const puzzleInput = fs.readFileSync(targetPath).toString().replace(/\r/g, '').trim().split('\n');
const cityPreview = fs
    .readFileSync(__dirname + '/../data/day_08/cityPreview.txt')
    .toString()
    .replace(/\r/g, '')
    .trim()
    .split('\n')
    .map((line) => line.split(''));

const city = puzzleInput.map((line) => line.split(''));

type Antenna = {
    frequency: string;
    x: number;
    y: number;
};

const calculateAntinodes = (antennas: Antenna[]): { x: number; y: number }[] => {
    const antinodes: Set<string> = new Set();

    const groupedByFrequency: Record<string, Antenna[]> = {};
    for (const antenna of antennas) {
        if (!groupedByFrequency[antenna.frequency]) {
            groupedByFrequency[antenna.frequency] = [];
        }
        groupedByFrequency[antenna.frequency].push(antenna);
    }

    for (const frequency in groupedByFrequency) {
        const sameFrequencyAntennas = groupedByFrequency[frequency];

        for (let i = 0; i < sameFrequencyAntennas.length; i++) {
            for (let j = i + 1; j < sameFrequencyAntennas.length; j++) {
                const A1 = sameFrequencyAntennas[i];
                const A2 = sameFrequencyAntennas[j];

                const dx = A2.x - A1.x;
                const dy = A2.y - A1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                const unitDx = dx / distance;
                const unitDy = dy / distance;

                const antinode1 = {
                    x: Math.round(A1.x - distance * unitDx),
                    y: Math.round(A1.y - distance * unitDy),
                };
                const antinode2 = {
                    x: Math.round(A2.x + distance * unitDx),
                    y: Math.round(A2.y + distance * unitDy),
                };

                antinodes.add(`${antinode1.x.toFixed(6)},${antinode1.y.toFixed(6)}`);
                antinodes.add(`${antinode2.x.toFixed(6)},${antinode2.y.toFixed(6)}`);
            }
        }
    }

    return Array.from(antinodes).map((str) => {
        const [x, y] = str.split(',').map(Number);
        return { x, y };
    });
};

const getAntennas = (city: string[][]): Antenna[] => {
    const antennas: Antenna[] = [];

    for (let y = 0; y < city.length; y++) {
        for (let x = 0; x < city[y].length; x++) {
            if (city[y][x] !== '.') {
                antennas.push({ frequency: city[y][x], x: x, y: y });
            }
        }
    }

    return antennas;
};

const markAntinodesOnCity = (city: string[][], antinodes: { x: number; y: number }[]) => {
    const withMarkedAntinodes = city.map((row) => row.slice());
    let placedAntinodesCount = 0;
    let uniqueAntinodesLocationsCount = 0;

    for (const antinode of antinodes) {
        const x = Math.round(antinode.x);
        const y = Math.round(antinode.y);

        if (x < 0 || x >= city[0].length || y < 0 || y >= city.length) {
            continue;
        }

        uniqueAntinodesLocationsCount++;

        if (city[y][x] === '.') {
            withMarkedAntinodes[y][x] = '#';
            placedAntinodesCount++;
        }
    }

    return [withMarkedAntinodes, placedAntinodesCount, uniqueAntinodesLocationsCount];
};

const antennas = getAntennas(city);
const antinodes = calculateAntinodes(antennas);
const [mapWithAntinodes, placedAntinodesCount, uniqueAntinodesLocationsCount] = markAntinodesOnCity(city, antinodes);

console.log('Locations for antinodes within city bounds:', uniqueAntinodesLocationsCount);
