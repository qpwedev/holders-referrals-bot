
import { Markup } from "telegraf";
// import uuid

const menu = () => {
    return [
        [
            Markup.button.callback('Holders Chat', 'holders-chat-callback'),
            Markup.button.callback('Invite Friends', 'invite-friends-callback')
        ],
    ]
}


export { menu }