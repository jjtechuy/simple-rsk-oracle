import config from 'config'
import { Eth } from 'web3-eth'

import { Application, RateUpdaterService } from '../definitions'
import { loggingFactory } from '../logger'
import { RateOracleContract } from '../oracle-contract'
import { RateProviderManager } from '../rate-provider'
import { waitForReadyApp } from '../utils'
import { OracleUpdateEvent, RateUpdateTrigger } from './update-trigger'

const logger = loggingFactory('rate-updater')

const upload: RateUpdaterService = {
  async initialize (app: Application): Promise<{ stop: () => Promise<void> }> {
    await waitForReadyApp(app)
    const rateProviderManager = app.get('rateProvider') as RateProviderManager
    const eth = app.get('eth') as Eth
    const oracleContract = new RateOracleContract(eth, config.get<string>('oracle.account'))

    if (!config.has('rateUpdateThreshold')) {
      throw new Error('Rate update threshold not configured!')
    }

    if (!config.has('rateApi.ratePollInterval')) {
      throw new Error('Rate poll interval not configured!')
    }

    const rateUpdateTrigger = new RateUpdateTrigger(
      rateProviderManager,
      config.get<number>('rateUpdateThreshold'),
      config.get<number>('rateApi.ratePollInterval'),
      config.get<number>('rateUpdateInterval')
    )

    rateUpdateTrigger.on(
      OracleUpdateEvent,
      async (rate: number) => {
        logger.info(`Need to update Oracle with rate ${rate}`)
        logger.debug(await oracleContract.updateRate(rate))
      }
    )

    await rateUpdateTrigger.run('BTC', 'USD')

    return {
      // eslint-disable-next-line require-await
      stop: async () => {
        rateUpdateTrigger.stop()
      }
    }
  }
}

export default upload
