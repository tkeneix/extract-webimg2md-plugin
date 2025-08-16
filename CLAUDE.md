# Claude Code 開発ガイドライン

この文書は、extract-webimg2md-plugin プロジェクトにおける Claude Code による開発ルールとベストプラクティスをまとめたものです。

## 📋 プロジェクト概要

- **開発**: Claude Code による設計・実装
- **人間の役割**: 要件定義・コードレビュー・実機検証・品質管理
- **主要機能**: 画像自動ダウンロード + リンク保持機能

## 🏗️ ディレクトリ構造仕様

### ダウンロードファイル構造
```
downloads/
└── extract-webimg2md-plugin/  # プロジェクト専用ディレクトリ (固定)
    └── YYYYMMDDhhmmss/         # タイムスタンプディレクトリ (実行時生成)
        ├── ページタイトル.md      # サニタイズされたMarkdownファイル
        └── img/                   # 画像格納ディレクトリ
            └── YYYYMMDDhhmmss_image_<通番>.<拡張子>
```

### ファイル命名規則
- **プロジェクトディレクトリ**: `extract-webimg2md-plugin` (固定)
- **タイムスタンプディレクトリ**: `YYYYMMDDhhmmss` (例: `20250816125830`)
- **画像ファイル**: `YYYYMMDDhhmmss_image_<通番>.<拡張子>` (例: `20250816125830_image_1.jpg`)
- **Markdownファイル**: サニタイズされたページタイトル + `.md`

## 🔧 技術実装仕様

### 画像処理
- **格納場所**: `img/` サブディレクトリ
- **命名形式**: タイムスタンプ + `_image_` + 通番 + 拡張子
- **参照形式**: Markdown内で相対パス `img/ファイル名` で参照
- **対応形式**: JPG, PNG, GIF, WebP など

### リンク保持機能
- **基本方針**: Mozilla Readability で除外されるリンクを自動復元
- **URL変換**: 相対URL → 絶対URL への自動変換
- **保持対象**: 記事内参照リンク + ナビゲーションリンク
- **実装**: `extractLinksFromDocument()` + `restoreLinksInMarkdown()`

### コアライブラリ
- **Mozilla Readability**: 記事コンテンツ抽出 (`keepClasses: true` 設定)
- **Turndown**: HTML → Markdown 変換
- **WebExtension Polyfill**: クロスブラウザ対応

## 🛠️ 開発ワークフロー

### 1. 計画・進捗管理
```typescript
// 必須: TodoWrite ツールによるタスク管理
TodoWrite([
  {id: "1", content: "タスク内容", status: "in_progress"},
  // ...
]);
```

### 2. コード理解・調査
```typescript
// 既存コードの読み取り・理解
Read("file_path")
Grep("pattern", {output_mode: "content"})
```

### 3. 段階的実装
```typescript
// 小さな変更の積み重ね
Edit("file_path", {old_string, new_string})
// または複数箇所の一括変更
MultiEdit("file_path", {edits: [...]})
```

### 4. ビルド・検証
```bash
# 必須: 各実装後のビルド確認
npm run build:chrome
npm run build:firefox
```

## 📝 文書管理規約

### README.md / README_EN.md
- **重複排除**: 冒頭は簡潔に、詳細は謝辞セクションに集約
- **感謝表現**: 元プロジェクトとClaude Codeへの適切な敬意
- **技術仕様**: ファイル構造とコマンド例の明記
- **バイリンガル**: 日本語・英語両版の内容同期

### ファイル構造例の記載形式
```markdown
downloads/extract-webimg2md-plugin/20250816125830/
├── ページタイトル.md
└── img/
    ├── 20250816125830_image_1.jpg
    └── 20250816125830_image_2.png
```

## 🧩 コーディング規約

### TypeScript実装
- **型安全性**: 厳格な型定義の徹底
- **関数設計**: 単一責任原則の遵守
- **エラーハンドリング**: try-catch の適切な配置
- **命名規則**: `generateProjectDirectory()` 等の明確な関数名

### ファイル修正手順
1. **調査**: Read/Grep による既存コード理解
2. **修正**: Edit/MultiEdit による段階的変更
3. **検証**: ビルドテスト + 動作確認
4. **文書化**: README/コメントの更新

### 主要実装ファイル
- **`src/logic/file-downloader.ts`**: ダウンロード・ファイル管理ロジック
- **`src/logic/markdown-converter.ts`**: Markdown変換・リンク復元ロジック
- **`src/content.ts`**: メインの拡張機能ロジック

## 🎯 品質管理

### ビルド要件
- **Chrome**: `npm run build:chrome` が正常完了
- **Firefox**: `npm run build:firefox` が正常完了
- **パッケージング**: `npm run package:chrome/firefox` が正常完了

### 動作確認項目
- [ ] 画像が正しいディレクトリ・ファイル名で保存される
- [ ] リンクがMarkdown内に適切に保持される
- [ ] ファイル構造が仕様通りに生成される
- [ ] エラー時のgracefulな処理

## 🔄 継続的改善

### 変更時の原則
1. **既存動作の保持**: 後方互換性を重視
2. **段階的改善**: 大きな変更は小さく分割
3. **文書同期**: コード変更時はREADME更新も必須
4. **テスト重視**: 変更後は必ずビルド・動作確認

### Git管理
- **リポジトリ**: https://github.com/tkeneix/extract-webimg2md-plugin
- **ブランチ戦略**: main ブランチでの直接開発
- **コミット**: 機能単位での適切な粒度

---

**最終更新**: 2025-08-16  
**Claude Code Version**: Sonnet 4  
**プロジェクト責任者**: tkeneix