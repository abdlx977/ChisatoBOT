
import type { ConfigCommands } from "../../types/structure/commands";
import { Database } from "../../infrastructure/database/database.service";
import { resolveToPnJid } from "../../utils/jid-resolver";

export default {
    name: "add-noble",
    alias: ["اضف"],
    usage: "نخبة @منشن",
    category: "owner",
    description: "إضافة شخص إلى النخبة",
    isOwner: true,
    cooldown: 3,

    async run({ Chisato, args, from, message }) {
        if (args[0] !== "نخبة") {
            await Chisato.sendText(
                from,
                "❌ استخدم الأمر هكذا:\n.اضف نخبة مع منشن الشخص أو بالرد على رسالته",
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
            const existing = await Database.nobleMember.findUnique({
                where: { phoneNumber: number },
            });

            if (existing) {
                await Chisato.sendText(
                    from,
                    "ℹ️ هذا الشخص موجود بالفعل في النخبة.",
                    message
                );
                return;
            }

            await Database.nobleMember.create({
                data: { phoneNumber: number },
            });

            await Chisato.sendText(
                from,
                `✅ تمت إضافة @${number} إلى النخبة بنجاح.`,
                message,
                { mentions: [target] }
            );
        } catch (error) {
            await Chisato.sendText(
                from,
                "❌ حدث خطأ أثناء إضافة العضو. حاول مرة أخرى.",
                message
            );
        }
    },
} satisfies ConfigCommands;
