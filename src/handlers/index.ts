import start from "./start";
import { checkTransactionAndBalance } from "./checkTransactionAndBalance";
import { connectWallet } from "./connectWallet";
import { referrals } from "./referrals";

const Handlers = {
    connectWallet,
    start,
    checkTransactionAndBalance,
    referrals
};

export default Handlers;