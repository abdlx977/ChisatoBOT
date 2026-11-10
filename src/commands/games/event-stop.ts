
import type { ConfigCommands } from "../../types/structure/commands";
import { stopEvent } from "../../libs/games/event-manager";

export default {
    name: "event-stop",
    alias: ["انهاء", "إنهاء"],
    category: "games",
    description: "إنهاء الفعالية",
    cooldown: 3,
    isOwner: true,
    isGroup: true,

    async run({ Chisato, from }) {
        await stopEvent(Chisato, from);
    },
} satisfies ConfigCommands;
