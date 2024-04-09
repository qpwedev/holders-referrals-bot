import { Context } from "telegraf"
import { addReferral, addVisitor } from "../db/db"
import { TVisitor } from "../utils/types"
import Handlers from "."

const getMessageText = (ctx: Context) => {
    // @ts-ignore
    const messageText = ctx.message?.text
    return messageText
}

const extractStartQueryParamAndType = (text: string) => {
    let path = ''
    let type = undefined

    if (text && text.split(' ').length === 2 && text.split(' ')[0] === '/start') {
        path = text.split(' ')[1]
    }

    if (path && !isNaN(Number(path))) {
        type = 'addReferral'
    } else if (path === 'chat') {
        type = 'chat'
    } else {
        type = 'start'
    }

    return { path, type }
}


const startHandler = async (ctx: Context) => {
    try {
        addVisitor({ ...ctx.from!, created_at: new Date().toISOString() } as TVisitor)

        const messageText = getMessageText(ctx)
        const { path, type } = extractStartQueryParamAndType(messageText)

        const defaultHandler = Handlers.referrals

        switch (type) {
            case 'chat':
                await Handlers.connectWallet(ctx)
                break
            case 'ref':
                await Handlers.referrals(ctx)
                break
            case 'addReferral':
                addReferral(Number(path), ctx.from?.id)
                await defaultHandler(ctx)
                break
            default:
                await defaultHandler(ctx)
                break
        }

    } catch (error) {
        console.log(error)
    }
}

export default startHandler