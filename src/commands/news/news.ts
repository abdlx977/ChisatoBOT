
import type { ConfigCommands } from "../../types/structure/commands.js";
import { getLatestAnimeNews } from "../../utils/scrapers/news/anime-news.scraper.js";

export default {
    name: "news",
    alias: ["الاخبار", "الأخبار", "anime-news"],
    category: "news",
    description: "عرض آخر أخبار ومستجدات الأنمي",
    cooldown: 10,

    async run({ Chisato, from, message }) {
        await Chisato.sendReaction(from, "⏳", message.key);

        try {
            const news = await getLatestAnimeNews(10);

            if (!news.length) {
                await Chisato.sendText(
                    from,
                    "❄️ لم يتم العثور على أخبار أنمي حاليًا.",
                    message
                );
                return;
            }

            let text = "";
            text += "╭━━━〔 🎌 𝐀𝐍𝐈𝐌𝐄 𝐍𝐄𝐖𝐒 〕━━━╮\n";
            text += "┃ ✦ آخر أخبار ومستجدات الأنمي\n";
            text += "╰━━━━━━━━━━━━━━━━━━━━╯\n\n";

            news.forEach((item, index) => {
                text += `┏━━〔 ✧ ${index + 1} 〕━━┓\n`;
                text += `🎬 *${item.title}*\n`;

                if (item.description) {
                    text += `📝 ${item.description}\n`;
                }

                text += `📅 ${item.date}\n`;
                text += `🌐 المصدر: ${item.source}\n`;
                text += `🔗 ${item.link}\n`;
                text += "┗━━━━━━━━━━━━━━┛\n\n";
            });

            text += "╭━━━━━━━━━━━━━━━━━━━━╮\n";
            text += "❄️ _يتم تحديث الأخبار عند طلب الأمر_\n";
            text += "╰━━━━━━━━━━━━━━━━━━━━╯\n";
            text += "_Lucilfer.Bot_";

            await Chisato.sendText(from, text, message);
            await Chisato.sendReaction(from, "✅", message.key);
        } catch (error: any) {
            await Chisato.sendReaction(from, "❌", message.key);

            await Chisato.sendText(
                from,
                "⚠️ تعذّر جلب أخبار الأنمي حاليًا.\nحاول مرة أخرى بعد قليل.",
                message
            );

            Chisato.logger.error("Anime news error:", error);
        }
    },
} satisfies ConfigCommands;
