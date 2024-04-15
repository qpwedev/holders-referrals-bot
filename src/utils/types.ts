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

export type FetchJettonsParams = {
    address: string;
    currencies?: string[];
}

export type TransactionResponse = {
    transactions: any[];
}

export type JettonResponse = {
    balances: any[];
}


export type TView = "menu" | "referrals" | "joinChat" | "connectWallet";