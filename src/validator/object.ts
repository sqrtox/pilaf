import { ValidatorErrorKind } from "@src/types/error.js";
import type { Infer, InferValidators } from "@src/types/infer.js";
import type {
  LooseValidators,
  ObjectValidator,
  Validator,
  ValidatorMap,
} from "@src/types/validator.js";
import {
  Array_,
  Object_,
  Reflect_ownKeys_,
  Set_,
  validatorError_,
} from "@src/utils/minify.js";
import { isArrayLike } from "@src/utils/types.js";

export const $arrLike = <V extends Validator>(
  item: V,
): Validator<ArrayLike<Infer<V>[]>> =>
  ((input, errors = [], path = []) => {
    if (!isArrayLike(input)) {
      return false;
    }

    let valid = true;
    const len = input.length;

    for (let i = 0; i < len; i++) {
      const propPath = [...path, i];

      if (!item(input[i], errors, propPath)) {
        errors.push(
          validatorError_(ValidatorErrorKind.InvalidProperty, propPath),
        );
        valid = false;
      }
    }

    return valid;
  }) as ReturnType<typeof $arrLike<V>>;

export const $arr = <V extends Validator>(item: V): Validator<Infer<V>[]> => {
  const validator = $arrLike(item);

  return ((input, ...rest) =>
    Array_.isArray(input) && validator(input, ...rest)) as ReturnType<
    typeof $arr<V>
  >;
};

export const $obj = <VM extends ValidatorMap>(
  fields: VM,
  strict = false,
): ObjectValidator<VM> => {
  const validator = ((input, errors = [], path = []) => {
    if (input == null) {
      return false;
    }

    const unchecked = new Set_(Reflect_ownKeys_(Object_(input)));

    if (input.constructor !== Object_) {
      for (const key of Reflect_ownKeys_(Object_.getPrototypeOf(input))) {
        unchecked.add(key);
      }
    }

    let valid = true;

    for (const [key, validator] of Object_.entries(fields)) {
      // biome-ignore lint/suspicious/noExplicitAny: TODO: <explanation>
      const prop = (input as any)[key];
      const propPath = [...path, key];

      if (validator(prop, errors, propPath)) {
        unchecked.delete(key);
      } else {
        errors.push(
          validatorError_(ValidatorErrorKind.InvalidProperty, propPath),
        );
        valid = false;
      }
    }

    if (strict && unchecked.size) {
      errors.push(
        ...[...unchecked].map((key) =>
          validatorError_(ValidatorErrorKind.UnknownProperty, [...path, key]),
        ),
      );
      valid = false;
    }

    return valid;
  }) as ReturnType<typeof $obj<VM>>;

  Object_.assign(validator, {
    fields,
    strict,
  });

  return validator;
};

export const $tuple = <Vs extends LooseValidators>(
  ...values: Vs
): Validator<InferValidators<Vs>> =>
  ((input, errors = [], path = []) => {
    if (!Array_.isArray(input)) {
      return false;
    }

    let valid = true;
    let checked = 0;

    for (const [i, value] of values.entries()) {
      const item = input[i];
      const itemPath = [...path, i];

      if (!value(item, errors, path)) {
        errors.push(
          validatorError_(ValidatorErrorKind.InvalidProperty, itemPath),
        );
        valid = false;
      }

      checked++;
    }

    const len = input.length;

    // on not match length
    while (checked < len) {
      errors.push(
        validatorError_(ValidatorErrorKind.UnknownProperty, [...path, checked]),
      );
      valid = false;
      checked++;
    }

    return valid;
  }) as ReturnType<typeof $tuple<Vs>>;
