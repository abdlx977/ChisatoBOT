
import type { ConfigCommands } from "../../types/structure/commands";
import { selectRandomGame } from "../../libs/games/event-manager";

export default {
    name: "random",
    alias: ["عشوائي"],
    category: "games",
    description: "اختيار ألعاب عشوائية في كل جولة",
    cooldown: 3,
    isOwner: true,
    isGroup: true,

    async run({ Chisato, from }) {
        await selectRandomGame(Chisato, from);
    },
} satisfies ConfigCommands;
