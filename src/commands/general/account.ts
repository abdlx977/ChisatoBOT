
import type { ConfigCommands } from "../../types/structure/commands";
import { databaseService } from "../../infrastructure/database/database.service";

export default {
    name: "الحساب",
    alias: ["account", "aura"],
    category: "general",
    usage: "[@mention أو رد على رسالة]",
    description: "عرض حساب Aura ومقتنيات العضو",
    cooldown: 5,
    isGroup: true,

    async run({ Chisato, from, sender, message }) {
        try {
            const targetUser =
                message.mentions?.[0] ||
                message.quoted?.sender ||
                sender;

            const db = databaseService.getPrismaClient();

            const account = await db.groupAura.upsert({
                where: {
                    groupId_userId: {
                        groupId: from,
                        userId: targetUser,
                    },
                },
                create: {
                    groupId: from,
                    userId: targetUser,
                },
                update: {},
            });

            const rankNames: Record<string, string> = {
                pawn: "بيدق",
                king: "ملك المملكة",
                uncrowned: "الملك غير المتوج",
                guardian: "حارس القلعة",
                tactical: "الفارس",
                council: "الفيل",
            };

            const name =
                targetUser === sender
                    ? message.pushName
                    : await Chisato.getName(targetUser).catch(
                          () => targetUser.split("@")[0]
                      );

            const text =
                `「 🏛️ الحساب 」\n\n` +
                `👤 العضو: ${name}\n` +
                `💎 رصيد Aura: ${account.aura}\n` +
                `👑 الرتبة: ${rankNames[account.rank] || account.rank}\n` +
                `📜 اللقب: ${account.title || "لا يوجد"}\n\n` +
                `⚔️ السلاح: ${account.weapon || "لا يوجد"}\n` +
                `🛡️ الدرع: ${account.armor || "لا يوجد"}\n` +
                `🔰 الحماية: ${account.protection || "لا يوجد"}`;

            await Chisato.sendText(from, text, message);
        } catch (error) {
            Chisato.logger.error("Aura account error:", error);
            await Chisato.sendText(
                from,
                "حدث خطأ أثناء جلب الحساب. حاول مرة أخرى.",
                message
            );
        }
    },
} satisfies ConfigCommands;
