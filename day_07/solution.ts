//@ts-nocheck
import { getPuzzleInput } from '../helpers/getPuzzleInput';
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
        return `Type: ${HandType[this.type]}, Bid: ${
            this.bid
        } \n Cards: ${this.cards.join('')} \n`;
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
            continue; // Skip wildcards for now
        }
        cardCounts[card] = (cardCounts[card] || 0) + 1;
    }

    const values = Object.values(cardCounts);
    const uniqueValues = new Set(values);

    if (uniqueValues.size === 0 && wildcards >= 5) {
        hand.type = HandType.FiveOfAKind;
        return;
    }

    // Five of a kind
    if (uniqueValues.size === 1 && Math.max(...values) + wildcards >= 5) {
        hand.type = HandType.FiveOfAKind;
        return;
    }

    // Four of a kind
    if (uniqueValues.size <= 2 && Math.max(...values) + wildcards >= 4) {
        hand.type = HandType.FourOfAKind;
        return;
    }

    // Full house
    if (
        (values.length == 2 && wildcards === 1) ||
        (values.filter((val) => val === 3).length === 1 &&
            values.filter((val) => val === 2).length === 1)
    ) {
        hand.type = HandType.FullHouse;
        return;
    }

    // Three of a kind
    if (
        (values.length === 2 && wildcards >= 2) ||
        values.filter((val) => val === 3).length === 1
    ) {
        hand.type = HandType.ThreeOfAKind;
        return;
    }

    // Two pairs
    if (
        values.filter((val) => val === 2).length === 2 ||
        values[0] + values[1] + wildcards >= 4
    ) {
        hand.type = HandType.TwoPairs;
        return;
    }

    // One pair
    if (uniqueValues.size <= 4 && (values.includes(2) || wildcards >= 1)) {
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
// part1(getPuzzleInput('day_07_input'));
// part1(getPuzzleInput('day_07_t1_input'));

function part2(input: string[]) {
    // console.log('------------------- PART 2 -------------------');
    // console.time('How much time to process Part 2');
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

        return 0;
    });

    const totalWinnings = hands.reduce((acc, hand, index) => {
        return (acc += hand.bid * (index + 1));
    }, 0);

    hands.forEach((hand) => {
        console.log(hand.toString());
    });

    // console.timeEnd('How much time to process Part 2');
    console.log(`Total Winnings: ${totalWinnings}`);
    // console.log('----------------------------------------------');
}

// part2(getPuzzleInput('day_07_t_input')); //
// part2(getPuzzleInput('day_07_t1_input')); //
part2(getPuzzleInput('day_07_input'));
// 250 507 454 to low
// 252 753 670 to low
// 252 532 599 not right
// 252 910 023 to high
