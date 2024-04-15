import { Context } from "telegraf"
import { addReferral, addVisitor } from "../db/db"
import { TView, TVisitor } from "../utils/types"
import Handlers from "."
import { extractStartQueryParamAndType, getMessageText } from "../utils"

export const backButton = async (ctx: Context) => {
    try {
        // @ts-ignore
        const messageText = ctx.update.callback_query?.data
        const { path, type } = extractStartQueryParamAndType(messageText)

        if (path === undefined || type === undefined || type === 'menu') {
            await Handlers.menu(ctx)
            return
        }

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
