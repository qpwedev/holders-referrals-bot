import { Context } from "telegraf";
import Keyboards from "../keyboards";
import Send from "../utils/sender";
import { v4 as uuidv4 } from 'uuid';
import { countReferrals } from "../db/db";

/**
 * Handles the referrals command, displaying the user's referral stats and providing a referral link.
 * @param {Context} ctx - The Telegraf context for the current update.
 */
export const menu = async (ctx: Context) => {

    // @ts-ignore
    const userId = ctx?.update?.message?.from?.id || ctx?.update?.callback_query?.from?.id
    if (!userId) {
        console.warn('No user ID found in the context.');
        return;
    }

    try {
        await sendMenuMessage(ctx);
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
async function sendMenuMessage(ctx: Context): Promise<void> {
    const message = `<b>👥 Menu</b>

<i>Choose options below</i>`;

    await Send.photo(ctx, message, Keyboards.menu(), "./img/welcome.png", ctx.message?.message_id || ctx.callbackQuery?.message.message_id);
}
