## 🔬 Advent of Code 2022 Day 12 - Pathfinding Performance Benchmark

##### 📊 Dataset: 1339 start positions

##### 🎯 Target: [88, 20]

##### 🗺️ Map size: 113x41

# 📈 BENCHMARK RESULTS

| Method                    | Time (ms) | Result | Details                                                        |
| ------------------------- | --------- | ------ | -------------------------------------------------------------- |
| Iterative (Single Thread) | 435.5     | 375    | 1.57x `{"startPositions":1339,"validPaths":117}`               |
| Worker Pool (2 workers)   | 394.4     | 375    | 1.42x `{"poolSize":2,"startPositions":1339,"validPaths":117}`  |
| Worker Pool (4 workers)   | 277.5     | 375    | 🏆 `{"poolSize":4,"startPositions":1339,"validPaths":117}`     |
| Worker Pool (8 workers)   | 296.1     | 375    | 1.07x `{"poolSize":8,"startPositions":1339,"validPaths":117}`  |
| Worker Pool (16 workers)  | 372.2     | 375    | 1.34x `{"poolSize":16,"startPositions":1339,"validPaths":117}` |
| Individual Workers        | 5366.3    | 375    | 19.34x `{"workersSpawned":1339,"validPaths":117}`              |
