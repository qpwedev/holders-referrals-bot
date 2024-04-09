
export const findUuidInTransactions = (txs: any, uuid: string) => {
    for (let i = 0; i < txs.length; i++) {
        if (txs[i]?.in_msg?.decoded_body?.text === uuid) {
            return txs[i].in_msg
        }
    }
    return null
}