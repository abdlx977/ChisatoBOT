
import type { ConfigCommands } from "../../types/structure/commands";
import { Database } from "../../infrastructure/database/database.service";
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

        const number = String(resolved)
            .split("@")[0]
            .replace(/\D/g, "");

        if (!number) {
            await Chisato.sendText(from, "❌ تعذر تحديد رقم الشخص.", message);
            return;
        }

        try {
            const result = await Database.nobleMember.deleteMany({
                where: { phoneNumber: number },
            });

            if (result.count === 0) {
                await Chisato.sendText(
                    from,
                    "ℹ️ هذا الشخص ليس ضمن النخبة.",
                    message
                );
                return;
            }

            await Chisato.sendText(
                from,
                `✅ تمت إزالة @${number} من النخبة.`,
                message,
                { mentions: [target] }
            );
        } catch (error) {
            await Chisato.sendText(
                from,
                "❌ حدث خطأ أثناء إزالة العضو. حاول مرة أخرى.",
                message
            );
        }
    },
} satisfies ConfigCommands;
