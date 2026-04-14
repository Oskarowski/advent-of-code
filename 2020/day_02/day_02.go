package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

func solvePart1(puzzleContent []string) uint16 {
	validPasswordsCount := uint16(0)
	for _, line := range puzzleContent {
		parts := strings.Split(line, " ")
		minMax := strings.Split(parts[0], "-")

		if len(minMax) != 2 {
			continue
		}

		min, _ := strconv.ParseUint(minMax[0], 10, 16)
		max, _ := strconv.ParseUint(minMax[1], 10, 16)
		char := parts[1][0]
		pass := parts[2]

		freq := uint16(0)

		for _, c := range []byte(pass) {
			if c == char {
				freq++
			}
			if freq > uint16(max) {
				break
			}
		}

		if freq <= uint16(max) && freq >= uint16(min) {
			validPasswordsCount++
		}
	}

	return validPasswordsCount
}

func solvePart2(puzzleInput []string) uint16 {
	validPasswordCount := uint16(0)
	for _, line := range puzzleInput {
		line = strings.TrimSpace(line)
		if line == "" {
			continue
		}

		colonIdx := strings.Index(line, ":")
		dashIdx := strings.Index(line, "-")
		if colonIdx == -1 || dashIdx == -1 {
			panic(fmt.Sprintf("Hmm : or - not found in such line: %s", line))
		}

		pass := line[colonIdx+2:]
		char := (line[colonIdx-1 : colonIdx])[0]
		pos1, _ := strconv.ParseUint(line[:dashIdx], 10, 16)
		pos2, _ := strconv.ParseUint(line[dashIdx+1:colonIdx-2], 10, 16)

		if (pass[pos1-1] == char) != (pass[pos2-1] == char) {
			validPasswordCount++
		}
	}

	return validPasswordCount
}

const (
	colorReset  = "\033[0m"
	colorCyan   = "\033[36m"
	colorGreen  = "\033[32m"
	colorPurple = "\033[35m"
)

func colorize(enabled bool, color string, text string) string {
	if !enabled {
		return text
	}
	return color + text + colorReset
}

func main() {
	content, err := os.ReadFile("p.txt")
	if err != nil {
		fmt.Println("Error reading puzzle file:", err)
		return
	}

	puzzleContent := strings.Split(string(content), "\n")

	part1 := solvePart1(puzzleContent)
	part2 := solvePart2(puzzleContent)

	fmt.Println()
	fmt.Println(colorize(true, colorCyan, "Advent of Code 2020 - Day 02"))
	fmt.Println(strings.Repeat("=", 30))
	fmt.Printf("%s %d\n", colorize(true, colorGreen, "Part 1 Result:"), part1)
	fmt.Printf("%s %d\n", colorize(true, colorGreen, "Part 2 Result:"), part2)
	fmt.Println()
}
