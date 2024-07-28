import { getPuzzleInput } from '../helpers/getPuzzleInput.js';

const pi = getPuzzleInput('day_2_t_input');

interface IRound {
    redGems: number;
    blueGems: number;
    greenGems: number;
}

interface IGame {
    id: number;
    rounds: IRound[];

    minimas: { red: number; green: number; blue: number };
}

enum GemType {
    Red = 'red',
    Green = 'green',
    Blue = 'blue',
}

class Round implements IRound {
    redGems;
    blueGems;
    greenGems;

    constructor({
        redGemsAmount,
        greenGemsAmount,
        blueGemsAmount,
    }: {
        redGemsAmount: number;
        greenGemsAmount: number;
        blueGemsAmount: number;
    }) {
        this.redGems = redGemsAmount;
        this.greenGems = greenGemsAmount;
        this.blueGems = blueGemsAmount;
    }
}

class Game implements IGame {
    id;
    rounds;

    minimas = { red: 0, green: 0, blue: 0 };

    constructor(id: number) {
        this.id = id;
        this.rounds = [] as IRound[];
    }

    toString(): string {
        const roundsString = this.rounds
            .map((round) => {
                return `\n\t\t{ redGems: ${round.redGems}, greenGems: ${round.greenGems}, blueGems: ${round.blueGems} }`;
            })
            .join(',');

        const minimasString = `\n\t\t{ red: ${this.minimas.red}, green: ${this.minimas.green}, blue: ${this.minimas.blue} }`;

        return `Game { id: ${this.id}, rounds: [${roundsString}], minimas: ${minimasString}`;
    }
}

function parseInputToGames(input: string[]): IGame[] {
    let allGames = [] as IGame[];

    input.forEach((line) => {
        let gamePhrase = '';
        let allRounds = '';
        [gamePhrase, allRounds] = line.split(':');

        const gameId = Number(gamePhrase.split(' ')[1]);
        const game = new Game(gameId);

        const spitedRounds = allRounds.split(';');

        spitedRounds.forEach((roundLine: string) => {
            const allGemsInRound = roundLine.split(',');

            let redGemsAmount = 0;
            let greenGemsAmount = 0;
            let blueGemsAmount = 0;

            allGemsInRound.forEach((gemAmountAndType: string) => {
                gemAmountAndType = gemAmountAndType.trim();
                let amount, gemType;
                [amount, gemType] = gemAmountAndType.split(' ');

                switch (gemType) {
                    case GemType.Red:
                        redGemsAmount = Number(amount);
                        break;
                    case GemType.Green:
                        greenGemsAmount = Number(amount);
                        break;
                    case GemType.Blue:
                        blueGemsAmount = Number(amount);
                        break;
                }
            });

            const round = new Round({
                redGemsAmount: redGemsAmount,
                greenGemsAmount: greenGemsAmount,
                blueGemsAmount: blueGemsAmount,
            });

            game.rounds.push(round);
        });

        allGames.push(game);
    });

    return allGames;
}

function part1(input: string[]) {
    console.log('------------------- PART 1 -------------------');
    console.time('How much time to process Part 1');

    let allGames = parseInputToGames(input) as IGame[];

    const maxRedGems = 12;
    const maxGreenGems = 13;
    const maxBlueGems = 14;

    let idSum = 0;

    allGames.forEach((game) => {
        let possible = true;
        game.rounds.forEach((round) => {
            if (
                round.blueGems > maxBlueGems ||
                round.redGems > maxRedGems ||
                round.greenGems > maxGreenGems
            ) {
                possible = false;
            }
        });

        if (possible) {
            idSum += game.id;
        }
    });

    console.timeEnd('How much time to process Part 1');
    console.log(`Sum of all IDs of those games: ${idSum}`);
    console.log('----------------------------------------------');
}

part1(getPuzzleInput('day_2_input'));

function part2(input: string[]) {
    console.log('------------------- PART 2 -------------------');
    console.time('How much time to process Part 2');

    let allGames = parseInputToGames(input) as IGame[];

    let gamePowers = [] as number[];

    allGames.forEach((game) => {
        game.rounds.forEach((round) => {
            game.minimas.red = Math.max(game.minimas.red, round.redGems);
            game.minimas.green = Math.max(game.minimas.green, round.greenGems);
            game.minimas.blue = Math.max(game.minimas.blue, round.blueGems);
        });

        gamePowers.push(
            game.minimas.red * game.minimas.green * game.minimas.blue
        );
    });

    const powerSum = gamePowers.reduce((acc, curr) => acc + curr, 0);

    console.timeEnd('How much time to process Part 2');
    console.log(`Sum of the power of these sets: ${powerSum}`);
    console.log('----------------------------------------------');
}

part2(getPuzzleInput('day_2_input'));
