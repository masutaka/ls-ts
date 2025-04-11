export interface LsOptions {
  all?: boolean;
  long?: boolean;
  classify?: boolean;
  color?: boolean;
}

export interface FileInfo {
  name: string;
  isDirectory: boolean;
  isSymbolicLink: boolean;
  isHidden: boolean;
  size: number;
  mode: string;
  mtime: Date;
  uid: number;
  gid: number;
  nlink: number;
  path: string;
} 