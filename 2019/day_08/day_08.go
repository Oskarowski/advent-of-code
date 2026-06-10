package main

import (
	"fmt"
	"os"
	"path"
	"path/filepath"
	"runtime"
)

const (
	LAYER_HORIZONTAL_SIZE = 25
	LAYER_VERTICAL_SIZE   = 6
)

func main() {
	fmt.Println("\nAoC - 08 / 2019")

	_, file, _, _ := runtime.Caller(0)

	fileData, err := os.ReadFile(path.Join(filepath.Dir(file), "p.txt"))
	if err != nil {
		fmt.Println("Error reading file:", err)
		return
	}

	layerSize := LAYER_HORIZONTAL_SIZE * LAYER_VERTICAL_SIZE
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

	finalImage := make([]rune, layerSize)

	for idx := range layerSize {
		finalPixel := '2'

		for _, layer := range layers {
			if layer[idx] != '2' {
				finalPixel = rune(layer[idx])
				break
			}
		}
		finalImage[idx] = finalPixel
	}

	fmt.Println("\nPart 2:")

	for y := range LAYER_VERTICAL_SIZE {
		for x := range LAYER_HORIZONTAL_SIZE {
			pixel := finalImage[y*LAYER_HORIZONTAL_SIZE+x]

			if pixel == '1' {
				fmt.Print("█")
			} else {
				fmt.Print(" ")
			}
		}
		fmt.Println()
	}

}
