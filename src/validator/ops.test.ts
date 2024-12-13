import { describe, expect, test } from "bun:test";
import { $every, $num, $obj, $range, $some, $str, $val } from "@src/index.js";

describe("ops", () => {
  test("$some", () => {
    const AllowMethod = $some($val("GET"), $val("POST"));

    expect(AllowMethod("GET")).toBe(true);
    expect(AllowMethod("POST")).toBe(true);
    expect(AllowMethod(0)).toBe(false);
    expect(AllowMethod("PATCH")).toBe(false);
    expect(AllowMethod("post")).toBe(false);
  });

  test("$every", () => {
    const HasName = $obj({
      name: $str,
    });
    const HasAge = $obj({
      age: $num,
    });
    const Human = $every(HasName, HasAge);

    expect(Human({ name: "Taro", age: 24 })).toBe(true);
    expect(Human({ name: "Taro" })).toBe(false);
    expect(Human({ age: 24 })).toBe(false);
  });

  test("$range", () => {
    const U8 = $range(0, 256);

    expect(U8("Hello, world!")).toBe(false);
    expect(U8("123")).toBe(false);
    expect(U8(123)).toBe(true);
    expect(U8(-123)).toBe(false);
    expect(U8(1234)).toBe(false);
  });
});
