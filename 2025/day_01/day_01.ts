const puzzleContent = await Bun.file('./t.txt')
    .text()
    .then((data) => data.trim());

function solve(puzzleContent: string): number {
    const rotationsSequence = puzzleContent
        .split('\n')
        .map<[string, number]>((line: string) => [line.slice(0, 1), parseInt(line.slice(1), 10)] as const);

    let rotationPointer = 50;
    let passthroughZero = 0;

    const wrap100 = (n: number): number => ((n % 100) + 100) % 100;

    for (const [dir, value] of rotationsSequence) {
        switch (dir) {
            case 'L':
                rotationPointer = wrap100(rotationPointer - value);
                break;
            case 'R':
                rotationPointer = wrap100(rotationPointer + value);
                break;
            default:
                throw new Error(`Unknown direction: ${dir}`);
        }

        if (rotationPointer === 0) {
            passthroughZero++;
        }
    }

    return passthroughZero;
}

console.log(`Final passthroughZero count: ${solve(puzzleContent)}`);
