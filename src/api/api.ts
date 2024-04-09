
const BASE_URL = 'https://tonapi.io/v2/';

interface FetchTransactionsParams {
    address: string;
    limit?: number;
}

interface TransactionResponse {
    transactions: any[];
}

export async function fetchTransactions({
    address,
    limit = 100,
}: FetchTransactionsParams): Promise<any> {
    const response = await fetch(BASE_URL + `blockchain/accounts/${address}/transactions?limit=${limit}`, {
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${process.env.TONAPI_KEY}`,
        }
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data: TransactionResponse = await response.json();
    return data.transactions;
}
