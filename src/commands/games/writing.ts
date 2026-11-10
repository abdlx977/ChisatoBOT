import type { ConfigCommands } from "../../types/structure/commands";
import { selectWritingGame } from "../../libs/games/event-manager";

export default {
    name: "writing",
    alias: ["كتابة"],
    category: "games",
    description: "اختيار لعبة الكتابة",
    cooldown: 3,
    isOwner: true,
    isGroup: true,

    async run({ Chisato, from }) {
        await selectWritingGame(Chisato, from);
    },
} satisfies ConfigCommands;
