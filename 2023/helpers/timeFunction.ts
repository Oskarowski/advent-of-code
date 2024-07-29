export async function timeFunction<T>(fn: () => Promise<T>): Promise<{ result: T; executionTime: number }> {
    const startTime = performance.now();
    const result = await fn();
    const endTime = performance.now();
    const executionTime = Math.round(endTime - startTime);

    return { result, executionTime };
}