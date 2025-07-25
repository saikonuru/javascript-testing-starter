import { describe, expect, it, vi } from "vitest";
import { getExchangeRate, getPriceInCurrency } from "../src/libs/currency.js";
import { getShippingInfo, getShippingQuote } from "../src/libs/shipping.js";

vi.mock("../src/libs/currency.js", () => {
  const mockGetExchangeRate = vi.fn();
  return {
    getExchangeRate: mockGetExchangeRate,
    getPriceInCurrency: vi.fn().mockImplementation(async (price, currency) => {
      const rate = mockGetExchangeRate(currency);
      return price * rate;
    }),
  };
});

vi.mock("../src/libs/shipping.js", () => {
  const mockGetShippingQuote = vi.fn();
  return {
    getShippingQuote: mockGetShippingQuote,
    getShippingInfo: vi.fn().mockImplementation((destination) => {
      const quote = mockGetShippingQuote(destination);
      if (!quote) return "Shipping unavailable";
      return `Shipping cost: $${quote.cost} (Estimated delivery: ${quote.estimatedDays})`;
    }),
  };
});

// describe("mock", () => {
//   it("test case", () => {
//     const greet = vi.fn();
//     let result;

//     greet.mockReturnValue("Hello"); // mock a function to return a value
//     result = greet();
//     console.log(result);

//     greet.mockResolvedValue("Hello"); // return a Promise resolved to the value
//     greet().then((result) => console.log(result));

//     greet.mockImplementation((name) => "Hello " + name); // mocks a function implementation
//     result = greet("Sairam");
//     // expect(greet).toHaveBeenCalledOnce(); //called only once
//     expect(greet).toHaveBeenCalled();
//     expect(greet).toHaveBeenCalledWith("Sairam");
//   });
//   it("mockSend text message", () => {
//     const sentText = vi.fn();
//     let result;
//     sentText.mockReturnValue("Ok");
//     result = sentText("message");
//     expect(sentText).toHaveBeenCalledWith("message");
//     expect(result).toBe("Ok");
//   });
// });
describe("mocking Demos", () => {
  it("should return exchange rate", async () => {
    getExchangeRate.mockReturnValue(1.5); // Now this is a mock

    const price = await getPriceInCurrency(10, "AUD");
    console.log("price: " + price);
    expect(price).toBe(15);
  });

  it("should return shipping unavailable if quote can't be fetched", () => {
    getShippingQuote.mockReturnValue(null); // Now this is a mock

    const result = getShippingInfo("London");

    expect(result).toMatch(/unavailable/i);
  });

  it("should return shipping details when quote can be fetched", () => {
    getShippingQuote.mockReturnValue({ cost: 10, estimatedDays: "2 Days" }); // Now this is a mock

    const result = getShippingInfo("London");

    expect(result).toMatch("$10");
    expect(result).toMatch(/2 Days/i);
  });
});
