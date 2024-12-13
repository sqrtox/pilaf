import { describe, expect, test } from "bun:test";
import { v } from "@src/index.js";

describe("ops", () => {
  test("or", () => {
    const AllowMethod = v.or(v.val("GET"), v.val("POST"));

    expect(AllowMethod("GET")).toBe(true);
    expect(AllowMethod("POST")).toBe(true);
    expect(AllowMethod(0)).toBe(false);
    expect(AllowMethod("PATCH")).toBe(false);
    expect(AllowMethod("post")).toBe(false);
  });

  test("and", () => {
    const HasName = v.obj({
      name: v.str,
    });
    const HasAge = v.obj({
      age: v.num,
    });
    const Human = v.and(HasName, HasAge);

    expect(Human({ name: "Taro", age: 24 })).toBe(true);
    expect(Human({ name: "Taro" })).toBe(false);
    expect(Human({ age: 24 })).toBe(false);
  });

  test("range", () => {
    const U8 = v.range(0, 256);

    expect(U8("Hello, world!")).toBe(false);
    expect(U8("123")).toBe(false);
    expect(U8(123)).toBe(true);
    expect(U8(-123)).toBe(false);
    expect(U8(1234)).toBe(false);
  });
});
