const fs = require('fs')

const puzzleInput = fs
    .readFileSync(`${__dirname}/p_input.txt`)
    .toString()
    .replace(/\r/g, '')
    .trim()
    .split('\n')

const part1 = () => {
    console.log('------------------- PART 1 -------------------')
    console.time('How much time to process Part 1')

    const mappedValues = puzzleInput.map((line: string) => {
        const regex = /\d/g
        const matchedDigits: string[] = Array.from(
            line.matchAll(regex),
            (match: RegExpMatchArray) => match[0]
        )

        if (matchedDigits.length === 0) return 0

        const numberRepresentation =
            matchedDigits.length > 1
                ? matchedDigits[0] + matchedDigits[matchedDigits.length - 1]
                : matchedDigits[0] + matchedDigits[0]

        return Number(numberRepresentation)
    })

    const calibratedSum = mappedValues.reduce(
        (accumulator: number, currentValue: number) =>
            accumulator + currentValue,
        0
    )
    console.timeEnd('How much time to process Part 1')

    console.log(`Sum of all calibration values: ${calibratedSum}`)
    console.log('----------------------------------------------')
}

part1()
