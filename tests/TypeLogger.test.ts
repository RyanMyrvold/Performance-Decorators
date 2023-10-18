import { TypeLogger } from '../src/TypeLogger';

// Mock console.log to capture its calls
const mockLog = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('TypeLogger', () => {

  // Reset the mock before each test
  beforeEach(() => {
    mockLog.mockClear();
    TypeLogger.setLogging(false); // Disable logging by default
  });

  describe('setLogging', () => {
    it('should enable logging when passed true', () => {
      TypeLogger.setLogging(true);
      TypeLogger.log('Test log message');
      expect(mockLog).toHaveBeenCalledWith('Test log message');
    });

    it('should disable logging when passed false', () => {
      TypeLogger.setLogging(false);
      TypeLogger.log('Test log message');
      expect(mockLog).not.toHaveBeenCalled();
    });
  });

  describe('log', () => {
    it('should log a message when logging is enabled', () => {
      TypeLogger.setLogging(true);
      TypeLogger.log('Test log message');
      expect(mockLog).toHaveBeenCalledWith('Test log message');
    });

    it('should not log a message when logging is disabled', () => {
      TypeLogger.setLogging(false);
      TypeLogger.log('Test log message');
      expect(mockLog).not.toHaveBeenCalled();
    });
  });
});
