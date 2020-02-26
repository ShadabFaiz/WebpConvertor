import * as fs from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

export async function getFilesFromDirectory(dir) {
    const subdirs = await readdir(dir);
    const files = await Promise.all(
        subdirs.map(async subdir => {
            const res = resolve(dir, subdir);
            return (await stat(res)).isDirectory()
                ? getFilesFromDirectory(res)
                : res;
        })
    );
    return files.reduce((a: string, f: string) => a.concat(f), []);
}

export function createDirectoriesForPath(filePath: string) {
    const directories = filePath.split('/');
    for (let i = 0; i < directories.length - 1; i++) {
        createDirectory(directories.slice(0, i + 1).join('/'));
    }
}

function createDirectory(dirPath: string) {
    // console.log(dirPath);
    if (fs.existsSync(dirPath)) return false;
    return fs.mkdirSync(dirPath);
}
