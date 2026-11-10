import type { ConfigCommands } from "../../types/structure/commands";
import { showEventGames } from "../../libs/games/event-manager";

export default {
    name: "games",
    alias: ["العاب", "ألعاب"],
    category: "games",
    description: "عرض الألعاب المتاحة",
    cooldown: 3,
    isOwner: true,
    isGroup: true,

    async run({ Chisato, from }) {
        await showEventGames(Chisato, from);
    },
} satisfies ConfigCommands;
