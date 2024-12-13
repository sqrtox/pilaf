import { describe, expect, test } from "bun:test";
import {
  $arr,
  $arrLike,
  $every,
  $num,
  $obj,
  $range,
  $str,
  $tuple,
  $val,
  ValidatorErrorKind,
} from "@src/index.js";
import { validatorError_ } from "@src/utils/minify.js";
import { testErrors } from "@src/utils/test.js";

// toArrayLike converter
function toArguments(..._args: unknown[]) {
  // biome-ignore lint/style/noArguments: <explanation>
  return arguments;
}

describe("object", () => {
  test("$arrLike", () => {
    const U8 = $every($num, $range(0, 255));
    const Bytes = $arrLike(U8);

    // IArguments [red, green, blue, alpha]
    const pixel = toArguments(255, 0, 0, 255);

    const pixelArray = [255, 0, 0, 255];

    expect(Bytes(pixel)).toBe(true);
    expect(Bytes(pixelArray)).toBe(true);
    expect(Bytes({ length: 0 })).toBe(true);

    testErrors((errors) => {
      const invalidPixel = toArguments(255, 0, 0, "255");

      expect(Bytes(invalidPixel, errors)).toBe(false);
      expect(errors).toContainAllValues([
        validatorError_(ValidatorErrorKind.InvalidProperty, [3]),
      ]);
    });

    testErrors((errors) => {
      expect(Bytes({}, errors)).toBe(false);
      expect(errors).toEqual([]);
    });

    testErrors((errors) => {
      expect(Bytes(null, errors)).toBe(false);
      expect(errors).toEqual([]);
    });

    testErrors((errors) => {
      expect(Bytes({ length: -1 }, errors)).toBe(false);
      expect(errors).toEqual([]);
    });
  });

  test("$arr", () => {
    const U8 = $every($num, $range(0, 255));
    const Bytes = $arr(U8);

    expect(Bytes([255, 0, 0, 255])).toBe(true);

    testErrors((errors) => {
      // IArguments [red, green, blue, alpha]
      const pixel = toArguments(255, 0, 0, 255);

      expect(Bytes(pixel, errors)).toBe(false);
      expect(errors).toEqual([]);
    });

    testErrors((errors) => {
      expect(Bytes([255, 0, 0, "255"], errors)).toBe(false);
    });
  });

  test("$tuple", () => {
    const U8 = $every($num, $range(0, 255));
    const Rgb = $tuple(U8, U8, U8);

    expect(Rgb([255, 0, 0])).toBe(true);

    testErrors((errors) => {
      expect(Rgb([255, 0, "0"], errors)).toBe(false);
      expect(errors).toContainAllValues([
        validatorError_(ValidatorErrorKind.InvalidProperty, [2]),
      ]);
    });

    testErrors((errors) => {
      expect(Rgb([], errors)).toBe(false);
      expect(errors).toContainAllValues([
        validatorError_(ValidatorErrorKind.InvalidProperty, [0]),
        validatorError_(ValidatorErrorKind.InvalidProperty, [1]),
        validatorError_(ValidatorErrorKind.InvalidProperty, [2]),
      ]);
    });

    testErrors((errors) => {
      expect(Rgb([255, 0, 0, 255], errors)).toBe(false);
      expect(errors).toContainAllValues([
        validatorError_(ValidatorErrorKind.UnknownProperty, [3]),
      ]);
    });

    testErrors((errors) => {
      expect(Rgb(null, errors)).toBe(false);
      expect(errors).toEqual([]);
    });
  });

  test("$obj", () => {
    const Human = $obj({
      name: $str,
      age: $num,
    });

    expect(Human({ name: "Taro", age: 24 })).toBe(true);
    expect(Human({ name: "Taro", age: 24, profile: "Hi!" })).toBe(true);

    testErrors((errors) => {
      expect(Human({ name: "Taro" }, errors)).toBe(false);
      expect(errors).toContainAllValues([
        validatorError_(ValidatorErrorKind.InvalidProperty, ["age"]),
      ]);
    });

    testErrors((errors) => {
      expect(Human(null, errors)).toBe(false);
      expect(errors).toEqual([]);
    });

    testErrors((errors) => {
      expect(Human({}, errors)).toBe(false);
      expect(errors).toContainAllValues([
        validatorError_(ValidatorErrorKind.InvalidProperty, ["name"]),
        validatorError_(ValidatorErrorKind.InvalidProperty, ["age"]),
      ]);
    });

    const ExampleUrl = $obj({
      hostname: $val("example.com"),
    });

    expect(ExampleUrl(new URL("https://example.com"))).toBe(true);

    testErrors((errors) => {
      expect(ExampleUrl(new URL("https://sub.example.com"), errors)).toBe(
        false,
      );
      expect(errors).toContainAllValues([
        validatorError_(ValidatorErrorKind.InvalidProperty, ["hostname"]),
      ]);
    });
  });

  test("strict $obj", () => {
    const Human = $obj(
      {
        name: $str,
        age: $num,
      },
      true,
    );

    expect(Human({ name: "Taro", age: 24 })).toBe(true);

    testErrors((errors) => {
      expect(Human({ name: "Taro", age: 24, profile: "Hi!" }, errors)).toBe(
        false,
      );
      expect(errors).toContainAllValues([
        validatorError_(ValidatorErrorKind.UnknownProperty, ["profile"]),
      ]);
    });

    testErrors((errors) => {
      expect(Human({ name: "Taro" }, errors)).toBe(false);
      expect(errors).toContainAllValues([
        validatorError_(ValidatorErrorKind.InvalidProperty, ["age"]),
      ]);
    });
  });

  test("object validator properties", () => {
    const fields = {
      name: $str,
      age: $num,
    };
    const Human = $obj(fields);

    expect(Human.fields).toBe(fields);
    expect(Human.strict).toBe(false);

    const StrictHuman = $obj(fields, true);

    expect(StrictHuman.strict).toBe(true);
  });
});
