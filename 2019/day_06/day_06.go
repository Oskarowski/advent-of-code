package main

import (
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"strings"
)

type Planet struct {
	Name     string
	Cost     int
	Center   *Planet
	Orbiting []*Planet
}

func SolvePart1(puzzleInput []string) int {

	galaxyTree := make(map[string]*Planet)
	for _, line := range puzzleInput {
		info := strings.Split(strings.TrimSpace(line), ")")
		p1, p2 := info[0], info[1]
		planet1, ok := galaxyTree[p1]
		if !ok {
			planet1 = &Planet{Name: p1, Cost: 0}
			galaxyTree[p1] = planet1
		}

		planet2, ok := galaxyTree[p2]
		if !ok {
			planet2 = &Planet{Name: p2, Cost: 0}
			galaxyTree[p2] = planet2
		}

		planet1.Orbiting = append(planet1.Orbiting, planet2)
		planet2.Center = planet1
	}

	queue := []*Planet{galaxyTree["COM"]}
	totalGalaxyTraverseCost := 0
	for len(queue) > 0 {
		planet := queue[0]
		queue = queue[1:]

		for _, p := range planet.Orbiting {
			queue = append(queue, p)
			p.Cost = planet.Cost + 1
			totalGalaxyTraverseCost += p.Cost
		}
	}

	return totalGalaxyTraverseCost
}

func main() {
	_, file, _, _ := runtime.Caller(0)
	dir := filepath.Dir(file)

	fileData, err := os.ReadFile(filepath.Join(dir, "p.txt"))
	if err != nil {
		fmt.Println("Error reading file:", err)
		return
	}

	puzzleInput := strings.Split(strings.TrimSpace(string(fileData)), "\n")

	solvedPuzzle1 := SolvePart1(puzzleInput)

	fmt.Printf("Part 1: %d\n", solvedPuzzle1)
}
