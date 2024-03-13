import { getPuzzleInput } from '../helpers/getPuzzleInput';

enum MapType {
    SEED_TO_SOIL,
    SOIL_TO_FERTILIZER,
    FERTILIZER_TO_WATER,
    WATER_TO_LIGHT,
    LIGHT_TO_TEMPERATURE,
    TEMPERATURE_TO_HUMIDITY,
    HUMIDITY_TO_LOCATION,
}

class AlmanacMap {
    type: MapType;
    destRangeStart: number;
    destRangeEnd: number;
    sourceRangeStart: number;
    sourceRangeEnd: number;
    rangeLength: number;

    constructor(
        type: MapType,
        destRangeStart: number,
        sourceRangeStart: number,
        rangeLength: number
    ) {
        this.type = type;
        this.destRangeStart = destRangeStart;
        this.sourceRangeStart = sourceRangeStart;
        this.rangeLength = rangeLength;
        this.destRangeEnd = destRangeStart + rangeLength; // -1
        this.sourceRangeEnd = sourceRangeStart + rangeLength; // -1
    }

    toString(): string {
        return `Type: ${MapType[this.type]}, Dest Range: ${
            this.destRangeStart
        }-${this.destRangeEnd}, Source Range: ${this.sourceRangeStart}-${
            this.sourceRangeEnd
        }, Range Length: ${this.rangeLength}`;
    }
}

class Seed {
    id: number;
    soil: number;
    fertilizer: number;
    water: number;
    light: number;
    temperature: number;
    humidity: number;
    location: number;

    constructor(id: number) {
        this.id = id;
        this.soil = -1;
        this.fertilizer = -1;
        this.water = -1;
        this.light = -1;
        this.temperature = -1;
        this.humidity = -1;
        this.location = -1;
    }

    get seed(): number {
        return this.id;
    }

    toString(): string {
        return `Seed ID: ${this.id}, Soil: ${this.soil}, Fertilizer: ${this.fertilizer}, Water: ${this.water}, Light: ${this.light}, Temperature: ${this.temperature}, Humidity: ${this.humidity}, Location: ${this.location}`;
    }
}

const parseAlmanacMaps = (input: string[]): Map<MapType, AlmanacMap[]> => {
    let currentCategory: MapType | null = null;
    const almanacMaps = new Map<MapType, AlmanacMap[]>();

    for (let key in MapType) {
        const mapType = parseInt(key);
        if (!isNaN(mapType)) {
            almanacMaps.set(mapType, []);
        }
    }

    input.forEach((line) => {
        switch (line.trim()) {
            case 'seed-to-soil map:':
                currentCategory = MapType.SEED_TO_SOIL;
                break;
            case 'soil-to-fertilizer map:':
                currentCategory = MapType.SOIL_TO_FERTILIZER;
                break;
            case 'fertilizer-to-water map:':
                currentCategory = MapType.FERTILIZER_TO_WATER;
                break;
            case 'water-to-light map:':
                currentCategory = MapType.WATER_TO_LIGHT;
                break;
            case 'light-to-temperature map:':
                currentCategory = MapType.LIGHT_TO_TEMPERATURE;
                break;
            case 'temperature-to-humidity map:':
                currentCategory = MapType.TEMPERATURE_TO_HUMIDITY;
                break;
            case 'humidity-to-location map:':
                currentCategory = MapType.HUMIDITY_TO_LOCATION;
                break;
            default:
                if (currentCategory !== null && line.trim() !== '') {
                    const values = line.split(' ').map(Number);
                    if (values.length === 3) {
                        const [destRangeStart, sourceRangeStart, rangeLength] =
                            values;
                        almanacMaps
                            .get(currentCategory)
                            ?.push(
                                new AlmanacMap(
                                    currentCategory,
                                    destRangeStart,
                                    sourceRangeStart,
                                    rangeLength
                                )
                            );
                    }
                }
                break;
        }
    });

    return almanacMaps;
};

const parseSeeds = (seedsString: string): Seed[] => {
    const seeds: Seed[] = [];
    seedsString = seedsString.slice(7);

    seedsString.split(' ').forEach((seedString) => {
        const seed = new Seed(parseInt(seedString, 10));
        seeds.push(seed);
    });

    return seeds;
};

const identifySeedsData = (
    seeds: Seed[],
    almanacMaps: Map<MapType, AlmanacMap[]>
): Seed[] => {
    const checkIfNumberIsInRange = (map: AlmanacMap, id: number) => {
        return map.sourceRangeStart <= id && id <= map.sourceRangeEnd;
    };

    const calculateFinalOffset = (map: AlmanacMap, id: number) => {
        const offset = id - map.sourceRangeStart;
        return map.destRangeStart + offset;
    };

    const checkIfIsOffsetIfNotAssignSelf = (
        seed: Seed,
        prop: string,
        origin: string
    ) => {
        if (seed[prop] === -1) {
            seed[prop] = seed[origin];
        }
    };

    const mapSeedPropRanges = (seed: Seed, mapType: MapType) => {
        almanacMaps.get(MapType.SEED_TO_SOIL);

        const [source, destination] = MapType[mapType]
            .split('_TO_')
            .map((str) => str.toLowerCase());

        const amountOfMaps = almanacMaps.get(mapType)?.length;
        const mapsOfSpecificType = almanacMaps.get(mapType);

        if (!amountOfMaps || !mapsOfSpecificType) {
            return;
        }

        for (let index = 0; index < amountOfMaps; index++) {
            const map = mapsOfSpecificType[index];

            if (seed[destination] !== -1) {
                return;
            }

            if (checkIfNumberIsInRange(map, seed[source])) {
                seed[destination] = calculateFinalOffset(map, seed[source]);
            }
        }

        checkIfIsOffsetIfNotAssignSelf(seed, destination, source);
    };

    for (let index = 0; index < seeds.length; index++) {
        const seed = seeds[index];

        mapSeedPropRanges(seed, MapType.SEED_TO_SOIL);
        mapSeedPropRanges(seed, MapType.SOIL_TO_FERTILIZER);
        mapSeedPropRanges(seed, MapType.FERTILIZER_TO_WATER);
        mapSeedPropRanges(seed, MapType.WATER_TO_LIGHT);
        mapSeedPropRanges(seed, MapType.LIGHT_TO_TEMPERATURE);
        mapSeedPropRanges(seed, MapType.TEMPERATURE_TO_HUMIDITY);
        mapSeedPropRanges(seed, MapType.HUMIDITY_TO_LOCATION);
    }

    return seeds;
};

function part1(input: string[]) {
    console.log('------------------- PART 1 -------------------');
    console.time('How much time to process Part 1');

    const seedsString = input.splice(0, 2)[0];
    const almanacMaps: Map<MapType, AlmanacMap[]> = parseAlmanacMaps(input);
    const seeds: Seed[] = identifySeedsData(
        parseSeeds(seedsString),
        almanacMaps
    );

    const lowestLocation = Math.min(...seeds.map((seed) => seed.location));

    console.timeEnd('How much time to process Part 1');
    console.log(`Lowest location number is: ${lowestLocation}`);
    console.log('----------------------------------------------');
}

// part1(getPuzzleInput('day_5_t_input')); // 35
part1(getPuzzleInput('day_5_input')); // 388071289
