import { FileInfo, LsOptions } from './types';
import { join, basename } from 'path';
import * as fs from 'fs/promises';

export async function ls(path: string = '.', options: LsOptions): Promise<void> {
  try {
    const stats = await fs.stat(path);
    if (stats.isDirectory()) {
      await readDirectory(path, options);
    } else {
      const fileInfo = await getFileInfo(basename(path), path, options);
      console.log(formatFileInfo(fileInfo, options));
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('Error: 不明なエラーが発生しました');
    }
  }
}

async function readDirectory(path: string, options: LsOptions): Promise<void> {
  const files = await fs.readdir(path);
  const fileInfos: FileInfo[] = [];

  for (const file of files) {
    if (!options.all && file.startsWith('.')) {
      continue;
    }

    const filePath = join(path, file);
    try {
      const fileInfo = await getFileInfo(file, filePath, options);
      fileInfos.push(fileInfo);
    } catch (error) {
      console.error(`Error: ${file}の情報を取得できませんでした`);
    }
  }

  if (options.long) {
    for (const fileInfo of fileInfos) {
      console.log(formatFileInfo(fileInfo, options));
    }
  } else {
    console.log(fileInfos.map(fileInfo => formatFileInfo(fileInfo, options)).join('  '));
  }
}

async function getFileInfo(name: string, filePath: string, options: LsOptions): Promise<FileInfo> {
  const stats = await fs.lstat(filePath);

  return {
    name,
    isDirectory: stats.isDirectory(),
    isSymbolicLink: stats.isSymbolicLink(),
    isHidden: name.startsWith('.'),
    size: stats.size,
    mode: stats.mode.toString(8).slice(-3),
    mtime: stats.mtime,
    uid: stats.uid,
    gid: stats.gid,
    nlink: stats.nlink,
    path: filePath
  };
}

function formatFileInfo(fileInfo: FileInfo, options: LsOptions): string {
  if (options.long) {
    return [
      fileInfo.mode,
      fileInfo.nlink.toString(),
      fileInfo.uid.toString(),
      fileInfo.gid.toString(),
      fileInfo.size.toString().padStart(8),
      fileInfo.mtime.toLocaleString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
        timeZone: 'UTC'
      }),
      formatName(fileInfo, options)
    ].join(' ');
  }

  return formatName(fileInfo, options);
}

function formatName(fileInfo: FileInfo, options: LsOptions): string {
  let name = fileInfo.name;
  if (options.classify) {
    if (fileInfo.isDirectory) {
      name += '/';
    } else if (fileInfo.isSymbolicLink) {
      name += '@';
    } else if (isExecutable(fileInfo.mode)) {
      name += '*';
    }
  }
  return name;
}

function isExecutable(mode: string): boolean {
  const permissions = parseInt(mode, 8);
  return (permissions & 0o111) !== 0;
} 