import start from "./start";
import { checkTransactionAndBalance } from "./checkTransactionAndBalance";
import { connectWallet } from "./connectWallet";
import { referrals } from "./referrals";

/**
 * A collection of handler functions for the bot. Each handler is associated with a specific bot command or action.
 * - `start`: Handles the bot's start command.
 * - `connectWallet`: Handles wallet connection requests.
 * - `checkTransactionAndBalance`: Checks for transactions and balances associated with the user.
 * - `referrals`: Manages referral-related actions.
 */
const Handlers = {
    start,
    connectWallet,
    checkTransactionAndBalance,
    referrals,
};

export default Handlers;