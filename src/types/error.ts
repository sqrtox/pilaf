import type { Path } from "@src/utils/path.js";

export const ValidatorErrorKind = {
  InvalidProperty: 0,
  UnknownProperty: 1,
} as const;

export type ValidatorErrorKind =
  (typeof ValidatorErrorKind)[keyof typeof ValidatorErrorKind];

export interface ValidatorError {
  kind: ValidatorErrorKind;
  path: Path;
}
