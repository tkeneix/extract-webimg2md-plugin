import browser from "webextension-polyfill";


/**
 * サニタイズされたファイル名を生成
 */
function generateSafeFilename(title: string): string {
  // 基本的な文字の置換とクリーンアップ
  let safeName = title
    .replace(/[\\\/\?%*:|"<>]/g, "-") // 無効な文字を置換
    .replace(/\s+/g, "_") // スペースをアンダースコアに
    .replace(/[^\w\-_\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, "") // 英数字、日本語のみ許可
    .replace(/^\.+|\.+$/g, "") // 先頭・末尾のピリオドを除去
    .replace(/_{2,}/g, "_") // 連続するアンダースコアを一つに
    .replace(/\-{2,}/g, "-"); // 連続するハイフンを一つに

  // 長すぎる場合は切り詰め（Windows の制限を考慮）
  if (safeName.length > 100) {
    safeName = safeName.substring(0, 100);
  }

  // 空の場合はデフォルト名を使用
  if (!safeName) {
    safeName = "webpage";
  }

  return safeName;
}

/**
 * プロジェクト専用ディレクトリパスを生成
 */
function generateProjectDirectory(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  
  const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;
  return `extract-webimg2md-plugin/${timestamp}`;
}

/**
 * YYYYMMDDhhmmss形式のタイムスタンプを生成
 */
function generateTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

/**
 * 画像ファイル名を生成 (YYYYMMDDhhmmss_image_<通番>.<拡張子>)
 */
function generateImageFilename(timestamp: string, index: number, extension: string): string {
  return `${timestamp}_image_${index + 1}.${extension}`;
}

/**
 * 画像ファイルをダウンロード
 */
async function downloadImageFile(imageUrl: string, basePath: string, filename: string): Promise<void> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const blob = await response.blob();
    const dataUrl = await blobToDataURL(blob);
    
    await browser.downloads.download({
      url: dataUrl,
      filename: `${basePath}/img/${filename}`,
      saveAs: false
    });
  } catch (error) {
    console.error(`画像ダウンロードエラー (${imageUrl}):`, error);
    // 画像ダウンロードが失敗しても続行する
  }
}

/**
 * BlobをData URLに変換
 */
function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * data URLをBlobに変換するヘルパー関数
 */
async function dataURLtoBlob(dataURL: string): Promise<Blob> {
  const res = await fetch(dataURL);
  const blob = await res.blob();
  return blob;
}

export async function downloadFile(
  filename: string,
  content: string
): Promise<void> {
  try {
    // ファイル名を安全に変換
    const baseName = filename.replace(/\.md$/, ""); // .md拡張子を一旦除去
    const safeFilename = generateSafeFilename(baseName) + ".md";

    // Data URLを作成
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(content);
    const binaryString = Array.from(uint8Array, (byte) =>
      String.fromCharCode(byte)
    ).join("");
    const encodedContent = btoa(binaryString);
    const dataUrl = `data:text/markdown;base64,${encodedContent}`;

    // URL.createObjectURLが使えるかチェック (Firefoxではtrue, ChromeのService Workerではfalse)
    if (typeof URL.createObjectURL === "function") {
      // Firefox向けの処理: data URLをBlobに変換してからblob URLを生成
      console.log("Firefox-style download: using Blob URL");
      const blob = await dataURLtoBlob(dataUrl);
      const blobUrl = URL.createObjectURL(blob);

      await browser.downloads.download({
        url: blobUrl,
        filename: safeFilename,
        saveAs: false,
      });
    } else {
      // Chrome (MV3) 向けの処理: data URLを直接ダウンロード
      console.log("Chrome-style download: using data: URL");
      await browser.downloads.download({
        url: dataUrl,
        filename: safeFilename,
        saveAs: false,
      });
    }
  } catch (error) {
    console.error("ファイルダウンロードエラー:", error);
    throw error;
  }
}

/**
 * マークダウンと画像ファイルを含む完全なダウンロード処理
 */
export async function downloadMarkdownWithImages(
  title: string,
  markdown: string,
  imageUrls: string[]
): Promise<void> {
  try {
    // プロジェクト専用ディレクトリパスを生成
    const projectDir = generateProjectDirectory();
    
    // 画像ファイル名用のタイムスタンプを生成
    const imageTimestamp = generateTimestamp();
    
    // ファイル名をサニタイズ
    const safeTitle = generateSafeFilename(title);
    const markdownFilename = `${projectDir}/${safeTitle}.md`;
    
    // 画像URLから相対パスへの変換マップを作成
    const imageMap = new Map<string, string>();
    const imageDownloadPromises: Promise<void>[] = [];
    
    // 各画像のダウンロード処理を準備
    imageUrls.forEach((imageUrl, index) => {
      try {
        const url = new URL(imageUrl);
        const pathname = url.pathname;
        const extension = pathname.split('.').pop() || 'jpg';
        const imageName = generateImageFilename(imageTimestamp, index, extension);
        const relativePath = `img/${imageName}`;
        
        imageMap.set(imageUrl, relativePath);
        
        // 画像ダウンロードを並列実行用にプッシュ
        imageDownloadPromises.push(
          downloadImageFile(imageUrl, projectDir, imageName)
        );
      } catch (error) {
        console.warn(`Invalid image URL: ${imageUrl}`, error);
      }
    });
    
    // マークダウン内の画像URLを相対パスに置換
    let processedMarkdown = markdown;
    imageMap.forEach((relativePath, originalUrl) => {
      const escapedUrl = originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // ![alt](url) 形式を置換
      const imageRegex = new RegExp(`!\\[([^\\]]*)\\]\\(${escapedUrl}\\)`, 'g');
      processedMarkdown = processedMarkdown.replace(imageRegex, `![$1](${relativePath})`);
      
      // [![alt](url)](link_url) 形式のリンクURLも置換（画像が同じURLにリンクしている場合）
      const linkedImageRegex = new RegExp(`\\[!\\[([^\\]]*)\\]\\([^)]+\\)\\]\\(${escapedUrl}\\)`, 'g');
      processedMarkdown = processedMarkdown.replace(linkedImageRegex, `[![$1](${relativePath})](${relativePath})`);
    });
    
    // マークダウンファイルをダウンロード
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(processedMarkdown);
    const binaryString = Array.from(uint8Array, (byte) =>
      String.fromCharCode(byte)
    ).join("");
    const encodedContent = btoa(binaryString);
    const dataUrl = `data:text/markdown;base64,${encodedContent}`;
    
    await browser.downloads.download({
      url: dataUrl,
      filename: markdownFilename,
      saveAs: false
    });
    
    // 画像ファイルを並列ダウンロード
    await Promise.all(imageDownloadPromises.map(p => p.catch(err => {
      console.error('画像ダウンロードエラー:', err);
      return null;
    })));
    
    console.log(`ダウンロード完了: ${markdownFilename}, 画像: ${imageUrls.length}件`);
  } catch (error) {
    console.error("マークダウン+画像ダウンロードエラー:", error);
    throw error;
  }
}
