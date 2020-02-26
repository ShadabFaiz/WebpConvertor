import * as color from 'colors';
import { CWebp } from 'cwebp';
import * as PATH from 'path';

import { createDirectoriesForPath, getFilesFromDirectory } from './directoryReader';

const inputDirectory = 'input';
const outputDirectory = 'output';

// Get list of file from <variable>inputDirectory</variable>.
getFilesFromDirectory(inputDirectory).then((fileList: string[]) => {
    const validFilePaths = filterInvalidFiles(fileList);
    const fileListWithRelativePath = ConvertAbsolutePathsToRelativePaths(
        validFilePaths
    );
    fileListWithRelativePath.forEach(file => processFile(file));
});

function filterInvalidFiles(filePaths: string[]) {
    return filePaths.filter(
        path =>
            path.split('.').pop() === 'png' || path.split('.').pop() === 'jpg'
    );
}

function ConvertAbsolutePathsToRelativePaths(list: string[]) {
    return list.map(pth => PATH.relative(process.cwd(), pth));
}

function processFile(file: string) {
    const encoder = CWebp(file);
    encoder.quality(80);
    const outputPath = PATH.join(outputDirectory, file).replace(
        /\..+/g,
        '.webp'
    );
    createDirectoriesForPath(outputPath);
    encoder
        .write(outputPath)
        .then(res => {
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write(color.green(`${file} success.`));
        })
        .catch(err => console.error(color.red(`${file} failed.`), err));
}
