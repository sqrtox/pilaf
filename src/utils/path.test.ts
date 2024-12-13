import { describe, expect, test } from "bun:test";
import { access } from "@src/index.js";

describe("path", () => {
  test("access", () => {
    const target = {
      a: {
        b: {
          c: 1,
        },
      },
    };

    expect(access(target, [])).toBe(target);
    expect(access(target, ["a", "b", "c"])).toBe(1);
    expect(() => access(target, ["a", "b", "c", "d", "e"])).toThrow();
  });
});
