
import type { ConfigCommands } from "../../types/structure/commands";
import { configService } from "../../core/config/config.service";
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
            await Chisato.sendText(from, "❌ استخدم: .اضف نخبة مع منشن الشخص أو بالرد عليه", message);
            return;
        }

        const target = message.quoted?.sender || message.mentions?.[0];

        if (!target) {
            await Chisato.sendText(from, "⚠️ منشن الشخص أو رد على رسالته أولاً.", message);
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

        if (allowed.some((n) => String(n).replace(/\D/g, "") === number)) {
            await Chisato.sendText(from, "ℹ️ هذا الشخص موجود بالفعل في النخبة.", message);
            return;
        }

        configService.updateConfig({
            allowedNumbers: [...allowed, number],
        });

        await Chisato.sendText(
            from,
            `✅ تمت إضافة @${number} إلى النخبة بنجاح.`,
            message,
            { mentions: [target] }
        );
    },
} satisfies ConfigCommands;
