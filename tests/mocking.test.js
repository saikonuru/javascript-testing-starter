import { describe, expect, it, vi } from 'vitest';
import { trackPageView } from '../src/libs/analytics';
import { getExchangeRate } from '../src/libs/currency';
import { sendEmail } from '../src/libs/email';
import { charge } from '../src/libs/payment';
import security from '../src/libs/security';
import { getShippingQuote } from '../src/libs/shipping';
import {
  getDiscount,
  getPriceInCurrency,
  getShippingInfo,
  isOnline,
  login,
  renderPage,
  signUp,
  submitOrder,
} from '../src/mocking';

vi.mock('../src/libs/currency');
vi.mock('../src/libs/shipping');
vi.mock('../src/libs/analytics');
vi.mock('../src/libs/payment');
// Partial mocking - Replaces some of the functions in a module
vi.mock('../src/libs/email', async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    sendEmail: vi.fn(),
  };
});

describe('test suite', () => {
  it('test case', () => {
    // Create a mock for the following function
    const sendText = vi.fn();
    sendText.mockReturnValue('ok');

    // Call the mock function
    const result = sendText('message');

    // Assert that the mock function is called
    expect(sendText).toHaveBeenCalledWith('message');
    // Assert that the result is 'ok'
    expect(result).toBe('ok');
  });
});

describe('getPriceInCurrency', () => {
  it('should return price in target currency', () => {
    vi.mocked(getExchangeRate).mockReturnValue(1.5);

    const price = getPriceInCurrency(10, 'AUD');

    expect(price).toBe(15);
  });
});

describe('getShippingInfo', () => {
  it('should return shipping unavailable if quote cannot be fetched', () => {
    vi.mocked(getShippingQuote).mockReturnValue(null);

    const result = getShippingInfo('London');

    expect(result).toMatch(/unavailable/i);
  });

  it('should return shipping info if quote can be fetched', () => {
    vi.mocked(getShippingQuote).mockReturnValue({ cost: 10, estimatedDays: 2 });

    const result = getShippingInfo('London');

    expect(result).toMatch('$10');
    expect(result).toMatch(/2 days/i);
    expect(result).toMatch(/shipping cost: \$10 \(2 days\)/i);
  });
});

describe('renderPage', () => {
  it('should return correct content', async () => {
    const result = await renderPage();

    expect(result).toMatch(/content/i);
  });

  it('should call analytics', async () => {
    await renderPage();

    expect(trackPageView).toHaveBeenCalledWith('/home');
  });
});

describe('submitOrder', () => {
  const order = { totalAmount: 10 };
  const creditCard = { creditCardNumber: '1234' };

  it('should charge the customer', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'success' }); //mockResolvedValue - becasuse the function returns a promise

    await submitOrder(order, creditCard);

    expect(charge).toHaveBeenCalledWith(creditCard, order.totalAmount);
  });

  it('should return success when payment is successful', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'success' });

    const result = await submitOrder(order, creditCard);

    expect(result).toEqual({ success: true });
  });

  it('should return success when payment is successful', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'failed' });

    const result = await submitOrder(order, creditCard);

    expect(result).toEqual({ success: false, error: 'payment_error' });
  });
});

describe('signUp', () => {
  let email = 'sai@gmail.com';
  it('should rerurn false if email is not valid', async () => {
    const result = await signUp('a');

    expect(result).toBe(false);
  });

  it('should rerurn true if email is valid', async () => {
    const result = await signUp(email);

    expect(result).toBe(true);
  });

  it('shouldsend the welcome email if email is valid', async () => {
    await signUp(email);

    expect(sendEmail).toHaveBeenCalledOnce();
    const args = vi.mocked(sendEmail).mock.calls[0];
    expect(args[0]).toBe(email);
    expect(args[1]).toMatch(/welcome/i);
  });
});

// Spy - Monitor behavior of function during test execution
// collects information about the function call and it results

describe('login', () => {
  it(' email the one-time login code', async () => {
    const email = 'sai@gmail.com';
    const spy = vi.spyOn(security, 'generateCode');
    await login(email);
    const [firstCall] = spy.mock.results;
    const securityCode = firstCall?.value?.toString();

    expect(sendEmail).toHaveBeenCalledWith(email, securityCode);
  });
});

describe('isOnline', () => {
  it('should return false if current hour is outside opening hours', () => {
    vi.setSystemTime('2025-01-01 07:59');
    expect(isOnline()).toBe(false);

    vi.setSystemTime('2025-01-01 20:01');
    expect(isOnline()).toBe(false);
  });

  it('should return true if current hour is with in opening hours', () => {
    vi.setSystemTime('2025-01-01 08:00');
    expect(isOnline()).toBe(true);

    vi.setSystemTime('2025-01-01 19:59');
    expect(isOnline()).toBe(true);
  });
});

describe('getDiscount', () => {
  it('should return discount 0.2 on New Year day', () => {
    vi.setSystemTime('2025-01-01 00:01');
    expect(getDiscount()).toBe(0.2);

    vi.setSystemTime('2025-01-01 23:59');
    expect(getDiscount()).toBe(0.2);
  });

  it('should return discount 0 on any other day', () => {
    vi.setSystemTime('2025-01-02 00:01');
    expect(getDiscount()).toBe(0);

    vi.setSystemTime('2025-12-31 23:59');
    expect(getDiscount()).toBe(0);
  });
});
