
import { Client } from "../../../libs";
import { MessageSerialize } from "../../../types/structure/serialize";
import { configService } from "../../../core/config/config.service";

const WARNING_WINDOW = 10 * 60 * 1000;
const SPAM_WINDOW = 10 * 1000;
const MAX_MESSAGES = 6;
const SAME_MESSAGE_LIMIT = 3;

type ActivityRecord = {
    text: string;
    time: number;
};

const warnings = new Map<
    string,
    { count: number; expiresAt: number }
>();

const activity = new Map<string, ActivityRecord[]>();
export function getKingdomSecurityStats(groupId: string) {
    const now = Date.now();
    const prefix = `${groupId}:`;

    const activeWarnings = [...warnings.entries()].filter(
        ([key, value]) =>
            key.startsWith(prefix) && now <= value.expiresAt
    );

    const activeActivity = [...activity.entries()].filter(
        ([key, records]) =>
            key.startsWith(prefix) &&
            records.some(record => record.time > now - SPAM_WINDOW)
    );

    return {
        membersWithWarnings: activeWarnings.length,
        totalWarnings: activeWarnings.reduce(
            (total, [, value]) => total + value.count,
            0
        ),
        membersBeingTracked: activeActivity.length,
    };
}

function cleanNumber(value: string): string {
    return String(value || "")
        .split("@")[0]
        .replace(/\D/g, "");
}

function isNoble(sender: string): boolean {
    const config = configService.getConfig();
    const number = cleanNumber(sender);

    return (config.allowedNumbers || []).some(
        (allowed) => cleanNumber(allowed) === number
    );
}

// Block WhatsApp group invitations and obvious WhatsApp impersonation links.
// Ordinary links and URL shorteners remain allowed.
function isSuspiciousUrl(text: string): boolean {
    const urls =
        text.match(/https?:\/\/[^\s]+|www\.[^\s]+/gi) || [];

    for (const value of urls) {
        try {
            const url = new URL(
                value.startsWith("www.") ? `https://${value}` : value
            );

            const host = url.hostname.toLowerCase();

            if (host === "chat.whatsapp.com") {
                return true;
            }

            if (
                host.includes("whatsapp") &&
                host !== "whatsapp.com" &&
                !host.endsWith(".whatsapp.com")
            ) {
                return true;
            }
        } catch {
            continue;
        }
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

        // Exempt owner, group admins and noble members.
        if (isOwner || isGroupAdmin || isNoble(sender)) {
            return false;
        }

        // Moderation requires the bot to be a group admin.
        if (!isBotAdmin) return false;

        const key = `${from}:${sender}`;
        const inviteMessage = type === "groupInviteMessage";
        const suspiciousLink = isSuspiciousUrl(body || "");

        // Immediate removal for group invitations and suspicious links.
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
                    `🛡️ *حماية المملكة*\n\nتم طرد @${cleanNumber(sender)} بسبب إرسال دعوة مجموعة أو رابط مشبوه.`,
                    null,
                    { mentions: [sender] }
                );
            } catch (error) {
                console.error("Kingdom security action failed:", error);
            }

            return true;
        }

        // Track message activity during the spam window.
        const now = Date.now();
        const currentText = (body || type || "")
            .trim()
            .toLowerCase();

        let records = activity.get(key) || [];

        records = records.filter(
            (record) => record.time > now - SPAM_WINDOW
        );

        records.push({
            text: currentText,
            time: now,
        });

        activity.set(key, records);

        const sameMessageCount = records.filter(
            (record) => record.text === currentText
        ).length;

        const isSpam =
            records.length >= MAX_MESSAGES ||
            sameMessageCount >= SAME_MESSAGE_LIMIT;

        if (!isSpam) return false;

        activity.delete(key);

        // Delete the message that triggered spam detection.
        try {
            await Chisato.sendMessage(from, {
                delete: message.key,
            });
        } catch (error) {
            console.error("Spam message deletion failed:", error);
        }

        // Count warnings for this member.
        let warning = warnings.get(key);

        if (!warning || now > warning.expiresAt) {
            warning = {
                count: 0,
                expiresAt: now + WARNING_WINDOW,
            };
        }

        warning.count++;
        warnings.set(key, warning);

        // Third violation: remove the member.
        if (warning.count >= 3) {
            try {
                await Chisato.groupParticipantsUpdate(
                    from,
                    [sender],
                    "remove"
                );

                warnings.delete(key);

                await Chisato.sendText(
                    from,
                    `🚫 *حماية المملكة*\n\nتم طرد @${cleanNumber(sender)} بعد 3 مخالفات سبام.`,
                    null,
                    { mentions: [sender] }
                );
            } catch (error) {
                console.error("Spam removal failed:", error);
            }

            return true;
        }

        // First and second warnings.
        const warningText =
            warning.count === 1
                ? "يرجى عدم إغراق المجموعة بالرسائل."
                : "⚠️ هذا تحذيرك الأخير! المخالفة القادمة ستؤدي إلى الطرد.";

        await Chisato.sendText(
            from,
            `⚠️ *تحذير سبام ${warning.count}/3*\n\n@${cleanNumber(sender)}\n${warningText}`,
            null,
            { mentions: [sender] }
        );

        return true;
    }
}
