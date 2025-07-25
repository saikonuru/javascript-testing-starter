import { describe, it, expect, vi } from 'vitest';

describe('Hello World Test', () => {
    it('should return true', () => {
        const mockFunction = vi.fn(() => true);
        expect(mockFunction()).toBe(true);
    });
});