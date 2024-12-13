import type { InferAsIntersection, InferAsUnion } from "@src/types/infer.js";
import type { Validator, Validators } from "@src/types/validator.js";
import { Number_, bigint_, number_, typeofEq } from "@src/utils/minify.js";

export const $some = <Vs extends Validators>(
  ...vs: Vs
): Validator<InferAsUnion<Vs>> =>
  ((value) => vs.some((v) => v(value))) as ReturnType<typeof $some>;

export const $every = <Vs extends Validators>(
  ...vs: Vs
): Validator<InferAsIntersection<Vs>> =>
  ((value) => vs.every((v) => v(value))) as ReturnType<typeof $every>;

export const $range = (
  min: number | bigint = Number_.NEGATIVE_INFINITY,
  max: number | bigint = Number_.POSITIVE_INFINITY,
): Validator<number | bigint> =>
  ((value) =>
    (typeofEq(value, number_) || typeofEq(value, bigint_)) && // comparable number-like types
    value >= min &&
    value <= max) as ReturnType<typeof $range>;
