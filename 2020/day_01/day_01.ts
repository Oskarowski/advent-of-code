const puzzleContent = await Bun.file('./t.txt')
    .text()
    .then((d) => d.trim());

function solvePart1(puzzleContent: string): string {
    return 'Part 1 solution is not implemented yet';
}

console.log('Part 1 solution:', solvePart1(puzzleContent));

function solvePart2(puzzleContent: string): string {
    return 'Part 2 solution is not implemented yet';
}

console.log('Part 2 solution:', solvePart2(puzzleContent));
