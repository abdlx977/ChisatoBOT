import type { ConfigCommands } from "../../types/structure/commands";
import { configService } from "../../core/config/config.service";
import { resolveToPnJid } from "../../utils/jid-resolver";

export default {
    name: "remove-noble",
    alias: ["ازل"],
    usage: "نخبة @منشن",
    category: "owner",
    description: "إزالة شخص من النخبة",
    isOwner: true,
    cooldown: 3,

    async run({ Chisato, args, from, message }) {
        if (args[0] !== "نخبة") {
            await Chisato.sendText(
                from,
                "❌ استخدم الأمر هكذا:\n.ازل نخبة مع منشن الشخص أو بالرد على رسالته",
                message
            );
            return;
        }

        const target = message.quoted?.sender || message.mentions?.[0];

        if (!target) {
            await Chisato.sendText(
                from,
                "⚠️ منشن الشخص أو رد على رسالته أولاً.",
                message
            );
            return;
        }

        let resolved = target;

        try {
            resolved = (await resolveToPnJid(Chisato, target)) || target;
        } catch {}

        const number = String(resolved).split("@")[0].replace(/\D/g, "");

        if (!number) {
            await Chisato.sendText(from, "❌ تعذر تحديد رقم الشخص.", message);
            return;
        }

        const config = configService.getConfig();
        const allowed = config.allowedNumbers || [];

        const updated = allowed.filter(
            n => String(n).replace(/\D/g, "") !== number
        );

        if (updated.length === allowed.length) {
            await Chisato.sendText(
                from,
                "ℹ️ هذا الشخص ليس ضمن النخبة.",
                message
            );
            return;
        }

        configService.updateConfig({
            allowedNumbers: updated,
        });

        await Chisato.sendText(
            from,
            `✅ تمت إزالة @${number} من النخبة.`,
            message,
            { mentions: [target] }
        );
    },
} satisfies ConfigCommands;
