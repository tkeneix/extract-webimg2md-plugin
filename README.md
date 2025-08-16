# Web to Markdown (拡張版)

_[English version](README_EN.md)_

クリック一つでウェブページを Markdown 形式で保存できるブラウザ拡張機能です。**画像自動ダウンロード**と**リンク保持機能**を追加した拡張版です。

> この拡張機能は [OsawaKousei/simple-web2md-ext](https://github.com/OsawaKousei/simple-web2md-ext) を基にした拡張版で、[Claude Code](https://claude.ai/code) により開発されました。

## 🌟 特徴

### 基本機能
- **ワンクリック変換**: ツールバーアイコンをクリックするだけで、現在のページを Markdown 形式で保存
- **高精度抽出**: Mozilla Readability を使用して記事コンテンツを正確に抽出
- **自動ダウンロード**: 変換された Markdown ファイルを自動的にダウンロード
- **日本語対応**: 日本語コンテンツにも完全対応
- **軽量**: シンプルで高速な動作

### 🆕 拡張機能
- **📸 画像自動ダウンロード**: ページ内の画像を自動的にローカル保存し、Markdownで相対パス参照
- **🔗 リンク保持機能**: 他のページへの参照リンクをMarkdown内に保持
- **📁 整理されたファイル構造**: タイムスタンプ付きディレクトリで整理
- **🏷️ 統一ファイル命名**: `YYYYMMDDhhmmss_image_<通番>.<拡張子>` 形式の画像ファイル名

## 📂 ファイル構造

拡張版では以下のような構造でファイルが保存されます：

```
downloads/
└── extract-webimg2md-plugin/  # プロジェクト専用ディレクトリ
    └── 20250816125830/         # タイムスタンプディレクトリ
        ├── ページタイトル.md      # メインのMarkdownファイル
        └── img/                   # 画像フォルダ
            ├── 20250816125830_image_1.jpg
            ├── 20250816125830_image_2.png
            └── 20250816125830_image_3.gif
```

### ファイル命名規則
- **プロジェクトディレクトリ**: `extract-webimg2md-plugin` (固定)
- **タイムスタンプディレクトリ**: `YYYYMMDDhhmmss` (例: `20250816125830`)
- **画像ファイル**: `YYYYMMDDhhmmss_image_<通番>.<拡張子>` (例: `20250816125830_image_1.jpg`)
- **Markdownファイル**: `ページタイトル.md` (無効文字は自動変換)

## ✨ 新機能詳細

### 📸 画像自動ダウンロード
- ページ内のすべての画像を自動検出・ダウンロード
- `img/` サブディレクトリに整理保存
- Markdown内の画像参照を相対パスに自動変換
- 対応形式: JPG, PNG, GIF, WebP など

### 🔗 リンク保持機能
- 記事内の他のページへのリンクを保持
- Mozilla Readabilityで除外されたリンクを自動復元
- 相対URLを絶対URLに自動変換
- ナビゲーションリンクも適切に保持

## 📋 動作環境

- Google Chrome
- Microsoft Edge
- Mozilla Firefox

## 🚀 インストール方法

1. [GitHub リリースページ](https://github.com/tkeneix/extract-webimg2md-plugin/releases)から zip ファイルをダウンロード

2. zip ファイルを解凍

3. ブラウザで拡張機能を読み込み

**Chrome/Edge の場合:**

- `chrome://extensions/` または `edge://extensions/` にアクセス
- 「デベロッパーモード」を有効化
- 「パッケージ化されていない拡張機能を読み込む」をクリック
- 解凍した `dist` フォルダを選択

**Firefox の場合:**

- `about:debugging#/runtime/this-firefox` にアクセス
- 「一時的なアドオンを読み込む」をクリック
- 解凍した `dist` フォルダ内の `manifest.json` を選択

## 📖 使用方法

1. **ページを開く**: Markdown で保存したいウェブページを開きます
2. **拡張機能をクリック**: ツールバーの「Web to Markdown」アイコンをクリック
3. **自動保存**: 以下のファイルが自動的にダウンロードされます：
   - `extract-webimg2md-plugin/YYYYMMDDhhmmss/ページタイトル.md` - メインのMarkdownファイル
   - `extract-webimg2md-plugin/YYYYMMDDhhmmss/img/YYYYMMDDhhmmss_image_*.{jpg,png,gif}` - 画像ファイル群

### 💡 使用例
記事「AI技術の最新動向」を保存した場合：
```
downloads/extract-webimg2md-plugin/20250816125830/
├── AI技術の最新動向.md
└── img/
    ├── 20250816125830_image_1.jpg  # 記事内の1番目の画像
    ├── 20250816125830_image_2.png  # 記事内の2番目の画像
    └── 20250816125830_image_3.gif  # 記事内の3番目の画像
```

## ❗ 制限事項

- JavaScript 動的コンテンツが多いページでは一部内容が抽出されない場合があります
- chrome:// や file:// などの特殊な URL では動作しません
- 一部の Web サイトではコンテンツセキュリティポリシーにより動作しない場合があります

## 🐛 トラブルシューティング

### ファイルがダウンロードされない場合

1. ブラウザのダウンロード設定を確認
2. ポップアップブロッカーが有効になっていないか確認
3. 拡張機能の権限設定を確認

### 内容が正しく抽出されない場合

1. ページが完全に読み込まれてから実行してください
2. JavaScript 多用サイトの場合、少し時間を置いてから再試行してください

## 📝 開発

### 開発環境のセットアップ

```bash
# リポジトリをクローン
git clone https://github.com/tkeneix/extract-webimg2md-plugin.git
cd extract-webimg2md-plugin

# 依存関係をインストール
npm install

# 本番用ビルド
# chrome/edge
npm run build:chrome
# firefox
npm run build:firefox

# 拡張機能パッケージの作成
# chrome/edge
npm run package:chrome
# firefox
npm run package:firefox
```

### 技術スタック

- **TypeScript**: 型安全な開発
- **Webpack**: バンドリングとビルド
- **Mozilla Readability**: コンテンツ抽出
- **Turndown**: HTML to Markdown 変換
- **WebExtension Polyfill**: クロスブラウザ対応

## 🙏 謝辞

### 元プロジェクト
- **[OsawaKousei/simple-web2md-ext](https://github.com/OsawaKousei/simple-web2md-ext)** - 素晴らしい基盤プロジェクトを提供していただき、心より感謝いたします

### 開発
- **[Claude Code](https://claude.ai/code)** - この拡張版の開発を担当。画像ダウンロード機能とリンク保持機能を実現
- **開発体制**: Claude Code (設計・実装) + 人間 (要件定義・レビュー・検証)

### 技術スタック
- **[Mozilla Readability](https://github.com/mozilla/readability)** - コンテンツ抽出
- **[Turndown](https://github.com/domchristie/turndown)** - HTML to Markdown変換  
- **[WebExtension Polyfill](https://github.com/mozilla/webextension-polyfill)** - クロスブラウザ対応

---
