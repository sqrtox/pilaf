import { describe, expect, test } from "bun:test";
import { v } from "@src/index.js";

describe("path", () => {
  test("access", () => {
    const target = {
      a: {
        b: {
          c: 1,
        },
      },
    };

    expect(v.access(target, [])).toBe(target);
    expect(v.access(target, ["a", "b", "c"])).toBe(1);
    expect(() => v.access(target, ["a", "b", "c", "d", "e"])).toThrow();
  });
});
