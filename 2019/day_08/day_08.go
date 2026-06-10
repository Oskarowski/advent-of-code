package main

import (
	"fmt"
	"os"
	"path"
	"path/filepath"
	"runtime"
)

func main() {
	fmt.Println("\nAoC - 08 / 2019")

	_, file, _, _ := runtime.Caller(0)
	dir := filepath.Dir(file)

	fileData, err := os.ReadFile(path.Join(dir, "p.txt"))
	if err != nil {
		fmt.Println("Error reading file:", err)
		return
	}

	layerHorizontalSize := 25
	layerVerticalSize := 6
	layerSize := layerHorizontalSize * layerVerticalSize
	layerCount := len(fileData) / layerSize

	layers := make([]string, layerCount)

	for i := range layerCount {
		layers[i] = string(fileData[i*layerSize : (i+1)*layerSize])
	}

	fewestZerosLayerIndex := -1
	fewestZerosCount := layerSize + 1

	computeCharInstances := func(stack string, needle rune) int {
		instances := 0
		for _, c := range stack {
			if c == needle {
				instances++
			}
		}
		return instances
	}

	for i, layer := range layers {
		zerosCount := computeCharInstances(layer, '0')

		if zerosCount != 0 && zerosCount < fewestZerosCount {
			fewestZerosLayerIndex = i
			fewestZerosCount = zerosCount
		}
	}

	imageCheckSum := computeCharInstances(layers[fewestZerosLayerIndex], '1') * computeCharInstances(layers[fewestZerosLayerIndex], '2')
	fmt.Printf("\nPart 1 Image Checksum: %d", imageCheckSum)
}
