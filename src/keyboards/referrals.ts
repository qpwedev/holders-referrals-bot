import { Markup } from "telegraf";
import { createBackButton } from "./utils";
// import uuid

const referrals = (url: string) => {
    return [
        [
            Markup.button.switchToChat('🔗 Share', url)
        ],
        [
            createBackButton('menu')
        ]

    ]
}


export { referrals }