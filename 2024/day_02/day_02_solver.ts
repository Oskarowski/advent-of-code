import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const targetPath = __dirname + '/../data/day_02/t02.txt';

const puzzleInput = fs.readFileSync(targetPath).toString().replace(/\r/g, '').trim().split('\n');

const reports = puzzleInput.map((line) => {
    return line.split(' ').map((e) => Number(e));
});

const isSave = (report: number[]) => {
    let allIncreasing = null;
    for (let i = 0; i < report.length - 1; i++) {
        const level = report[i];
        const nextLevel = report[i + 1];
        const diff = nextLevel - level;

        const diffAbs = Math.abs(diff);
        if (diffAbs < 1 || diffAbs > 3) {
            return false;
        }

        if (allIncreasing === null) {
            allIncreasing = diff > 0;
        } else if ((allIncreasing && diff < 0) || (!allIncreasing && diff > 0)) {
            return false;
        }
    }

    return true;
};

const safeReports = [];
const dampenedSafeReports = [];

for (const report of reports) {
    if (isSave(report)) {
        safeReports.push(report);
        dampenedSafeReports.push(report);
        continue;
    }

    let dampenedSafe = false;
    for (let i = 0; i < report.length; i++) {
        const modifiedReport = [...report.slice(0, i), ...report.slice(i + 1)];
        if (isSave(modifiedReport)) {
            dampenedSafe = true;
            break;
        }
    }

    if (dampenedSafe) {
        dampenedSafeReports.push(report);
    }
}

console.log(`Pure safe reports: ${safeReports.length}`);
console.log(`Reports tolerating one mistake: ${dampenedSafeReports.length}`);
