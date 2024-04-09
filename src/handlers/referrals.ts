import { Context } from "telegraf";
import Keyboards from "../keyboards";
import Send from "../utils/sender";
import { v4 as uuidv4 } from 'uuid';
import { countReferrals } from "../db/db";


export const referrals = async (ctx: Context) => {
    // @ts-ignore
    const userId = ctx.update.message.from.id
    const uuid = uuidv4();
    const totalAmountOfReferrals = await countReferrals(userId)

    try {
        const msg = await Send.photo(ctx, `<b>👥 Referrals</b>

<i>Invite more friends by using the referral link below.</i>

Invited Today: ${totalAmountOfReferrals.todayReferrals}
Total: ${totalAmountOfReferrals.totalReferrals}

Referral Link: <code>t.me/${process.env.BOT_USERNAME}?start=${userId}</code> 
`, Keyboards.referrals(`t.me/${process.env.BOT_USERNAME}?start=${userId}`), './img/referrals.png',);
    }
    catch (error) {
        console.log(error);
    }
}

