import type { ValidatorError } from "@src/types/error.js";
import type { InferVM } from "@src/types/infer.js";
import type { Path } from "@src/utils/path.js";

type ValidatorFunction<T> = (
  value: unknown,
  errors?: ValidatorError[],
  _path?: Path,
) => value is T;

interface ValidatorTag {
  _validator: never;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type Validator<T = any> = ValidatorFunction<T> & ValidatorTag;

export type ObjectValidator<VM extends ValidatorMap> = Validator<
  InferVM<VM>
> & {
  /**
   * Definition of object schema. You can reuse and extend existing definitions as follows
   * ```
   * const User = v.obj({
   *   email: v.str,
   *   name: v.str
   * });
   *
   * const Admin = v.obj({
   *   ...User.fields,
   *   permissions: v.arr(v.str)
   * });
   * ```
   */
  readonly fields: VM;
  readonly strict: boolean;
};

export type Validators = [Validator, ...Validator[]];

export type LooseValidators = Validator[];

export type ValidatorMap = Record<string | symbol | number, Validator>;
