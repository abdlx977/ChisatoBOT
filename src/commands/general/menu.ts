import type { ConfigCommands } from "../../types/structure/commands";
import { commands, aliasIndex } from "../../libs";

const COMMANDS: Record<string, { name: string; emoji: string }> = {
    animeranking: { name: "ترتيب_الانمي", emoji: "🏆" },
    tracemoe: { name: "البحث_عن_الانمي", emoji: "🔎" },
    news: { name: "الاخبار", emoji: "📰" },

    instagram: { name: "انستغرام", emoji: "📸" },
    tiktokvideo: { name: "تيك_توك", emoji: "🎵" },
    tiktokimage: { name: "صور_تيك_توك", emoji: "🖼️" },
    facebook: { name: "فيسبوك", emoji: "📘" },
    threads: { name: "ثريدز", emoji: "🧵" },
    xdownload: { name: "اكس", emoji: "❎" },

    sticker: { name: "ملصق", emoji: "🎨" },
    meme: { name: "ميم", emoji: "😂" },
    emojimix: { name: "دمج_ايموجي", emoji: "😀" },
    ocr: { name: "استخراج_النص", emoji: "📝" },

    games: { name: "الألعاب", emoji: "🎮" },
    event: { name: "فعالية", emoji: "🏅" },
    random: { name: "عشوائي", emoji: "🎲" },
    tetris: { name: "تتريس", emoji: "🧩" },
    werewolf: { name: "الذئب", emoji: "🐺" },

    groupinfo: { name: "معلومات_المجموعة", emoji: "👥" },
    kick: { name: "طرد", emoji: "🚪" },
    grouplink: { name: "رابط_المجموعة", emoji: "🔗" },
    tagall: { name: "منشن_الكل", emoji: "📢" },
    add: { name: "اضف_عضو", emoji: "➕" },
    promote: { name: "ترقية", emoji: "⬆️" },
    demote: { name: "سحب_اشراف", emoji: "⬇️" },

    kingdomsecurity: { name: "الحماية", emoji: "🛡️" },
    antilink: { name: "منع_الروابط", emoji: "🚫" },
    antibot: { name: "منع_البوتات", emoji: "🤖" },
    antidelete: { name: "منع_الحذف", emoji: "🗑️" },
    mute: { name: "كتم", emoji: "🔇" },
    unmute: { name: "فتح", emoji: "🔊" },

    leaderboard: { name: "المتصدرين", emoji: "🥇" },
    level: { name: "مستواي", emoji: "⭐" },
    me: { name: "ملفي", emoji: "👤" },
    stats: { name: "احصائياتي", emoji: "📊" },
    runtime: { name: "مدة_التشغيل", emoji: "⏱️" },
    about: { name: "حول", emoji: "ℹ️" },
    ping: { name: "سرعة", emoji: "⚡" },
};

const SECTIONS = [
    { title: "🎌 الأنمي", commands: ["animeranking", "tracemoe", "news"] },
    {
        title: "📥 التحميل",
        commands: ["instagram", "tiktokvideo", "tiktokimage", "facebook", "threads", "xdownload"],
    },
    { title: "🎨 الصور والوسائط", commands: ["sticker", "meme", "emojimix", "ocr"] },
    { title: "🎮 الألعاب", commands: ["games", "event", "random", "tetris", "werewolf"] },
    {
        title: "👥 إدارة المجموعة",
        commands: ["groupinfo", "kick", "grouplink", "tagall", "add", "promote", "demote"],
    },
    {
        title: "🛡️ الحماية",
        commands: ["kingdomsecurity", "antilink", "antibot", "antidelete", "mute", "unmute"],
    },
    {
        title: "✨ حسابي وأدواتي",
        commands: ["leaderboard", "level", "me", "stats", "runtime", "about", "ping"],
    },
];

export default {
    name: "menu",
    alias: ["اوامر", "أوامر", "القائمة", "allmenu", "commands", "command", "cmd"],
    category: "general",
    description: "عرض قائمة الأوامر",

    async run({ Chisato, from, message, prefix, botName }) {
        let text = "";

        text += "╔══════════════════════════╗\n";
        text += "║       🌌 𝐋𝐔𝐂𝐈𝐋𝐅𝐄𝐑 𝐁𝐎𝐓       ║\n";
        text += "╚══════════════════════════╝\n\n";
        text += `✦ أهلاً ${message.pushName || "بك"}\n`;
        text += `✦ البادئة: ${prefix}\n`;
        text += "✦ اختر الأمر واكتبه مع البادئة\n";

        for (const section of SECTIONS) {
            const available: string[] = [];

            for (const key of section.commands) {
                const command = commands.get(key);
                const item = COMMANDS[key];

                if (!command || !item) continue;

                aliasIndex.set(item.name.toLowerCase(), command);
                available.push(`${item.emoji} ${prefix}${item.name}`);
            }

            if (!available.length) continue;

            text += `\n╭──〔 ${section.title} 〕──\n`;
            for (const item of available) {
                text += `│ ${item}\n`;
            }
            text += "╰──────────────────\n";
        }

        text += "\n✦ استمتع بالتجربة 🌠\n";
        text += `✦ ${botName || "Lucilfer.Bot"}`;

        await Chisato.sendText(from, text, message);
    },
} satisfies ConfigCommands;
