import type { Validator } from "@src/types/validator.js";
import {
  Object_,
  bigint_,
  boolean_,
  number_,
  string_,
  typeofEq,
} from "@src/utils/minify.js";
import type { Brand } from "@src/utils/types.js";

export const val = <const T>(expect: T): Validator<T> =>
  ((value) => Object_.is(value, expect)) as ReturnType<typeof val<T>>;

export const any: Validator = (() => true) as unknown as typeof any;

export const brand = <const T extends string, U>(
  _name: T,
  validator: Validator<U>,
): Validator<Brand<U, T>> => validator as ReturnType<typeof brand<T, U>>;

export const str: Validator<string> = ((value) =>
  typeofEq(value, string_)) as typeof str;

export const re = (regex: RegExp): Validator<string> =>
  ((value) => typeofEq(value, string_) && regex.test(value)) as ReturnType<
    typeof re
  >;

export const num: Validator<number> = ((value) =>
  typeofEq(value, number_)) as typeof num;

export const bigint: Validator<bigint> = ((value) =>
  typeofEq(value, bigint_)) as typeof bigint;

export const bool: Validator<boolean> = ((value) =>
  typeofEq(value, boolean_)) as typeof bool;