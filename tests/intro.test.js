import { describe, expect, it } from "vitest";
import { max } from "../src/intro";
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
