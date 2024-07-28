import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadPuzzleFromFile(
    whichDay: number | string,
    fileName: string
): Promise<string[]> {
    const dayDir = `day_${String(whichDay).padStart(2, '0')}`;

    const filePath = path.join(
        __dirname,
        '..',
        'data',
        dayDir,
        fileName + '.txt'
    );

    try {
        await fs.access(filePath);
    } catch {
        throw new Error(`File not found: ${filePath}`);
    }

    const fileContent = await fs.readFile(filePath, 'utf-8');

    const content = fileContent
        .toString()
        .replace(/\r/g, '')
        .trim()
        .split('\n');

    return content;
}
