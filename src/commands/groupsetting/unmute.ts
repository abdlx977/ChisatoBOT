import type { ConfigCommands } from "../../types/structure/commands";

export default {
    name: "unmute",
    alias: ["فتح", "unmutebot"],
    category: "group setting",
    description: "فتح المجموعة والسماح للجميع بالكتابة",
    isGroup: true,
    isGroupAdmin: true,
    isBotAdmin: true,

    async run({ Chisato, from, message, groupMetadata }) {
        if (!groupMetadata?.announce) {
            return Chisato.sendText(
                from,
                "🔓 المجموعة مفتوحة بالفعل، الجميع يستطيعون الكتابة.",
                message
            );
        }

        await Chisato.groupSettingUpdate(from, "not_announcement");

        await Chisato.sendText(
            from,
            "🔓 *تم فتح المجموعة!*\n\nأصبح بإمكان جميع الأعضاء إرسال الرسائل.",
            message
        );
    },
} satisfies ConfigCommands;
