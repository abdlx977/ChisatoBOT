
import { databaseService } from "../../infrastructure/database/database.service";

type EventSetup = {
    step: "games" | "game" | "rounds";
    selectedGame?: "writing" | "flags";
    owner: string;
};

type FlagQuestion = {
    country: string;
    code: string;
    aliases: string[];
};

const eventSetups = new Map<string, EventSetup>();
type ActiveEvent = {
    game?: "writing" | "flags";
    round: number;
    total: number;
    seconds: number;
    answer: string;
    acceptedAnswers?: string[];
    imageUrl?: string;
    characters: string[];
    flags?: FlagQuestion[];
    scores: Map<string, number>;
    timer: ReturnType<typeof setTimeout> | null;
    answered: boolean;
};
    

const activeEvents = new Map<string, ActiveEvent>();

export async function startWritingEvent(
    Chisato: any,
    from: string,
    message: any,
    total: number
) {
    if (activeEvents.has(from)) {
        await Chisato.sendText(from, "⚠️ توجد فعالية جارية بالفعل.", message);
        return;
    }

    const roundCount = Math.max(
        1,
        Math.min(Math.floor(total), CHARACTERS.length)
    );

    const event: ActiveEvent = {
        round: 1,
        total: roundCount,
        seconds: 8,
        answer: "",
        characters: shuffle(CHARACTERS).slice(0, roundCount),
        scores: new Map(),
        timer: null,
        answered: false,
    };

    eventSetups.delete(from);
    activeEvents.set(from, event);

    await Chisato.sendText(
        from,
        `🎉 *بدأ تحدي الكتابة!*\n` +
        `أسرع شخص يكتب اسم الشخصية يفوز.\n` +
        `💎 كل فوز = ${REWARD} AURA\n` +
        `🏁 عدد الجولات: ${event.total}\n` +
        `⏱️ مدة الجولة: ${event.seconds} ثوانٍ`
    );

    await nextRound(Chisato, from, event);
}
export async function beginEventSetup(Chisato: any, from: string, owner: string) {
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
        "🎮 *الألعاب المتاحة:*\n\n✍️ الكتابة\n🏳️ أعلام الدول\n\nاكتب:\n.كتابة أو .دول"
    );
}
    }

    setup.step = "game";
    await Chisato.sendText(
        from,
        "🎮 *الألعاب المتاحة:*\n\n✍️ الكتابة\n\nاكتب:\n.كتابة"
    );
}

export async function selectWritingGame(Chisato: any, from: string) {
    const setup = eventSetups.get(from);

    if (!setup || setup.step !== "game") {
        await Chisato.sendText(from, "اكتب .فعالية ثم .العاب أولاً.");
        return;
    }

    setup.step = "rounds";
    setup.selectedGame = "writing";

    await Chisato.sendText(
        from,
        "✍️ تم اختيار لعبة الكتابة.\n\nاختر عدد الجولات:\n\n1️⃣ — 10 جولات\n2️⃣ — 20 جولة\n3️⃣ — 30 جولة\n\nأرسل الرقم فقط."
    );
}

export async function selectFlagsGame(Chisato: any, from: string) {
    const setup = eventSetups.get(from);

    if (!setup || setup.step !== "game") {
        await Chisato.sendText(from, "اكتب .فعالية ثم .العاب أولاً.");
        return;
    }

    setup.step = "rounds";
    setup.selectedGame = "flags";

    await Chisato.sendText(
        from,
        "🏳️ تم اختيار لعبة أعلام الدول.\n\nاختر عدد الجولات:\n\n1️⃣ — 10 جولات\n2️⃣ — 20 جولة\n3️⃣ — 30 جولة\n\nأرسل الرقم فقط."
    );
        }
    const setup = eventSetups.get(from);

    if (!setup || setup.step !== "rounds" || setup.selectedGame !== "writing") {
        await Chisato.sendText(from, "ابدأ أولاً بالترتيب: .فعالية ثم .العاب ثم .كتابة");
        return;
    }

    const total = Number(arg);

    if (!Number.isInteger(total) || total < 1 || total > CHARACTERS.length) {
        await Chisato.sendText(
            from,
            `⚠️ أدخل عددًا صحيحًا من 1 إلى ${CHARACTERS.length}.\nمثال: .الجولات 30`
        );
        return;
    }

    await startWritingEvent(Chisato, from, undefined, total);
}
const REWARD = 100;

const CHARACTERS = [
    // دراغون بول
    "غوكو", "فيجيتا", "غوهان", "بيكولو", "ترانكس",
    "فريزا", "سيل", "برولي", "غوتين", "كريلين",

    // ون بيس
    "لوفي", "زورو", "نامي", "سانجي", "اوسوب",
    "تشوبر", "روبين", "فرانكي", "بروك", "شانكس",
    "ايس", "لاو", "كايدو", "سابو", "دوفلامينغو",

    // ناروتو
    "ناروتو", "ساسكي", "ساكورا", "كاكاشي", "ايتاتشي",
    "اوبيتو", "مادارا", "ميناتو", "هيناتا", "غارا",
    "جيرايا", "تسونادي", "شيكامارو", "باين", "روك لي",

    // قاتل الشياطين
    "تانجيرو", "نيزوكو", "زينيتسو", "اينوسكي", "غيو",
    "شينوبو", "رينغوكو", "تينغن", "موزان", "اكازا",
    "دوما", "كوكوشيبو", "ميتسوري", "اوباناي", "غيومي",

    // ديث نوت
    "لايت", "ال", "ريوك", "ميسا", "نير",
    "ميلو", "ريم", "ماتسودا",

    // سولو ليفلينغ
    "سونغ جين وو", "تشا هاي ان", "يو جين هو",
    "ايغريس", "بيرو", "بلود", "غو غون هوي",

    // بلو لوك
    "ايساغي", "رين", "ناغي", "باچيرا", "بارو",
    "تشيغيري", "ريو", "ساي", "كايسر", "لوك",

    // فينلاند ساغا
    "ثورفين", "اسكيلاد", "كانوت", "ثورز",
    "ثوركيل", "ليف", "اينار",

    // هجوم العمالقة
    "ايرين", "ميكاسا", "ارمين", "ليفاي", "ايروين",
    "هانجي", "راينر", "آني", "زيك", "هيستوريا",
    "جان", "كوني", "ساشا",

    // هنتر x هنتر
    "غون", "كيلوا", "كورابيكا", "ليوريو", "هيسوكا",
    "كرولو", "ماتشي", "ايلومي", "نيتيرو", "ميرويم",
    "كوموغي", "كايت",

    // جوجوتسو كايسن
    "يوجي", "غوجو", "ميغومي", "نوبارا", "سوكونا",
    "غيتو", "يوتا", "توجي", "نانامي", "ماكي",
    "تشيoso", "ماهito",

    // مونستر
    "تينما", "يوهان", "نينا", "لونغه", "غريمر",
    "إيفا", "روبرتو",

    // بليتش
    "ايشيغو", "روكيا", "اوريهيمي", "اوريـو",
    "بياكويا", "كينباتشي", "ايزن", "يورويتشي",
    "توشيرو", "رينجي",

    // أكاديمية بطلي
    "ديكو", "باكوغو", "تودوروكي", "اول مايت",
    "شيغاراكي", "دابي", "اوراراكا", "ايزاوا",
    "هوكس", "انديفور",

    // بلاك كلوفر
    "استا", "يونو", "نويل", "يامي", "يوليوس",
    "نيرو", "فانيكا", "زاغريد",
    // جينتاما
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

function shuffle<T>(items: T[]): T[] {
    const result = [...items];

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
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

    event.answer = event.characters[event.round - 1];
    event.answered = false;

    await Chisato.sendText(
        from,
        `✦ 『 ✍️ تحدي الكتابة 』 ✦\n\n` +
        `📝 اكتب اسم الشخصية التالية:\n\n` +
        `🌟 *${event.answer}*\n\n` +
        `🏁 الجولة ${event.round}/${event.total}\n` +
        `⏱️ الوقت: ${event.seconds} ثوانٍ\n` +
        `💎 الجائزة: ${REWARD} AURA\n` +
        `━━━━━━━━━━━━━━━`
    );

    if (event.timer) clearTimeout(event.timer);

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

if (setup?.step === "rounds" && setup.selectedGame === "writing") {
    if (sender !== setup.owner) return false;

    const choices: Record<string, number> = {
        "1": 10,
        "2": 20,
        "3": 30,
    };

    const selected = choices[body.trim()];

    if (!selected) return false;

    await startWritingEvent(Chisato, from, undefined, selected);
    return true;
}
    const event = activeEvents.get(from);

    if (!event || !body || body.startsWith(".")) return false;
    if (event.answered) return false;

    if (normalize(body) !== normalize(event.answer)) return false;

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
            `📝 الشخصية: *${event.answer}*\n` +
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
