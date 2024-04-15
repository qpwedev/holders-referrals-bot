import { Context } from "telegraf";
import Keyboards from "../keyboards";
import Send from "../utils/sender";
import { v4 as uuidv4 } from 'uuid';

/**
 * Initiates the wallet connection process by sending the user a message
 * with instructions on how to verify their wallet. This includes sending
 * a small transaction to a verification address with a unique text identifier.
 * @param {Context} ctx - The Telegraf context for the current update.
 */
export const connectWallet = async (ctx: Context) => {
    const uuid = uuidv4();

    try {
        await sendVerificationMessage(ctx, uuid);
    } catch (error) {
        console.error("Failed to send wallet connection message:", error);
    }
};

/**
 * Sends a message to the user with instructions for verifying their wallet.
 * @param {Context} ctx - The Telegraf context.
 * @param {string} uuid - The unique identifier to be included in the verification transaction.
 */
async function sendVerificationMessage(ctx: Context, uuid: string): Promise<void> {
    const verificationAddress = process.env.VERIFICATION_WALLET_ADDRESS || "UNDEFINED";
    const tokenTicker = process.env.TOKEN_TICKER
    const tokenRequiredAmount = Number.parseInt(process.env.TOKEN_REQUIRED_AMOUNT);

    const message = `<b>🔌 Verify Wallet</b>

<i>Please send 0.1 TON to the following address to verify your wallet.</i>

Address: <code>${verificationAddress}</code>

Text: <code>${uuid}</code>

Required amount: <code>${Math.round(tokenRequiredAmount / 1e9)} ${tokenTicker}</code>
`;


    await Send.photo(
        ctx,
        message,
        Keyboards.checkTransaction(uuid),
        './img/connect-wallet.png',
        ctx.message?.message_id || ctx.callbackQuery?.message.message_id
    );

}
