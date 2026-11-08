import type { ConfigCommands } from "../../types/structure/commands";
import { databaseService } from "../../infrastructure/database/database.service";

export default {
    name: "الاغنياء",
    alias: ["rich", "richest", "topaura"],
    category: "general",
    description: "عرض أغنى 10 أعضاء في المجموعة حسب رصيد Aura",
    cooldown: 10,
    isGroup: true,

    async run({ Chisato, from, message }) {
        try {
            const db = databaseService.getPrismaClient();

            const users = await db.groupAura.findMany({
                where: {
                    groupId: from,
                },
                orderBy: {
                    aura: "desc",
                },
                take: 10,
            });

            if (users.length === 0) {
                return Chisato.sendText(
                    from,
                    "💎 لا يوجد أعضاء لديهم رصيد Aura حتى الآن!",
                    message
                );
            }

            const mentions: string[] = [];

            let text = `「 💰 أغنياء المملكة 」\n\n`;
            text += `🏆 أفضل ${users.length} أعضاء حسب رصيد Aura:\n\n`;

            users.forEach((user, index) => {
                const position = index + 1;

                let medal = `${position}.`;
                if (position === 1) medal = "🥇";
                else if (position === 2) medal = "🥈";
                else if (position === 3) medal = "🥉";

                mentions.push(user.userId);

                text += `${medal} @${user.userId.split("@")[0]}\n`;
                text += `   💎 ${user.aura.toLocaleString()} Aura\n\n`;
            });

            await Chisato.sendText(from, text, message, { mentions });
        } catch (error) {
            Chisato.logger.error("Aura leaderboard error:", error);

            await Chisato.sendText(
                from,
                "حدث خطأ أثناء جلب قائمة الأغنياء. حاول مرة أخرى.",
                message
            );
        }
    },
} satisfies ConfigCommands;
