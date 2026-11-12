import type { ConfigCommands } from "../../types/structure/commands";

export default {
    name: "mute",
    alias: ["كتم", "mutebot"],
    category: "group setting",
    description: "كتم المجموعة والسماح للمشرفين فقط بالكتابة",
    isGroup: true,
    isGroupAdmin: true,
    isBotAdmin: true,

    async run({ Chisato, from, message, groupMetadata }) {
        if (groupMetadata?.announce) {
            return Chisato.sendText(
                from,
                "🔒 المجموعة مكتومة بالفعل، المشرفون فقط يستطيعون الكتابة.",
                message
            );
        }

        await Chisato.groupSettingUpdate(from, "announcement");

        await Chisato.sendText(
            from,
            "🔒 *تم كتم المجموعة!*\n\nالمشرفون فقط يستطيعون إرسال الرسائل الآن.",
            message
        );
    },
} satisfies ConfigCommands;
