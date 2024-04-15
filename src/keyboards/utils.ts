import { Markup } from "telegraf";
import { TView } from "../utils/types";

const createBackButton = (viewName: TView) => {
    return Markup.button.callback('⬅ Back', `back-button-${viewName}`)

}

export { createBackButton }