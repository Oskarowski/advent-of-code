declare var self: Worker;

interface WorkerMessage {
    heightMap: number[][];
    start: [number, number];
    end: [number, number];
}

interface PathResult {
    steps: number;
    path: [number, number][];
}

const findShortestPath = (start: [number, number], end: [number, number], heightMap: number[][]): PathResult => {
    const height = heightMap.length;
    const width = heightMap[0].length;

    const queue: [number, number, number][] = [[start[0], start[1], 0]];

    const visited = new Set<string>();
    visited.add(`${start[0]},${start[1]}`);

    const prev = new Map<string, [number, number] | null>();

    const directions = [
        [0, -1], // Up
        [0, 1], // Down
        [-1, 0], // Left
        [1, 0], // Right
    ];

    while (queue.length > 0) {
        const [x, y, steps] = queue.shift()!;

        if (x === end[0] && y === end[1]) {
            let path: [number, number][] = [];
            let current: [number, number] | null = [x, y];
            while (current) {
                path.push(current);
                const key = `${current[0]},${current[1]}`;
                current = prev.get(key) || null;
            }
            path.reverse();
            return { steps, path };
        }

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const key = `${nx},${ny}`;
                if (visited.has(key)) continue;

                const diff = heightMap[ny][nx] - heightMap[y][x];
                if (diff <= 1) {
                    visited.add(key);
                    queue.push([nx, ny, steps + 1]);
                    prev.set(key, [x, y]);
                }
            }
        }
    }

    return { steps: -1, path: [] };
};

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
    const { heightMap, start, end } = event.data;
    const result = findShortestPath(start, end, heightMap);
    self.postMessage(result);
};
