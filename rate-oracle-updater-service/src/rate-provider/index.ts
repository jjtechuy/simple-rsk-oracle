import config from 'config'

import { Application, RateProvider } from '../definitions'
import { loggingFactory } from '../logger'
import { CryptoCompareProvider } from './crypto-compare'

const logger = loggingFactory('rate-provider-manger')

export type RateEntity = { current: number, previous: number }

export class RateProviderManager {
  private provider?: RateProvider
  private rates: Record<string, RateEntity> = {}

  public getLastRate (from: string, to: string): RateEntity {
    return this.rates[`${from}/${to}`]
  }

  private updateRate (from: string, to: string, rate: number): void {
    const currentRate = this.getLastRate(from, to)
    logger.debug(`Store rate for ${from}/${to}, previous = ${currentRate ? currentRate.current : rate}, current = ${rate}`)
    this.rates = {
      ...this.rates,
      [`${from}/${to}`]: {
        ...currentRate
          ? { current: rate, previous: currentRate.current }
          : { current: rate, previous: rate }
      }
    }
  }

  public register (provider: RateProvider): void {
    this.provider = provider
  }

  public async fetchRate (from: string, to = 'USD'): Promise<number> {
    if (!this.provider) {
      throw new Error('Rate provider is not initialized!')
    }

    const rate = await this.provider.fetchRate(from, to)
    this.updateRate(from, to, rate)
    return rate
  }
}

export default function (app: Application): void {
  const rateProviderManager = new RateProviderManager()
  const cryptoCompareProvider = new CryptoCompareProvider(config.get<string>('rateApi.url'), config.get<string>('rateApi.token'))
  rateProviderManager.register(cryptoCompareProvider)
  app.set('rateProvider', rateProviderManager)
}
