import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://56f37c20553f029a413b628a4ee751d2@o4507640477450240.ingest.de.sentry.io/4507640480268368",

  integrations: [Sentry.replayIntegration()],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});
