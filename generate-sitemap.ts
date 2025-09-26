import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./src/routesConfig.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = "https://justdivescuba.com";

async function generateSitemap(urls: string[]) {
  try {
    const sitemapEntries = urls
      .filter((url) => !url.includes(":"))
      .map((url) => `<url><loc>${baseUrl}${url}</loc></url>`)
      .join("\n");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>`;

    const outputPath = path.resolve(__dirname, "public", "sitemap.xml");
    await fs.writeFile(outputPath, sitemap, "utf8");
    console.log("✅ Sitemap generated at /public/sitemap.xml");
  } catch (error) {
    console.error("Error generating sitemap:", error);
    process.exit(1);
  }
}

await generateSitemap(routes);
