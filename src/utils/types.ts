import { typeofEq } from "@src/utils/minify.js";

export type UnionToIntersection<U> =
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  (U extends any ? (x: U) => void : never) extends (x: infer I) => void
    ? I
    : never;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type TupleIndices<T extends readonly any[]> = Extract<
  keyof T,
  `${number}`
> extends `${infer N extends number}`
  ? N
  : never;

export type Brand<T, U extends string> = T & {
  [K in `_${U}Brand`]: never;
};

export const isArrayLike = <T>(input: unknown): input is ArrayLike<T> => {
  if (input == null) {
    return false;
  }

  const len = (input as { length: unknown }).length;

  return typeofEq(len, "number") && len >= 0;
};
