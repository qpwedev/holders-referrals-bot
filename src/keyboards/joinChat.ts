
import { Markup } from "telegraf";
// import uuid

const joinChat = (url: string) => {
    return [
        [
            Markup.button.url('👾 Join', url)
        ],

    ]
}


export { joinChat }