const puzzleContent = await Bun.file('./t.txt')
    .text()
    .then((data) => data.trim().replace(/\n/g, ''));

function solvePart1(puzzleContent: string): number {
    const IDRangesStr = puzzleContent.split(',').map((r) => r.trim());

    const countDigits = (n: number): number => {
        if (n === 0) return 1;
        return Math.floor(Math.log10(Math.abs(n))) + 1;
    };

    const isInvalidID = (num: number): boolean => {
        const digitCount = countDigits(num);

        if (digitCount % 2 !== 0) return false;

        const halfDigits = digitCount / 2;
        const divisor = Math.pow(10, halfDigits);

        const leftHalf = Math.floor(num / divisor);
        const rightHalf = num % divisor;

        return leftHalf === rightHalf;
    };

    let sum = 0;

    for (const IDRangeStr of IDRangesStr) {
        const [start, end] = IDRangeStr.split('-').map(Number);
        const size = end - start + 1;

        for (let id = start; id <= end; id++) {
            if (isInvalidID(id)) sum += id;
        }
    }

    return sum;
}

console.log(`Part 1 solution: ${solvePart1(puzzleContent)}`);
