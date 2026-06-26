/**
 * News aggregator data layer for the ecommerce / dropshipping niche.
 *
 * `getNews()` fetches a set of RSS/Atom feeds server-side, parses them with
 * fast-xml-parser, normalises the items and tags each with a topic. It is
 * resilient: feeds that fail are skipped, and if every feed is unreachable
 * (e.g. a locked-down network) it falls back to bundled sample articles so the
 * UI is never empty. `usedSample` tells the UI which mode it is in.
 */

import { XMLParser } from "fast-xml-parser";

export type Topic = "tools" | "research" | "business";

export const topics: { key: Topic; label: string }[] = [
  { key: "tools", label: "Tools" },
  { key: "research", label: "Research" },
  { key: "business", label: "Business" },
];

export const topicMeta: Record<Topic, { label: string; chip: string }> = {
  tools: {
    label: "Tools",
    chip: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  },
  research: {
    label: "Research",
    chip: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  },
  business: {
    label: "Business",
    chip: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  },
};

export type NewsItem = {
  id: string;
  title: string;
  url: string;
  source: string;
  /** ISO timestamp. */
  publishedAt: string;
  summary: string;
  topic: Topic;
};

type FeedSource = {
  source: string;
  url: string;
};

/** Ecommerce / dropshipping RSS feeds. */
export const FEEDS: FeedSource[] = [
  { source: "Shopify Blog", url: "https://www.shopify.com/blog.atom" },
  { source: "Practical Ecommerce", url: "https://www.practicalecommerce.com/feed" },
  { source: "Modern Retail", url: "https://www.modernretail.co/feed" },
  { source: "Digital Commerce 360", url: "https://www.digitalcommerce360.com/feed" },
  { source: "Do Dropshipping", url: "https://dodropshipping.com/feed" },
  { source: "Ecommerce Bytes", url: "https://www.ecommercebytes.com/feed" },
];

const TOPIC_KEYWORDS: Record<Topic, string[]> = {
  tools: [
    "tool", "app", "software", "platform", "plugin", "integration",
    "automation", " ai ", "ai-", "chatgpt", "saas", "dashboard", "extension",
    "shopify app", "feature", "launch",
  ],
  research: [
    "study", "report", "survey", "data", "research", "trend", "statistic",
    "forecast", "analysis", "consumer behavior", "insight", "benchmark",
    "%", "percent",
  ],
  business: [
    "revenue", "funding", "acquisition", "growth", "strategy", "marketing",
    "profit", "sales", "brand", "logistics", "supplier", "margin", "ad ",
    "advertis", "tariff", "shipping", "fulfillment",
  ],
};

/** Heuristically classify an article by keywords; defaults to "business". */
export function categorize(title: string, summary: string): Topic {
  const text = `${title} ${summary}`.toLowerCase();
  const scores: Record<Topic, number> = { tools: 0, research: 0, business: 0 };
  for (const topic of Object.keys(TOPIC_KEYWORDS) as Topic[]) {
    for (const kw of TOPIC_KEYWORDS[topic]) {
      if (text.includes(kw)) scores[topic] += 1;
    }
  }
  let best: Topic = "business";
  for (const topic of Object.keys(scores) as Topic[]) {
    if (scores[topic] > scores[best]) best = topic;
  }
  return best;
}

function stripHtml(input: string): string {
  return input
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&#8216;|&lsquo;/g, "‘")
    .replace(/&#8220;|&ldquo;/g, "“")
    .replace(/&#8221;|&rdquo;/g, "”")
    .replace(/&quot;/g, '"')
    .replace(/&hellip;|&#8230;/g, "…")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text: string, max = 220): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

type RawEntry = Record<string, unknown>;

function asText(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (typeof obj["#text"] === "string") return obj["#text"];
  }
  return String(value);
}

function getLink(entry: RawEntry): string {
  // RSS: <link>url</link>. Atom: <link href="url"/> (possibly an array).
  const link = entry.link;
  if (typeof link === "string") return link;
  if (Array.isArray(link)) {
    const alt =
      link.find(
        (l) =>
          typeof l === "object" &&
          (l as Record<string, unknown>)["@_rel"] === "alternate"
      ) ?? link[0];
    if (alt && typeof alt === "object") {
      return String((alt as Record<string, unknown>)["@_href"] ?? "");
    }
    if (typeof alt === "string") return alt;
  }
  if (link && typeof link === "object") {
    return String((link as Record<string, unknown>)["@_href"] ?? "");
  }
  return "";
}

/** Parse a feed XML string into normalised items. */
export function parseFeed(xml: string, source: string): NewsItem[] {
  let doc: Record<string, unknown>;
  try {
    doc = parser.parse(xml) as Record<string, unknown>;
  } catch {
    return [];
  }

  const rss = doc.rss as Record<string, unknown> | undefined;
  const channel = rss?.channel as Record<string, unknown> | undefined;
  const feed = doc.feed as Record<string, unknown> | undefined;

  let entries: RawEntry[] = [];
  if (channel?.item) {
    entries = Array.isArray(channel.item)
      ? (channel.item as RawEntry[])
      : [channel.item as RawEntry];
  } else if (feed?.entry) {
    entries = Array.isArray(feed.entry)
      ? (feed.entry as RawEntry[])
      : [feed.entry as RawEntry];
  }

  const items: NewsItem[] = [];
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const title = stripHtml(asText(entry.title));
    if (!title) continue;

    const url = getLink(entry);
    const rawSummary = asText(
      entry.description ?? entry.summary ?? entry["content:encoded"] ?? entry.content
    );
    const summary = truncate(stripHtml(rawSummary));

    const rawDate = asText(entry.pubDate ?? entry.published ?? entry.updated);
    const parsed = rawDate ? new Date(rawDate) : null;
    const publishedAt =
      parsed && !Number.isNaN(parsed.getTime())
        ? parsed.toISOString()
        : new Date().toISOString();

    items.push({
      id: `${source}-${i}-${url || title}`,
      title,
      url,
      source,
      publishedAt,
      summary,
      topic: categorize(title, summary),
    });
  }
  return items;
}

async function fetchFeed(feed: FeedSource): Promise<NewsItem[]> {
  try {
    const res = await fetch(feed.url, {
      headers: { "user-agent": "ContentHub/1.0 (+news-aggregator)" },
      // Revalidate every 30 minutes (ISR) in environments with network access.
      next: { revalidate: 1800 },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseFeed(xml, feed.source);
  } catch {
    return [];
  }
}

export type NewsResult = {
  items: NewsItem[];
  usedSample: boolean;
  sources: string[];
};

/** Aggregate all feeds, newest first, with a sample fallback. */
export async function getNews(): Promise<NewsResult> {
  const results = await Promise.all(FEEDS.map(fetchFeed));
  const items = results
    .flat()
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, 60);

  if (items.length === 0) {
    return {
      items: sampleNews,
      usedSample: true,
      sources: Array.from(new Set(sampleNews.map((i) => i.source))),
    };
  }

  return {
    items,
    usedSample: false,
    sources: Array.from(new Set(items.map((i) => i.source))),
  };
}

// --- Sample fallback (used when no feed is reachable) ----------------------

function daysAgoIso(n: number): string {
  // Anchored to a fixed date for deterministic rendering in the sandbox.
  const base = new Date("2026-06-26T09:00:00Z");
  base.setUTCDate(base.getUTCDate() - n);
  return base.toISOString();
}

export const sampleNews: NewsItem[] = [
  {
    id: "s1",
    title: "Shopify rolls out new AI product-research tool for dropshippers",
    url: "https://www.shopify.com/blog",
    source: "Shopify Blog",
    publishedAt: daysAgoIso(0),
    summary:
      "The new tool surfaces trending products and supplier options directly inside the admin, aiming to speed up store building for dropshipping merchants.",
    topic: "tools",
  },
  {
    id: "s2",
    title: "Study: dropshipping stores see 18% higher returns than average DTC",
    url: "https://www.practicalecommerce.com",
    source: "Practical Ecommerce",
    publishedAt: daysAgoIso(1),
    summary:
      "New research analysing 4,000 stores finds longer shipping times drive elevated return and refund rates, with implications for supplier selection.",
    topic: "research",
  },
  {
    id: "s3",
    title: "How top dropshipping brands are cutting ad costs with UGC",
    url: "https://www.modernretail.co",
    source: "Modern Retail",
    publishedAt: daysAgoIso(1),
    summary:
      "Brands are shifting budget from paid creative to user-generated content and affiliate creators to protect margins as CPMs rise.",
    topic: "business",
  },
  {
    id: "s4",
    title: "New tariff rules reshape supplier sourcing for US dropshippers",
    url: "https://www.digitalcommerce360.com",
    source: "Digital Commerce 360",
    publishedAt: daysAgoIso(2),
    summary:
      "Changes to de minimis thresholds are pushing merchants to diversify away from single-country suppliers and rethink fulfillment strategy.",
    topic: "business",
  },
  {
    id: "s5",
    title: "10 best dropshipping automation apps for 2026",
    url: "https://dodropshipping.com",
    source: "Do Dropshipping",
    publishedAt: daysAgoIso(3),
    summary:
      "A roundup of order-fulfillment and pricing-automation tools that integrate with Shopify and WooCommerce to reduce manual work.",
    topic: "tools",
  },
  {
    id: "s6",
    title: "Consumer survey: shoppers expect sub-5-day delivery from small stores",
    url: "https://www.ecommercebytes.com",
    source: "Ecommerce Bytes",
    publishedAt: daysAgoIso(4),
    summary:
      "Survey data shows delivery-speed expectations are tightening, raising the bar for dropshipping merchants relying on overseas suppliers.",
    topic: "research",
  },
  {
    id: "s7",
    title: "AI copywriting tools compared for product descriptions",
    url: "https://www.practicalecommerce.com",
    source: "Practical Ecommerce",
    publishedAt: daysAgoIso(5),
    summary:
      "We tested the leading AI writing tools on real dropshipping catalogs to see which produce the most conversion-ready copy.",
    topic: "tools",
  },
  {
    id: "s8",
    title: "Profit margins in dropshipping: what the latest data shows",
    url: "https://www.modernretail.co",
    source: "Modern Retail",
    publishedAt: daysAgoIso(6),
    summary:
      "An analysis of merchant financials reveals where margin is won and lost across pricing, shipping and returns in 2026.",
    topic: "research",
  },
  {
    id: "s9",
    title: "Scaling a dropshipping brand past $1M: a founder’s playbook",
    url: "https://dodropshipping.com",
    source: "Do Dropshipping",
    publishedAt: daysAgoIso(7),
    summary:
      "A case study covering supplier negotiation, retention marketing and the operational changes needed to scale profitably.",
    topic: "business",
  },
  {
    id: "s10",
    title: "Shopify adds bulk supplier-sync feature to reduce stockouts",
    url: "https://www.shopify.com/blog",
    source: "Shopify Blog",
    publishedAt: daysAgoIso(8),
    summary:
      "The new integration keeps inventory and pricing in sync across multiple suppliers, a common pain point for dropshipping catalogs.",
    topic: "tools",
  },
];
