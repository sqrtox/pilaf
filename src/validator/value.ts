import type { Validator } from "@src/types/validator.js";
import {
  Object_,
  bigint_,
  boolean_,
  number_,
  string_,
  symbol_,
  typeofEq,
  undefined_,
} from "@src/utils/minify.js";
import type { Brand } from "@src/utils/types.js";
import { $some } from "@src/validator/ops.js";

export const $val = <const T>(expect: T): Validator<T> =>
  ((value) => Object_.is(value, expect)) as ReturnType<typeof $val<T>>;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const $enum = <const T extends [any, ...any[]]>(
  ...variants: T
): Validator<T[number]> =>
  $some(
    ...(variants.map((variant) => $val(variant)) as {
      [I in keyof T]: Validator<T[I]>;
    }),
  );

export const $any: Validator = (() => true) as unknown as typeof $any;

export const $brand = <const T extends string, U>(
  _name: T,
  validator: Validator<U>,
): Validator<Brand<U, T>> => validator as ReturnType<typeof $brand<T, U>>;

export const $str: Validator<string> = ((value) =>
  typeofEq(value, string_)) as typeof $str;

export const $re = (regex: RegExp): Validator<string> =>
  ((value) => typeofEq(value, string_) && regex.test(value)) as ReturnType<
    typeof $re
  >;

export const $num: Validator<number> = ((value) =>
  typeofEq(value, number_)) as typeof $num;

export const $bigint: Validator<bigint> = ((value) =>
  typeofEq(value, bigint_)) as typeof $bigint;

export const $bool: Validator<boolean> = ((value) =>
  typeofEq(value, boolean_)) as typeof $bool;

export const $sym: Validator<symbol> = ((value: unknown) =>
  typeofEq(value, symbol_)) as typeof $sym;

export const $null: Validator<null> = ((value) =>
  value === null) as typeof $null;

export const $undef: Validator<undefined> = ((value) =>
  typeofEq(value, undefined_)) as typeof $undef;
