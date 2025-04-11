import { FileInfo, LsOptions } from './types';
import { join, basename } from 'path';
import * as fs from 'fs/promises';

// ANSIエスケープシーケンス
const Colors = {
  reset: '\x1b[0m',
  blue: '\x1b[34m',    // ディレクトリ
  cyan: '\x1b[36m',    // シンボリックリンク
  green: '\x1b[32m',   // 実行可能ファイル
  yellow: '\x1b[33m',  // デバイスファイル
  magenta: '\x1b[35m', // 画像ファイル
  red: '\x1b[31m',     // アーカイブファイル
  white: '\x1b[37m',   // 通常ファイル
} as const;

export async function ls(paths: string | string[], options: LsOptions): Promise<void> {
  try {
    const pathArray = Array.isArray(paths) ? paths : [paths];
    for (const path of pathArray) {
      const stats = await fs.stat(path);
      if (stats.isDirectory()) {
        await readDirectory(path, options);
      } else {
        const fileInfo = await getFileInfo(basename(path), path, options);
        console.log(formatFileInfo(fileInfo, options));
      }
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

  // ファイルタイプに応じたサフィックスを追加
  if (options.classify) {
    if (fileInfo.isDirectory) {
      name += '/';
    } else if (fileInfo.isSymbolicLink) {
      name += '@';
    } else if (isExecutable(fileInfo.mode)) {
      name += '*';
    }
  }

  // ファイルタイプに応じた色付け
  if (options.color) {
    const color = getFileColor(fileInfo);
    name = `${color}${name}${Colors.reset}`;
  }

  return name;
}

function isExecutable(mode: string): boolean {
  const permissions = parseInt(mode, 8);
  return (permissions & 0o111) !== 0;
}

function getFileColor(fileInfo: FileInfo): string {
  if (fileInfo.isDirectory) {
    return Colors.blue;
  }
  if (fileInfo.isSymbolicLink) {
    return Colors.cyan;
  }
  if (isExecutable(fileInfo.mode)) {
    return Colors.green;
  }
  if (isImageFile(fileInfo.name)) {
    return Colors.magenta;
  }
  if (isArchiveFile(fileInfo.name)) {
    return Colors.red;
  }
  return Colors.white;
}

function isImageFile(name: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
  return imageExtensions.some(ext => name.toLowerCase().endsWith(ext));
}

function isArchiveFile(name: string): boolean {
  const archiveExtensions = ['.zip', '.tar', '.gz', '.bz2', '.xz', '.7z', '.rar'];
  return archiveExtensions.some(ext => name.toLowerCase().endsWith(ext));
} 