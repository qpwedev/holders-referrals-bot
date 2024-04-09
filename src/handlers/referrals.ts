import { Context } from "telegraf";
import Keyboards from "../keyboards";
import Send from "../utils/sender";
import { v4 as uuidv4 } from 'uuid';
import { countReferrals } from "../db/db";

/**
 * Handles the referrals command, displaying the user's referral stats and providing a referral link.
 * @param {Context} ctx - The Telegraf context for the current update.
 */
export const referrals = async (ctx: Context) => {
    // @ts-ignore
    const userId = ctx.update.message?.from.id;
    if (!userId) {
        console.warn('No user ID found in the context.');
        return;
    }

    const referralStats = await countReferrals(userId);
    try {
        await sendReferralMessage(ctx, userId, referralStats);
    } catch (error) {
        console.error("Failed to send referral message:", error);
    }
};

/**
 * Sends a message to the user with their referral stats and referral link.
 * @param {Context} ctx - The Telegraf context.
 * @param {number} userId - The ID of the user.
 * @param {{ todayReferrals: number; totalReferrals: number; }} referralStats - The user's referral statistics.
 */
async function sendReferralMessage(ctx: Context, userId: number, referralStats: { todayReferrals: number; totalReferrals: number; }): Promise<void> {
    const botUsername = process.env.BOT_USERNAME || "your_bot_username_here";
    const message = `<b>👥 Referrals</b>

<i>Invite more friends by using the referral link below.</i>

Invited Today: ${referralStats.todayReferrals}
Total: ${referralStats.totalReferrals}

Referral Link: <code>t.me/${botUsername}?start=${userId}</code>`;

    await Send.photo(ctx, message, Keyboards.referrals(`t.me/${botUsername}?start=${userId}`), './img/referrals.png');
}
