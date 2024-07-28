import { getPuzzleInput } from '../helpers/getPuzzleInput.js';

class BoatRace {
    duration: number;
    recordDistance: number;
    possibleChargeTimes: number[] = [];

    constructor(duration: number, recordDistance: number) {
        this.duration = duration;
        this.recordDistance = recordDistance;
    }

    toString() {
        const chargeTimes = this.possibleChargeTimes.join(', ');
        return `Time/Duration: ${this.duration}, Distance: ${this.recordDistance} \n Possible charge times: ${chargeTimes} \n`;
    }
}

function calculatePossibleChargeTimes(boatRace: BoatRace): void {
    const raceDuration = boatRace.duration;
    const recordDistance = boatRace.recordDistance;

    let chargingTime = 0;
    let boatSpeed = 0;
    let distance = 0;

    do {
        boatSpeed = chargingTime;
        distance = boatSpeed * (raceDuration - chargingTime);

        if (distance > recordDistance) {
            boatRace.possibleChargeTimes.push(chargingTime);
        }

        chargingTime++;
    } while (chargingTime <= raceDuration);
}

function parseInputToBoatRaces(input: string[]): BoatRace[] {
    const boatRaces: BoatRace[] = [];

    if (input.length !== 2) {
        throw new Error(
            'Invalid input: To many lines in input. Expected 2 lines.'
        );
    }

    const times = input[0].match(/\d+/g)?.map(Number) || [];
    const distances = input[1].match(/\d+/g)?.map(Number) || [];

    if (times?.length !== distances?.length) {
        throw new Error(
            'Amount of times and distances do not match. Expected equal amount of times and distances.'
        );
    }

    for (let i = 0; i < times.length; i++) {
        const boatRace = new BoatRace(times[i], distances[i]);
        calculatePossibleChargeTimes(boatRace);
        boatRaces.push(boatRace);
    }

    return boatRaces;
}

function part1(input: string[]) {
    console.log('------------------- PART 1 -------------------');
    console.time('How much time to process Part 1');

    const boatRaces: BoatRace[] = parseInputToBoatRaces(input);

    const possibleCombinations = boatRaces.reduce((combinations, boatRace) => {
        return combinations * boatRace.possibleChargeTimes.length;
    }, 1);

    console.timeEnd('How much time to process Part 1');
    console.log(`Number of combinations is: ${possibleCombinations}`);
    console.log('----------------------------------------------');
}

// part1(getPuzzleInput('day_06_t_input'));
part1(getPuzzleInput('day_06_input'));

function part2(input: string[]) {
    console.log('------------------- PART 2 -------------------');
    console.time('How much time to process Part 2');

    const boatRace = new BoatRace(
        Number(input[0].replace(/\D/g, '')),
        Number(input[1].replace(/\D/g, ''))
    );

    calculatePossibleChargeTimes(boatRace);

    const possibleCombinations = boatRace.possibleChargeTimes.length;

    console.timeEnd('How much time to process Part 2');
    console.log(`Number of combinations is: ${possibleCombinations}`);
    console.log('----------------------------------------------');
}

// part2(getPuzzleInput('day_06_t_input'));
part2(getPuzzleInput('day_06_input'));
