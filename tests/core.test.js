import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";
import {
  calculateDiscount,
  canDrive,
  fetchData,
  getCoupons,
  isPriceInRange,
  isValidUsername,
  Stack,
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

describe("isPriceInRange", () => {
  it.each([
    { scenario: "price < min", price: -10, result: false },
    { scenario: "price = min", price: 0, result: true },
    { scenario: "price between min and max", price: 50, result: true },
    { scenario: "price = min", price: 100, result: true },
    { scenario: "price > min", price: 101, result: false },
  ])("should retrun $result when $scenario", ({ price, result }) => {
    expect(isPriceInRange(price, 0, 100)).toBe(result);
  });
});

describe("fetchData with promise", () => {
  it("should return a promise that will resolve to an array of numbers", async () => {
    const result = await fetchData();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should reject with an error", async () => {
    await expect(fetchData(true)).rejects.toThrow(/fail/i);
  });
});

describe("TearDownDemo", () => {
  beforeAll(() => {
    console.log("before all called");
  });

  beforeEach(() => {
    console.log("before each test case called");
  });

  afterEach(() => {
    console.log("after each test case called");
  });

  afterAll(() => {
    console.log("after all called");
  });

  it("test case 1", () => {
    console.log("test case 1 called");
  });
  it("test case 2", () => {
    console.log("test case 2 called");
  });
});

describe("Stack", () => {
  let stack;
  beforeEach(() => {
    stack = new Stack();
  });

  it("push should an item to the stack", () => {
    stack.push(1);
    stack.push(2);
    expect(stack.size()).toBe(2);
  });

  it("pop should remove and return the top item from the stack", () => {
    stack.push(1);
    stack.push(2);
    expect(stack.pop()).toBe(2);
    expect(stack.size()).toBe(1);
    expect(stack.pop()).toBe(1);
  });

  it("pop should throw an error if stack is empty", () => {
    expect(() => stack.pop()).toThrow(/empty/i);
  });

  it("peack should return last element without removing the last element", () => {
    stack.push(3);
    stack.push(4);
    expect(stack.peek()).toBe(4);
    expect(stack.size()).toBe(2);
  });

  it("peack shouldthrow an error if stack is empty", () => {
    expect(() => stack.peek()).toThrow(/empty/i);
  });

  it("is empty should return true when stack is empty", () => {
    expect(stack.isEmpty()).toBe(true);
  });

  it("size should return number of items in the stack", () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);
    stack.pop();
    expect(stack.size()).toBe(2);
  });

  it("clear should remove all items from the stack", () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);
    stack.pop();
    stack.clear();
    expect(stack.size()).toBe(0);
  });
});
