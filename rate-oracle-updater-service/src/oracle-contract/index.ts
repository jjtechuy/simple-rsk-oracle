import config from 'config'
import Eth from 'web3-eth'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import { TransactionReceipt } from 'web3-eth'
import { loggingFactory } from '../logger'

const logger = loggingFactory('oracle-contract')

export class RateOracleContract {
  private readonly eth: Eth
  private readonly from: string
  private contract: Contract

  constructor(eth: Eth, from: string) {
    this.eth = eth
    this.from = from
    this.contract = new eth.Contract(
        [] as AbiItem[],
        config.get<string>('oracle.contractAddress'),
        { from }
    )
  }

  async updateRate (rate: number): Promise<TransactionReceipt> {
    const gasPrice = await this.eth.getGasPrice()
        .catch((error: Error) => {
          logger.error(`Error getting gas price, error:`, error)
          throw error
        })
    const tx = this.contract.methods.updatePrice(rate, Date.now())
    const gas = Math.ceil(await tx.estimateGas({
        from: this.from,
        gasPrice,
    }))

    return tx.send({
      from: this.from,
      gas,
      gasPrice
    })
  }
}
