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

bot.command('connectWallet', Handlers.connectWallet)
bot.command('referrals', Handlers.referrals)

bot.on('callback_query', async (ctx) => {
    const data = (ctx.callbackQuery as CallbackQuery.DataQuery).data

    if (data.startsWith('check:')) {
        await Handlers.checkTransactionAndBalance(ctx)
    } else if (data === 'holders-chat-callback') {
        await Handlers.connectWallet(ctx)
    } else if (data === 'invite-friends-callback') {
        await Handlers.referrals(ctx)
    } else if (data.startsWith('back-button-')) {
        await Handlers.backButton(ctx)
    }
})


// [
//     Markup.button.callback('Holders Chat', '')
// ],
// [
//     Markup.button.callback('Invite Friends', 'invite-friends-callback')
// ],

bot.catch((e) => {
    console.error(e)
})

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
