const Sentry = require('@sentry/node');

module.exports.sentryInit = () => {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV,
        tracesSampleRate: 1.0,
        attachStacktrace: true,
        enableTracing: true,
    });
};
