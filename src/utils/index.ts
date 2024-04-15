import { Context } from "telegraf"
import { TView } from "./types"
import { Address } from "@ton/ton"



export const findUuidInTransactions = (txs: any, uuid: string) => {
    for (let i = 0; i < txs.length; i++) {
        if (txs[i]?.in_msg?.decoded_body?.text === uuid) {
            return txs[i].in_msg
        }
    }
    return null
}

export const findTokenAndCheckBalance = (balances: any[]) => {
    const jettonAddress = process.env.TOKEN_ADDRESS

    for (let i = 0; i < balances.length; i++) {
        if (Address.parse(balances[i].jetton.address).toString() === Address.parse(jettonAddress).toString()) {
            return {
                balance: balances[i].balance,
            }
        }
    }
    return { balance: null }
}

export const getMessageText = (ctx: Context) => {
    if ((!("text" in ctx.message))) {
        console.warn("No message found in the context.")
        return;
    };
    const messageText = ctx.message.text
    return messageText
}



export const extractStartQueryParamAndType = (text: string) => {
    let path = ''
    let type = undefined

    if (text && text.split(' ').length === 2 && text.split(' ')[0] === '/start') {
        path = text.split(' ')[1]
    }

    if (path && !isNaN(Number(path))) {
        type = 'addReferral'
    } else if (path === 'joinChat') {
        type = 'joinChat'
    } else {
        type = 'start'
    }

    return { path, type }
}


export const extractBackQueryParamAndType = (text: string): { view: TView | null } => {
    if (text.startsWith('back-button-')) {
        const viewPart = text.substring('back-button-'.length);

        // Check if the extracted view is one of the expected types
        if (viewPart === 'menu' || viewPart === 'referrals' || viewPart === 'joinChat') {
            return { view: viewPart as TView };
        }
    }

    return { view: null };
}