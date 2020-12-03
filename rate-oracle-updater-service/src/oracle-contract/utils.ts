import Eth, { TransactionReceipt } from 'web3-eth'

const TIMEOUT_LIMIT = 120000
const POLLING_INTERVAL = 2000

export function waitForReceipt (
  txHash: string,
  eth: Eth
): Promise<TransactionReceipt> {
  let timeElapsed = 0
  return new Promise<TransactionReceipt>((resolve, reject) => {
    const checkInterval = setInterval(async () => {
      timeElapsed += POLLING_INTERVAL
      const receipt = await eth.getTransactionReceipt(txHash)

      if (receipt != null) {
        clearInterval(checkInterval)
        resolve(receipt)
      }

      if (timeElapsed > TIMEOUT_LIMIT) {
        reject(
          new Error('Transaction receipt could not be retrieved - Timeout')
        )
      }
    }, POLLING_INTERVAL)
  })
}
