import type { ConfigCommands } from "../../types/structure/commands";
import { selectFlagsGame } from "../../libs/games/event-manager";

export default {
    name: "flags",
    alias: ["دول", "أعلام"],
    category: "games",
    description: "اختيار لعبة أعلام الدول",
    cooldown: 3,
    isOwner: true,
    isGroup: true,

    async run({ Chisato, from }) {
        await selectFlagsGame(Chisato, from);
    },
} satisfies ConfigCommands;
