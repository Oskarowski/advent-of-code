import { getPuzzleInput } from '../helpers/getPuzzleInput.js';
import * as fs from 'fs';

// const { getPuzzleInput } = require('../helpers/getPuzzleInput');

enum HandType {
    Undefined,
    HighCard,
    OnePair,
    TwoPairs,
    ThreeOfAKind,
    FullHouse,
    FourOfAKind,
    FiveOfAKind,
}

class Hand {
    type: HandType;
    cards: string[];
    bid: number;

    constructor(cards: string[], bid: number) {
        this.type = HandType.Undefined;
        this.bid = bid;
        this.cards = cards;
    }

    toString() {
        return `Type: ${HandType[this.type]} Cards: ${this.cards.join(
            ''
        )} Bid: ${this.bid}`;
    }
}

function determineHandTypePart1(hand: Hand): void {
    const cardCounts: { [key: string]: number } = {};

    hand.cards.forEach((card) => {
        if (cardCounts[card]) {
            cardCounts[card]++;
        } else {
            cardCounts[card] = 1;
        }
    });
    let uniqueCards = Object.keys(cardCounts).length;

    switch (uniqueCards) {
        case 1:
            hand.type = HandType.FiveOfAKind;
            return;
        case 5:
            hand.type = HandType.HighCard;
            return;
        case 4:
            hand.type = HandType.OnePair;
            return;
        case 3:
            if (Object.values(cardCounts).includes(3)) {
                hand.type = HandType.ThreeOfAKind;
                return;
            }
            hand.type = HandType.TwoPairs;
            return;
        case 2:
            if (Object.values(cardCounts).includes(4)) {
                hand.type = HandType.FourOfAKind;
                return;
            }
            hand.type = HandType.FullHouse;
            return;
    }
}

function determineHandTypePart2(hand: Hand): void {
    // Count occurrences of each card
    let cardCounts = {};
    let wildcards = 0;
    for (let card of hand.cards) {
        if (card == 'J' || card == 'j') {
            wildcards++;
            continue;
        }
        cardCounts[card] = (cardCounts[card] || 0) + 1;
    }

    const values = Object.values(cardCounts);
    const keys = Object.keys(cardCounts);

    // Five of a kind
    if (keys.length === 1 || wildcards === 5) {
        hand.type = HandType.FiveOfAKind;
        return;
    }

    // Four of a kind
    if (
        (keys.length === 2 && values.includes(4)) ||
        (keys.length === 2 && values.includes(3) && wildcards >= 1) ||
        (keys.length === 2 && values.includes(2) && wildcards >= 2) ||
        (wildcards === 3 && keys.length === 2)
    ) {
        hand.type = HandType.FourOfAKind;
        return;
    }

    // Full house
    if (
        (values.length === 2 && wildcards === 1) ||
        (values.filter((val) => val === 3).length === 1 &&
            values.filter((val) => val === 2).length === 1)
    ) {
        hand.type = HandType.FullHouse;
        return;
    }

    // Three of a kind
    if (
        (values.length === 2 && wildcards === 1) ||
        values.filter((val) => val === 3).length === 1 ||
        (values.length === 3 && wildcards === 2) ||
        (values.filter((val) => val === 2).length === 1 && wildcards === 1)
    ) {
        hand.type = HandType.ThreeOfAKind;
        return;
    }

    // Two pairs
    if (
        values.filter((val) => val === 2).length === 2 ||
        (values.filter((val) => val === 2).length === 1 && wildcards === 1)
    ) {
        hand.type = HandType.TwoPairs;
        return;
    }

    // One pair
    if (
        values.filter((val) => val === 2).length === 1 ||
        (values.length === 4 && wildcards >= 1)
    ) {
        hand.type = HandType.OnePair;
        return;
    }

    // High card
    hand.type = HandType.HighCard;
    return;
}

function parseInputToHands(input: string[], whichPart: number): Hand[] {
    const hands: Hand[] = [];

    for (let i = 0; i < input.length; i++) {
        const handLine = input[i];
        const [handChars, bid] = handLine.split(' ');

        const hand = new Hand(handChars.split(''), Number(bid));
        if (whichPart === 1) {
            determineHandTypePart1(hand);
        } else {
            determineHandTypePart2(hand);
        }
        hands.push(hand);
    }

    return hands;
}

function cardStrengthPart1(card: string): number {
    const cardValues: { [key: string]: number } = {
        A: 14,
        K: 13,
        Q: 12,
        J: 11,
        T: 10,
        '9': 9,
        '8': 8,
        '7': 7,
        '6': 6,
        '5': 5,
        '4': 4,
        '3': 3,
        '2': 2,
    };

    return cardValues[card];
}

function cardStrengthPart2(card: string): number {
    const cardValues: { [key: string]: number } = {
        A: 13,
        K: 12,
        Q: 11,
        T: 10,
        '9': 9,
        '8': 8,
        '7': 7,
        '6': 6,
        '5': 5,
        '4': 4,
        '3': 3,
        '2': 2,
        J: 1,
    };

    return cardValues[card];
}

function part1(input: string[]) {
    console.log('------------------- PART 1 -------------------');
    console.time('How much time to process Part 1');
    const hands = parseInputToHands(input, 1);

    hands.sort((handA, handB) => {
        if (handA.type !== handB.type) {
            return handA.type - handB.type;
        }

        const cardsA = handA.cards;
        const cardsB = handB.cards;

        for (let i = 0; i < 5; i++) {
            const strengthA = cardStrengthPart1(cardsA[i]);
            const strengthB = cardStrengthPart1(cardsB[i]);

            if (strengthA !== strengthB) {
                return strengthA - strengthB;
            }
        }

        return 0;
    });

    const totalWinnings = hands.reduce((acc, hand, index) => {
        return (acc += hand.bid * (index + 1));
    }, 0);

    console.timeEnd('How much time to process Part 1');
    console.log(`Total Winnings: ${totalWinnings}`);
    console.log('----------------------------------------------');
}

// part1(getPuzzleInput('day_07_t_input'));
// part1(getPuzzleInput('day_07_t1_input'));
part1(getPuzzleInput('day_07_input'));

function part2(input: string[]) {
    console.log('------------------- PART 2 -------------------');
    console.time('How much time to process Part 2');
    const hands = parseInputToHands(input, 2);

    hands.sort((handA, handB) => {
        if (handA.type !== handB.type) {
            return handA.type - handB.type;
        }

        const cardsA = handA.cards;
        const cardsB = handB.cards;

        for (let i = 0; i < cardsA.length; i++) {
            const strengthA = cardStrengthPart2(cardsA[i]);
            const strengthB = cardStrengthPart2(cardsB[i]);

            if (strengthA !== strengthB) {
                return strengthA - strengthB;
            }
        }

        return null;
    });
    const totalWinnings = hands.reduce((acc, hand, index) => {
        return (acc += hand.bid * (index + 1));
    }, 0);

    // saveHandsToFile(hands);

    console.timeEnd('How much time to process Part 2');
    console.log(`Total Winnings with J as wildcard: ${totalWinnings}`);
    console.log('----------------------------------------------');
}

// part2(getPuzzleInput('day_07_t_input')); //5905
// part2(getPuzzleInput('day_07_t1_input')); //
// part2(getPuzzleInput('day_07_t2_input')); // 6839
// part2(getPuzzleInput('day_07_t3_input')); // just to get the correct ordered hands

part2(getPuzzleInput('day_07_input'));

function saveHandsToFile(hands: Hand[]) {
    const filename = 'hands_output.txt';
    const stream = fs.createWriteStream(filename);

    hands.forEach((hand, ind) => {
        stream.write(hand.toString() + ` Rank: ${ind + 1}` + '\n');
    });

    stream.end();
    console.log(`Hands written to ${filename}`);
}
