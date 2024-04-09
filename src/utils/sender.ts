import { Context } from 'telegraf';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';

const animation = async (ctx: Context, text: string, markup: InlineKeyboardButton[][], animationId: string) => {
    const msg = await ctx.telegram.sendAnimation(
        ctx.chat!.id,
        animationId,
        {
            caption: text,
            reply_markup: {
                inline_keyboard: markup,
            },

            parse_mode: "HTML",
        }
    );

    return msg;
}

const photo = async (ctx: Context, text: string, markup: InlineKeyboardButton[][], photoId: string) => {
    const msg = await ctx.telegram.sendPhoto(
        ctx.chat!.id,
        { source: photoId },
        {

            caption: text,
            reply_markup: {
                inline_keyboard: markup,
            },

            parse_mode: "HTML",
        }
    );

    return msg;
}

const text = async (ctx: Context, text: string, markup: InlineKeyboardButton[][]) => {
    await ctx.telegram.sendMessage(
        ctx.chat!.id,
        text,
        {
            reply_markup: {
                inline_keyboard: markup,
            },

            parse_mode: "HTML",
        }
    );
}


const Send = {
    animation,
    text,
    photo

};

export default Send;