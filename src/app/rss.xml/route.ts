import { getAllArticles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/utils";
import { siteConfig } from "@/config/site";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toUTCString();
}

export async function GET() {
  const articles = getAllArticles();
  const baseUrl = siteConfig.url;

  const items = articles
    .map((article) => {
      const url = absoluteUrl(article.url);
      const imageUrl = absoluteUrl(article.cover);
      const categories = article.tags.map((t) => t.name);

      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${formatDate(article.date)}</pubDate>
      <description><![CDATA[<p>${escapeXml(article.description)}</p><img src="${imageUrl}" alt="${escapeXml(article.title)}" width="1200" height="630" />]]></description>
      <content:encoded><![CDATA[<p>${escapeXml(article.description)}</p><img src="${imageUrl}" alt="${escapeXml(article.title)}" width="1200" height="630" style="max-width:100%;height:auto;" />]]></content:encoded>
      <author>${escapeXml(article.author.name)}</author>
      <category>${categories.map(escapeXml).join("</category>\n      <category>")}</category>
      <enclosure url="${imageUrl}" length="0" type="image/jpeg" />
      <media:content url="${imageUrl}" medium="image" width="1200" height="630" title="${escapeXml(article.title)}" />`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en</language>
    <lastBuildDate>${formatDate(articles[0]?.date ?? new Date().toISOString())}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/logo.svg</url>
      <title>${escapeXml(siteConfig.name)}</title>
      <link>${baseUrl}</link>
    </image>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
