import config from 'config'
import { Account } from 'web3-core'
import Eth, { TransactionReceipt } from 'web3-eth'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'

import { loggingFactory } from '../logger'

const logger = loggingFactory('oracle-contract')

const TIMEOUT_LIMIT = 120000
const POLLING_INTERVAL = 2000

function waitForReceipt (
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

export class RateOracleContract {
  private readonly eth: Eth
  private contract: Contract
  private account: Account

  constructor (eth: Eth, privateKey: string) {
    this.eth = eth
    this.account = this.eth.accounts.privateKeyToAccount(privateKey)
    this.contract = new eth.Contract(
        [] as AbiItem[],
        config.get<string>('oracle.contractAddress')
    )
  }

  public async send (tx: any, gas: number | string, gasPrice: number | string, callBack: any): Promise<TransactionReceipt> {
    const encodedABI = tx.encodeABI()
    const signedTx = await this.account.signTransaction(
      {
        data: encodedABI,
        from: this.account.address,
        gas,
        gasPrice,
        to: this.contract.options.address
      }
    )
    return this.eth.sendSignedTransaction(signedTx.rawTransaction!, callBack)
  }

  async updateRate (rate: number): Promise<TransactionReceipt> {
    const gasPrice = await this.eth.getGasPrice()
      .catch((error: Error) => {
        logger.error('Error getting gas price, error:', error)
        throw error
      })
    const tx = this.contract.methods.updatePrice(rate, Date.now())
    const gas = Math.ceil(await tx.estimateGas({
      from: this.account.address,
      gasPrice
    }))

    return await new Promise<TransactionReceipt>((resolve, reject) => {
      this.send(
        tx,
        gas,
        gasPrice,
        async (err: any, txHash: any) => {
          try {
            if (err) throw err
            const receipt = await waitForReceipt(txHash, this.eth)
            return resolve(receipt)
          } catch (e) {
            return reject(e)
          }
        })
    })
  }
}
