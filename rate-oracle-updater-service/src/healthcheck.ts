import type { Application } from './definitions'

const HEALTHCHECK_ROUTE = '/healthcheck'
export default function (app: Application): void {
  app.use(HEALTHCHECK_ROUTE, async (req, res) => {
    // try {
    //   await storage.version()
    // } catch (e) {
    //   res.status(500).send('No Storage connection')
    // }
    //
    // try {
    //   await sequelize.authenticate()
    // } catch (e) {
    //   res.status(500).send('No DB connection')
    // }

    res.status(204).end()
  })
}
