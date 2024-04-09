import { Markup } from "telegraf";
// import uuid

const referrals = (url: string) => {
    return [
        [
            Markup.button.switchToChat('🔗 Share', url)
        ],

    ]
}


export { referrals }