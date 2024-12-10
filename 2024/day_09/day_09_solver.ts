import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const targetPath = __dirname + '/../data/day_09/t09.txt';

const puzzleInput = fs.readFileSync(targetPath).toString().replace(/\r/g, '').trim();

// so this represents compressed information about the disk
const diskCompressed = puzzleInput.split('').map(Number);

const decompressDisk = (compressed: number[]): string[] => {
    const diskUncompressed: string[] = [];
    let fileID = 0;

    for (let i = 0; i < compressed.length; i++) {
        const isEven = i % 2 === 0;

        if (isEven) {
            const fileData = fileID.toString();
            for (let j = 0; j < compressed[i]; j++) {
                diskUncompressed.push(fileData);
            }
            fileID++;
        } else {
            const emptySpace = '.';
            for (let j = 0; j < compressed[i]; j++) {
                diskUncompressed.push(emptySpace);
            }
        }
    }

    return diskUncompressed;
};

const diskUncompressed = decompressDisk(diskCompressed);

const defragmentDisk = (disk: string[]): string[] => {
    const defragmentedDisk = [...disk];
    let right = defragmentedDisk.length - 1;

    for (let left = 0; left < defragmentedDisk.length; left++) {
        if (defragmentedDisk[left] === '.') {
            while (right > left && defragmentedDisk[right] === '.') {
                right--;
            }

            if (right > left) {
                defragmentedDisk[left] = defragmentedDisk[right];
                defragmentedDisk[right] = '.';
                right--;
            }
        }
    }

    return defragmentedDisk;
};

const defragmentedDisk = defragmentDisk(diskUncompressed);

const outputPath = __dirname + '/../data/day_09/defragmented_disk.txt';
fs.writeFileSync(outputPath, defragmentedDisk.join(''));
console.log(`Defragmented disk saved to ${outputPath}`);

const calculateDiskChecksum = (disk: string[]): number => {
    return disk.reduce((checksum, block, index) => {
        if (block === '.') return checksum;
        return checksum + Number(block) * index;
    }, 0);
};

const diskChecksum = calculateDiskChecksum(defragmentedDisk);
console.log(`Filesystem checksum: ${diskChecksum}`);
