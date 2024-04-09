import { FetchTransactionsParams, TransactionResponse } from "../utils/types";

const BASE_URL = 'https://tonapi.io/v2/';

/**
 * Fetches transactions for a given account address.
 * 
 * @param {FetchTransactionsParams} params - The parameters for fetching transactions, including address and limit.
 * @returns {Promise<TransactionResponse['transactions']>} A promise that resolves to an array of transactions.
 * @throws {Error} Throws an error if the network response is not OK.
 */
export async function fetchTransactions({
    address,
    limit = 100,
}: FetchTransactionsParams): Promise<TransactionResponse['transactions']> {
    const url = `${BASE_URL}blockchain/accounts/${address}/transactions?limit=${limit}`;
    const headers = {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TONAPI_KEY}`,
    };

    const response = await fetch(url, { headers });

    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }

    const data: TransactionResponse = await response.json();
    return data.transactions;
}
