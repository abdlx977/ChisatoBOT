
import type { ConfigCommands } from "../../types/structure/commands";
import { commands, aliasIndex } from "../../libs";

const ARABIC_COMMANDS: Record<string, string> = {
    animeranking: "ترتيب_الانمي",
    tracemoe: "البحث_عن_الانمي",
    news: "الاخبار",

    instagram: "انستغرام",
    tiktokvideo: "تيك_توك",
    tiktokimage: "صور_تيك_توك",
    facebook: "فيسبوك",
    threads: "ثريدز",
    xdownload: "اكس",

    sticker: "ملصق",
    texttosticker: "ملصق_نصي",
    emojimix: "دمج_ايموجي",
    meme: "ميم",
    ocr: "استخراج_النص",
    toimage: "ملصق_الى_صورة",
    animatedtext: "ملصق_متحرك",

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

    groupinfo: "معلومات_المجموعة",
    kick: "طرد",
    grouplink: "رابط_المجموعة",
    tagall: "منشن_الكل",
    hidetag: "منشن_صامت",
    afk: "غائب",
    add: "اضف_عضو",
    promote: "ترقية",
    demote: "سحب_اشراف",
    grouprevoke: "تغيير_رابط_المجموعة",

    antilink: "منع_الروابط",
    kingdomsecurity: "الحماية",
    mute: "كتم",
    unmute: "فتح",
    antibot: "منع_البوتات",
    antidelete: "منع_الحذف",
    gsetting: "اعدادات_المجموعة",
    announce: "وضع_اعلان",
    restrict: "تقييد_المجموعة",

    leaderboard: "المتصدرين",
    level: "مستواي",
    me: "ملفي",
    stats: "احصائياتي",
    botstatistics: "احصائيات_البوت",
    runtime: "مدة_التشغيل",
    about: "حول",
    ping: "سرعة",
};

const SECTIONS = [
    {
        title: "🎌 عالم الأنمي",
        commands: ["animeranking", "tracemoe", "news"],
    },
    {
        title: "📥 التحميل",
        commands: [
            "instagram",
            "tiktokvideo",
            "tiktokimage",
            "facebook",
            "threads",
            "xdownload",
        ],
    },
    {
        title: "🎨 الصور والتحويلات",
        commands: [
            "sticker",
            "texttosticker",
            "emojimix",
            "meme",
            "ocr",
            "toimage",
            "animatedtext",
        ],
    },
    {
        title: "🎮 الألعاب والفعاليات",
        commands: [
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
    },
    {
        title: "👥 إدارة المجموعة",
        commands: [
            "groupinfo",
            "kick",
            "grouplink",
            "tagall",
            "hidetag",
            "afk",
            "add",
            "promote",
            "demote",
            "grouprevoke",
        ],
    },
    {
        title: "🛡️ حماية وإعدادات",
        commands: [
            "kingdomsecurity",
            "antilink",
            "antibot",
            "antidelete",
            "mute",
            "unmute",
            "gsetting",
            "announce",
            "restrict",
        ],
    },
    {
        title: "✨ الحساب والأدوات",
        commands: [
            "الحساب",
            "الاغنياء",
            "leaderboard",
            "level",
            "me",
            "stats",
            "botstatistics",
            "runtime",
            "about",
            "ping",
        ],
    },
];

export default {
    name: "menu",
    alias: [
        "اوامر",
        "أوامر",
        "القائمة",
        "allmenu",
        "commands",
        "command",
        "cmd",
    ],
    category: "general",
    description: "عرض قائمة الأوامر",

    async run({ Chisato, from, message, prefix, botName }) {
        let text = "";

        text += "╔══════════════════════════╗\n";
        text += "║     ✦･ﾟ: *✧･ﾟ:* 🌌 *:･ﾟ✧*:･ﾟ✦     ║\n";
        text += `║       𝐋𝐔𝐂𝐈𝐋𝐅𝐄𝐑 𝐁𝐎𝐓       ║\n`;
        text += "╚══════════════════════════╝\n\n";

        text += `✧ أهلاً ${message.pushName || "بك"}\n`;
        text += "✦ اختر الأمر واكتبه مع البادئة\n";
        text += `✦ البادئة: ${prefix}\n`;

        for (const section of SECTIONS) {
            const available: string[] = [];

            for (const name of section.commands) {
                const command = commands.get(name);

                if (!command) continue;

                const displayName = ARABIC_COMMANDS[name] || name;

                aliasIndex.set(displayName.toLowerCase(), command);
                available.push(displayName);
            }

            if (!available.length) continue;

            text += "\n";
            text += `╭──〔 ${section.title} 〕──\n`;

            for (const name of available) {
                text += `│ ✧ ${prefix}${name}\n`;
            }

            text += "╰──────────────────\n";
        }

        text += "\n";
        text += "╭──────〔 🌠 〕──────╮\n";
        text += "  ✦ 𝐄𝐱𝐩𝐥𝐨𝐫𝐞 𝐓𝐡𝐞 𝐆𝐚𝐥𝐚𝐱𝐲 ✦\n";
        text += `  ${botName || "Lucilfer.Bot"}\n`;
        text += "╰──────────────────╯";

        await Chisato.sendText(from, text, message);
    },
} satisfies ConfigCommands;
