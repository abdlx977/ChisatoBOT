import { BingImagesScraper } from "../../utils/scrapers/search";

export type ImageGameType = "characters" | "eyes";

export type ImageQuestion = {
    game: ImageGameType;
    answer: string;
    acceptedAnswers: string[];
    imageUrl: string;
    prompt: string;
};

type Character = {
    name: string;
    aliases: string[];
    query: string;
};

const CHARACTERS: Character[] = [
    // Dragon Ball
    { name: "غوكو", aliases: ["goku", "سون غوكو"], query: "Son Goku Dragon Ball anime" },
    { name: "فيجيتا", aliases: ["vegeta"], query: "Vegeta Dragon Ball anime" },
    { name: "غوهان", aliases: ["gohan"], query: "Gohan Dragon Ball anime" },
    { name: "فريزا", aliases: ["frieza"], query: "Frieza Dragon Ball anime" },

    // One Piece
    { name: "لوفي", aliases: ["luffy", "مونكي دي لوفي"], query: "Monkey D Luffy One Piece anime" },
    { name: "زورو", aliases: ["zoro", "رورونوا زورو"], query: "Roronoa Zoro One Piece anime" },
    { name: "سانجي", aliases: ["sanji"], query: "Sanji One Piece anime" },
    { name: "شانكس", aliases: ["shanks"], query: "Shanks One Piece anime" },
    { name: "ايس", aliases: ["ace", "بورتغاس دي ايس"], query: "Portgas D Ace One Piece anime" },
    { name: "ترافالغار لاو", aliases: ["لاو", "law"], query: "Trafalgar Law One Piece anime" },
    { name: "كايدو", aliases: ["kaido"], query: "Kaido One Piece anime" },

    // Naruto
    { name: "ناروتو", aliases: ["naruto"], query: "Naruto Uzumaki anime" },
    { name: "ساسكي", aliases: ["sasuke"], query: "Sasuke Uchiha anime" },
    { name: "ايتاتشي", aliases: ["itachi"], query: "Itachi Uchiha anime" },
    { name: "اوبيتو", aliases: ["obito"], query: "Obito Uchiha anime" },
    { name: "مادارا", aliases: ["madara"], query: "Madara Uchiha anime" },
    { name: "كاكاشي", aliases: ["kakashi"], query: "Kakashi Hatake anime" },
    { name: "ميناتو", aliases: ["minato"], query: "Minato Namikaze anime" },
    { name: "باين", aliases: ["pain", "ناغاتو"], query: "Pain Nagato Naruto anime" },

    // Demon Slayer
    { name: "تانجيرو", aliases: ["tanjiro"], query: "Tanjiro Kamado anime" },
    { name: "نيزوكو", aliases: ["nezuko"], query: "Nezuko Kamado anime" },
    { name: "زينيتسو", aliases: ["zenitsu"], query: "Zenitsu Agatsuma anime" },
    { name: "اينوسكي", aliases: ["inosuke"], query: "Inosuke Hashibira anime" },
    { name: "غيو", aliases: ["giyu", "توميوكا"], query: "Giyu Tomioka anime" },
    { name: "رينغوكو", aliases: ["rengoku"], query: "Kyojuro Rengoku anime" },
    { name: "موزان", aliases: ["muzan"], query: "Muzan Kibutsuji anime" },
    { name: "اكازا", aliases: ["akaza"], query: "Akaza Demon Slayer anime" },

    // Attack on Titan
    { name: "ايرين", aliases: ["eren"], query: "Eren Yeager Attack on Titan anime" },
    { name: "ميكاسا", aliases: ["mikasa"], query: "Mikasa Ackerman anime" },
    { name: "ليفاي", aliases: ["levi"], query: "Levi Ackerman anime" },
    { name: "ارمين", aliases: ["armin"], query: "Armin Arlert anime" },
    { name: "ايروين", aliases: ["erwin"], query: "Erwin Smith anime" },
    { name: "زيك", aliases: ["zeke"], query: "Zeke Yeager anime" },

    // Hunter x Hunter
    { name: "غون", aliases: ["gon"], query: "Gon Freecss Hunter x Hunter anime" },
    { name: "كيلوا", aliases: ["killua"], query: "Killua Zoldyck anime" },
    { name: "كورابيكا", aliases: ["kurapika"], query: "Kurapika anime" },
    { name: "هيسوكا", aliases: ["hisoka"], query: "Hisoka Hunter x Hunter anime" },
    { name: "كرولو", aliases: ["chrollo"], query: "Chrollo Lucilfer anime" },
    { name: "ميرويم", aliases: ["meruem"], query: "Meruem Hunter x Hunter anime" },

    // Jujutsu Kaisen
    { name: "غوجو", aliases: ["gojo", "ساتورو غوجو"], query: "Satoru Gojo anime" },
    { name: "سوكونا", aliases: ["sukuna"], query: "Ryomen Sukuna anime" },
    { name: "يوجي", aliases: ["yuji", "ايتادوري"], query: "Yuji Itadori anime" },
    { name: "ميغومي", aliases: ["megumi"], query: "Megumi Fushiguro anime" },
    { name: "غيتو", aliases: ["geto"], query: "Suguru Geto anime" },
    { name: "توجي", aliases: ["toji"], query: "Toji Fushiguro anime" },
    { name: "ماهيتو", aliases: ["mahito"], query: "Mahito Jujutsu Kaisen anime" },

    // Solo Leveling
    { name: "سونغ جين وو", aliases: ["jinwoo", "جين وو"], query: "Sung Jinwoo Solo Leveling anime" },
    { name: "تشا هاي ان", aliases: ["cha hae in"], query: "Cha Hae In Solo Leveling anime" },
    { name: "ايغريس", aliases: ["igris"], query: "Igris Solo Leveling anime" },
    { name: "بيرو", aliases: ["beru"], query: "Beru Solo Leveling anime" },

    // Death Note
    { name: "لايت", aliases: ["light", "يا غامي لايت"], query: "Light Yagami Death Note anime" },
    { name: "إل", aliases: ["l", "lawliet"], query: "L Lawliet Death Note anime" },
    { name: "ريوك", aliases: ["ryuk"], query: "Ryuk Death Note anime" },

    // Vinland Saga
    { name: "ثورفين", aliases: ["thorfinn"], query: "Thorfinn Vinland Saga anime" },
    { name: "اسكيلاد", aliases: ["askeladd"], query: "Askeladd Vinland Saga anime" },
    { name: "كانوت", aliases: ["canute"], query: "Canute Vinland Saga anime" },

    // Bleach
    { name: "ايشيغو", aliases: ["ichigo"], query: "Ichigo Kurosaki Bleach anime" },
    { name: "ايزن", aliases: ["aizen"], query: "Sosuke Aizen Bleach anime" },
    { name: "بياكويا", aliases: ["byakuya"], query: "Byakuya Kuchiki Bleach anime" },
    { name: "كينباتشي", aliases: ["kenpachi"], query: "Kenpachi Zaraki Bleach anime" },

    // My Hero Academia
    { name: "ديكو", aliases: ["deku", "ميدوريا"], query: "Izuku Midoriya anime" },
    { name: "باكوغو", aliases: ["bakugo"], query: "Katsuki Bakugo anime" },
    { name: "تودوروكي", aliases: ["todoroki"], query: "Shoto Todoroki anime" },
    { name: "شيغاراكي", aliases: ["shigaraki"], query: "Tomura Shigaraki anime" },

    // Blue Lock
    { name: "ايساغي", aliases: ["isagi"], query: "Yoichi Isagi Blue Lock anime" },
    { name: "رين", aliases: ["rin"], query: "Rin Itoshi Blue Lock anime" },
    { name: "ناغي", aliases: ["nagi"], query: "Seishiro Nagi Blue Lock anime" },
    { name: "باچيرا", aliases: ["bachira"], query: "Meguru Bachira Blue Lock anime" },

    // Tokyo Ghoul
    { name: "كانيكي", aliases: ["kaneki"], query: "Ken Kaneki Tokyo Ghoul anime" },
    { name: "اريما", aliases: ["arima"], query: "Kishou Arima Tokyo Ghoul anime" },

    // Other anime
    { name: "غينتوكي", aliases: ["gintoki"], query: "Gintoki Sakata Gintama anime" },
    { name: "سايتاما", aliases: ["saitama"], query: "Saitama One Punch Man anime" },
    { name: "غارو", aliases: ["garou"], query: "Garou One Punch Man anime" },
    { name: "يوهان", aliases: ["johan"], query: "Johan Liebert Monster anime" },
    { name: "تينما", aliases: ["tenma"], query: "Kenzo Tenma Monster anime" },

    // TV series
    { name: "والتر وايت", aliases: ["walter white", "هايزنبرغ", "heisenberg"], query: "Walter White Breaking Bad" },
    { name: "جيسي بينكمان", aliases: ["jesse pinkman", "جيسي"], query: "Jesse Pinkman Breaking Bad" },
    { name: "توماس شيلبي", aliases: ["thomas shelby", "توماس"], query: "Thomas Shelby Peaky Blinders" },
    { name: "مايكل سكوفيلد", aliases: ["michael scofield", "مايكل"], query: "Michael Scofield Prison Break" },
    { name: "جون سنو", aliases: ["jon snow", "جون"], query: "Jon Snow Game of Thrones" },
    { name: "هوملاندر", aliases: ["homelander"], query: "Homelander The Boys" },
    { name: "شيرلوك هولمز", aliases: ["sherlock", "شيرلوك"], query: "Sherlock Holmes BBC Sherlock" },
    { name: "ديكستر", aliases: ["dexter"], query: "Dexter Morgan Dexter TV series" },

    // Video games
    { name: "آرثر مورغان", aliases: ["arthur morgan", "ارثر مورغان", "آرثر"], query: "Arthur Morgan Red Dead Redemption 2" },
    { name: "ليون كينيدي", aliases: ["leon kennedy", "ليون"], query: "Leon S Kennedy Resident Evil" },
    { name: "كريتوس", aliases: ["kratos"], query: "Kratos God of War" },
    { name: "إيزيو", aliases: ["ezio", "ezio auditore"], query: "Ezio Auditore Assassin's Creed" },
    { name: "نيثن دريك", aliases: ["nathan drake", "نيثن"], query: "Nathan Drake Uncharted" },
    { name: "جويل", aliases: ["joel", "joel miller"], query: "Joel Miller The Last of Us" },
    { name: "لارا كروفت", aliases: ["lara croft", "لارا"], query: "Lara Croft Tomb Raider" },
    { name: "دانتي", aliases: ["dante"], query: "Dante Devil May Cry" },
];

const EYES: Character[] = [
    { name: "غوجو", aliases: ["gojo", "ساتورو غوجو"], query: "Satoru Gojo eyes close up anime" },
    { name: "سوكونا", aliases: ["sukuna"], query: "Ryomen Sukuna eyes close up anime" },
    { name: "ايتاتشي", aliases: ["itachi"], query: "Itachi Uchiha eyes close up anime" },
    { name: "ساسكي", aliases: ["sasuke"], query: "Sasuke Uchiha eyes close up anime" },
    { name: "مادارا", aliases: ["madara"], query: "Madara Uchiha eyes close up anime" },
    { name: "اوبيتو", aliases: ["obito"], query: "Obito Uchiha eyes close up anime" },
    { name: "كاكاشي", aliases: ["kakashi"], query: "Kakashi Hatake eyes close up anime" },
    { name: "ليفاي", aliases: ["levi"], query: "Levi Ackerman eyes close up anime" },
    { name: "ايرين", aliases: ["eren"], query: "Eren Yeager eyes close up anime" },
    { name: "كيلوا", aliases: ["killua"], query: "Killua Zoldyck eyes close up anime" },
    { name: "هيسوكا", aliases: ["hisoka"], query: "Hisoka eyes close up anime" },
    { name: "كرولو", aliases: ["chrollo"], query: "Chrollo Lucilfer eyes close up anime" },
    { name: "لايت", aliases: ["light", "يا غامي لايت"], query: "Light Yagami eyes close up anime" },
    { name: "إل", aliases: ["l", "lawliet"], query: "L Lawliet eyes close up anime" },
    { name: "ايزن", aliases: ["aizen"], query: "Sosuke Aizen eyes close up anime" },
    { name: "ايشيغو", aliases: ["ichigo"], query: "Ichigo Kurosaki eyes close up anime" },
    { name: "غوكو", aliases: ["goku"], query: "Goku eyes close up Dragon Ball anime" },
    { name: "فيجيتا", aliases: ["vegeta"], query: "Vegeta eyes close up Dragon Ball anime" },
    { name: "ناروتو", aliases: ["naruto"], query: "Naruto Uzumaki eyes close up anime" },
    { name: "غيتو", aliases: ["geto"], query: "Suguru Geto eyes close up anime" },
    { name: "توجي", aliases: ["toji"], query: "Toji Fushiguro eyes close up anime" },
    { name: "يوجي", aliases: ["yuji", "ايتادوري"], query: "Yuji Itadori eyes close up anime" },
    { name: "تانجيرو", aliases: ["tanjiro"], query: "Tanjiro Kamado eyes close up anime" },
    { name: "زورو", aliases: ["zoro"], query: "Roronoa Zoro eyes close up anime" },
    { name: "لوفي", aliases: ["luffy"], query: "Monkey D Luffy eyes close up anime" },
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

function pickRandom<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
}

export async function createImageQuestion(
    game: ImageGameType
): Promise<ImageQuestion> {
    const selected = pickRandom(game === "eyes" ? EYES : CHARACTERS);
    const scraper = new BingImagesScraper();

    const results = await scraper.search(selected.query, {
        perPage: 15,
    });

    if (!results.length || !results[0].url) {
        throw new Error(`No image found for ${selected.name}`);
    }

    return {
        game,
        answer: selected.name,
        acceptedAnswers: [selected.name, ...selected.aliases].map(normalize),
        imageUrl: results[0].url,
        prompt: game === "eyes"
            ? "👁️ *خمن الشخصية من عيونها!*"
            : "🖼️ *خمن الشخصية من الصورة!*",
    };
      }
