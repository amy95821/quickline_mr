export interface SearchResult {
  title: string;
  link: string;
  source: string;
  snippet: string;
}

function decodeHtml(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function extractDomain(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host.split(".")[0] ?? host;
  } catch {
    return "web";
  }
}

function parseGoogleNewsRss(xml: string): SearchResult[] {
  const items: SearchResult[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const titleMatch = block.match(/<title>([\s\S]*?)<\/title>/);
    const linkMatch = block.match(/<link>([\s\S]*?)<\/link>/);
    const descMatch = block.match(/<description>([\s\S]*?)<\/description>/);
    const sourceMatch = block.match(/<source[^>]*>([\s\S]*?)<\/source>/);

    if (!titleMatch) continue;

    const title = decodeHtml(titleMatch[1]);
    const link = linkMatch ? decodeHtml(linkMatch[1]) : "";
    const snippet = descMatch ? decodeHtml(descMatch[1]).slice(0, 120) : "";
    const source = sourceMatch
      ? decodeHtml(sourceMatch[1])
      : extractDomain(link);

    if (title && title !== "Google News") {
      items.push({ title, link, source, snippet });
    }
  }

  return items;
}

async function searchGoogleNewsRss(query: string): Promise<SearchResult[]> {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ko&gl=KR&ceid=KR:ko`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; QuicklineBot/1.0)" },
    next: { revalidate: 0 },
  });

  if (!res.ok) return [];
  const xml = await res.text();
  return parseGoogleNewsRss(xml);
}

async function searchSerperNews(query: string): Promise<SearchResult[]> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return [];

  const res = await fetch("https://google.serper.dev/news", {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ q: query, gl: "kr", hl: "ko", num: 15 }),
  });

  if (!res.ok) return [];
  const data = (await res.json()) as {
    news?: { title: string; link: string; snippet: string; source?: string }[];
  };

  return (data.news ?? []).map((item) => ({
    title: item.title,
    link: item.link,
    source: item.source ?? extractDomain(item.link),
    snippet: item.snippet ?? "",
  }));
}

function dedupeResults(results: SearchResult[]): SearchResult[] {
  const seen = new Set<string>();
  return results.filter((r) => {
    const key = r.title.replace(/\s+/g, "").slice(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function webSearch(
  queries: string[],
  limit = 20,
): Promise<SearchResult[]> {
  const all: SearchResult[] = [];

  for (const query of queries) {
    const [serper, rss] = await Promise.all([
      searchSerperNews(query),
      searchGoogleNewsRss(query),
    ]);
    all.push(...serper, ...rss);
  }

  return dedupeResults(all).slice(0, limit);
}
