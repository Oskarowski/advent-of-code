package main

import (
	"flag"
	"fmt"
	"math"
	"os"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
	"time"
)

var puzzleFileProvidedPath = flag.String("f", "t.txt", "Name of the puzzle file to use")

type Point struct {
	X, Y int
}

func main() {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("hehe Recovered from panic:", r)
		}
	}()

	flag.Parse()

	fmt.Println("Using puzzle file:", *puzzleFileProvidedPath)

	exePath, err := os.Executable()
	if err == nil {
		dir := filepath.Dir(exePath)
		if _, err := os.Stat(filepath.Join(dir, *puzzleFileProvidedPath)); err == nil {
			os.Chdir(dir)
		}
	}

	content, err := os.ReadFile(fmt.Sprintf("%s", *puzzleFileProvidedPath))
	if err != nil {
		fmt.Println("Error reading puzzle file:", err)
		return
	}
	puzzleContent := strings.TrimSpace(string(content))

	start := time.Now()
	res1 := solvePart1(puzzleContent)
	dur1 := time.Since(start)
	fmt.Printf("Part 1 solution: %d\n", res1)
	fmt.Printf("Part 1 took: %v\n", dur1)

	printMemStats("After Part 1")

	start = time.Now()
	res2 := solvePart2(puzzleContent)
	dur2 := time.Since(start)
	fmt.Printf("Part 2 solution: %d\n", res2)
	fmt.Printf("Part 2 took: %v\n", dur2)
}

func printMemStats(msg string) {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)
	fmt.Printf("[%s] Alloc = %v MiB, TotalAlloc = %v MiB, Sys = %v MiB, NumGC = %v\n",
		msg, bToMb(m.Alloc), bToMb(m.TotalAlloc), bToMb(m.Sys), m.NumGC)
}

func bToMb(b uint64) uint64 {
	return b / 1024 / 1024
}

func computeArea(x1, y1, x2, y2 int) int {
	w := x1 - x2
	if w < 0 {
		w = -w
	}
	h := y1 - y2
	if h < 0 {
		h = -h
	}
	return (w + 1) * (h + 1)
}

func parsePoints(input string) []Point {
	lines := strings.Split(input, "\n")
	points := make([]Point, 0, len(lines))
	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line == "" {
			continue
		}
		parts := strings.Split(line, ",")
		if len(parts) != 2 {
			continue
		}
		x, err1 := strconv.Atoi(strings.TrimSpace(parts[0]))
		y, err2 := strconv.Atoi(strings.TrimSpace(parts[1]))
		if err1 == nil && err2 == nil {
			points = append(points, Point{X: x, Y: y})
		}
	}
	return points
}

func solvePart1(puzzleContent string) int {
	points := parsePoints(puzzleContent)
	maxArea := math.MinInt

	for i := range points {
		p1 := points[i]
		for j := i + 1; j < len(points)-1; j++ {
			p2 := points[j]
			area := computeArea(p1.X, p1.Y, p2.X, p2.Y)
			if area > maxArea {
				maxArea = area
			}
		}
	}

	if maxArea == math.MinInt {
		return -1
	}
	return maxArea
}

type BitGrid struct {
	Width, Height int
	Data          []uint64
}

func NewBitGrid(width, height int) *BitGrid {
	totalCells := width * height
	numWords := (totalCells + 31) / 32
	return &BitGrid{
		Width:  width,
		Height: height,
		Data:   make([]uint64, numWords),
	}
}

func (bg *BitGrid) Set(x, y int, val uint8) {
	if x < 0 || x >= bg.Width || y < 0 || y >= bg.Height {
		return
	}
	idx := y*bg.Width + x
	wordIdx := idx / 32
	bitOffset := (idx % 32) * 2

	bg.Data[wordIdx] &= ^(uint64(3) << bitOffset)
	bg.Data[wordIdx] |= (uint64(val&3) << bitOffset)
}

func (bg *BitGrid) Get(x, y int) uint8 {
	if x < 0 || x >= bg.Width || y < 0 || y >= bg.Height {
		return 0
	}
	idx := y*bg.Width + x
	wordIdx := idx / 32
	bitOffset := (idx % 32) * 2

	return uint8((bg.Data[wordIdx] >> bitOffset) & 3)
}

func solvePart2(puzzleContent string) int {
	points := parsePoints(puzzleContent)

	maxX, maxY := 0, 0
	for _, p := range points {
		if p.X > maxX {
			maxX = p.X
		}
		if p.Y > maxY {
			maxY = p.Y
		}
	}
	width := maxX + 1
	height := maxY + 1

	printMemStats("Before Grid Alloc")
	grid := NewBitGrid(width, height)
	printMemStats("After Grid Alloc")

	for _, p := range points {
		grid.Set(p.X, p.Y, 1) // 1 = #
	}

	for i := range points {
		p1 := points[i]
		p2 := points[(i+1)%len(points)]
		drawLine(grid, p1.X, p1.Y, p2.X, p2.Y)
	}

	fmt.Println("Starting FloodFill...")
	floodFillOutside(grid)
	printMemStats("After FloodFill")

	relevantXs := make(map[int]bool)
	relevantYs := make(map[int]bool)

	for _, p := range points {
		relevantXs[p.X] = true
		relevantXs[p.X-1] = true
		relevantYs[p.Y] = true
		relevantYs[p.Y-1] = true
	}

	sparseSum := make(map[int]map[int]uint64)
	for y := range relevantYs {
		sparseSum[y] = make(map[int]uint64)
	}

	fmt.Println("Computing prefix sums...")
	prevRowSums := make([]uint64, width)

	for y := range height {
		var rowAccumulator uint64 = 0
		for x := range width {
			val := grid.Get(x, y)

			binVal := uint64(0)
			if val == 0 || val == 1 {
				binVal = 1
			}

			rowAccumulator += binVal
			prevRowSums[x] += rowAccumulator

			if relevantYs[y] && relevantXs[x] {
				sparseSum[y][x] = prevRowSums[x]
			}
		}
	}
	printMemStats("After PrefixSums")

	maxValidArea := math.MinInt

	for i := range points {
		p1 := points[i]
		for j := i + 1; j < len(points)-1; j++ {
			p2 := points[j]
			expectedArea := computeArea(p1.X, p1.Y, p2.X, p2.Y)

			if expectedArea < maxValidArea {
				continue
			}

			xMax := max(p1.X, p2.X)
			xMin := min(p1.X, p2.X)
			yMax := max(p1.Y, p2.Y)
			yMin := min(p1.Y, p2.Y)

			getSum := func(x, y int) uint64 {
				if x < 0 || y < 0 {
					return 0
				}
				if row, ok := sparseSum[y]; ok {
					if val, ok := row[x]; ok {
						return val
					}
				}
				return 0
			}

			s1 := getSum(xMax, yMax)
			s2 := getSum(xMax, yMin-1)
			s3 := getSum(xMin-1, yMax)
			s4 := getSum(xMin-1, yMin-1)

			cArea := int(s1 - s2 - s3 + s4)

			if cArea == expectedArea {
				maxValidArea = expectedArea
			}
		}
	}

	if maxValidArea == math.MinInt {
		return 0
	}
	return maxValidArea
}

func drawLine(bg *BitGrid, x1, y1, x2, y2 int) {
	if x1 == x2 {
		minY := min(y1, y2)
		maxY := max(y1, y2)
		for y := minY; y <= maxY; y++ {
			if bg.Get(x1, y) == 0 {
				bg.Set(x1, y, 1)
			}
		}
	} else {
		minX := min(x1, x2)
		maxX := max(x1, x2)
		for x := minX; x <= maxX; x++ {
			if bg.Get(x, y1) == 0 {
				bg.Set(x, y1, 1)
			}
		}
	}
}

func floodFillOutside(bg *BitGrid) {
	type CR struct{ X, Y int }

	active := make([]CR, 0, 100000)
	next := make([]CR, 0, 100000)

	addToActive := func(x, y int) {
		if bg.Get(x, y) == 0 {
			bg.Set(x, y, 2)
			active = append(active, CR{x, y})
		}
	}

	for x := 0; x < bg.Width; x++ {
		addToActive(x, 0)
		addToActive(x, bg.Height-1)
	}
	for y := 0; y < bg.Height; y++ {
		addToActive(0, y)
		addToActive(bg.Width-1, y)
	}

	dirs := []CR{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}

	var processedCount int64 = 0
	var lastPrint int64 = 0

	for len(active) > 0 {
		currentSize := len(active)
		processedCount += int64(currentSize)

		if processedCount-lastPrint > 10_000_000 {
			fmt.Printf("FloodFill: Processed %d pixels. Active queue: %d\n", processedCount, currentSize)
			lastPrint = processedCount
			printMemStats("During FloodFill")
		}

		for _, curr := range active {
			cx, cy := curr.X, curr.Y
			for _, d := range dirs {
				nx, ny := cx+d.X, cy+d.Y
				if nx >= 0 && nx < bg.Width && ny >= 0 && ny < bg.Height {
					if bg.Get(nx, ny) == 0 {
						bg.Set(nx, ny, 2)
						next = append(next, CR{nx, ny})
					}
				}
			}
		}

		temp := active
		active = next
		next = temp[:0]
	}
	fmt.Printf("FloodFill finished. Total processed: %d\n", processedCount)
}
