import { GenericPuzzleTester } from './GenericPuzzleTester.js';
import path from 'path';

(async () => {
    const tester = new GenericPuzzleTester();
    const testCasesPath = path.resolve('2023', 'data', 'test_cases.json');
    const testsResults = await tester.runTests([14, 15], testCasesPath);
    await GenericPuzzleTester.displayTestResults(testsResults);
})();
