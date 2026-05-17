/**
 * Environment Configuration
 *
 * Centralized configuration for environment variables and API endpoints.
 */

/**
 * Get environment variable with fallback
 */
function getEnv(key: string, fallback: string = ""): string {
  const value = import.meta.env[`VITE_${key}`];
  if (!value && !fallback) {
    console.warn(`Missing environment variable: VITE_${key}`);
  }
  return (value || fallback) as string;
}

/**
 * Environment configuration
 */
export const env = {
  // API Configuration
  API_BASE_URL: getEnv("API_BASE_URL", "http://localhost:8000/api/v1"),
  API_GRAPHQL_URL: getEnv("API_GRAPHQL_URL", "http://localhost:8000/graphql"),

  // App Configuration
  APP_ENV: (import.meta.env.MODE || "development") as "development" | "staging" | "production",
  APP_NAME: getEnv("APP_NAME", "CaddyStats"),
  APP_VERSION: getEnv("APP_VERSION", "0.1.0"),

  // Feature Flags
  ENABLE_BETA_FEATURES: getEnv("ENABLE_BETA_FEATURES", "false") === "true",
  ENABLE_DEBUG_TOOLBAR: getEnv("ENABLE_DEBUG_TOOLBAR", "false") === "true",

  // Analytics
  ANALYTICS_ID: getEnv("ANALYTICS_ID", ""),

  // Sentry (Error Tracking)
  SENTRY_DSN: getEnv("SENTRY_DSN", ""),

  // Auth
  AUTH_REDIRECT_URI: getEnv("AUTH_REDIRECT_URI", window.location.origin),

  // Cache Configuration
  CACHE_STRATEGY: getEnv("CACHE_STRATEGY", "memory") as "memory" | "indexeddb" | "hybrid",

  // Debug
  DEBUG: import.meta.env.DEV,
};

/**
 * Validate critical environment variables
 */
export function validateEnvironment(): boolean {
  const required = ["API_BASE_URL"];
  const missing = required.filter((key) => !getEnv(key));

  if (missing.length > 0) {
    console.error("Missing required environment variables:", missing);
    return false;
  }

  return true;
}

/**
 * Log environment configuration (for debugging)
 */
export function logEnvironment(): void {
  if (!env.DEBUG) return;

  console.group("🔧 Environment Configuration");
  console.log("Mode:", env.APP_ENV);
  console.log("API URL:", env.API_BASE_URL);
  console.log("Debug:", env.DEBUG);
  console.table({
    API_BASE_URL: env.API_BASE_URL,
    API_GRAPHQL_URL: env.API_GRAPHQL_URL,
    APP_ENV: env.APP_ENV,
    ENABLE_BETA_FEATURES: env.ENABLE_BETA_FEATURES,
    ENABLE_DEBUG_TOOLBAR: env.ENABLE_DEBUG_TOOLBAR,
  });
  console.groupEnd();
}
