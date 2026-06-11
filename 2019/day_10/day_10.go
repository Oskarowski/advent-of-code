package main

import (
	"fmt"
	"math"
	"os"
	"path"
	"path/filepath"
	"runtime"
)

const (
	ROWS    = 23
	COLUMNS = 23
)

type Asteroid struct {
	x                  int
	y                  int
	countVisableAngles int
	visableAngles      map[float64]bool
}

func main() {
	_, file, _, _ := runtime.Caller(0)
	fileData, err := os.ReadFile(path.Join(filepath.Dir(file), "p.txt"))
	if err != nil {
		panic(err)
	}

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
			make(map[float64]bool),
		})

		dataChars++
	}

	maxVisableAsteroids := -1
	for _, a1 := range asteroids {
		for _, a2 := range asteroids {
			if a1 == a2 {
				continue
			}

			dx := (float64(a2.x - a1.x))
			dy := (float64(a2.y - a1.y))

			angle := math.Atan2(dy, dx)

			_, ok := a1.visableAngles[angle]
			if !ok {
				a1.visableAngles[angle] = true
				a1.countVisableAngles++
			}

			if a1.countVisableAngles > maxVisableAsteroids {
				maxVisableAsteroids = a1.countVisableAngles
			}
		}
	}

	fmt.Printf("Best space station can observe: %d asteroids", maxVisableAsteroids)

}
