import { describe, expect, test } from "bun:test";
import { v } from "@src/index.js";

describe("value", () => {
  test("any", () => {
    const Any = v.any;

    expect(Any(0)).toBe(true);
    expect(Any(null)).toBe(true);
    expect(Any("Hello, world!")).toBe(true);
    expect(Any(false)).toBe(true);
    expect(Any([])).toBe(true);
    expect(Any({})).toBe(true);
  });

  test("val", () => {
    const Zero = v.val(0);

    expect(Zero(0)).toBe(true);
    expect(Zero(-0)).toBe(false);
    expect(Zero("")).toBe(false);
    expect(Zero(false)).toBe(false);
    expect(Zero(null)).toBe(false);

    const NotANumber = v.val(Number.NaN);

    expect(NotANumber(-Number.NaN)).toBe(true);
    expect(NotANumber(0)).toBe(false);
    expect(NotANumber("")).toBe(false);
  });

  test("brand", () => {
    const U8 = v.brand("u8", v.and(v.num, v.range(0, 255)));
    const value = 0;

    expect(U8(value)).toBe(true);

    // Brand tags are not present at runtime
    expect("_u8Brand" in Object(value)).toBe(false);
  });

  test("str", () => {
    const Name = v.str;

    expect(Name("Taro")).toBe(true);
    expect(Name(0)).toBe(false);
  });

  test("re", () => {
    const Name = v.re(/taro/i);

    expect(Name("Taro")).toBe(true);
    expect(Name("Momotaro")).toBe(true);
    expect(Name("Jirou")).toBe(false);
    expect(Name(0)).toBe(false);
  });

  test("num", () => {
    const Age = v.num;

    expect(Age(24)).toBe(true);
    expect(Age(Number.NaN)).toBe(true);
    expect(Age("Taro")).toBe(false);
  });

  test("num", () => {
    const Age = v.num;

    expect(Age(24)).toBe(true);
    expect(Age(Number.NaN)).toBe(true);
    expect(Age("Taro")).toBe(false);
  });

  test("bigint", () => {
    const Big = v.bigint;

    expect(Big(1n)).toBe(true);
    expect(Big(1)).toBe(false);
    expect(Big(Number.NaN)).toBe(false);
    expect(Big("Taro")).toBe(false);
  });

  test("bool", () => {
    const Flag = v.bool;

    expect(Flag(false)).toBe(true);
    expect(Flag(0)).toBe(false);
    expect(Flag("")).toBe(false);
  });
});
