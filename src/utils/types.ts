import { CallbackQuery } from "telegraf/typings/core/types/typegram";

export type TVisitor = {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    created_at: string;
}


export type FetchTransactionsParams = {
    address: string;
    limit?: number;
}

export type TransactionResponse = {
    transactions: any[];
}