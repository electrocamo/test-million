import { formatPrice, truncateText, isValidUrl, debounce } from '../utils';

describe('utils', () => {
  describe('formatPrice', () => {
    it('should format price correctly', () => {
      expect(formatPrice(1000)).toBe('$1,000');
      expect(formatPrice(1500000)).toBe('$1,500,000');
      expect(formatPrice(0)).toBe('$0');
    });

    it('should format price without decimals', () => {
      expect(formatPrice(1234.56)).toBe('$1,235');
    });

    it('should handle large numbers', () => {
      expect(formatPrice(999999999)).toBe('$999,999,999');
    });
  });

  describe('truncateText', () => {
    it('should truncate text when exceeds max length', () => {
      const text = 'This is a very long text that should be truncated';
      expect(truncateText(text, 20)).toBe('This is a very long ...');
    });

    it('should not truncate text when within max length', () => {
      const text = 'Short text';
      expect(truncateText(text, 20)).toBe('Short text');
    });

    it('should return text as is when exactly at max length', () => {
      const text = 'Exactly twenty chars';
      expect(truncateText(text, 20)).toBe('Exactly twenty chars');
    });

    it('should handle empty strings', () => {
      expect(truncateText('', 10)).toBe('');
    });
  });

  describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
      expect(isValidUrl('https://images.unsplash.com/photo-123')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('just text')).toBe(false);
      expect(isValidUrl('')).toBe(false);
    });

    it('should handle URLs with paths and query params', () => {
      expect(isValidUrl('https://example.com/path?query=value')).toBe(true);
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    it('should delay function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 500);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(500);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should cancel previous calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 500);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      jest.advanceTimersByTime(500);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments correctly', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 500);

      debouncedFn('arg1', 'arg2');
      jest.advanceTimersByTime(500);

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    afterEach(() => {
      jest.clearAllTimers();
    });
  });
});

