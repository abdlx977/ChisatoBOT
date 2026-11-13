
import { databaseService } from "../../infrastructure/database/database.service";
import { createImageQuestion } from "./image-question";

type GameType =
    | "writing"
    | "flags"
    | "decompose"
    | "join"
    | "reverse"
    | "scramble"
    | "characters"
    | "eyes"
    | "random";

type PlayableGame = Exclude<GameType, "random">;

type EventSetup = {
    step: "games" | "game" | "rounds";
    selectedGame?: GameType;
    owner: string;
};

type FlagQuestion = {
    country: string;
    code: string;
    aliases: string[];
};

type Question = {
    game: PlayableGame;
    answer: string;
    acceptedAnswers: string[];
    prompt: string;
    imageUrl?: string;
};

type ActiveEvent = {
    game: GameType;
    questions: Question[];
    round: number;
    total: number;
    seconds: number;
    answer: string;
    acceptedAnswers: string[];
    currentGame: PlayableGame;
    scores: Map<string, number>;
    timer: ReturnType<typeof setTimeout> | null;
    answered: boolean;
};

const eventSetups = new Map<string, EventSetup>();
const activeEvents = new Map<string, ActiveEvent>();

const REWARD = 100;

const CHARACTERS = [
    "غوكو", "فيجيتا", "غوهان", "بيكولو", "ترانكس",
    "فريزا", "سيل", "برولي", "غوتين", "كريلين",
    "لوفي", "زورو", "نامي", "سانجي", "اوسوب",
    "تشوبر", "روبين", "فرانكي", "بروك", "شانكس",
    "ايس", "لاو", "كايدو", "سابو", "دوفلامينغو",
    "ناروتو", "ساسكي", "ساكورا", "كاكاشي", "ايتاتشي",
    "اوبيتو", "مادارا", "ميناتو", "هيناتا", "غارا",
    "جيرايا", "تسونادي", "شيكامارو", "باين", "روك لي",
    "تانجيرو", "نيزوكو", "زينيتسو", "اينوسكي", "غيو",
    "شينوبو", "رينغوكو", "تينغن", "موزان", "اكازا",
    "دوما", "كوكوشيبو", "ميتسوري", "اوباناي", "غيومي",
    "لايت", "ال", "ريوك", "ميسا", "نير",
    "ميلو", "ريم", "ماتسودا",
    "سونغ جين وو", "تشا هاي ان", "يو جين هو",
    "ايغريس", "بيرو", "بلود", "غو غون هوي",
    "ايساغي", "رين", "ناغي", "باچيرا", "بارو",
    "تشيغيري", "ريو", "ساي", "كايسر", "لوك",
    "ثورفين", "اسكيلاد", "كانوت", "ثورز",
    "ثوركيل", "ليف", "اينار",
    "ايرين", "ميكاسا", "ارمين", "ليفاي", "ايروين",
    "هانجي", "راينر", "آني", "زيك", "هيستوريا",
    "جان", "كوني", "ساشا",
    "غون", "كيلوا", "كورابيكا", "ليوريو", "هيسوكا",
    "كرولو", "ماتشي", "ايلومي", "نيتيرو", "ميرويم",
    "كوموغي", "كايت",
    "يوجي", "غوجو", "ميغومي", "نوبارا", "سوكونا",
    "غيتو", "يوتا", "توجي", "نانامي", "ماكي",
    "تشوسو", "ماهيتو",
    "تينما", "يوهان", "نينا", "لونغه", "غريمر",
    "ايشيغو", "روكيا", "اوريهيمي", "اوريـو",
    "بياكويا", "كينباتشي", "ايزن", "يورويتشي",
    "توشيرو", "رينجي",
    "ديكو", "باكوغو", "تودوروكي", "اول مايت",
    "شيغاراكي", "دابي", "اوراراكا", "ايزاوا",
    "هوكس", "انديفور",
    "استا", "يونو", "نويل", "يامي", "يوليوس",
    "غينتوكي", "كاغورا", "شينباتشي",
    "تاكاسوجي", "كاموي", "كاتسورا",
    "هيجيكاتا", "أوكيتا", "كوندو",
    "ساروتوبي", "تسوكويو", "ساكاموتو",
];

const FLAG_QUESTIONS: FlagQuestion[] = [
    { country: "سوريا", code: "sy", aliases: ["سوريا", "الجمهورية العربية السورية"] },
    { country: "الأردن", code: "jo", aliases: ["الأردن", "اردن"] },
    { country: "السعودية", code: "sa", aliases: ["السعودية", "المملكة العربية السعودية"] },
    { country: "فلسطين", code: "ps", aliases: ["فلسطين"] },
    { country: "مصر", code: "eg", aliases: ["مصر"] },
    { country: "العراق", code: "iq", aliases: ["العراق"] },
    { country: "لبنان", code: "lb", aliases: ["لبنان"] },
    { country: "الإمارات", code: "ae", aliases: ["الإمارات", "الامارات", "الإمارات العربية المتحدة"] },
    { country: "قطر", code: "qa", aliases: ["قطر"] },
    { country: "الكويت", code: "kw", aliases: ["الكويت"] },
    { country: "البحرين", code: "bh", aliases: ["البحرين"] },
    { country: "عُمان", code: "om", aliases: ["عمان"] },
    { country: "اليمن", code: "ye", aliases: ["اليمن"] },
    { country: "تركيا", code: "tr", aliases: ["تركيا"] },
    { country: "ألمانيا", code: "de", aliases: ["ألمانيا", "المانيا"] },
    { country: "فرنسا", code: "fr", aliases: ["فرنسا"] },
    { country: "إيطاليا", code: "it", aliases: ["إيطاليا", "ايطاليا"] },
    { country: "إسبانيا", code: "es", aliases: ["إسبانيا", "اسبانيا"] },
    { country: "المملكة المتحدة", code: "gb", aliases: ["بريطانيا", "المملكة المتحدة", "انجلترا", "إنجلترا"] },
    { country: "الولايات المتحدة", code: "us", aliases: ["أمريكا", "امريكا", "الولايات المتحدة"] },
    { country: "كندا", code: "ca", aliases: ["كندا"] },
    { country: "البرازيل", code: "br", aliases: ["البرازيل"] },
    { country: "الأرجنتين", code: "ar", aliases: ["الأرجنتين", "الارجنتين"] },
    { country: "اليابان", code: "jp", aliases: ["اليابان"] },
    { country: "الصين", code: "cn", aliases: ["الصين"] },
    { country: "كوريا الجنوبية", code: "kr", aliases: ["كوريا الجنوبية"] },
    { country: "الهند", code: "in", aliases: ["الهند"] },
    { country: "روسيا", code: "ru", aliases: ["روسيا"] },
    { country: "المغرب", code: "ma", aliases: ["المغرب"] },
    { country: "الجزائر", code: "dz", aliases: ["الجزائر"] },
    { country: "تونس", code: "tn", aliases: ["تونس"] },
    { country: "ليبيا", code: "ly", aliases: ["ليبيا"] },
    { country: "السودان", code: "sd", aliases: ["السودان"] },
    { country: "أستراليا", code: "au", aliases: ["أستراليا", "استراليا"] },
    { country: "المكسيك", code: "mx", aliases: ["المكسيك"] },
    { country: "البرتغال", code: "pt", aliases: ["البرتغال"] },
    { country: "هولندا", code: "nl", aliases: ["هولندا"] },
    { country: "السويد", code: "se", aliases: ["السويد"] },
    { country: "النرويج", code: "no", aliases: ["النرويج"] },
    { country: "سويسرا", code: "ch", aliases: ["سويسرا"] },
];

function normalize(value: string): string {
    return value
        .toLowerCase()
        .replace(/[ً-ْ]/g, "")
        .replace(/[أإآ]/g, "ا")
        .replace(/ة/g, "ه")
        .replace(/[ـ\s\-_]/g, "")
        .trim();
}

function normalizeDecomposed(value: string): string {
    return value
        .toLowerCase()
        .replace(/[ً-ْ]/g, "")
        .replace(/[أإآ]/g, "ا")
        .replace(/ة/g, "ه")
        .replace(/ـ/g, "")
        .trim()
        .replace(/\s+/g, " ");
}

function shuffle<T>(items: T[]): T[] {
    const result = [...items];

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

const ALL_GAMES: PlayableGame[] = [
    "writing",
    "flags",
    "decompose",
    "join",
    "reverse",
    "scramble",
    "characters",
    "eyes",
];

function makeQuestion(game: PlayableGame): Question {
    if (game === "flags") {
        const flag = FLAG_QUESTIONS[
            Math.floor(Math.random() * FLAG_QUESTIONS.length)
        ];

        return {
            game,
            answer: flag.country,
            acceptedAnswers: [flag.country, ...flag.aliases].map(normalize),
            prompt: "🏳️ *خمن اسم الدولة!*",
        };
    }

    if (game === "characters" || game === "eyes") {
        return {
            game,
            answer: "",
            acceptedAnswers: [],
            prompt: "",
        };
    }

    const answer = CHARACTERS[
        Math.floor(Math.random() * CHARACTERS.length)
    ];

    const letters = [...answer.replace(/\s/g, "")];

    if (game === "writing") {
        return {
            game,
            answer,
            acceptedAnswers: [normalize(answer)],
            prompt: `✍️ *اكتب اسم الشخصية التالية:*\n\n🌟 *${answer}*`,
        };
    }

    if (game === "decompose") {
        return {
            game,
            answer,
            acceptedAnswers: [normalizeDecomposed(letters.join(" "))],
            prompt: `🔤 *فكّك اسم الشخصية واكتب حروفه مفصولة:*\n\n🌟 *${answer}*`,
        };
    }

    if (game === "join") {
        return {
            game,
            answer,
            acceptedAnswers: [normalize(answer)],
            prompt: `🧩 *اجمع الحروف واكتب اسم الشخصية:*\n\n🌟 *${letters.join(" ")}*`,
        };
    }

    if (game === "reverse") {
        return {
            game,
            answer,
            acceptedAnswers: [normalize(answer)],
            prompt: `🔄 *اكتب الاسم بشكل صحيح بعد عكسه:*\n\n🌟 *${[...answer].reverse().join("")}*`,
        };
    }

    const scrambled = shuffle(letters).join("");

    return {
        game: "scramble",
        answer,
        acceptedAnswers: [normalize(answer)],
        prompt: `🔀 *رتّب الحروف واكتشف اسم الشخصية:*\n\n🌟 *${scrambled}*`,
    };
}

function createQuestions(game: GameType, total: number): Question[] {
    const questions: Question[] = [];
    let randomGames: PlayableGame[] = [];

    for (let i = 0; i < total; i++) {
        if (game === "random") {
            if (randomGames.length === 0) {
                randomGames = shuffle(ALL_GAMES);

                if (
                    questions.length > 0 &&
                    randomGames[randomGames.length - 1].toString() ===
                        questions[questions.length - 1].game
                ) {
                    [randomGames[0], randomGames[randomGames.length - 1]] = [
                        randomGames[randomGames.length - 1],
                        randomGames[0],
                    ];
                }
            }

            questions.push(makeQuestion(randomGames.pop()!));
        } else {
            questions.push(makeQuestion(game));
        }
    }

    return questions;
}

async function startEvent(
    Chisato: any,
    from: string,
    game: GameType,
    total: number
) {
    if (activeEvents.has(from)) {
        await Chisato.sendText(from, "⚠️ توجد فعالية جارية بالفعل.");
        return;
    }

    const maximum = game === "flags" ? FLAG_QUESTIONS.length : 100;
    const roundCount = Math.min(Math.max(Math.floor(total), 1), maximum);

    const event: ActiveEvent = {
        game,
        questions: createQuestions(game, roundCount),
        round: 1,
        total: roundCount,
        seconds: 15,
        answer: "",
        acceptedAnswers: [],
        currentGame: "writing",
        scores: new Map(),
        timer: null,
        answered: false,
    };

    eventSetups.delete(from);
    activeEvents.set(from, event);

    await Chisato.sendText(
        from,
        `🎉 *بدأت الفعالية!*\n\n` +
        `🎮 نوع الفعالية: ${game === "random" ? "عشوائي" : game === "flags" ? "أعلام الدول" : "تحدي الألعاب"}\n` +
        `🏁 عدد الجولات: ${event.total}\n` +
        `⏱️ مدة الجولة: 15 ثانية (الأعلام 30 ثانية)\n` +
        `💎 كل فوز = ${REWARD} AURA`
    );

    await nextRound(Chisato, from, event);
}

export async function startWritingEvent(
    Chisato: any,
    from: string,
    message: any,
    total: number
) {
    await startEvent(Chisato, from, "writing", total);
}

export async function startFlagEvent(
    Chisato: any,
    from: string,
    total: number
) {
    await startEvent(Chisato, from, "flags", total);
}

export async function beginEventSetup(
    Chisato: any,
    from: string,
    owner: string
) {
    if (activeEvents.has(from)) {
        await Chisato.sendText(from, "⚠️ توجد فعالية جارية بالفعل.");
        return;
    }

    eventSetups.set(from, { step: "games", owner });

    await Chisato.sendText(
        from,
        "🎉 *إعداد فعالية جديدة*\n\nاكتب:\n.العاب"
    );
}

export async function showEventGames(Chisato: any, from: string) {
    const setup = eventSetups.get(from);

    if (!setup || setup.step !== "games") {
        await Chisato.sendText(from, "ابدأ أولاً بكتابة .فعالية");
        return;
    }

    setup.step = "game";

    await Chisato.sendText(
        from,
        "🎮 *الألعاب المتاحة:*\n\n" +
        "✍️ الكتابة\n" +
        "🔤 التفكيك\n" +
        "🧩 الجمع\n" +
        "🔄 العكس\n" +
        "🔀 الترتيب\n" +
        "🏳️ أعلام الدول\n" +
        "🖼️ شخصية\n" +
        "👁️ عين\n" +
        "🎲 العشوائي\n\n" +
        "اكتب اسم اللعبة التي تريدها."
    );
}

async function selectGame(
    Chisato: any,
    from: string,
    game: GameType,
    title: string
) {
    const setup = eventSetups.get(from);

    if (!setup || setup.step !== "game") {
        await Chisato.sendText(from, "اكتب .فعالية ثم .العاب أولاً.");
        return;
    }

    setup.step = "rounds";
    setup.selectedGame = game;

    await Chisato.sendText(
        from,
        `🎮 تم اختيار لعبة ${title}.\n\n` +
        `اختر عدد الجولات:\n\n` +
        `1️⃣ — 10 جولات\n` +
        `2️⃣ — 20 جولة\n` +
        `3️⃣ — 30 جولة\n\n` +
        `أرسل الرقم فقط.`
    );
}

export async function selectWritingGame(Chisato: any, from: string) {
    await selectGame(Chisato, from, "writing", "الكتابة");
}

export async function selectFlagsGame(Chisato: any, from: string) {
    await selectGame(Chisato, from, "flags", "أعلام الدول");
}

export async function selectDecomposeGame(Chisato: any, from: string) {
    await selectGame(Chisato, from, "decompose", "التفكيك");
}

export async function selectJoinGame(Chisato: any, from: string) {
    await selectGame(Chisato, from, "join", "الجمع");
}

export async function selectReverseGame(Chisato: any, from: string) {
    await selectGame(Chisato, from, "reverse", "العكس");
}

export async function selectScrambleGame(Chisato: any, from: string) {
    await selectGame(Chisato, from, "scramble", "الترتيب");
}

export async function selectRandomGame(Chisato: any, from: string) {
    await selectGame(Chisato, from, "random", "العشوائي");
}

async function nextRound(
    Chisato: any,
    from: string,
    event: ActiveEvent
) {
    if (event.round > event.total) {
        const entries = [...event.scores.entries()]
            .sort((a, b) => b[1] - a[1]);

        const mentions = entries.map(([id]) => id);

        const ranking = entries
            .map(([id, earned], i) =>
                `${i + 1}. @${id.split("@")[0]} — ${earned.toLocaleString()} AURA`
            )
            .join("\n");

        activeEvents.delete(from);

        await Chisato.sendText(
            from,
            `🏁 *انتهت الفعالية!*\n\n` +
            `🏆 *ترتيب الفائزين:*\n${ranking || "لم يفز أحد هذه المرة."}`,
            undefined,
            { mentions }
        );
        return;
    }

    const question = event.questions[event.round - 1];

    if (!question) return;

    event.currentGame = question.game;
    event.seconds = question.game === "flags" ? 30 : 15;
    event.answer = question.answer;
    event.acceptedAnswers = question.acceptedAnswers;
    event.answered = false;

    if (event.timer) clearTimeout(event.timer);

    if (question.game === "characters" || question.game === "eyes") {
        try {
            const imageQuestion = await createImageQuestion(question.game);

            event.answer = imageQuestion.answer;
            event.acceptedAnswers = imageQuestion.acceptedAnswers;

            const caption =
                `${imageQuestion.prompt}\n\n` +
                `🏁 الجولة ${event.round}/${event.total}\n` +
                `⏱️ الوقت: ${event.seconds} ثانية\n` +
                `💎 الجائزة: ${REWARD} AURA`;

            await Chisato.sendImage(
                from,
                imageQuestion.imageUrl,
                caption
            );
        } catch (error) {
            console.error("Image game error:", error);

            await Chisato.sendText(
                from,
                "⚠️ تعذر جلب صورة لهذه الجولة، سننتقل للجولة التالية."
            );

            event.round++;
            await nextRound(Chisato, from, event);
            return;
        }
    } else if (question.game === "flags") {
        const flag = FLAG_QUESTIONS.find(
            item => item.country === question.answer
        );

        if (!flag) return;

        await Chisato.sendImage(
            from,
            `https://flagcdn.com/w320/${flag.code}.png`,
            `🏳️ *خمن اسم الدولة!*\n\n` +
            `🏁 الجولة ${event.round}/${event.total}\n` +
            `⏱️ الوقت: ${event.seconds} ثانية\n` +
            `💎 الجائزة: ${REWARD} AURA`
        );
    } else {
        const gameNames: Record<string, string> = {
            writing: "الكتابة",
            decompose: "التفكيك",
            join: "الجمع",
            reverse: "العكس",
            scramble: "الترتيب",
        };

        await Chisato.sendText(
            from,
            `✦ 『 🎮 تحدي ${gameNames[question.game]} 』 ✦\n\n` +
            question.prompt +
            `\n\n🏁 الجولة ${event.round}/${event.total}\n` +
            `⏱️ الوقت: ${event.seconds} ثانية\n` +
            `💎 الجائزة: ${REWARD} AURA\n` +
            `━━━━━━━━━━━━━━━`
        );
    }

    event.timer = setTimeout(async () => {
        if (!activeEvents.has(from) || event.answered) return;

        event.answered = true;

        await Chisato.sendText(
            from,
            `⌛ انتهى الوقت!\nالإجابة كانت: *${event.answer}*`
        );

        event.round++;
        await nextRound(Chisato, from, event);
    }, event.seconds * 1000);
}

export async function stopEvent(Chisato: any, from: string) {
    const event = activeEvents.get(from);

    if (!event) {
        await Chisato.sendText(from, "لا توجد فعالية جارية.");
        return;
    }

    if (event.timer) clearTimeout(event.timer);
    activeEvents.delete(from);

    await Chisato.sendText(from, "🛑 تم إنهاء الفعالية.");
}

export async function handleEventMessage(
    Chisato: any,
    from: string,
    sender: string,
    body: string
): Promise<boolean> {
    const setup = eventSetups.get(from);

    if (setup?.step === "game") {
        if (sender !== setup.owner) return false;

        const choice = normalize(body);

        const choices: Record<string, { game: GameType; title: string }> = {
            "كتابه": { game: "writing", title: "الكتابة" },
            "writing": { game: "writing", title: "الكتابة" },
            "تفكيك": { game: "decompose", title: "التفكيك" },
            "decompose": { game: "decompose", title: "التفكيك" },
            "جمع": { game: "join", title: "الجمع" },
            "join": { game: "join", title: "الجمع" },
            "عكس": { game: "reverse", title: "العكس" },
            "reverse": { game: "reverse", title: "العكس" },
            "ترتيب": { game: "scramble", title: "الترتيب" },
            "رتب": { game: "scramble", title: "الترتيب" },
            "scramble": { game: "scramble", title: "الترتيب" },
            "دول": { game: "flags", title: "أعلام الدول" },
            "اعلام": { game: "flags", title: "أعلام الدول" },
            "أعلام": { game: "flags", title: "أعلام الدول" },
            "flags": { game: "flags", title: "أعلام الدول" },
            "شخصيات": { game: "characters", title: "شخصية" },
            "صور": { game: "characters", title: "شخصية" },
            "شخصيه": { game: "characters", title: "شخصية" },
            "characters": { game: "characters", title: "شخصية" },
            "عين": { game: "eyes", title: "عين" },
            "عيون": { game: "eyes", title: "عين" },
            "لعبه العيون": { game: "eyes", title: "عين" },
            "eyes": { game: "eyes", title: "عين" },
            "عشوائي": { game: "random", title: "العشوائي" },
            "random": { game: "random", title: "العشوائي" },
        };

        const selected = choices[choice];

        if (!selected) return false;

        await selectGame(
            Chisato,
            from,
            selected.game,
            selected.title
        );

        return true;
    }

    if (setup?.step === "rounds") {
        if (sender !== setup.owner) return false;

        const choices: Record<string, number> = {
            "1": 10,
            "2": 20,
            "3": 30,
        };

        const selected = choices[body.trim()];

        if (!selected || !setup.selectedGame) return false;

        await startEvent(Chisato, from, setup.selectedGame, selected);
        return true;
    }

    const event = activeEvents.get(from);

    if (!event || !body || body.startsWith(".")) return false;
    if (event.answered) return false;

    const normalizedAnswer =
        event.currentGame === "decompose"
            ? normalizeDecomposed(body)
            : normalize(body);

    if (!event.acceptedAnswers.includes(normalizedAnswer)) {
        return false;
    }

    event.answered = true;

    if (event.timer) clearTimeout(event.timer);

    try {
        const db = databaseService.getPrismaClient();

        const account = await db.groupAura.upsert({
            where: {
                groupId_userId: {
                    groupId: from,
                    userId: sender,
                },
            },
            create: {
                groupId: from,
                userId: sender,
                aura: REWARD,
            },
            update: {
                aura: {
                    increment: REWARD,
                },
            },
        });

        const earned = (event.scores.get(sender) || 0) + REWARD;
        event.scores.set(sender, earned);

        await Chisato.sendText(
            from,
            `🎉 *إجابة صحيحة!*\n` +
            `🏆 الفائز: @${sender.split("@")[0]}\n` +
            `📝 الإجابة: *${event.answer}*\n` +
            `💎 المكافأة: +${REWARD} AURA\n` +
            `💰 رصيدك: ${account.aura.toLocaleString()} AURA`,
            undefined,
            { mentions: [sender] }
        );
    } catch (error) {
        console.error("AURA reward error:", error);

        await Chisato.sendText(
            from,
            "⚠️ تعذرت إضافة المكافأة. لم يتم احتساب الإجابة."
        );

        event.round++;

        event.timer = setTimeout(async () => {
            if (!activeEvents.has(from)) return;
            await nextRound(Chisato, from, event);
        }, 2000);

        return true;
    }

    event.round++;
    await nextRound(Chisato, from, event);

    return true;
}
