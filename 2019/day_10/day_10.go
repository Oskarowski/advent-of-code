package main

import (
	"bytes"
	"fmt"
	"math"
	"os"
	"path"
	"path/filepath"
	"runtime"
	"sort"
)

const (
	ROWS    = 23
	COLUMNS = 23
)

type VisibleAsteroid struct {
	x        int
	y        int
	distance float64
	angle    float64
}

type Asteroid struct {
	x                  int
	y                  int
	countVisableAngles int
	visableAngles      map[float64]*VisibleAsteroid
}

func main() {
	_, file, _, _ := runtime.Caller(0)
	fileData, err := os.ReadFile(path.Join(filepath.Dir(file), "p.txt"))
	if err != nil {
		panic(err)
	}

	fileData = bytes.ReplaceAll(fileData, []byte("\r"), []byte{})
	fileData = bytes.ReplaceAll(fileData, []byte("\n"), []byte{})

	asteroids := make([]*Asteroid, 0)

	dataChars := 0
	for idx := range fileData {
		spaceObject := fileData[idx]

		if spaceObject != '.' && spaceObject != '#' {
			continue
		}

		if spaceObject == '.' {
			dataChars++
			continue
		}

		x := dataChars % COLUMNS
		y := dataChars / COLUMNS

		asteroids = append(asteroids, &Asteroid{
			x,
			y,
			0,
			make(map[float64]*VisibleAsteroid),
		})

		dataChars++
	}

	maxVisableAsteroids := -1
	bestAsteroidForObservatory := &Asteroid{}

	for _, a1 := range asteroids {
		for _, a2 := range asteroids {
			if a1 == a2 {
				continue
			}

			dx := (float64(a2.x - a1.x))
			dy := (float64(a2.y - a1.y))

			manhattan := math.Abs(dx) + math.Abs(dy)

			angle := math.Atan2(dy, dx)
			clockAngle := angle + (math.Pi / 2)
			if clockAngle < 0 {
				clockAngle += 2 * math.Pi
			}

			va, ok := a1.visableAngles[angle]
			if !ok {
				a1.visableAngles[angle] = &VisibleAsteroid{
					x:        a2.x,
					y:        a2.y,
					distance: manhattan,
					angle:    clockAngle,
				}
				a1.countVisableAngles++
			}

			if va != nil && manhattan < va.distance {
				va.distance = manhattan
				va.x = a2.x
				va.y = a2.y
				va.angle = clockAngle
			}
		}

		if a1.countVisableAngles > maxVisableAsteroids {
			maxVisableAsteroids = a1.countVisableAngles
			bestAsteroidForObservatory = a1
		}
	}

	fmt.Printf("\nBest space station can observe up too: %d asteroids, and it's position X:{%d}, Y:{%d}", maxVisableAsteroids, bestAsteroidForObservatory.x, bestAsteroidForObservatory.y)

	sequVisibleAsteroids := make([]*VisibleAsteroid, 0)
	for _, val := range bestAsteroidForObservatory.visableAngles {
		sequVisibleAsteroids = append(sequVisibleAsteroids, val)
	}

	sort.Slice(sequVisibleAsteroids, func(i, j int) bool {
		return sequVisibleAsteroids[i].angle < sequVisibleAsteroids[j].angle
	})

	vaporizedAsteroids := make([]*VisibleAsteroid, 0)

	for _, va := range sequVisibleAsteroids {
		asteroidsLeft := make([]*Asteroid, 0)

		for _, asteroid := range asteroids {
			if va.x == bestAsteroidForObservatory.x && va.y == bestAsteroidForObservatory.y {
				continue
			}

			if asteroid.x == va.x && asteroid.y == va.y {
				vaporizedAsteroids = append(vaporizedAsteroids, va)
				continue
			}

			asteroidsLeft = append(asteroidsLeft, asteroid)

		}
		asteroids = asteroidsLeft
	}

	for idx, va := range vaporizedAsteroids {
		if idx == 199 {
			res := (va.x * 100) + (va.y)
			fmt.Printf("\n200th asteroid to be vaporized is X:{%d}, Y:{%d}", va.x, va.y)
			fmt.Printf("\n200th asteroid score is: {%d}", res)
			return
		}
	}

	fmt.Println("\nSomething is not right i can feel it")
}
