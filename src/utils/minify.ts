/**
 * Utilities for minify
 */

import type { ValidatorError, ValidatorErrorKind } from "@src/types.js";
import type { Path } from "./path.js";

export const string_ = "string";
export const number_ = "number";
export const boolean_ = "boolean";
export const undefined_ = "undefined";
export const object_ = "object";
export const function_ = "function";
export const symbol_ = "symbol";
export const bigint_ = "bigint";

interface TypeMap {
  string: string;
  number: number;
  boolean: boolean;
  undefined: undefined;
  object: object | null;
  // biome-ignore lint/complexity/noBannedTypes: TODO: <explanation>
  function: Function;
  symbol: symbol;
  bigint: bigint;
}

export const typeofEq = <T extends keyof TypeMap>(
  value: unknown,
  type: T,
): value is TypeMap[T] =>
  // biome-ignore lint/suspicious/useValidTypeof: TODO: <explanation>
  typeof value === type;

export const Object_: typeof Object = Object;

export const Reflect_: typeof Reflect = Reflect;

export const Reflect_ownKeys_: typeof Reflect_.ownKeys = Reflect_.ownKeys;

export const Number_: typeof Number = Number;

export const Set_: typeof Set = Set;

export const Array_: typeof Array = Array;

export const validatorError_ = (
  kind: ValidatorErrorKind,
  path: Path,
): ValidatorError => ({
  kind,
  path,
});
