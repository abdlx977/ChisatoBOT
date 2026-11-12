
import type { ConfigCommands } from "../../types/structure/commands";
import { selectScrambleGame } from "../../libs/games/event-manager";

export default {
    name: "scramble",
    alias: ["رتب"],
    category: "games",
    description: "اختيار لعبة ترتيب الحروف",
    cooldown: 3,
    isOwner: true,
    isGroup: true,

    async run({ Chisato, from }) {
        await selectScrambleGame(Chisato, from);
    },
} satisfies ConfigCommands;
