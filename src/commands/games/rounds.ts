import type { ConfigCommands } from "../../types/structure/commands";
import { setEventRounds } from "../../libs/games/event-manager";

export default {
    name: "rounds",
    alias: ["الجولات"],
    category: "games",
    description: "تحديد عدد الجولات",
    cooldown: 3,
    isOwner: true,
    isGroup: true,

    async run({ Chisato, from, arg }) {
        await setEventRounds(Chisato, from, arg);
    },
} satisfies ConfigCommands;
