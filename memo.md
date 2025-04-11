# memo.md

## 実装して欲しいいこと

- ls コマンドを TypeScript で実装する

## 技術仕様

- サポートするオプションは以下の通り
    - `-a`
    - `-l`
    - `-F`
    - `--color`
- パッケージマネージャは pnpm を使用する
- npm パッケージは出来るだけインストールしない

## 作業の進め方

1. `plan.md` というファイルを作り、作業の進め方を記載する
2. `plan.md` に沿って、作業を進める
3. 今回あなたがやったことと、私が頼んだことをプロンプト化して `spec.md` にまとめる

## 振り返り

- 最初は .gitignore の作成から
- 作業単位で plan.md の当該タスクにチェックを付け、git commit を強制する

## その他

### Cursor Settings

#### General > Privacy Mode

```text
ON
```

※ OFF 選択不可

#### Features > Enable auto-run Mode

```text
OFF (default)
```

#### Rules > User RUles

```markdown
Always respond in Japanese
- 成果物はできるだけファイルとして出力して下さい。ファイルはなるべく細かく分けて下さい
- MCP の使用やファイル確認など、可能な作業は自律的に行って下さい
- タスクをお願いされたら、不足している情報は確認し、情報が揃ったら自分で計画を立ててゴールまで進めて下さい
- 計画はタスクリストとして、ユーザーが確認できるようにして下さい
```
