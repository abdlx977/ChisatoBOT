
import type { ConfigCommands } from "../../types/structure/commands";
import {
    getLevelInfo,
    getRankInfo,
    generateProgressBar,
} from "../../utils/leveling";

const rankArabic = (level: number): string => {
    if (level >= 100) return "أسطوري";
    if (level >= 80) return "خرافي";
    if (level >= 60) return "ماستر";
    if (level >= 40) return "خبير";
    if (level >= 25) return "متقدم";
    if (level >= 15) return "متوسط";
    if (level >= 5) return "مبتدئ";
    return "مبتدئ جداً";
};

const roleArabic = (role: string): string => {
    const roles: Record<string, string> = {
        owner: "مالك البوت",
        premium: "مميز",
        free: "عادي",
        user: "مستخدم",
    };
    return roles[role] || role || "مستخدم";
};

export default {
    name: "me",
    alias: ["myprofile", "myinfo", "ملفي"],
    usage: "ملفي أو ملفي مع منشن أو بالرد على رسالة",
    category: "general",
    description: "عرض الملف الشخصي",

    async run({
        Chisato,
        sender,
        isOwner,
        from,
        message,
        userMetadata,
        groupSettingData,
        isGroup,
        Database,
        groupParticipants,
    }) {
        try {
            // تحديد صاحب الملف: منشن، ثم رد، ثم المرسل نفسه
            const target =
                message.mentions?.[0] ||
                message.quoted?.sender ||
                sender;

            const isOwnProfile = target === sender;

            // جلب بيانات الشخص المطلوب
            let targetData: any = isOwnProfile
                ? userMetadata
                : await Database.User.get(target);

            const participant = groupParticipants?.find(
                (p: any) =>
                    p.phoneNumber === target ||
                    p.id === target ||
                    p.jid === target
            );

            const targetName =
                targetData?.name ||
                participant?.notify ||
                participant?.name ||
                (isOwnProfile ? message.pushName : "مستخدم");

            // إنشاء سجل افتراضي إذا لم يكن لديه ملف سابق
            if (!targetData) {
                targetData = await Database.User.upsert(
                    Chisato,
                    target,
                    targetName
                );
            }

            if (!targetData) {
                await Chisato.sendText(
                    from,
                    "❌ تعذر العثور على بيانات هذا المستخدم.",
                    message
                );
                return;
            }

            const fetchStatus = await Chisato
                .fetchStatus(target)
                .catch(() => null);

            const level = targetData.level?.level || 1;
            const xp = targetData.level?.xp || 0;
            const totalXp = targetData.level?.totalXp || 0;

            const levelInfo = getLevelInfo(level, xp, totalXp);
            const rank = getRankInfo(level);
            const isPremium = targetData.role === "premium";

            const number = target
                .split("@")[0]
                .replace(/\D/g, "");

            let caption = "";
            caption += "╭━━━〔 👤 الملف الشخصي 〕━━━╮\n";
            caption += `┃ ✦ الاسم: ${targetName}\n`;
            caption += `┃ ✦ الرقم: ${number}\n`;
            caption += `┃ ✦ الحالة: ${fetchStatus?.status || "غير متوفرة"}\n`;
            caption += `┃ ✦ الرتبة: ${roleArabic(targetData.role)}\n`;
            caption += `┃ ✦ الحد اليومي: ${
                targetData.role === "premium" ||
                targetData.role === "owner" ||
                isOwner && isOwnProfile
                    ? "غير محدود"
                    : targetData.limit ?? 0
            }\n`;

            if (isPremium) {
                caption += "┃ ⭐ عضو مميز\n";
            }

            if (isGroup && groupSettingData) {
                caption += `┃ ✦ الحظر: ${
                    groupSettingData.banned?.includes(target)
                        ? "محظور"
                        : "غير محظور"
                }\n`;
            }

            caption += "╰━━━━━━━━━━━━━━━━━━━━╯\n\n";

            caption += "╭━━━〔 ⭐ المستوى والخبرة 〕━━━╮\n";
            caption += `┃ ✦ المستوى: ${level}\n`;
            caption += `┃ ✦ الرتبة: ${rankArabic(level)} ${rank.emoji}\n`;
            caption += `┃ ✦ الخبرة: ${xp} / ${levelInfo.xpNeeded}\n`;
            caption += `┃ ✦ الخبرة الكلية: ${totalXp.toLocaleString("ar")}\n`;

            const progress = Math.min(
                100,
                Math.max(0, (xp / levelInfo.xpNeeded) * 100)
            );

            caption += `┃ ✦ التقدم: ${generateProgressBar(progress, 10)} ${Math.floor(progress)}%\n`;
            caption += "╰━━━━━━━━━━━━━━━━━━━━╯\n\n";

            const stats = targetData.stats;

            caption += "╭━━━〔 📊 الإحصائيات 〕━━━╮\n";
            caption += `┃ ✦ إجمالي الأوامر: ${stats?.totalCommands || 0}\n`;
            caption += `┃ ✦ تاريخ الانضمام: ${
                stats?.joinedAt
                    ? new Date(stats.joinedAt * 1000).toLocaleDateString("ar")
                    : "غير معروف"
            }\n`;

            if (stats?.commandsUsed?.length) {
                const sortedCommands = [...stats.commandsUsed]
                    .sort((a: any, b: any) => b.count - a.count)
                    .slice(0, 3);

                caption += "┃\n┃ 🏆 أكثر الأوامر استخداماً:\n";

                sortedCommands.forEach((cmd: any, index: number) => {
                    caption += `┃ ${index + 1}. ${cmd.command} — ${cmd.count} مرة\n`;
                });
            }

            caption += "╰━━━━━━━━━━━━━━━━━━━━╯\n\n";
            caption += "❄️ استمر باستخدام البوت لزيادة مستواك وخبرتك!\n";
            caption += "_Lucilfer.Bot_";

            try {
                const profile = await Chisato.profilePictureUrl(
                    target,
                    "image"
                );
                await Chisato.sendImage(from, profile, caption, message);
            } catch {
                await Chisato.sendText(from, caption, message);
            }
        } catch (error) {
            Chisato.logger.error("Profile command error:", error);
            await Chisato.sendText(
                from,
                "❌ حدث خطأ أثناء جلب الملف الشخصي. حاول مرة أخرى.",
                message
            );
        }
    },
} satisfies ConfigCommands;
