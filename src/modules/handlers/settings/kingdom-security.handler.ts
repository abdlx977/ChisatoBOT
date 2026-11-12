
import { Client } from "../../../libs";
import { MessageSerialize } from "../../../types/structure/serialize";
import { configService } from "../../../core/config/config.service";

const WARNING_WINDOW = 10 * 60 * 1000;
const SPAM_WINDOW = 10 * 1000;
const MAX_MESSAGES = 6;

const warnings = new Map<string, { count: number; expiresAt: number }>();
const activity = new Map<string, { messages: string[]; times: number[] }>();

function cleanNumber(value: string): string {
    return String(value || "").split("@")[0].replace(/\D/g, "");
}

function isNoble(sender: string): boolean {
    const config = configService.getConfig();
    const number = cleanNumber(sender);

    return (config.allowedNumbers || []).some(
        (allowed) => cleanNumber(allowed) === number
    );
}

function isSuspiciousUrl(text: string): boolean {
    const urls = text.match(/https?:\/\/[^\s]+|www\.[^\s]+/gi) || [];

    const suspiciousHosts = [
        "chat.whatsapp.com",
        "bit.ly",
        "tinyurl.com",
        "cutt.ly",
        "is.gd",
        "rb.gy",
        "shorturl.at",
    ];

    for (const value of urls) {
        try {
            const url = new URL(
                value.startsWith("www.") ? `https://${value}` : value
            );

            const host = url.hostname.toLowerCase();

            if (
                host === "chat.whatsapp.com" ||
                suspiciousHosts.includes(host) ||
                host.startsWith("xn--") ||
                /^\d{1,3}(\.\d{1,3}){3}$/.test(host)
            ) {
                return true;
            }
        } catch {}
    }

    return false;
}

export class KingdomSecurityHandler {
    async handle(
        Chisato: Client,
        message: MessageSerialize,
        isOwner: boolean,
        isGroupAdmin: boolean,
        isBotAdmin: boolean
    ): Promise<boolean> {
        if (!message.isGroup || message.fromMe) return false;

        const { from, sender, body, type } = message;

        // Owner, group admins and noble members are exempt.
        if (isOwner || isGroupAdmin || isNoble(sender)) return false;

        // The bot must be an admin to moderate members.
        if (!isBotAdmin) return false;

        const key = `${from}:${sender}`;
        const inviteMessage = type === "groupInviteMessage";
        const suspiciousLink = isSuspiciousUrl(body || "");

        // Dangerous group invitations and suspicious links: immediate removal.
        if (inviteMessage || suspiciousLink) {
            try {
                await Chisato.sendMessage(from, {
                    delete: message.key,
                });

                await Chisato.groupParticipantsUpdate(
                    from,
                    [sender],
                    "remove"
                );

                await Chisato.sendText(
                    from,
                    `🛡️ *حماية المملكة*\n\nتم طرد @${cleanNumber(sender)} بسبب إرسال رابط أو دعوة مشبوهة.`,
                    null,
                    { mentions: [sender] }
                );
            } catch (error) {
                console.error("Kingdom security action failed:", error);
            }

            return true;
        }

        // Spam detection: repeated messages or too many messages quickly.
        const now = Date.now();
        let record = activity.get(key);

        if (!record) {
            record = { messages: [], times: [] };
        }

        record.messages = record.messages.filter(
            (_, index) => record!.times[index] > now - SPAM_WINDOW
        );
        record.times = record.times.filter(
            (time) => time > now - SPAM_WINDOW
        );

        record.messages.push((body || type || "").trim().toLowerCase());
        record.times.push(now);
        activity.set(key, record);

        const sameMessageCount = record.messages.filter(
            (item) => item === (body || type || "").trim().toLowerCase()
        ).length;

        if (
            record.times.length < MAX_MESSAGES &&
            sameMessageCount < 3
        ) {
            return false;
        }

        activity.delete(key);

        try {
            await Chisato.sendMessage(from, {
                delete: message.key,
            });
        } catch {}

        let warning = warnings.get(key);

        if (!warning || now > warning.expiresAt) {
            warning = {
                count: 0,
                expiresAt: now + WARNING_WINDOW,
            };
        }

        warning.count++;
        warnings.set(key, warning);

        if (warning.count >= 3) {
            warnings.delete(key);

            try {
                await Chisato.groupParticipantsUpdate(
                    from,
                    [sender],
                    "remove"
                );

                await Chisato.sendText(
                    from,
                    `🚫 *حماية المملكة*\n\nتم طرد @${cleanNumber(sender)} بعد 3 مخالفات سبام.`,
                    null,
                    { mentions: [sender] }
                );
            } catch (error) {
                console.error("Spam removal failed:", error);
            }
        } else {
            const remaining = 3 - warning.count;

            await Chisato.sendText(
                from,
                `⚠️ *تحذير سبام ${warning.count}/3*\n\n@${cleanNumber(sender)} يرجى عدم إغراق المجموعة بالرسائل.\nالمخالفة القادمة قد تؤدي إلى الطرد.`,
                null,
                { mentions: [sender] }
            );
        }

        return true;
    }
}
