
import type { ConfigCommands } from "../../types/structure/commands";
import { commands } from "../../libs";
import fs from "fs";
import moment from "moment-timezone";

const CATEGORY_ICON: Record<string, string> = {
    general: "🌐",
    downloader: "📥",
    converter: "🔄",
    search: "🔎",
    anime: "🎌",
    news: "📰",
    wallpaper: "🖼️",
    group: "👥",
    groupsetting: "⚙️",
    games: "🎮",
    misc: "🎲",
    lookup: "🔍",
    owner: "👑",
    debugging: "🛠️",
};

const CATEGORY_NAME: Record<string, string> = {
    general: "عام",
    downloader: "التحميل",
    converter: "التحويل",
    search: "البحث",
    anime: "الأنمي",
    news: "الأخبار",
    wallpaper: "الخلفيات",
    group: "المجموعات",
    groupsetting: "إعدادات المجموعات",
    games: "الألعاب",
    misc: "متنوعة",
    lookup: "الاستعلامات",
    owner: "المالك",
    debugging: "التصحيح",
};

const getGreeting = (timezone: string): string => {
    const hour = parseInt(moment().tz(timezone).format("H"), 10);
    if (hour >= 4 && hour < 11) return "صباح الخير";
    if (hour >= 11 && hour < 15) return "طاب يومك";
    if (hour >= 15 && hour < 18) return "مساء الخير";
    return "مساء الخير";
};

export default {
    name: "menu",
    alias: ["اوامر", "أوامر", "القائمة", "allmenu", "commands", "command", "cmd"],
    category: "general",
    description: "عرض قائمة الأوامر",

    async run({ Chisato, from, message, prefix, botName, Database, isOwner, isTeam }) {
        const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
        const tz: string = config.timezone || config.timeZone || "Asia/Jakarta";
        const { pushName } = message;

        const isMaintenance = (name: string) => config.maintenance?.includes(name);

        const allCmds = Array.from(commands.values());
        const category: Record<string, ConfigCommands[]> = {};

        for (const cmd of allCmds) {
            const cat = cmd.category || "misc";
            if (!category[cat]) category[cat] = [];
            category[cat].push(cmd);
        }

        const totalUsers = await Database.User.getAll();
        const totalGroups = await Database.Group.getAll();

        const now = moment().tz(tz);
        const greeting = getGreeting(tz);
        const catKeys = Object.keys(category).sort((a, b) => a.localeCompare(b));

        let text = "";

        text += `✦ ──────────────────── ✦\n`;
        text += `        ✧ *${botName}* ✧\n`;
        text += `✦ ──────────────────── ✦\n\n`;

        text += `${greeting}، *${pushName || "صديقي"}* 👋\n`;
        text += `_${now.format("DD/MM/YYYY • HH:mm")}_\n\n`;

        text += `┌─────「 📊 *إحصائيات البوت* 」\n`;
        text += `│  🤖 *اسم البوت* : ${botName}\n`;
        text += `│  🔑 *البادئة* : ${prefix}\n`;
        text += `│  📦 *عدد الأوامر* : ${allCmds.length}\n`;
        text += `│  🗂️ *عدد الأقسام* : ${catKeys.length}\n`;
        text += `│  👥 *المستخدمون* : ${totalUsers.length}\n`;
        text += `│  🏢 *المجموعات* : ${totalGroups.length}\n`;
        text += `└${"─".repeat(24)}\n\n`;

        text += `📌 *دليل الرموز:*\n`;
        text += `⭐ المالك  💎 الفريق  👑 مشرف المجموعة  ✅ متاح للجميع\n`;
        text += `〰️ = قيد الصيانة\n\n`;

        const canSeeDebugging = isOwner || isTeam;

        for (const key of catKeys) {
            if (key === "debugging" && !canSeeDebugging) continue;

            const icon = CATEGORY_ICON[key] ?? "📂";
            const sorted = category[key].sort((a, b) => a.name.localeCompare(b.name));

            text += `┌─「 ${icon} *${CATEGORY_NAME[key] ?? key}* 」\n`;

            for (const v of sorted) {
                const badge = v.isOwner
                    ? "⭐"
                    : v.isTeam
                    ? "💎"
                    : v.isGroupAdmin
                    ? "👑"
                    : "✅";

                const usage = v.usage ? ` _${v.usage}_` : "";
                const inMaint = isMaintenance(v.name);

                const cmdText = inMaint
                    ? `~${prefix}${v.name}~`
                    : `${prefix}${v.name}`;

                text += `│  ${badge} ${cmdText}${usage}\n`;
            }

            text += `└${"─".repeat(24)}\n\n`;
        }

        text += `✦ ──────────────────── ✦\n`;
        text += `  _للتفاصيل اكتب: ${prefix}help ثم اسم الأمر_\n`;
        text += `✦ ──────────────────── ✦`;

        await Chisato.sendText(from, text, message);
    },
} satisfies ConfigCommands;
