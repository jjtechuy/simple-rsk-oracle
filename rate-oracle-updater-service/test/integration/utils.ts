import config from 'config'
import { Server } from 'http'
import Eth, { TransactionReceipt } from 'web3-eth'

import { loggingFactory } from '../../src/logger'
import { appFactory } from '../../src/app'
import { Application } from '../../src/definitions'
import { sleep } from '../utils'

export class TestingApp {
  private readonly logger = loggingFactory('test:test-app')
  public server: undefined | Server
  public app: { stop: () => void, app: Application } | undefined
  public account: any

  async initAndStart (options?: any, force = false): Promise<void> {
    if (this.app && !force) {
      return
    }
    // TODO add oracle contract deploy
    // await this.init()
    this.logger.info('App initialized')
    await this.start(options)
    this.logger.info('App started')
  }

  async start (options?: Partial<any>): Promise<void> {
    // Run Upload service
    this.app = await appFactory()

    // Start server
    const port = config.get('port')
    this.server = this.app.app.listen(port)
    this.logger.info('Cache service started')

    this.server.on('listening', () =>
      this.logger.info(`Server started on port ${port}`)
    )

    process.on('unhandledRejection', err =>
      this.logger.error(`Unhandled Rejection at: ${err}`)
    )
  }

  async stop (): Promise<void> {
    if (this.app) {
      await this.app.stop()
    }

    this.server?.close()
    this.app = undefined
    await sleep(1000)
  }
}
