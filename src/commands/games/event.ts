import type { ConfigCommands } from "../../types/structure/commands";
import { beginEventSetup } from "../../libs/games/event-manager";

export default {
    name: "event",
    alias: ["فعالية"],
    category: "games",
    description: "بدء إعداد فعالية",
    cooldown: 3,
    isOwner: true,
    isGroup: true,

    async run({ Chisato, from }) {
        await beginEventSetup(Chisato, from);
    },
} satisfies ConfigCommands;
