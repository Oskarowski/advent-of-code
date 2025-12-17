import { join } from 'path';

type DayProgress = {
    day: number;
    part1: 'solved' | 'unsolved' | 'failed';
    part2: 'solved' | 'unsolved' | 'failed';
};

type YearProgress = {
    year: number;
    stars: number;
    totalStars: number;
    days: DayProgress[];
};

const ICONS = {
    solved: '⭐',
    failed: '❌',
    unsolved: '⏳',
};

function getStatusFromIcon(icon: string): 'solved' | 'unsolved' | 'failed' {
    switch (icon) {
        case '⭐':
            return 'solved';
        case '❌':
            return 'failed';
        case '⏳':
            return 'unsolved';
        default:
            throw new Error('Unrecognized icon: ' + icon);
    }
}

function getIconFromStatus(status: 'solved' | 'failed' | 'unsolved'): string {
    return ICONS[status];
}

async function parseReadme(readmePath: string): Promise<DayProgress[]> {
    const file = Bun.file(readmePath);

    if (!file.exists()) {
        return [];
    }

    const content = await file.text();
    const dayProgresses: DayProgress[] = [];

    // god please forgive me for this regex
    const rowRegex = /\|\s*\[?(\d+)\]?\s*(?:\([^)]*\))?\s*\|\s*([⭐❌⏳])\s*\|\s*([⭐❌⏳])\s*\|/g;

    let match: RegExpExecArray | null;
    while ((match = rowRegex.exec(content)) !== null) {
        const dayNumber = parseInt(match[1], 10);
        const part1Icon = match[2].trim();
        const part2Icon = match[3].trim();

        if (!isNaN(dayNumber)) {
            dayProgresses.push({
                day: dayNumber,
                part1: getStatusFromIcon(part1Icon),
                part2: getStatusFromIcon(part2Icon),
            });
        }
    }

    return dayProgresses.sort((a, b) => a.day - b.day);
}

async function analyzeYear(year: number, basePath: string): Promise<YearProgress | null> {
    const readmePath = join(basePath, year.toString(), 'README.md');
    const days = await parseReadme(readmePath);

    if (days.length === 0) {
        return null;
    }

    const stars = days.reduce((acc, day) => {
        if (day.part1 === 'solved') acc += 1;
        if (day.part2 === 'solved') acc += 1;
        return acc;
    }, 0);

    return {
        year,
        stars,
        totalStars: days.length * 2,
        days,
    };
}

function generateProgressBar(percentage: number): string {
    const filled = Math.floor(percentage / 10);
    const empty = 10 - filled;
    return `${'█'.repeat(filled)}${'░'.repeat(empty)} ${percentage}%`;
}

function getYearStatusEmoji(percentage: number): string {
    if (percentage === 100) return '🎉';
    if (percentage >= 80) return '🔥';
    if (percentage >= 50) return '💪';
    if (percentage >= 25) return '🚀';
    return '🌱';
}

function generateYearDetails(yearProgress: YearProgress): string {
    let details = `<details>\n<summary>View all days</summary>\n\n`;
    details += `| Day | Part 1 | Part 2 |\n`;
    details += `|:---:|:------:|:------:|\n`;

    for (let i = 1; i <= 25; i++) {
        const dayProgress = yearProgress.days.find((d) => d.day === i);
        if (dayProgress) {
            details += `| ${i.toString().padStart(2, '0')} | ${getIconFromStatus(
                dayProgress.part1
            )} | ${getIconFromStatus(dayProgress.part2)} |\n`;
        } else {
            details += `| ${i.toString().padStart(2, '0')} | ⏳ | ⏳ |\n`;
        }
    }

    details += `\n</details>\n`;
    return details;
}

async function generateSummaryMarkdown(yearProgresses: YearProgress[]): Promise<string> {
    const totalStars = yearProgresses.reduce((acc, yp) => acc + yp.stars, 0);
    const totalPossibleStars = yearProgresses.reduce((acc, yp) => acc + yp.totalStars, 0);

    let markdown = `## 🎯 Advent of Code Progress\n\n`;
    markdown += `## Overall Progress: ${totalStars}/${totalPossibleStars} ⭐\n\n`;
    markdown += `### Years Overview\n\n`;
    markdown += `| Year | Progress | Stars | Status |\n`;
    markdown += `|:----:|:--------:|:-----:|:------:|\n`;

    for (const yp of yearProgresses.sort((a, b) => a.year - b.year)) {
        const percentage = Math.round((yp.stars / yp.totalStars) * 100);
        const progressBar = generateProgressBar(percentage);
        const statusEmoji = getYearStatusEmoji(percentage);

        markdown += `| [${yp.year}](${yp.year}/) | ${progressBar} | ${yp.stars}/${yp.totalStars} | ${statusEmoji} |\n`;
    }

    markdown += `\n### Detailed Progress\n\n`;

    for (const yp of yearProgresses.sort((a, b) => a.year - b.year)) {
        markdown += `#### ${yp.year} (${yp.stars}/${yp.totalStars} ⭐)\n\n`;
        markdown += generateYearDetails(yp);
        markdown += `\n`;
    }

    markdown += `\n---\n\n`;
    markdown += `**Legend:** ${getIconFromStatus('solved')} Solved & Verified &nbsp; ${getIconFromStatus(
        'failed'
    )} Failed &nbsp; ${getIconFromStatus('unsolved')} Unsolved\n\n`;
    markdown += `*Last updated: ${new Date().toISOString().split('T')[0]}*\n`;

    return markdown;
}

const STATIC_README_HEADER = `# 🎄 Advent of Code

To install dependencies:

\`\`\`bash
bun install
\`\`\`

To run:

\`\`\`bash
bun run cli
\`\`\`

## 🎯 Progress Tracking

This repository includes automated progress tracking for all Advent of Code years.

### Quick Commands

\`\`\`bash
# Update progress summary (run after completing challenges)
bun run progress:update

# Install git pre-commit hook (auto-updates on commit)
bun run progress:install-hook
\`\`\`

### How It Works

- Each year has a [\`README.md\`](README.md ) with a table tracking completed (⭐), failed (❌), and pending (⏳) challenges
- Run \`bun run progress:update\` to scan all year READMEs and generate a summary
- The summary shows total stars, progress bars, and detailed breakdowns
- Install the git hook to automatically update progress when committing README changes
`;

async function main() {
    const basePath = process.cwd();
    const years = [2022, 2023, 2024, 2025];

    const yearProgressPromises = years.map((year) => analyzeYear(year, basePath));

    let yearProgresses: YearProgress[] = [];
    await Promise.all(yearProgressPromises).then((yps) => {
        yearProgresses = yps.filter((yp): yp is YearProgress => yp !== null);
    });

    const summaryMarkdown = await generateSummaryMarkdown(yearProgresses);

    const rootReadmePath = join(basePath, 'README.md');

    // Always overwrite with fresh content because i have failed too many times with diffs
    const rootReadmeContent = STATIC_README_HEADER + '\n' + summaryMarkdown;
    await Bun.write(rootReadmePath, rootReadmeContent);

    const progressReadmePath = join(basePath, 'PROGRESS.md');
    await Bun.write(progressReadmePath, '# 🎯 Advent of Code Progress\n\n' + summaryMarkdown.replace(/^## /, ''));

    console.log('✅ Progress summary generated successfully!');
    console.log(`📊 Total stars: ${yearProgresses.reduce((sum, y) => sum + y.stars, 0)}`);
    console.log(`📝 Updated: README.md and PROGRESS.md`);
}

await main();
