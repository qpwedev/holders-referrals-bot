import { Context } from "telegraf";
import { fetchTransactions } from "../api/api";
import Keyboards from "../keyboards";
import { findUuidInTransactions } from "../utils";

export const checkTransactionAndBalance = async (ctx: Context) => {
    // @ts-ignore
    const data = ctx.update.callback_query.data;
    // @ts-ignore
    const messageId = ctx.update.callback_query.message.message_id

    const txs = (await fetchTransactions({
        address: process.env.VERIFICATION_WALLET_ADDRESS || "",
        // @ts-ignore
    }))

    const tx = findUuidInTransactions(txs, data)

    if (tx) {
        const chatLink = await ctx.telegram.createChatInviteLink(
            process.env.TELEGRAM_CHAT_ID || "",
            {
                member_limit: 1,
            }
        )

        await ctx.telegram.editMessageMedia(ctx.chat!.id, messageId, undefined, { type: "photo", media: { source: "./img/welcome.png" }, caption: `<b>👋 Welcome Onboard</b>`, parse_mode: "HTML" }, { reply_markup: { inline_keyboard: Keyboards.joinChat(chatLink.invite_link) } });

    } else {
        ctx.answerCbQuery("⭕️ Transaction not found\n\nTry a bit later or send transaction again.", { show_alert: true })
    }

}

