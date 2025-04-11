import { ls } from '../ls';
import * as fs from 'fs/promises';
import { join } from 'path';
import { mkdtemp } from 'fs/promises';
import { tmpdir } from 'os';

jest.mock('fs/promises');

describe('ls command', () => {
  let tempDir: string;
  let consoleSpy: jest.SpyInstance;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'ls-test-'));
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    // モックの設定
    const defaultStats = {
      isDirectory: () => false,
      isSymbolicLink: () => false,
      size: 1024,
      mode: 0o644,
      mtime: new Date('2024-01-01T00:00:00.000Z'),
      uid: 1000,
      gid: 1000,
      nlink: 1,
    };

    (fs.stat as jest.Mock).mockResolvedValue({
      ...defaultStats,
      isDirectory: () => true,
      mode: 0o755,
      nlink: 2,
    });

    (fs.lstat as jest.Mock).mockImplementation((path: string) => {
      const name = path.split('/').pop() || '';
      return Promise.resolve({
        ...defaultStats,
        isDirectory: () => false,
        isSymbolicLink: () => false,
      });
    });

    (fs.readdir as jest.Mock).mockResolvedValue(['file1.txt', 'file2.txt', '.hidden']);
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    jest.clearAllMocks();
  });

  it('should list files in short format', async () => {
    await ls(tempDir, { all: false, long: false });
    expect(consoleSpy).toHaveBeenCalledWith('file1.txt  file2.txt');
  });

  it('should list all files including hidden ones', async () => {
    await ls(tempDir, { all: true, long: false });
    expect(consoleSpy).toHaveBeenCalledWith('file1.txt  file2.txt  .hidden');
  });

  it('should list files in long format', async () => {
    await ls(tempDir, { all: false, long: true });
    const expectedOutput = [
      '644 1 1000 1000     1024 1/1/2024, 12:00:00 AM file1.txt',
      '644 1 1000 1000     1024 1/1/2024, 12:00:00 AM file2.txt'
    ];
    expectedOutput.forEach(line => {
      expect(consoleSpy).toHaveBeenCalledWith(line);
    });
  });

  it('should handle directories', async () => {
    (fs.lstat as jest.Mock).mockImplementationOnce(() => ({
      isDirectory: () => true,
      isSymbolicLink: () => false,
      size: 4096,
      mode: 0o755,
      mtime: new Date('2024-01-01T00:00:00.000Z'),
      uid: 1000,
      gid: 1000,
      nlink: 2,
    }));
    await ls(tempDir, { all: false, long: false });
    expect(consoleSpy).toHaveBeenCalledWith('file1.txt/  file2.txt');
  });

  it('should handle symbolic links', async () => {
    (fs.lstat as jest.Mock).mockImplementationOnce(() => ({
      isDirectory: () => false,
      isSymbolicLink: () => true,
      size: 1024,
      mode: 0o777,
      mtime: new Date('2024-01-01T00:00:00.000Z'),
      uid: 1000,
      gid: 1000,
      nlink: 1,
    }));
    await ls(tempDir, { all: false, long: false });
    expect(consoleSpy).toHaveBeenCalledWith('file1.txt@  file2.txt');
  });

  it('should handle errors', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    (fs.stat as jest.Mock).mockRejectedValue(new Error('Permission denied'));
    await ls(tempDir, { all: false, long: false });
    expect(errorSpy).toHaveBeenCalledWith('Error: Permission denied');
    errorSpy.mockRestore();
  });
}); 