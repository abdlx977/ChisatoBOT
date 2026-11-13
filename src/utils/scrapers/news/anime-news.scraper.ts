import Axios from "axios";
import { load } from "cheerio";

export interface AnimeNewsItem {
    title: string;
    link: string;
    date: string;
    timestamp: number;
    description: string;
    source: string;
}

const FEEDS = [
    {
        name: "Anime News Network",
        url: "https://www.animenewsnetwork.com/news/rss.xml?ann-edition=us",
    },
    {
        name: "Crunchyroll",
        url: "https://cr-news-api-service.prd.crunchyrollsvc.com/v1/en-US/rss",
    },
];

async function fetchFeed(
    feed: (typeof FEEDS)[number]
): Promise<AnimeNewsItem[]> {
    const { data } = await Axios.get(feed.url, {
        timeout: 15000,
        headers: {
            "User-Agent": "LucilferBot/1.0",
        },
        responseType: "text",
    });

    const $ = load(data, { xmlMode: true });
    const results: AnimeNewsItem[] = [];

    $("item").each((_, element) => {
        const item = $(element);

        const title = item.find("title").first().text().trim();
        const link = item.find("link").first().text().trim();
        const rawDate =
            item.find("pubDate").first().text().trim() ||
            item.find("date").first().text().trim();

        const rawDescription =
            item.find("description").first().text().trim() ||
            item.find("summary").first().text().trim();

        if (!title || !link) return;

        const parsedDate = rawDate ? new Date(rawDate) : new Date();
        const timestamp = Number.isNaN(parsedDate.getTime())
            ? Date.now()
            : parsedDate.getTime();

        const description = load(rawDescription).text().trim();

        results.push({
            title,
            link,
            date: new Date(timestamp).toLocaleDateString("en-GB"),
            timestamp,
            description: description.slice(0, 220),
            source: feed.name,
        });
    });

    return results;
}

export async function getLatestAnimeNews(
    limit = 10
): Promise<AnimeNewsItem[]> {
    const responses = await Promise.allSettled(
        FEEDS.map((feed) => fetchFeed(feed))
    );

    const successfulFeeds = responses.filter(
        (result) => result.status === "fulfilled"
    );

    if (!successfulFeeds.length) {
        throw new Error("All anime news sources are unavailable.");
    }

    const news = successfulFeeds.flatMap((result) =>
        result.status === "fulfilled" ? result.value : []
    );

    const uniqueNews = new Map<string, AnimeNewsItem>();

    for (const item of news) {
        const key = item.link.split("?")[0].replace(/\/$/, "").toLowerCase();

        if (!uniqueNews.has(key)) {
            uniqueNews.set(key, item);
        }
    }

    return [...uniqueNews.values()]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);
          }
