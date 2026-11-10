
import type { ConfigCommands } from "../../types/structure/commands";
import { startWritingEvent } from "../../libs/games/event-manager";

export default {
    name: "writing",
    alias: ["كتابة"],
    category: "games",
    description: "بدء تحدي الكتابة",
    cooldown: 5,
    isOwner: true,
    isGroup: true,

    async run({ Chisato, from, message }) {
        await startWritingEvent(Chisato, from, message);
    },
} satisfies ConfigCommands;
