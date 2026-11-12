import type { ConfigCommands } from "../../types/structure/commands";
import { getKingdomSecurityStats } from "../../modules/handlers/settings/kingdom-security.handler";

export default {
    name: "kingdomsecurity",
    alias: ["الحماية", "security"],
    category: "group setting",
    description: "عرض حالة حماية المملكة وإحصائياتها",
    isGroup: true,

    async run({ Chisato, from, message }) {
        const stats = getKingdomSecurityStats(from);

        const text =
            `🛡️ *「 حماية المملكة 」*\n\n` +
            `🟢 الحالة: *مفعّلة تلقائيًا*\n\n` +
            `⚠️ الأعضاء الذين لديهم تحذيرات: *${stats.membersWithWarnings}*\n` +
            `📋 مجموع التحذيرات: *${stats.totalWarnings}*\n` +
            `👁️ الأعضاء تحت مراقبة السبام: *${stats.membersBeingTracked}*\n\n` +
            `━━━━━━━━━━━━━━\n` +
            `📌 التحذير الأول: تنبيه\n` +
            `📌 التحذير الثاني: تحذير أخير\n` +
            `📌 التحذير الثالث: طرد`;

        await Chisato.sendText(from, text, message);
    },
} satisfies ConfigCommands;
