interface WorkerTask<T, R> {
    data: T;
    resolve: (result: R) => void;
    reject: (error: Error) => void;
}

export class WorkerPool<T, R> {
    private workers: Worker[] = [];
    private availableWorkers: Worker[] = [];
    private taskQueue: WorkerTask<T, R>[] = [];
    private workerTasks = new Map<Worker, WorkerTask<T, R>>();

    constructor(private workerUrl: string, private poolSize: number = navigator.hardwareConcurrency || 4) {
        this.initializeWorkers();
    }

    private initializeWorkers(): void {
        for (let i = 0; i < this.poolSize; i++) {
            const worker = new Worker(this.workerUrl, { type: 'module' });

            worker.onmessage = (event) => {
                const task = this.workerTasks.get(worker);
                if (task) {
                    task.resolve(event.data);
                    this.workerTasks.delete(worker);
                    this.availableWorkers.push(worker);
                    this.processNextTask();
                }
            };

            worker.onerror = (error) => {
                const task = this.workerTasks.get(worker);
                if (task) {
                    task.reject(new Error(`Worker error: ${error.message}`));
                    this.workerTasks.delete(worker);
                    this.availableWorkers.push(worker);
                    this.processNextTask();
                }
            };

            this.workers.push(worker);
            this.availableWorkers.push(worker);
        }
    }

    execute(data: T): Promise<R> {
        return new Promise((resolve, reject) => {
            const task: WorkerTask<T, R> = { data, resolve, reject };
            this.taskQueue.push(task);
            this.processNextTask();
        });
    }

    private processNextTask(): void {
        if (this.taskQueue.length === 0 || this.availableWorkers.length === 0) {
            return;
        }

        const task = this.taskQueue.shift()!;
        const worker = this.availableWorkers.shift()!;

        this.workerTasks.set(worker, task);
        worker.postMessage(task.data);
    }

    terminate(): void {
        this.workers.forEach((worker) => worker.terminate());
        this.workers = [];
        this.availableWorkers = [];
        this.taskQueue = [];
        this.workerTasks.clear();
    }

    getPoolSize(): number {
        return this.poolSize;
    }

    getActiveTaskCount(): number {
        return this.workerTasks.size;
    }

    getQueuedTaskCount(): number {
        return this.taskQueue.length;
    }
}
