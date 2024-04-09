import { config } from 'dotenv';
config();
import { Telegraf } from 'telegraf';
import Handlers from './handlers';
import { CallbackQuery } from 'telegraf/typings/core/types/typegram';

console.log('Starting bot...');
const bot = new Telegraf(process.env.BOT_TOKEN || '');

bot.start(
    Handlers.start
);

bot.command('chat', Handlers.connectWallet)
bot.command('ref', Handlers.referrals)

bot.on('callback_query', async (ctx) => {
    const data = (ctx.callbackQuery as CallbackQuery.DataQuery).data
    console.log(data)

    if (data.startsWith('check:')) {
        await Handlers.checkTransactionAndBalance(ctx)
    }
})

bot.catch((e) => {
    console.error(e)
})

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
