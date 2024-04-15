import { Context } from 'telegraf';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';

const photo = async (
    ctx: Context,
    text: string,
    markup: InlineKeyboardButton[][],
    photoId: string,
    messageId?: number
) => {
    if (messageId) {
        try {
            const msg = await ctx.telegram.editMessageMedia(
                ctx.chat!.id,
                messageId,
                undefined,
                {
                    type: 'photo',
                    media: { source: photoId },
                    caption: text,
                    parse_mode: 'HTML'
                },
                {
                    reply_markup: {
                        inline_keyboard: markup
                    }
                }
            );
            return msg;
        }
        catch (e) {
            const msg = await ctx.telegram.sendPhoto(
                ctx.chat!.id,
                { source: photoId },
                {
                    caption: text,
                    reply_markup: {
                        inline_keyboard: markup
                    },
                    parse_mode: 'HTML'
                }
            );
            return msg;
        }
    } else {
        const msg = await ctx.telegram.sendPhoto(
            ctx.chat!.id,
            { source: photoId },
            {
                caption: text,
                reply_markup: {
                    inline_keyboard: markup
                },
                parse_mode: 'HTML'
            }
        );
        return msg;
    }
}

const Send = {
    photo
};

export default Send;
