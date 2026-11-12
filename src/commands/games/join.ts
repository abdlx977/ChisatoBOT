
import type { ConfigCommands } from "../../types/structure/commands";
import { selectJoinGame } from "../../libs/games/event-manager";

export default {
    name: "join",
    alias: ["جمع"],
    category: "games",
    description: "اختيار لعبة جمع الحروف",
    cooldown: 3,
    isOwner: true,
    isGroup: true,

    async run({ Chisato, from }) {
        await selectJoinGame(Chisato, from);
    },
} satisfies ConfigCommands;
