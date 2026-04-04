package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

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

func trimParse(puzzleNumber string) (int64, error) {
	return strconv.ParseInt(strings.Trim(puzzleNumber, "\r"), 10, 64)
}

func Map[T any, U any](s []T, f func(T) U) []U {
	result := make([]U, len(s))
	for i, v := range s {
		result[i] = f(v)
	}
	return result
}

func solvePart1(puzzleContent []int64) int64 {
	var target int64 = 2020
	seen := make(map[int64]struct{}, len(puzzleContent))

	for i := 0; i < len(puzzleContent); i++ {
		in := puzzleContent[i]
		seen[in] = struct{}{}
		need := target - in

		if _, ok := seen[need]; ok {
			return in * need
		}
	}

	return -1
}

func solvePart2(puzzleContent []int64) int64 {
	puzzleContentLength := len(puzzleContent)
	var target int64 = 2020

	for i := 0; i < puzzleContentLength; i++ {
		need := target - puzzleContent[i]
		seen := make(map[int64]struct{}, puzzleContentLength-i-1)

		for j := i + 1; j < puzzleContentLength; j++ {
			jn := puzzleContent[j]

			rlnNeed := need - jn
			if _, ok := seen[rlnNeed]; ok {
				return puzzleContent[i] * jn * rlnNeed
			}
			seen[jn] = struct{}{}
		}
	}

	return -1
}

func main() {
	content, err := os.ReadFile("p.txt")
	if err != nil {
		fmt.Println("Error reading puzzle file:", err)
		return
	}

	puzzleContent := Map(strings.Split(strings.TrimSpace(string(content)), "\n"), func(s string) int64 {
		result, _ := trimParse(s)
		return result
	})

	part1 := solvePart1(puzzleContent)
	part2 := solvePart2(puzzleContent)

	fmt.Println()
	fmt.Println(colorize(true, colorCyan, "Advent of Code 2020 - Day 01"))
	fmt.Println(strings.Repeat("=", 30))
	fmt.Printf("%s %d\n", colorize(true, colorGreen, "Part 1 Result:"), part1)
	fmt.Printf("%s %d\n", colorize(true, colorGreen, "Part 2 Result:"), part2)
	fmt.Println()
}
