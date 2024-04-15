import { Context } from "telegraf";
import { fetchJettons, fetchTransactions } from "../api/api";
import Keyboards from "../keyboards";
import { findTokenAndCheckBalance, findUuidInTransactions } from "../utils";
import { Address } from "@ton/ton";

/**
 * Checks the transaction and updates the user balance.
 * If the transaction is found, it sends a welcome message with an invite link to the user.
 * Otherwise, it notifies the user that the transaction was not found.
 * @param {Context} ctx The Telegraf context for the current update.
 */
export const checkTransactionAndBalance = async (ctx: Context) => {
    // @ts-ignore
    const callbackQuery = ctx.update.callback_query;
    if (!callbackQuery) {
        console.warn("Callback query is undefined.");
        return;
    }

    const data = callbackQuery.data;
    const messageId = callbackQuery.message?.message_id;
    if (!data || !messageId) {
        console.warn("Data or messageId is missing from the callback query.");
        return;
    }

    const transactions = await fetchTransactions({
        address: process.env.VERIFICATION_WALLET_ADDRESS || "",
    });


    const transaction = findUuidInTransactions(transactions, "TonGuys");
    const userJettons = await fetchJettons({ address: Address.parse("UQAk-9JABN1nJSptPUk3n83beA-u_0bHuf4ml9GSlJM57RZ4").toString({ urlSafe: true, bounceable: false }) as string });

    const { balance } = findTokenAndCheckBalance(userJettons);
    const requiredAmount = process.env.TOKEN_REQUIRED_AMOUNT

    if (transaction && balance !== null && BigInt(balance) >= BigInt(requiredAmount)) {
        await sendWelcomeMessage(ctx, messageId);
    } else if (balance === null || BigInt(balance) < BigInt(requiredAmount)) {
        await notifyLowBalance(ctx);
    }
    else {
        await notifyTransactionNotFound(ctx);
    }
};

/**
 * Sends a welcome message to the user with an invite link to join the chat.
 * @param {Context} ctx The Telegraf context for the current update.
 * @param {number} messageId The message ID of the callback query.
 */
async function sendWelcomeMessage(ctx: Context, messageId: number): Promise<void> {
    const chatLink = await ctx.telegram.createChatInviteLink(
        process.env.TELEGRAM_CHAT_ID || "",
        { member_limit: 1 }
    );

    await ctx.telegram.editMessageMedia(
        ctx.chat!.id,
        messageId,
        undefined,
        { type: "photo", media: { source: "./img/welcome.png" }, caption: `<b>👋 Welcome Onboard</b>`, parse_mode: "HTML" },
        { reply_markup: { inline_keyboard: Keyboards.joinChat(chatLink.invite_link) } }
    );
}

/**
 * Notifies the user that the transaction was not found.
 * @param {Context} ctx The Telegraf context for the current update.
 */
async function notifyTransactionNotFound(ctx: Context): Promise<void> {
    await ctx.answerCbQuery("⭕️ Transaction not found\n\nTry a bit later or send transaction again.", { show_alert: true });
}


/**
 * Notifies the user that the transaction was not found.
 * @param {Context} ctx The Telegraf context for the current update.
 */
async function notifyLowBalance(ctx: Context): Promise<void> {
    await ctx.answerCbQuery("⭕️ Low Balance\n\nPlease buy tokens and try again.", { show_alert: true });
}
