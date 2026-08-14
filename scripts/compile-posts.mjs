import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const OUTPUT_FILE = path.join(process.cwd(), "src", "data", "posts.ts");

function compilePosts() {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));

  const posts = files
    .map((filename) => {
      const filePath = path.join(POSTS_DIR, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      const defaultSlug = filename.replace(/\.md$/, "");
      const dateStr = data.date ? String(data.date).trim() : new Date().toISOString().split("T")[0];
      const yearStr = data.year ? String(data.year).trim() : dateStr.slice(0, 4);

      return {
        slug: data.slug || defaultSlug,
        title: data.title || "Untitled Post",
        date: dateStr,
        year: yearStr,
        category: data.category || "uncategorized",
        excerpt: data.excerpt || "",
        image: data.image ? String(data.image).trim() : "",
        content: content.trim(),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const tsContent = `// Auto-generated file. Do not edit directly.
// Compiled from content/posts/*.md by scripts/compile-posts.mjs

export interface Post {
  slug: string;
  title: string;
  date: string;
  year: string;
  category: string;
  excerpt: string;
  image: string;
  content: string;
}

export const posts: Post[] = ${JSON.stringify(posts, null, 2)};
`;

  fs.writeFileSync(OUTPUT_FILE, tsContent, "utf-8");
  console.log(`Successfully compiled ${posts.length} markdown post(s) -> ${OUTPUT_FILE}`);
}

compilePosts();
