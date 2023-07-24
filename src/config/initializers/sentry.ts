import { initializer } from 'hyperstack'
import * as Sentry from '@sentry/node'

export default initializer(async ({ logger }) => ({
  beforeControllers(app) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Sentry.Integrations.Express({ app }),
        new Sentry.Integrations.Postgres({ usePgNative: true }),
      ],

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
    })

    app.use(Sentry.Handlers.requestHandler())
    app.use(Sentry.Handlers.tracingHandler())
  },
  afterControllers(app) {
    app.use(Sentry.Handlers.errorHandler())
    logger().info('initialized Sentry.')
  },
}))
