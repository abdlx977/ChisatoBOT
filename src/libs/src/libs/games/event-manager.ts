
import { databaseService } from "../../infrastructure/database/database.service";

type Question = {
    question: string;
    answers: string[];
};

type ActiveEvent = {
    round: number;
    total: number;
    seconds: number;
    answer: string[];
    questions: Question[];
    scores: Map<string, number>;
    timer: ReturnType<typeof setTimeout> | null;
};

const activeEvents = new Map<string, ActiveEvent>();
const REWARD = 100;

const QUESTIONS: Question[] = [
    // ون بيس
    { question: "من هو قائد قراصنة قبعة القش؟", answers: ["لوفي", "مونكي دي لوفي", "luffy"] },
    { question: "من هو سياف طاقم قبعة القش؟", answers: ["زورو", "رورونوا زورو", "zoro"] },
    { question: "من هي ملاحة طاقم قبعة القش؟", answers: ["نامي", "nami"] },
    { question: "من هو طباخ طاقم قبعة القش؟", answers: ["سانجي", "sanji"] },
    { question: "من هو قناص طاقم قبعة القش؟", answers: ["اوسوب", "يوسوب", "usopp"] },
    { question: "من هو طبيب طاقم قبعة القش؟", answers: ["تشوبر", "توني توني تشوبر", "chopper"] },
    { question: "من هي عالمة الآثار في الطاقم؟", answers: ["روبين", "نيكو روبين", "robin"] },
    { question: "من هو نجار السفينة؟", answers: ["فرانكي", "franky"] },
    { question: "من هو الموسيقي الهيكلي؟", answers: ["بروك", "brook"] },
    { question: "من هو قائد قراصنة الشعر الأحمر؟", answers: ["شانكس", "shanks"] },
    { question: "من هو الجراح المعروف بلقب جراح الموت؟", answers: ["لاو", "ترافالغار لاو", "law"] },
    { question: "من هو والد ايس بالتبني؟", answers: ["اللحية البيضاء", "ايدوارد نيوغيت", "whitebeard"] },
    { question: "من هو ملك القراصنة السابق؟", answers: ["غول دي روجر", "غولد روجر", "روجر", "roger"] },
    { question: "من هو أخ لوفي الذي يحمل فاكهة اللهب؟", answers: ["ايس", "بورتغاس دي ايس", "ace"] },
    { question: "من هو قائد الجيش الثوري؟", answers: ["دراغون", "مونكي دي دراغون", "dragon"] },

    // ناروتو
    { question: "من هو بطل أنمي ناروتو؟", answers: ["ناروتو", "naruto"] },
    { question: "من هو منافس ناروتو وصديقه؟", answers: ["ساسكي", "ساسكي اوتشيها", "sasuke"] },
    { question: "من هو أخ ساسكي الأكبر؟", answers: ["ايتاتشي", "ايتاتشي اوتشيها", "itachi"] },
    { question: "من هو النينجا الناسخ؟", answers: ["كاكاشي", "كاكاشي هاتاكي", "kakashi"] },
    { question: "من هي زميلة ناروتو في الفريق السابع؟", answers: ["ساكورا", "ساكورا هارونو", "sakura"] },
    { question: "من هو نينجا الرمل الذي أصبح كازيكاغي؟", answers: ["غارا", "gaara"] },
    { question: "من هو معلم ناروتو المعروف بالناسك المنحرف؟", answers: ["جيرايا", "jiraiya"] },
    { question: "من هي الهوكاغي الخامسة؟", answers: ["تسونادي", "tsunade"] },
    { question: "من هو النينجا الذي يستخدم تقنيات الظل؟", answers: ["شيكامارو", "شيكامارو نارا", "shikamaru"] },
    { question: "من هي فتاة عشيرة الهيوغا التي تحب ناروتو؟", answers: ["هيناتا", "هيناتا هيوغا", "hinata"] },
    { question: "من هو والد ناروتو والهوكاغي الرابع؟", answers: ["ميناتو", "ميناتو ناميكازي", "minato"] },
    { question: "من هو صديق كاكاشي الذي أصبح الرجل المقنع؟", answers: ["اوبيتو", "اوبيتو اوتشيها", "obito"] },
    { question: "من هو النينجا الذي يتخصص في التايجوتسو؟", answers: ["روك لي", "لي", "rock lee"] },
    { question: "من هو صاحب الرينغان وقائد الأكاتسكي؟", answers: ["ناغاتو", "باين", "nagato", "pain"] },
    { question: "من هو زعيم عشيرة الأوتشيها السابق؟", answers: ["مادارا", "مادارا اوتشيها", "madara"] },

    // هنتر x هنتر
    { question: "من هو بطل هنتر x هنتر؟", answers: ["غون", "غون فريكس", "gon"] },
    { question: "من هو صديق غون ذو الشعر الأبيض؟", answers: ["كيلوا", "كيلوا زولديك", "killua"] },
    { question: "من هو عضو العناكب الذي يبحث عن الانتقام؟", answers: ["كورابيكا", "kurapika"] },
    { question: "من هو الطبيب الذي أصبح صيادًا؟", answers: ["ليوريو", "leorio"] },
    { question: "من هو المقاتل الغامض الذي يحب القتال؟", answers: ["هيسوكا", "hisoka"] },
    { question: "من هو زعيم عصابة العناكب؟", answers: ["كرولو", "كرولو لوسيلفر", "chrollo"] },
    { question: "من هي عضوة العناكب التي تستخدم الخيوط؟", answers: ["ماتشي", "machi"] },
    { question: "من هو أخ كيلوا الذي يستخدم الإبر؟", answers: ["ايلومي", "ايلومي زولديك", "illumi"] },
    { question: "من هو رئيس جمعية الصيادين السابق؟", answers: ["نيتيرو", "اسحاق نيتيرو", "netero"] },
    { question: "من هو ملك النمل الكيميرا؟", answers: ["ميرويم", "meruem"] },
    { question: "من هي الفتاة التي تلعب غونغي مع ميرويم؟", answers: ["كوموغي", "komugi"] },
    { question: "من هو الصياد الذي اعتنى بغون؟", answers: ["كايت", "كايتو", "kite"] },

    // جوجوتسو كايسن
    { question: "من هو بطل جوجوتسو كايسن؟", answers: ["يوجي", "يوجي ايتادوري", "itadori"] },
    { question: "من هو أقوى ساحر جوجوتسو؟", answers: ["غوجو", "ساتورو غوجو", "gojo"] },
    { question: "من هو صاحب تقنية الظلال العشر؟", answers: ["ميغومي", "ميغومي فوشيغورو", "megumi"] },
    { question: "من هي الفتاة التي تستخدم المطرقة والمسامير؟", answers: ["نوبارا", "نوبارا كوغيساكي", "nobara"] },
    { question: "من هو ملك اللعنات؟", answers: ["سوكونا", "ريومن سوكونا", "sukuna"] },
    { question: "من هو الساحر الذي قاد أتباع اللعنات؟", answers: ["غيتو", "سوغورو غيتو", "geto"] },
    { question: "من هو الساحر الذي يمتلك ريكا؟", answers: ["يوتا", "يوتا اوكوتسو", "yuta"] },
    { question: "من هو والد ميغومي؟", answers: ["توجي", "توجي فوشيغورو", "toji"] },
    { question: "من هو الساحر الذي يرتدي النظارات ويستخدم السيف؟", answers: ["نانامي", "كينتو نانامي", "nanami"] },
    { question: "من هي المقاتلة التي تنتمي لعشيرة زينين؟", answers: ["ماكي", "ماكي زينين", "maki"] },

    // هجوم العمالقة
    { question: "من هو بطل هجوم العمالقة؟", answers: ["ايرين", "ايرين ييغر", "eren"] },
    { question: "من هي الفتاة التي تربت مع إيرين؟", answers: ["ميكاسا", "ميكاسا اكرمان", "mikasa"] },
    { question: "من هو صديق إيرين الذي يحب الكتب؟", answers: ["ارمين", "ارمين ارليرت", "armin"] },
    { question: "من هو أقوى جندي في فيلق الاستطلاع؟", answers: ["ليفاي", "ليفاي اكرمان", "levi"] },
    { question: "من هو القائد السابق لفيلق الاستطلاع؟", answers: ["ايروين", "ايروين سميث", "erwin"] },
    { question: "من هي قائدة فيلق الاستطلاع التي تهتم بالعمالقة؟", answers: ["هانجي", "هانجي زوي", "hange"] },
    { question: "من هو المحارب الذي يمتلك العملاق المدرع؟", answers: ["راينر", "راينر براون", "reiner"] },
    { question: "من هي المحاربة التي تمتلك العملاق الأنثى؟", answers: ["اني", "اني ليونهارت", "annie"] },
    { question: "من هو الأخ غير الشقيق لإيرين؟", answers: ["زيك", "زيك ييغر", "zeke"] },
    { question: "ما اسم الملكة التي كانت تُعرف باسم هيستوريا؟", answers: ["هيستوريا", "هيستوريا ريس", "historia"] },

    // ديث نوت
    { question: "من هو الطالب الذي عثر على دفتر الموت؟", answers: ["لايت", "لايت ياغامي", "light"] },
    { question: "من هو المحقق الغامض الذي يطارد كيرا؟", answers: ["ال", "إل", "l"] },
    { question: "من هو الشينيغامي الذي أسقط دفتر الموت؟", answers: ["ريوك", "ryuk"] },
    { question: "من هي الفتاة التي تحب لايت وتمتلك دفتر موت؟", answers: ["ميسا", "ميسا اماني", "misa"] },
    { question: "من هو خليفة إل المعروف بذكائه؟", answers: ["نير", "near"] },
    { question: "من هو المنافس الآخر لنير؟", answers: ["ميلو", "mello"] },
    { question: "من هو والد لايت ويعمل في الشرطة؟", answers: ["سويشيرو", "سويشيرو ياغامي", "soichiro"] },

    // بليتش
    { question: "من هو بطل أنمي بليتش؟", answers: ["ايشيغو", "ايشيغو كوروساكي", "ichigo"] },
    { question: "من هي الشينيغامي التي أعطت إيتشيغو قواها؟", answers: ["روكيا", "روكيا كوتشيكي", "rukia"] },
    { question: "من هي الفتاة التي تحب إيتشيغو؟", answers: ["اوريهيمي", "اوريهيمي اينوي", "orihime"] },
    { question: "من هو صديق إيتشيغو الذي يستخدم القوس؟", answers: ["اوريـو", "اوريـو ايشيدا", "ishida"] },
    { question: "من هو قائد الفرقة السادسة؟", answers: ["بياكويا", "بياكويا كوتشيكي", "byakuya"] },
    { question: "من هو قائد الفرقة الحادية عشرة؟", answers: ["كينباتشي", "كينباتشي زاراكي", "kenpachi"] },
    { question: "من هو القائد السابق الذي خان مجتمع الأرواح؟", answers: ["ايزن", "سوسكي ايزن", "aizen"] },
    { question: "من هي قائدة الفرقة الثانية السابقة؟", answers: ["يورويتشي", "يورويتشي شيهوين", "yoruichi"] },
    { question: "من هو قائد الفرقة العاشرة ذو الشعر الأبيض؟", answers: ["توشيرو", "توشيرو هيتسوغايا", "toshiro"] },
    { question: "من هو صديق إيتشيغو الذي يستخدم الزانباكتو بابون؟", answers: ["رينجي", "رينجي اباراي", "renji"] },

    // قاتل الشياطين
    { question: "من هو بطل قاتل الشياطين؟", answers: ["تانجيرو", "تانجيرو كامادو", "tanjiro"] },
    { question: "من هي أخت تانجيرو؟", answers: ["نيزوكو", "نيزوكو كامادو", "nezuko"] },
    { question: "من هو صاحب الشعر الأصفر ويستخدم تنفس الرعد؟", answers: ["زينيتسو", "zenitsu"] },
    { question: "من هو المقاتل الذي يرتدي رأس الخنزير؟", answers: ["اينوسكي", "اينوسكي هاشيبيرا", "inosuke"] },
    { question: "من هو عمود الماء؟", answers: ["غيو", "غيو توميوكا", "giyu"] },
    { question: "من هي عمود الحشرة؟", answers: ["شينوبو", "شينوبو كوتشو", "shinobu"] },
    { question: "من هو عمود اللهب؟", answers: ["رينغوكو", "كيوجورو رينغوكو", "rengoku"] },
    { question: "من هو عمود الصوت؟", answers: ["تينغن", "تينغن اوزوي", "tengen"] },
    { question: "من هو ملك الشياطين؟", answers: ["موزان", "موزان كيبوتسوجي", "muzan"] },
    { question: "من هو الشيطان صاحب فن القتال الدموي؟", answers: ["اكازا", "akaza"] },

    // أكاديمية بطلي
    { question: "ما اسم بطل أكاديمية بطلي؟", answers: ["ديكو", "ايزوكو ميدوريا", "ميدوريا", "deku"] },
    { question: "من هو صديق ديكو الذي يستخدم الانفجارات؟", answers: ["باكوغو", "كاتسوكي باكوغو", "bakugo"] },
    { question: "من هو صاحب نصف الجليد ونصف النار؟", answers: ["تودوروكي", "شوتو تودوروكي", "todoroki"] },
    { question: "من هو بطل السلام؟", answers: ["اول مايت", "all might"] },
    { question: "من هو زعيم رابطة الأشرار؟", answers: ["شيغاراكي", "تومورا شيغاراكي", "shigaraki"] },
    { question: "من هو الشرير المعروف باسم دابي؟", answers: ["دابي", "dabi"] },
    { question: "من هي الفتاة التي تستطيع جعل الأشياء عديمة الوزن؟", answers: ["اوراراكا", "اوكاكو اوراراكا", "uraraka"] },
    { question: "من هو المعلم صاحب قدرة إلغاء القدرات؟", answers: ["ايزاوا", "شوتا ايزاوا", "aizawa"] },

    // دراغون بول
    { question: "من هو بطل دراغون بول؟", answers: ["غوكو", "سون غوكو", "goku"] },
    { question: "من هو أمير السايان؟", answers: ["فيجيتا", "vegeta"] },
    { question: "من هو ابن غوكو الأكبر؟", answers: ["غوهان", "gohan"] },
    { question: "من هو المقاتل الأخضر من كوكب ناميك؟", answers: ["بيكولو", "piccolo"] },
    { question: "من هو ابن فيجيتا القادم من المستقبل؟", answers: ["ترانكس", "trunks"] },
    { question: "من هو الشرير الذي دمر كوكب السايان؟", answers: ["فريزا", "frieza"] },
    { question: "من هو المقاتل الذي وصل إلى الشكل المثالي؟", answers: ["سيل", "cell"] },
    { question: "من هو السايان الأسطوري؟", answers: ["برولي", "broly"] },

    // سباي فاميلي
    { question: "ما الاسم المستعار للجاسوس الشهير؟", answers: ["لويد", "لويد فورجر", "loid"] },
    { question: "من هي الأم التي تعمل قاتلة سرية؟", answers: ["يور", "يور فورجر", "yor"] },
    { question: "من هي الطفلة التي تستطيع قراءة الأفكار؟", answers: ["انيا", "انيا فورجر", "anya"] },
    { question: "ما اسم الكلب الذي يرى المستقبل؟", answers: ["بوند", "bond"] },
    { question: "من هو زميل أنيا في المدرسة؟", answers: ["داميان", "داميان ديسموند", "damian"] },

    // سولو ليفلينغ
    { question: "من هو بطل سولو ليفلينغ؟", answers: ["سونغ جين وو", "جين وو", "sung jinwoo", "jinwoo"] },
    { question: "من هي الصيادة التي تحب جين وو؟", answers: ["تشا هاي ان", "تشا هاي إن", "cha hae-in"] },
    { question: "من هو صديق جين وو المقرب؟", answers: ["يو جين هو", "جين هو", "yoo jinho"] },
    { question: "ما اسم الفارس الظلي الشهير؟", answers: ["ايغريس", "igris"] },
    { question: "ما اسم النملة الظلية القوية؟", answers: ["بيرو", "beru"] },

    // الخيميائي المعدني
    { question: "من هو الأخ الأكبر الذي يبحث عن حجر الفلاسفة؟", answers: ["ادوارد", "ادوارد اليريك", "edward"] },
    { question: "من هو الأخ الأصغر المرتبط بدرع؟", answers: ["الفونس", "الفونس اليريك", "alphonse"] },
    { question: "من هو العقيد الذي يستخدم اللهب؟", answers: ["روي موستانغ", "موستانغ", "roy mustang"] },
    { question: "من هي صديقة الأخوين التي تعمل في الميكانيكا؟", answers: ["وينري", "وينري روكبيل", "winry"] },
    { question: "من هو الرجل الذي يحمل ندبة على وجهه؟", answers: ["سكار", "scar"] },

    // طوكيو غول
    { question: "من هو بطل طوكيو غول؟", answers: ["كانيكي", "كين كانيكي", "kaneki"] },
    { question: "من هي الغولة التي تعمل في مقهى أنتيكو؟", answers: ["توكا", "توكا كيريشيما", "touka"] },
    { question: "من هي الغولة التي تسببت بتحول كانيكي؟", answers: ["ريزي", "ريزي كاميشيرو", "rize"] },
    { question: "من هو المحقق صاحب الشعر الأبيض؟", answers: ["جوزو", "جوزو سوزويا", "juuzou"] },
    { question: "من هو المحقق المعروف بلقب الشينيغامي؟", answers: ["أريما", "كيشو أريما", "arima"] },

    // بلاك كلوفر
    { question: "من هو بطل بلاك كلوفر الذي لا يمتلك سحرًا؟", answers: ["استا", "asta"] },
    { question: "من هو منافس أستا وصديق طفولته؟", answers: ["يونو", "yuno"] },
    { question: "من هي الفتاة التي تستخدم سحر الماء؟", answers: ["نويل", "نويل سيلفا", "noelle"] },
    { question: "من هو قائد الثيران السوداء؟", answers: ["يامي", "يامي سوكيهيرو", "yami"] },
    { question: "من هو ملك السحر السابق؟", answers: ["يوليوس", "يوليوس نوفاكرونو", "julius"] },
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

async function nextRound(Chisato: any, from: string, event: ActiveEvent) {
    if (event.round > event.total) {
        const ranking = [...event.scores.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([id, earned], i) =>
                `${i + 1}. @${id.split("@")[0]} — ${earned.toLocaleString()} AURA`
            )
            .join("\n");

        activeEvents.delete(from);

        await Chisato.sendText(
            from,
            `🏁 *انتهت الفعالية!*\n\n🏆 *مكافآت المشاركين:*\n${ranking || "لم يشارك أحد."}`
        );
        return;
    }

    const item = event.questions[event.round - 1];
    event.answer = item.answers;

    await Chisato.sendText(
        from,
        `✦ 『 ✍️ تحدي الكتابة 』 ✦\n\n` +
        `❓ ${item.question}\n\n` +
        `🏁 الجولة ${event.round}/${event.total}\n` +
        `⏱️ الوقت: ${event.seconds} ثوانٍ\n` +
        `🏆 المكافأة: ${REWARD} AURA\n` +
        `━━━━━━━━━━━━━━━`
    );

    if (event.timer) clearTimeout(event.timer);

    event.timer = setTimeout(async () => {
        if (!activeEvents.has(from)) return;

        await Chisato.sendText(
            from,
            `⌛ انتهى الوقت!\nالإجابة: *${event.answer[0]}*`
        );

        event.round++;
        await nextRound(Chisato, from, event);
    }, event.seconds * 1000);
}

export async function startWritingEvent(
    Chisato: any,
    from: string,
    message: any
) {
    if (activeEvents.has(from)) {
        await Chisato.sendText(from, "⚠️ توجد فعالية جارية بالفعل.", message);
        return;
    }

    const event: ActiveEvent = {
        round: 1,
        total: 10,
        seconds: 8,
        answer: [],
        questions: shuffle(QUESTIONS).slice(0, 10),
        scores: new Map(),
        timer: null,
    };

    activeEvents.set(from, event);

    await Chisato.sendText(
        from,
        `🎉 *بدأت فعالية الكتابة!*\n` +
        `كل إجابة صحيحة تمنحك ${REWARD} AURA.\n` +
        `اكتب الإجابة مباشرة دون نقطة في البداية.`
    );

    await nextRound(Chisato, from, event);
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
    const event = activeEvents.get(from);

    if (!event || !body || body.startsWith(".")) return false;

    const guess = normalize(body);
    const correct = event.answer.some(
        (answer) => normalize(answer) === guess
    );

    if (!correct) return false;

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
            `📝 الإجابة: *${event.answer[0]}*\n` +
            `💎 المكافأة: +${REWARD} AURA\n` +
            `💰 رصيده الحالي: ${account.aura.toLocaleString()} AURA`,
            undefined,
            { mentions: [sender] }
        );
    } catch (error) {
        console.error("AURA reward error:", error);

        await Chisato.sendText(
            from,
            "⚠️ تعذر إضافة المكافأة بسبب مشكلة في قاعدة البيانات. لم يتم احتساب الإجابة."
        );

        event.timer = setTimeout(async () => {
            if (!activeEvents.has(from)) return;
            event.round++;
            await nextRound(Chisato, from, event);
        }, 2000);

        return true;
    }

    event.round++;
    await nextRound(Chisato, from, event);

    return true;
}
