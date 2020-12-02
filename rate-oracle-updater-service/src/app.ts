import config from 'config'
import compress from 'compression'
import helmet from 'helmet'
import cors, { CorsOptionsDelegate } from 'cors'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'

import { Application } from './definitions'
import { loggingFactory } from './logger'
import healthcheck from './healthcheck'
import blockchain from './blockchain'
import rateProvider from './rate-provider'
import rateUpdater from './rate-updater'
import { errorHandler, waitForConfigure } from './utils'

const logger = loggingFactory()

export async function appFactory (): Promise<{ app: Application, stop: () => Promise<void> }> {
  const app: Application = express(feathers())

  logger.verbose('Current configuration: ', config)
  const corsOptions: CorsOptionsDelegate = config.get('cors')

  // Enable security, CORS, compression and body parsing
  app.use(helmet())
  app.use(cors(corsOptions))
  app.use(compress())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // Set up Plugins and rate-provider
  app.configure(express.rest())

  // Custom general services
  await waitForConfigure(app, blockchain)
  app.configure(healthcheck)
  app.configure(rateProvider)

  /**********************************************************/

  // Init rate-updater service
  const rateUpdaterService = await errorHandler(rateUpdater.initialize, logger, true)(app)

  // Log errors in hooks
  app.hooks({
    error (context) {
      logger.error(`Error in '${context.path}' service method '${context.method}'`, context.error.stack)
    }
  })

  // Configure a middleware for 404s and the error handler
  app.use(express.notFound())
  app.use(express.errorHandler({ logger }))

  return {
    app,
    stop: async (): Promise<void> => {
      await rateUpdaterService.stop()
    }
  }
}
