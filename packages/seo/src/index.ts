export const buildCanonicalUrl = (origin: string, pathname: string): string => `${origin.replace(/\/$/, "")}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
