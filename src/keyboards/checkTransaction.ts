import { Markup } from "telegraf";
// import uuid

const checkTransaction = (uuidv4: string) => {
    return [
        [
            Markup.button.url('🦋 Send', `ton://transfer/${process.env.VERIFICATION_WALLET_ADDRESS}?text=${uuidv4}&amount=100000000`)
        ],
        [
            Markup.button.callback('♻️ Check Transaction', `check:${uuidv4}`)
        ],

    ]
}


export { checkTransaction }