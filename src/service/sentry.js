import * as Sentry from '@sentry/vue'

export const initSentry = (app, router) => {
  if (import.meta.env.PROD)
    Sentry.init({
      app,
      dsn: 'https://cc4a4be547264dba8ff33d7f1b20277c@o4504902406373376.ingest.sentry.io/4505030214090752',
      integrations: [
        new Sentry.BrowserTracing({
          routingInstrumentation: Sentry.vueRouterInstrumentation(router),
          tracePropagationTargets: [import.meta.env.VITE_APP_URL, /^\//],
        }),
      ],
      tracesSampleRate: 1.0,
    })
}
