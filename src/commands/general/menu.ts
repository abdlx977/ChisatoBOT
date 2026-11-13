
import type { ConfigCommands } from "../../types/structure/commands";
import { commands, aliasIndex } from "../../libs";

const ARABIC_COMMANDS: Record<string, string> = {
    animeranking: "ترتيب_الانمي",
    tracemoe: "البحث_عن_الانمي",

    sticker: "ملصق",
    texttosticker: "ملصق_نصي",
    instagram: "انستغرام",
    tiktokvideo: "تيك_توك",
    zerochan: "خلفيات_انمي",

    tetris: "تتريس",
    werewolf: "الذئب",

    event: "فعالية",
    "event-stop": "انهاء",
    random: "عشوائي",
    games: "الألعاب",
    decompose: "تفكيك",
    reverse: "عكس",
    scramble: "رتب",
    join: "جمع",
    flags: "أعلام_الدول",
    writing: "كتابة",

    about: "حول",
    groupinfo: "معلومات_المجموعة",
    kick: "طرد",
    antilink: "منع_الروابط",
    mute: "كتم",
    unmute: "فتح",

    youtubesearch: "بحث_يوتيوب",
    ping: "سرعة",
    status: "الحالة",
};

const SECTIONS: Record<string, string[]> = {
    "🎌 الأنمي": [
        "animeranking",
        "tracemoe",
    ],

    "📥 التحميل": [
        "instagram",
        "tiktokvideo",
    ],

    "🖼️ الصور والملصقات": [
        "sticker",
        "texttosticker",
        "zerochan",
    ],

    "🎮 الألعاب والفعاليات": [
        "games",
        "event",
        "event-stop",
        "random",
        "decompose",
        "reverse",
        "scramble",
        "join",
        "flags",
        "writing",
        "tetris",
        "werewolf",
    ],

    "👥 المجموعات": [
        "groupinfo",
        "kick",
        "antilink",
        "mute",
        "unmute",
    ],

    "🌐 أدوات عامة": [
        "about",
        "ping",
        "status",
        "youtubesearch",
    ],
};

export default {
    name: "menu",
    alias: ["اوامر", "أوامر", "القائمة", "allmenu", "commands", "command", "cmd"],
    category: "general",
    description: "عرض قائمة الأوامر",

    async run({ Chisato, from, message, prefix, botName }) {
        for (const [commandName, arabicName] of Object.entries(ARABIC_COMMANDS)) {
            const command = commands.get(commandName);

            if (command) {
                aliasIndex.set(arabicName, command);
            }
        }

        let text = "";
        text += `✦ ───────────────── ✦\n`;
        text += `       ✧ *${botName}* ✧\n`;
        text += `✦ ───────────────── ✦\n\n`;
        text += `أهلاً ${message.pushName || "بك"} 👋\n`;
        text += `إليك قائمة الأوامر:\n`;

        for (const [section, names] of Object.entries(SECTIONS)) {
            const available = names.filter((name) => commands.has(name));

            if (!available.length) continue;

            text += `\n${section}\n`;

            for (const name of available) {
                text += `│ ${prefix}${ARABIC_COMMANDS[name]}\n`;
            }
        }

        text += `\n✦ ───────────────── ✦\n`;
        text += `_Lucilfer.Bot_`;

        await Chisato.sendText(from, text, message);
    },
} satisfies ConfigCommands;
