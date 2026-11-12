
import type { ConfigCommands } from "../../types/structure/commands";
import { selectDecomposeGame } from "../../libs/games/event-manager";

export default {
    name: "decompose",
    alias: ["تفكيك"],
    category: "games",
    description: "اختيار لعبة تفكيك الحروف",
    cooldown: 3,
    isOwner: true,
    isGroup: true,

    async run({ Chisato, from }) {
        await selectDecomposeGame(Chisato, from);
    },
} satisfies ConfigCommands;
