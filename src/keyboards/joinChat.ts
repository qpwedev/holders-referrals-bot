
import { Markup } from "telegraf";
import { createBackButton } from "./utils";

const joinChat = (url: string) => {
    return [
        [
            Markup.button.url('👾 Join', url)
        ],
        [
            createBackButton('menu')
        ]
    ]
}

export { joinChat }