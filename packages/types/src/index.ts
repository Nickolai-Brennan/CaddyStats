export type EnvironmentName = "local" | "development" | "test" | "staging" | "production";

export interface SeoMetadata {
  title: string;
  description: string;
  canonicalUrl?: string;
}
