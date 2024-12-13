import { describe, expect, test } from "bun:test";
import {
  $any,
  $bigint,
  $bool,
  $brand,
  $enum,
  $every,
  $null,
  $num,
  $range,
  $re,
  $str,
  $sym,
  $undef,
  $val,
} from "@src/index.js";

describe("value", () => {
  test("$any", () => {
    const Any = $any;

    expect(Any(0)).toBe(true);
    expect(Any(null)).toBe(true);
    expect(Any("Hello, world!")).toBe(true);
    expect(Any(false)).toBe(true);
    expect(Any([])).toBe(true);
    expect(Any({})).toBe(true);
  });

  test("$val", () => {
    const Zero = $val(0);

    expect(Zero(0)).toBe(true);
    expect(Zero(-0)).toBe(false);
    expect(Zero("")).toBe(false);
    expect(Zero(false)).toBe(false);
    expect(Zero(null)).toBe(false);

    const NotANumber = $val(Number.NaN);

    expect(NotANumber(-Number.NaN)).toBe(true);
    expect(NotANumber(0)).toBe(false);
    expect(NotANumber("")).toBe(false);
  });

  test("$enum", () => {
    const AllowMethod = $enum("GET", "POST");

    expect(AllowMethod("GET")).toBe(true);
    expect(AllowMethod("POST")).toBe(true);
    expect(AllowMethod(0)).toBe(false);
    expect(AllowMethod("PATCH")).toBe(false);
    expect(AllowMethod("post")).toBe(false);
  });

  test("$brand", () => {
    const U8 = $brand("u8", $every($num, $range(0, 255)));
    const value = 0;

    expect(U8(value)).toBe(true);

    // Brand tags are not present at runtime
    expect("_u8Brand" in Object(value)).toBe(false);
  });

  test("$str", () => {
    const Name = $str;

    expect(Name("Taro")).toBe(true);
    expect(Name(0)).toBe(false);
  });

  test("$re", () => {
    const Name = $re(/taro/i);

    expect(Name("Taro")).toBe(true);
    expect(Name("Momotaro")).toBe(true);
    expect(Name("Jirou")).toBe(false);
    expect(Name(0)).toBe(false);
  });

  test("$num", () => {
    const Age = $num;

    expect(Age(24)).toBe(true);
    expect(Age(Number.NaN)).toBe(true);
    expect(Age("Taro")).toBe(false);
  });

  test("$bigint", () => {
    const Big = $bigint;

    expect(Big(1n)).toBe(true);
    expect(Big(1)).toBe(false);
    expect(Big(Number.NaN)).toBe(false);
    expect(Big("Taro")).toBe(false);
  });

  test("$bool", () => {
    const Flag = $bool;

    expect(Flag(false)).toBe(true);
    expect(Flag(0)).toBe(false);
    expect(Flag("")).toBe(false);
  });

  test("$sym", () => {
    const AnySymbol = $sym;

    expect(AnySymbol(Symbol())).toBe(true);
    expect(AnySymbol("")).toBe(false);
  });

  test("$null", () => {
    const Null = $null;

    expect(Null(null)).toBe(true);
    expect(Null(undefined)).toBe(false);
    expect(Null("")).toBe(false);
    expect(Null({})).toBe(false);
  });

  test("$undef", () => {
    const Undef = $undef;

    expect(Undef(undefined)).toBe(true);
    expect(Undef(null)).toBe(false);
    expect(Undef("")).toBe(false);
    expect(Undef({})).toBe(false);

    // NOTE: document.all should pass the test
    // expect(Undef(document.all)).toBe(true);
  });
});
