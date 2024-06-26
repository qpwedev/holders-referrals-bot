import { Context } from "telegraf"
import { addReferral, addVisitor } from "../db/db"
import { TView, TVisitor } from "../utils/types"
import Handlers from "."
import { extractStartQueryParamAndType, getMessageText } from "../utils"
const startHandler = async (ctx: Context) => {
    try {
        addVisitor({ ...ctx.from!, created_at: new Date().toISOString() } as TVisitor)

        const messageText = getMessageText(ctx)
        const { path, type } = extractStartQueryParamAndType(messageText)

        const defaultHandler = Handlers.menu

        switch (type as TView | 'addReferral') {
            case 'connectWallet':
                await Handlers.connectWallet(ctx)
                break
            case 'referrals':
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