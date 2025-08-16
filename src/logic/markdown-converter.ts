import TurndownService from "turndown";
import { Readability } from "@mozilla/readability";

interface ExtractedContent {
  title: string;
  content: string;
  markdown: string;
  imageUrls: string[];
}

/**
 * Readabilityを使用してページから記事コンテンツを抽出し、Markdownに変換する
 */
export function convertToMarkdown(html?: string): ExtractedContent {
  const turndownService = new TurndownService({
    headingStyle: "atx",
    hr: "---",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    fence: "```",
    emDelimiter: "*",
    strongDelimiter: "**",
    linkStyle: "inlined",
    linkReferenceStyle: "full",
  });

  // 相対URLを絶対URLに変換するためのルール追加
  turndownService.addRule("links", {
    filter: "a",
    replacement: (content: string, node: Node) => {
      const href = (node as HTMLAnchorElement).getAttribute("href");
      if (!href) return content;

      // 相対URLを絶対URLに変換
      const absoluteUrl = new URL(href, window.location.href).href;
      return `[${content}](${absoluteUrl})`;
    },
  });

  turndownService.addRule("images", {
    filter: "img",
    replacement: (content: string, node: Node) => {
      const src = (node as HTMLImageElement).getAttribute("src");
      const alt = (node as HTMLImageElement).getAttribute("alt") || "";
      if (!src) return "";

      // 相対URLを絶対URLに変換
      const absoluteUrl = new URL(src, window.location.href).href;
      return `![${alt}](${absoluteUrl})`;
    },
  });


  try {
    // HTMLが提供されていない場合は現在のドキュメントを使用
    const sourceDocument = html
      ? new DOMParser().parseFromString(html, "text/html")
      : document;

    // Readabilityを使用して記事コンテンツを抽出
    const reader = new Readability(sourceDocument.cloneNode(true) as Document, {
      debug: false,
      maxElemsToParse: 0, // 制限なし
      nbTopCandidates: 5,
      charThreshold: 500,
      classesToPreserve: ["highlight", "code", "pre"],
      // リンクをより多く保持するための設定
      keepClasses: true,
    });

    const article = reader.parse();

    if (article && article.content) {
      // 元のドキュメントからリンクを事前に抽出
      const originalLinks = extractLinksFromDocument(sourceDocument);
      
      // 抽出されたコンテンツをMarkdownに変換
      let markdown = turndownService.turndown(article.content);
      
      // Readabilityで失われたリンクを復元
      markdown = restoreLinksInMarkdown(markdown, originalLinks);
      
      // 画像URLを抽出
      const imageUrls = extractImageUrls(markdown);

      return {
        title: article.title || document.title || "Untitled",
        content: article.content,
        markdown: `# ${
          article.title || document.title || "Untitled"
        }\n\n${markdown}`,
        imageUrls: imageUrls,
      };
    } else {
      // Readabilityで抽出できない場合はフォールバック処理
      console.warn(
        "Readability failed to extract content, falling back to body content"
      );
      return fallbackExtraction(turndownService);
    }
  } catch (error) {
    console.error("Readability extraction failed:", error);
    return fallbackExtraction(turndownService);
  }
}

/**
 * Readabilityが失敗した場合のフォールバック処理
 */
/**
 * マークダウンから画像URLを抽出する
 */
function extractImageUrls(markdown: string): string[] {
  const imageUrls: string[] = [];
  // ![alt](url) 形式の画像を抽出
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  
  while ((match = imageRegex.exec(markdown)) !== null) {
    const imageUrl = match[2];
    if (imageUrl && imageUrl.startsWith('http')) {
      imageUrls.push(imageUrl);
    }
  }
  
  return imageUrls;
}

/**
 * ドキュメントからリンク情報を抽出する
 */
function extractLinksFromDocument(doc: Document): Array<{text: string, href: string}> {
  const links: Array<{text: string, href: string}> = [];
  const anchorElements = doc.querySelectorAll('a[href]');
  
  anchorElements.forEach(anchor => {
    const href = anchor.getAttribute('href');
    const text = anchor.textContent?.trim();
    
    if (href && text && href !== '#' && !href.startsWith('javascript:')) {
      // 相対URLを絶対URLに変換
      try {
        const absoluteUrl = new URL(href, window.location.href).href;
        links.push({ text, href: absoluteUrl });
      } catch (e) {
        // 無効なURLは無視
      }
    }
  });
  
  return links;
}

/**
 * Markdownにリンクを復元する
 */
function restoreLinksInMarkdown(markdown: string, originalLinks: Array<{text: string, href: string}>): string {
  let restoredMarkdown = markdown;
  
  // 元のリンクテキストがMarkdown内にあるが、リンクになっていない場合は復元
  originalLinks.forEach(link => {
    // リンクテキストが既にMarkdownリンクになっていない場合
    const linkTextRegex = new RegExp(`\\b${escapeRegExp(link.text)}\\b(?!\\]\\()`, 'g');
    
    // テキストがMarkdownに存在し、まだリンクになっていない場合は復元
    if (linkTextRegex.test(restoredMarkdown)) {
      restoredMarkdown = restoredMarkdown.replace(
        linkTextRegex,
        `[${link.text}](${link.href})`
      );
    }
  });
  
  return restoredMarkdown;
}

/**
 * 正規表現で使用する特殊文字をエスケープする
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function fallbackExtraction(
  turndownService: TurndownService
): ExtractedContent {
  // 不要な要素を除去するが、リンクは保持する
  const cleanHtml = document.body.innerHTML
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    // header, footer, asideは除去するが、navは参照リンクが含まれる可能性があるので保持
    .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, "")
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, "")
    // 広告系のclassのみ除去し、その他のnavigationやmenuは保持
    .replace(
      /<div[^>]*class="[^"]*(?:advertisement|ads|banner)[^"]*"[^>]*>.*?<\/div>/gi,
      ""
    );

  const markdown = turndownService.turndown(cleanHtml);
  
  // 画像URLを抽出
  const imageUrls = extractImageUrls(markdown);

  return {
    title: document.title || "Untitled",
    content: cleanHtml,
    markdown: `# ${document.title || "Untitled"}\n\n${markdown}`,
    imageUrls: imageUrls,
  };
}
