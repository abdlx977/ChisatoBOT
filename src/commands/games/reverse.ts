
import type { ConfigCommands } from "../../types/structure/commands";
import { selectReverseGame } from "../../libs/games/event-manager";

export default {
    name: "reverse",
    alias: ["عكس"],
    category: "games",
    description: "اختيار لعبة عكس الحروف",
    cooldown: 3,
    isOwner: true,
    isGroup: true,

    async run({ Chisato, from }) {
        await selectReverseGame(Chisato, from);
    },
} satisfies ConfigCommands;
