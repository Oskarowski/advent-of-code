const puzzleContent = await Bun.file('./t.txt')
    .text()
    .then((data) => data.trim());

function solve(puzzleContent: string, positionPerfect = false): number {
    const rotationsSequence = puzzleContent
        .split('\n')
        .map<[string, number]>((line: string) => [line.slice(0, 1), parseInt(line.slice(1), 10)] as const);

    let rotationPointer = 50;
    let passthroughZero = 0;

    const wrap100 = (n: number): number => ((n % 100) + 100) % 100;

    const countCrossingsLeft = (start: number, distance: number): number => {
        if (start === 0) return Math.floor(distance / 100);
        if (distance < start) return 0;
        return 1 + Math.floor((distance - start) / 100);
    };

    const countCrossingsRight = (start: number, distance: number): number => {
        return Math.floor((start + distance) / 100);
    };

    for (const [dir, value] of rotationsSequence) {
        let crossings = 0;
        switch (dir) {
            case 'L':
                crossings = positionPerfect ? countCrossingsLeft(rotationPointer, value) : 0;
                rotationPointer = wrap100(rotationPointer - value);
                break;
            case 'R':
                crossings = positionPerfect ? countCrossingsRight(rotationPointer, value) : 0;
                rotationPointer = wrap100(rotationPointer + value);
                break;
            default:
                throw new Error(`Unknown direction: ${dir}`);
        }

        passthroughZero += crossings;
        if (!positionPerfect && rotationPointer === 0) {
            passthroughZero++;
        }
    }

    return passthroughZero;
}

console.log(`Final passthroughZero count only stepping on 0 position: ${solve(puzzleContent)}`);
console.log(`Final passthroughZero count with counting just passing 0 position: ${solve(puzzleContent, true)}`);
