import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("https://chinmaykarkar.com/blog/blogger_blog/", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2500);

const info = await page.evaluate(() => {
  const out = {};
  // Body styles
  const body = getComputedStyle(document.body);
  out.body = {
    fontFamily: body.fontFamily,
    fontSize: body.fontSize,
    color: body.color,
    background: body.backgroundColor,
    lineHeight: body.lineHeight,
  };
  // Main content container
  const article = document.querySelector("article") || document.querySelector("main") || document.querySelector(".blog-content") || document.querySelector("body");
  const aStyle = getComputedStyle(article);
  out.container = {
    tag: article.tagName,
    maxWidth: aStyle.maxWidth,
    width: aStyle.width,
    padding: aStyle.padding,
    fontSize: aStyle.fontSize,
  };
  // Headings
  const h1 = document.querySelector("h1");
  const h2 = document.querySelector("h2");
  const p = document.querySelector("p");
  out.h1 = h1 ? { text: h1.textContent.slice(0, 60), font: getComputedStyle(h1).fontFamily, size: getComputedStyle(h1).fontSize, weight: getComputedStyle(h1).fontWeight, lineHeight: getComputedStyle(h1).lineHeight, letterSpacing: getComputedStyle(h1).letterSpacing } : null;
  out.h2 = h2 ? { text: h2.textContent.slice(0, 60), font: getComputedStyle(h2).fontFamily, size: getComputedStyle(h2).fontSize, weight: getComputedStyle(h2).fontWeight, lineHeight: getComputedStyle(h2).lineHeight, margin: getComputedStyle(h2).margin } : null;
  out.p = p ? { font: getComputedStyle(p).fontFamily, size: getComputedStyle(p).fontSize, lineHeight: getComputedStyle(p).lineHeight, margin: getComputedStyle(p).margin, maxWidth: getComputedStyle(p).maxWidth } : null;
  // Links
  const a = document.querySelector("article a, main a, a");
  out.a = a ? { color: getComputedStyle(a).color, textDecoration: getComputedStyle(a).textDecoration } : null;
  // Code blocks
  const pre = document.querySelector("pre");
  out.pre = pre ? { font: getComputedStyle(pre).fontFamily, bg: getComputedStyle(pre).backgroundColor, color: getComputedStyle(pre).color, padding: getComputedStyle(pre).padding, radius: getComputedStyle(pre).borderRadius } : null;
  // Tables
  const table = document.querySelector("table");
  out.table = table ? { borderCollapse: getComputedStyle(table).borderCollapse, width: getComputedStyle(table).width, fontSize: getComputedStyle(table).fontSize } : null;
  // Fonts loaded
  out.fonts = [...new Set([...document.fonts].map((f) => f.family))].slice(0, 20);
  // Font-face rules
  const fontFaces = [];
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (rule.cssText && rule.cssText.startsWith("@font-face")) fontFaces.push(rule.cssText.slice(0, 300));
      }
    } catch (e) {}
  }
  out.fontFaces = fontFaces.slice(0, 8);
  // Page-level structure
  out.h1Count = document.querySelectorAll("h1").length;
  out.h2Count = document.querySelectorAll("h2").length;
  out.hasToc = !!document.querySelector("nav, .toc, [class*=toc]");
  return out;
});

console.log(JSON.stringify(info, null, 2));
await browser.close();
