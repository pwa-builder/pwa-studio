import { setup, defaultClient } from 'applicationinsights';

export function initAnalytics() {
  try {
    setup().start();
  }
  catch (err) {
    console.error("Error initializing analytics", err);
    throw new Error(`Error initializing analytics: ${err}`);
  }
}

export function getAnalyticsClient() {
  return defaultClient;
}