import config from 'config'

import { Application, RateUpdaterService } from '../definitions'
import { loggingFactory } from '../logger'
import { RateProviderManager } from '../rate-provider'
import { waitForReadyApp } from '../utils'
import { OracleUpdateEvent, RateUpdateTrigger } from './update-trigger'

const logger = loggingFactory('rate-updater')

const upload: RateUpdaterService = {
  async initialize (app: Application): Promise<{ stop: () => Promise<void> }> {
    await waitForReadyApp(app)
    const rateProviderManager = app.get('rateProvider') as RateProviderManager
    // const oracleContract = app.get('oracleContract')

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
          // TODO Implement oracle update rate transaction
          // await oracleContract.updateRate(rate)
        }
    )

    await rateUpdateTrigger.run('BTC', 'USD')

    return {
      stop: async () => {
        rateUpdateTrigger.stop()
      }
    }
  }
}

export default upload
