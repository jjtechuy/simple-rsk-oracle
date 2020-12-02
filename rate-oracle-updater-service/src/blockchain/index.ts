import config from 'config'
import Eth from 'web3-eth'

import { Application } from '../definitions'
import { loggingFactory } from '../logger'

const logger = loggingFactory('blockchain')

export async function ethFactory (): Promise<Eth> {
  const provider = Eth.givenProvider || config.get('blockchain.provider')
  logger.info(`Connecting to provider ${provider}`)
  const eth = new Eth(provider)
  try {
    await eth.getProtocolVersion()
  } catch (e) {
    throw new Error(`Can't connect to the node on address ${provider}`)
  }
  return eth
}

export default async function (app: Application) {
  const eth = await ethFactory()
  app.set('eth', eth)
}
