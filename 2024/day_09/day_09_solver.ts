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

const blockBasedDefragmentDisk = (disk: string[]): string[] => {
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

const blockBasedDefragmentedDisk = blockBasedDefragmentDisk(diskUncompressed);

const calculateDiskChecksum = (disk: string[]): number => {
    return disk.reduce((checksum, block, index) => {
        if (block === '.') return checksum;
        return checksum + Number(block) * index;
    }, 0);
};

const blockBasedDiskCheckSum = calculateDiskChecksum(blockBasedDefragmentedDisk);
console.log(`Filesystem Block Fragmented checksum: ${blockBasedDiskCheckSum}`);

// part 2
const findEmptyMemRegions = (disk: string[], rightPointer: number): [number, number][] => {
    let startIndex = -1;
    let offset = 0;

    const emptyRegionsInBounds: [number, number][] = [];

    for (let i = 0; i <= rightPointer; i++) {
        if (disk[i] === '.') {
            if (startIndex === -1) {
                startIndex = i;
            }
            offset++;
        } else {
            if (startIndex !== -1) {
                emptyRegionsInBounds.push([startIndex, offset]);
                startIndex = -1;
                offset = 0;
            }
        }
    }

    if (startIndex !== -1) {
        emptyRegionsInBounds.push([startIndex, offset]);
    }

    return emptyRegionsInBounds;
};

const getFileOffset = (disk: string[], fileID: string, rightPointer: number): number => {
    let offset = 0;

    for (let i = rightPointer; i >= 0; i--) {
        if (disk[i] === fileID) {
            offset++;
        } else {
            break;
        }
    }

    return offset;
};

const fileBasedDefragmentDisk = (disk: string[]): string[] => {
    const defragmentedDisk = [...disk];

    let right = defragmentedDisk.length - 1;
    let emptyRegions: [number, number][];
    let fileOffset: number;

    while (right >= 0) {
        const fileID = defragmentedDisk[right];
        if (fileID === '.') {
            right--;
            continue;
        }

        fileOffset = getFileOffset(defragmentedDisk, fileID, right);
        emptyRegions = findEmptyMemRegions(defragmentedDisk, right - fileOffset);

        for (const [startIndex, memOffset] of emptyRegions) {
            if (memOffset >= fileOffset) {
                for (let j = 0; j < fileOffset; j++) {
                    defragmentedDisk[startIndex + j] = fileID;
                    defragmentedDisk[right - j] = '.';
                }
                break;
            }
        }

        right -= fileOffset;
    }

    return defragmentedDisk;
};

const fileBasedDefragmentedDisk = fileBasedDefragmentDisk(diskUncompressed);
const fileBasedDiskChecksum = calculateDiskChecksum(fileBasedDefragmentedDisk);

console.log(`Filesystem File Fragmented checksum: ${fileBasedDiskChecksum}`);
