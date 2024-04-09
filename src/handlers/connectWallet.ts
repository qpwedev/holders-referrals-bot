import { Context } from "telegraf";
import Keyboards from "../keyboards";
import Send from "../utils/sender";
import { v4 as uuidv4 } from 'uuid';


export const connectWallet = async (ctx: Context) => {
    const uuid = uuidv4();

    try {
        const msg = await Send.photo(ctx, `<b>🔌 Verify Wallet</b>

<i>Please send 0.1 TON to the following address to verify your wallet.</i>

Address: <code>${process.env.VERIFICATION_WALLET_ADDRESS}</code> 

Text: <code>${uuid}</code> 
 
`, Keyboards.checkTransaction(uuid), './img/connect-wallet.png',);
    }
    catch (error) {
        console.log(error);
    }
}

