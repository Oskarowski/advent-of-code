import { getPuzzleInput } from '../helpers/getPuzzleInput.js';

class Card {
    id: number;
    winningNumbers: number[];
    numbers: number[];
    winningNumbersCount: number;
    value: number;
    copies: number;

    constructor(id: number, winningNumbers: number[], numbers: number[]) {
        this.id = id;
        this.winningNumbers = winningNumbers;
        this.numbers = numbers;
        this.winningNumbersCount = this.calculateWinningNumbersCount();
        this.value = this.calculateValue();
        this.copies = 1;
    }

    private calculateWinningNumbersCount(): number {
        return this.numbers.filter((num) => this.winningNumbers.includes(num))
            .length;
    }

    private calculateValue(): number {
        switch (this.winningNumbersCount) {
            case 0:
                return 0;
            case 1:
                return 1;

            default:
                return 1 << (this.winningNumbersCount - 1);
        }
    }

    toString() {
        return `Card ${this.id}: Winning Numbers: [${this.winningNumbers.join(
            ', '
        )}], Numbers: [${this.numbers.join(', ')}] \n Winning Numbers Count: ${
            this.winningNumbersCount
        } \n Value: ${this.value} \n Copies: ${this.copies} \n\n`;
    }
}

const parseCards = (input: string[]): Card[] => {
    const cards: Card[] = [];

    // parse input
    const cachedInputLength = input.length;
    for (let index = 0; index < cachedInputLength; index++) {
        const cardLine: string = input[index];

        const [cardIdString, numbersString] = cardLine.split(':');

        const cardId: number = parseInt(cardIdString.substring(4).trim(), 10);

        const [winningNumbersSet, cardNumbersSet] = numbersString
            .split('|')
            .map((set) => set.trim().split(' ').filter(Boolean).map(Number));

        cards.push(new Card(cardId, winningNumbersSet, cardNumbersSet));
    }

    return cards;
};

function part1(input: string[]) {
    console.log('------------------- PART 1 -------------------');
    console.time('How much time to process Part 1');

    const cards: Card[] = parseCards(input);

    let scratchcardsTotalWorth: number = 0;
    for (let index = 0; index < cards.length; index++) {
        const card = cards[index];
        scratchcardsTotalWorth += card.value;
    }

    console.timeEnd('How much time to process Part 1');
    console.log(
        `All scratchcards are worth in total: ${scratchcardsTotalWorth}`
    );
    console.log('----------------------------------------------');
}

// part1(getPuzzleInput('day_4_t_input'));
part1(getPuzzleInput('day_4_input'));

function part2(input: string[]) {
    console.log('------------------- PART 2 -------------------');
    console.time('How much time to process Part 2');

    const cards: Card[] = parseCards(input);
    let totalScratchcards = 0;
    const cachedCardsLength = cards.length;

    for (let index = 0; index < cachedCardsLength; index++) {
        const card = cards[index];

        if (card.winningNumbersCount >= 1) {
            let iterations = 0;
            let nextCardIndex = index + 1;
            do {
                const nextCard = cards[nextCardIndex];
                nextCard.copies += card.copies;
                nextCardIndex++;
                iterations++;
            } while (iterations < card.winningNumbersCount);
        }

        totalScratchcards += card.copies;
    }

    console.timeEnd('How much time to process Part 2');
    console.log(`Amount of all scratchcards is: ${totalScratchcards}`);
    console.log('----------------------------------------------');
}

// part2(getPuzzleInput('day_4_t_input'));
part2(getPuzzleInput('day_4_input'));
