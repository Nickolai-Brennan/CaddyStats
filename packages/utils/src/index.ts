export const compact = <T>(values: Array<T | null | undefined>): T[] =>
  values.filter((value): value is T => value != null);
