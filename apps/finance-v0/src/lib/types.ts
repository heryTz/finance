import { Decimal } from "@prisma/client/runtime/library";

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type SerializeObject<T> = T extends Decimal
  ? string
  : T extends Date
    ? string
    : T extends object
      ? { [K in keyof T]: SerializeObject<T[K]> }
      : T;

export type SerializeData<T> =
  T extends Array<infer U> ? Array<SerializeObject<U>> : SerializeObject<T>;
