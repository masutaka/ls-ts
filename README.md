# ls-ts

TypeScriptで実装した`ls`コマンドです。

## 機能

- ファイルとディレクトリの一覧表示
- 隠しファイルの表示/非表示（`-a`オプション）
- 詳細表示（`-l`オプション）
- ファイルタイプの表示（`-F`オプション）
- カラー表示（`--color`オプション）

## インストール

```bash
# リポジトリをクローン
git clone https://github.com/your-username/ls-ts.git
cd ls-ts

# 依存関係をインストール
pnpm install

# ビルド
pnpm build
```

## 使用方法

```bash
# 基本的な使用法
node dist/index.js [オプション] [パス]

# 例
node dist/index.js          # カレントディレクトリの内容を表示
node dist/index.js -l       # 詳細表示
node dist/index.js -a       # 隠しファイルも表示
node dist/index.js --color  # カラー表示
node dist/index.js src/     # 特定のディレクトリを表示
```

## オプション

- `-a, --all`: 隠しファイルを含めて表示
- `-l, --long`: 詳細表示
- `-F, --classify`: ファイルタイプを表示
  - ディレクトリ: `/`
  - シンボリックリンク: `@`
  - 実行可能ファイル: `*`
- `--color`: カラー表示
  - ディレクトリ: 青
  - シンボリックリンク: シアン
  - 実行可能ファイル: 緑
  - 画像ファイル: マゼンタ
  - アーカイブファイル: 赤
  - 通常ファイル: 白

## 開発

```bash
# 依存関係をインストール
pnpm install

# 開発サーバーを起動
pnpm dev

# ビルド
pnpm build

# テスト
pnpm test

# 型チェック
pnpm typecheck
```

## ライセンス

MIT 