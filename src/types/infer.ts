import type {
  LooseValidators,
  Validator,
  ValidatorMap,
  Validators,
} from "@src/types/validator.js";
import type { TupleIndices, UnionToIntersection } from "@src/utils/types.js";

export type Infer<V> = V extends Validator<infer T> ? T : never;

export type InferValidators<Vs extends LooseValidators> = {
  [I in keyof Vs]: Infer<Vs[I]>;
};

export type InferAsUnion<Vs extends Validators> = InferValidators<Vs>[number];

type ToObjectUnion<Vs extends Validators> = {
  [I in TupleIndices<Vs>]: {
    type: Infer<Vs[I]>;
  };
};

type InferObjectUnion<U> = U[keyof U];

export type InferAsIntersection<Vs extends Validators> = InferObjectUnion<
  UnionToIntersection<ToObjectUnion<Vs>[TupleIndices<Vs>]>
>;

export type InferVM<VM extends ValidatorMap> = {
  [K in keyof VM]: Infer<VM[K]>;
};
