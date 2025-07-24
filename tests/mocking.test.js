import { describe, it, vi } from "vitetest";
import { getExchangeRate } from "../src/libs/currency";
import { getPriceInCurrency } from "../src/mocking";
// Hoisting - A line is moved to top of the file
vi.mock("../src/libs/currency"); // executed first and all exported functions are replaced with mock functions
describe("getPriceInCurrency", () => {
  it("should return price in target currency", () => {
    vi.mocked(getExchangeRate).mockReturnValue(1.5);

    const price = getPriceInCurrency(10, "AUD");
    expect(price).toBe(15);
  });
});
