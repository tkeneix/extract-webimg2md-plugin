# Web to Markdown (Enhanced Edition)

_[日本語版はこちら / Japanese version](README.md)_

A browser extension that saves web pages as Markdown format with just one click. This **enhanced edition** adds **automatic image downloading** and **link preservation** features.

> This extension is an enhanced version based on [OsawaKousei/simple-web2md-ext](https://github.com/OsawaKousei/simple-web2md-ext) and developed by [Claude Code](https://claude.ai/code).

## 🌟 Features

### Core Features
- **One-Click Conversion**: Save current page as Markdown format by simply clicking the toolbar icon
- **High-Precision Extraction**: Accurately extract article content using Mozilla Readability
- **Automatic Download**: Automatically download converted Markdown files
- **Japanese Support**: Full support for Japanese content
- **Lightweight**: Simple and fast operation

### 🆕 Enhanced Features
- **📸 Automatic Image Download**: Automatically save images from pages locally with relative path references in Markdown
- **🔗 Link Preservation**: Preserve links to other pages within Markdown content
- **📁 Organized File Structure**: Organized with timestamped directories
- **🏷️ Unified File Naming**: Image files named in `YYYYMMDDhhmmss_image_<number>.<extension>` format

## 📂 File Structure

The enhanced edition saves files in the following structure:

```
downloads/
└── extract-webimg2md-plugin/  # Project-specific directory
    └── 20250816125830/         # Timestamp directory
        ├── page-title.md          # Main Markdown file
        └── img/                   # Image folder
            ├── 20250816125830_image_1.jpg
            ├── 20250816125830_image_2.png
            └── 20250816125830_image_3.gif
```

### File Naming Convention
- **Project Directory**: `extract-webimg2md-plugin` (fixed)
- **Timestamp Directory**: `YYYYMMDDhhmmss` (e.g., `20250816125830`)
- **Image Files**: `YYYYMMDDhhmmss_image_<number>.<extension>` (e.g., `20250816125830_image_1.jpg`)
- **Markdown File**: `page-title.md` (invalid characters automatically converted)

## ✨ Enhanced Feature Details

### 📸 Automatic Image Download
- Auto-detect and download all images from the page
- Organized storage in `img/` subdirectory
- Automatic conversion of image references to relative paths in Markdown
- Supported formats: JPG, PNG, GIF, WebP, etc.

### 🔗 Link Preservation
- Preserve links to other pages within articles
- Auto-restore links excluded by Mozilla Readability
- Automatic conversion of relative URLs to absolute URLs
- Proper preservation of navigation links

## 📋 Environment

- Google Chrome
- Microsoft Edge
- Mozilla Firefox

## 🚀 Installation

1. Download zip file from [GitHub Releases](https://github.com/tkeneix/extract-webimg2md-plugin/releases)

2. Extract the zip file

3. Load extension in your browser

**For Chrome/Edge:**

- Navigate to `chrome://extensions/` or `edge://extensions/`
- Enable "Developer mode"
- Click "Load unpacked"
- Select the extracted `dist` folder

**For Firefox:**

- Navigate to `about:debugging#/runtime/this-firefox`
- Click "Load Temporary Add-on"
- Select `manifest.json` in the extracted `dist` folder

## 📖 Usage

1. **Open a page**: Open the web page you want to save as Markdown
2. **Click extension**: Click the "Web to Markdown" icon in the toolbar
3. **Auto-save**: The following files will be automatically downloaded:
   - `extract-webimg2md-plugin/YYYYMMDDhhmmss/page-title.md` - Main Markdown file
   - `extract-webimg2md-plugin/YYYYMMDDhhmmss/img/YYYYMMDDhhmmss_image_*.{jpg,png,gif}` - Image files

### 💡 Usage Example
When saving an article titled "Latest AI Technology Trends":
```
downloads/extract-webimg2md-plugin/20250816125830/
├── Latest-AI-Technology-Trends.md
└── img/
    ├── 20250816125830_image_1.jpg  # 1st image in the article
    ├── 20250816125830_image_2.png  # 2nd image in the article
    └── 20250816125830_image_3.gif  # 3rd image in the article
```

## ❗ Limitations

- Some content may not be extracted from pages with heavy JavaScript dynamic content
- Does not work on special URLs like chrome:// or file://
- May not work on some websites due to Content Security Policy restrictions

## 🐛 Troubleshooting

### File not downloading

1. Check browser download settings
2. Verify popup blocker is not enabled
3. Check extension permissions

### Content not extracted correctly

1. Make sure the page is fully loaded before executing
2. For JavaScript-heavy sites, wait a moment and try again

## 📝 Development

### Development Environment Setup

```bash
# Clone repository
git clone https://github.com/tkeneix/extract-webimg2md-plugin.git
cd extract-webimg2md-plugin

# Install dependencies
npm install

# Production build
# chrome/edge
npm run build:chrome
# firefox
npm run build:firefox

# Create extension package
# chrome/edge
npm run package:chrome
# firefox
npm run package:firefox
```

### Tech Stack

- **TypeScript**: Type-safe development
- **Webpack**: Bundling and build
- **Mozilla Readability**: Content extraction
- **Turndown**: HTML to Markdown conversion
- **WebExtension Polyfill**: Cross-browser compatibility

## 🙏 Acknowledgments

### Original Project
- **[OsawaKousei/simple-web2md-ext](https://github.com/OsawaKousei/simple-web2md-ext)** - We are deeply grateful for providing such an excellent foundation project

### Development
- **[Claude Code](https://claude.ai/code)** - Developed this enhanced edition with image download and link preservation features
- **Development Process**: Claude Code (design & implementation) + Human (requirements & review & testing)

### Tech Stack
- **[Mozilla Readability](https://github.com/mozilla/readability)** - Content extraction
- **[Turndown](https://github.com/domchristie/turndown)** - HTML to Markdown conversion
- **[WebExtension Polyfill](https://github.com/mozilla/webextension-polyfill)** - Cross-browser compatibility

---
