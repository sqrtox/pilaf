import type { ValidatorError } from "@src/types.js";

export const testErrors = (func: (errors: ValidatorError[]) => void): void => {
  func([]);
};
