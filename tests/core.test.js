import { describe, expect, it } from "vitest";
import {
  calculateDiscount,
  canDrive,
  getCoupons,
  isPriceInRange,
  isValidUsername,
  validateUserInput,
} from "../src/core";
describe("GetCoupons test cases", () => {
  it("should have length greater than 0", () => {
    const result = getCoupons();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should return an array with valid coupon codes", () => {
    const coupons = getCoupons();

    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty("code");
      expect(typeof coupon.code).toBe("string");
      expect(coupon.code).toBeTruthy();
    });
  });

  it("should return an array with valid coupon discounts", () => {
    const coupons = getCoupons();

    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty("discount");
      expect(typeof coupon.discount).toBe("number");
      expect(coupon.discount).toBeLessThan(20);
    });
  });
});

describe("calculateDiscount", () => {
  it("should return discount price if given valid code", () => {
    expect(calculateDiscount(10, "SAVE10")).toBe(9);
    expect(calculateDiscount(10, "SAVE20")).toBe(8);
  });

  it("should handle negative price", () => {
    expect(calculateDiscount(-10, "SAVE10")).toMatch(/invalid/i);
  });

  it("should handle non-numeric price", () => {
    expect(calculateDiscount("10", "SAVE10")).toMatch(/invalid/i);
  });

  it("should handle non-string discount code", () => {
    expect(calculateDiscount(10, 10)).toMatch(/invalid/i);
  });

  it("should handle invalid discount code", () => {
    expect(calculateDiscount("10", "INVALID")).toMatch(/invalid/i);
  });
});

describe("validateUserInput", () => {
  it("should return success for valid input", () => {
    expect(validateUserInput("Sai", 22)).toMatch(/success/i);
  });

  it("should handle invalid username", () => {
    expect(validateUserInput(10, 18)).toMatch(/invalid/i);
  });

  it("should handle invalid username if it is less than 3 char", () => {
    expect(validateUserInput("sa", 18)).toMatch(/invalid/i);
  });

  it("should handle username if it is more than 255 char", () => {
    const name = "A".repeat(256);
    expect(validateUserInput(name, 18)).toMatch(/invalid/i);
  });

  it("should handle invalid age ", () => {
    expect(validateUserInput("Sai", "16")).toMatch(/invalid/i);
  });

  it("should handle invalid age if age less than 18", () => {
    expect(validateUserInput("Sai", 16)).toMatch(/invalid/i);
  });
});

// Boundry testings
describe("isPriceInRange", () => {
  it("should retrun false if the price is outside the range", () => {
    expect(isPriceInRange(-10, 0, 100)).toBe(false);
  });

  it("should retrun false if the price is above the range", () => {
    expect(isPriceInRange(200, 0, 100)).toBe(false);
  });

  it("should retrun true if the price is in the range", () => {
    expect(isPriceInRange(20, 10, 100)).toBe(true);
  });

  it("should retrun true if the price is equal to min or to the range", () => {
    expect(isPriceInRange(100, 0, 100)).toBe(true);
    expect(isPriceInRange(20, 20, 100)).toBe(true);
  });
});

describe("isValidUSerName", () => {
  const minLength = 5;
  const maxLength = 15;
  it("should return true if username length if it is in range", () => {
    expect(isValidUsername("a".repeat(minLength), maxLength)).toBe(true);
  });

  it("should return false if username length if it is ltoo short", () => {
    expect(isValidUsername("a".repeat(minLength - 1))).toBe(false);
  });

  it("should return false if username length if it is too long", () => {
    expect(isValidUsername("a".repeat(maxLength + 1))).toBe(false);
  });

  it("should return false if username is null or invalid", () => {
    expect(isValidUsername("")).toBe(false);
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername(undefined)).toBe(false);
    expect(isValidUsername(10)).toBe(false);
  });
});

// parameterized testing
describe("canDrive", () => {
  it.each([
    { age: 15, country: "US", result: false },
    { age: 16, country: "US", result: true },
    { age: 17, country: "US", result: true },

    { age: 16, country: "UK", result: false },
    { age: 17, country: "UK", result: true },
    { age: 18, country: "UK", result: true },

    { age: 0, country: "UK", result: false },

    { age: 17, country: "FR", result: "Invalid country code" },
    { age: 17, country: "", result: "Invalid country code" },
  ])("should retrun $result for $age, $country", ({ age, country, result }) => {
    expect(canDrive(age, country)).toBe(result);
  });
});
