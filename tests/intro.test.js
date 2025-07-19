import { describe, expect, it } from "vitest";
import { calculateAverage, factorial, fizzBuzz, max } from "../src/intro";
describe("max", () => {
  it("should return first argument if it is greater", () => {
    expect(max(2, 1)).toBe(2);
  });
  it("should return second argument if it is greater", () => {
    expect(max(11, 22)).toBe(22);
  });

  it("should return first argument if both are equal", () => {
    expect(max(2, 2)).toBe(2);
  });
});

describe("FizzBuzz", () => {
  it("should return FizzBuzz if argument is divisible by 3 & 5", () => {
    expect(fizzBuzz(15)).toBe("FizzBuzz");
  });

  it("should return Fizz if argument is only divisible by 3", () => {
    expect(fizzBuzz(6)).toBe("Fizz");
  });

  it("should return Buzz if argument is only divisible by 5", () => {
    expect(fizzBuzz(10)).toBe("Buzz");
  });

  it("should return the given argument if it is not divisible by 3 or 5", () => {
    expect(fizzBuzz(11)).toBe("11");
  });
});

describe("CalcAverage", () => {
  it("should return Nan if array length is 0", () => {
    expect(calculateAverage([])).toBe(NaN);
  });

  it("should calculate average of an array with 1 element", () => {
    expect(calculateAverage([1])).toBe(1);
  });

  it("should calculate average of an array with 2 elements", () => {
    expect(calculateAverage([1, 2])).toBe(1.5);
  });

  it("should calculate average of an array with 3 elements", () => {
    expect(calculateAverage([1, 2, 3])).toBe(2);
  });
});

describe("factorial", () => {
  it("shoud return 0 if given 1", () => {
    expect(factorial(0)).toBe(1);
  });

  it("shoud return 1 if given 1", () => {
    expect(factorial(1)).toBe(1);
  });

  it("shoud return 6 if given 3", () => {
    expect(factorial(3)).toBe(6);
  });

  it("shoud return 24 if given 4", () => {
    expect(factorial(4)).toBe(24);
  });
});

describe("test suite", () => {
  it("string test case", () => {
    const result = "the required file was not found";

    // Loose (too general)
    expect(result).toBeDefined();
    // Tight (too specific)
    expect(result).toBe("the required file was not found");
    // Better assertion
    expect(result).toMatch(/Not found/i);
  });

  it("Number test case", () => {
    const result = [1, 2, 3];

    // Loose (too general)
    expect(result).toBeDefined();
    // Tight (too specific)
    expect(result).toEqual([1, 2, 3]);
    // Better assertion
    expect(result).toEqual(expect.arrayContaining([2, 1, 3]));

    expect(result.length).toBeGreaterThan(0);
  });

  it("Object test case", () => {
    const result = { name: "sairam", id: 22 };
    expect(result).toMatchObject({ name: "sairam" });
    expect(result).toHaveProperty("name");
    expect(typeof result.name).toBe("string");
  });
});
