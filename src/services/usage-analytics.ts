import { setup, defaultClient } from 'applicationinsights';

export function initAnalytics() {
  try {
    setup("#{ANALYTICS_CODE}#").start();
  }
  catch (err) {
    console.error("Error initializing analytics", err);
    throw new Error(`Error initializing analytics: ${err}`);
  }
}

export function getAnalyticsClient() {
  return defaultClient;
}