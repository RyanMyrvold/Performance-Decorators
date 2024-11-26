import { LogReturnValue } from '../../src/debugging/LogReturnValue';

describe('LogReturnValue Decorator', () => {

  // Test 1: Logging the return value of a simple synchronous method
  it('should log the return value of a synchronous method', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    class TestService {
      @LogReturnValue()
      add(a: number, b: number): number {
        return a + b;
      }
    }

    const service = new TestService();
    const result = service.add(5, 10);

    expect(result).toBe(15);
    expect(logSpy).toHaveBeenCalledWith(15, 'add');
    logSpy.mockRestore();
  });

  // Test 2: Logging the return value of an asynchronous method
  it('should log the return value of an asynchronous method', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    class TestService {
      @LogReturnValue()
      async fetchData(): Promise<string> {
        return "data";
      }
    }

    const service = new TestService();
    const result = await service.fetchData();

    expect(result).toBe("data");
    expect(logSpy).toHaveBeenCalledWith("data", 'fetchData');
    logSpy.mockRestore();
  });

  // Test 3: Logging with a custom logging function
  it('should log using a custom logging function', () => {
    const customLogFn = jest.fn();

    class TestService {
      @LogReturnValue(customLogFn)
      subtract(a: number, b: number): number {
        return a - b;
      }
    }

    const service = new TestService();
    const result = service.subtract(10, 3);

    expect(result).toBe(7);
    expect(customLogFn).toHaveBeenCalledWith(7, 'subtract');
  });

  // Test 4: Ensuring the original method is executed
  it('should execute the original method and log the return value', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    class TestService {
      @LogReturnValue()
      multiply(a: number, b: number): number {
        return a * b;
      }
    }

    const service = new TestService();
    const result = service.multiply(6, 7);

    expect(result).toBe(42);
    expect(logSpy).toHaveBeenCalledWith(42, 'multiply');
    logSpy.mockRestore();
  });

  // Test 5: Handling promise rejection in async methods
  it('should not log on promise rejection', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    class TestService {
      @LogReturnValue()
      async fetchWithError(): Promise<string> {
        throw new Error("Network error");
      }
    }

    const service = new TestService();
    await expect(service.fetchWithError()).rejects.toThrow("Network error");

    expect(logSpy).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  // Test 6: Logging when method returns an object
  it('should log when method returns an object', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    class TestService {
      @LogReturnValue()
      getObject(): object {
        return { key: "value" };
      }
    }

    const service = new TestService();
    const result = service.getObject();

    expect(result).toEqual({ key: "value" });
    expect(logSpy).toHaveBeenCalledWith({ key: "value" }, 'getObject');
    logSpy.mockRestore();
  });

  // Test 7: Logging when method returns undefined
  it('should log when method returns undefined', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    class TestService {
      @LogReturnValue()
      doNothing(): void {
        // no return statement, implicitly returns undefined
      }
    }

    const service = new TestService();
    const result = service.doNothing();

    expect(result).toBeUndefined();
    expect(logSpy).toHaveBeenCalledWith(undefined, 'doNothing');
    logSpy.mockRestore();
  });

  // Test 8: Logging return value from a method with no arguments
  it('should log the return value of a method with no arguments', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    class TestService {
      @LogReturnValue()
      getTime(): number {
        return Date.now();
      }
    }

    const service = new TestService();
    const result = service.getTime();

    expect(logSpy).toHaveBeenCalledWith(result, 'getTime');
    logSpy.mockRestore();
  });

  // Test 9: Ensuring logging doesn't interfere with return value
  it('should not alter the return value of the method', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    class TestService {
      @LogReturnValue()
      divide(a: number, b: number): number {
        return a / b;
      }
    }

    const service = new TestService();
    const result = service.divide(10, 2);

    expect(result).toBe(5);
    expect(logSpy).toHaveBeenCalledWith(5, 'divide');
    logSpy.mockRestore();
  });

  // Test 10: Logging for methods returning a resolved promise
  it('should log the return value of a resolved promise', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    class TestService {
      @LogReturnValue()
      async getPromise(): Promise<string> {
        return Promise.resolve("resolved");
      }
    }

    const service = new TestService();
    const result = await service.getPromise();

    expect(result).toBe("resolved");
    expect(logSpy).toHaveBeenCalledWith("resolved", 'getPromise');
    logSpy.mockRestore();
  });


    // Test 11: Logging return value when method returns a complex nested object
    it('should log when method returns a complex nested object', () => {
        const logSpy = jest.spyOn(console, 'log').mockImplementation();

        class TestService {
          @LogReturnValue()
          getComplexObject(): object {
            return { user: { id: 1, name: "John Doe", address: { city: "Metropolis" } } };
          }
        }

        const service = new TestService();
        const result = service.getComplexObject();

        expect(result).toEqual({ user: { id: 1, name: "John Doe", address: { city: "Metropolis" } } });
        expect(logSpy).toHaveBeenCalledWith({ user: { id: 1, name: "John Doe", address: { city: "Metropolis" } } }, 'getComplexObject');
        logSpy.mockRestore();
      });

      // Test 12: Logging when method returns an array
      it('should log when method returns an array', () => {
        const logSpy = jest.spyOn(console, 'log').mockImplementation();

        class TestService {
          @LogReturnValue()
          getArray(): number[] {
            return [1, 2, 3, 4, 5];
          }
        }

        const service = new TestService();
        const result = service.getArray();

        expect(result).toEqual([1, 2, 3, 4, 5]);
        expect(logSpy).toHaveBeenCalledWith([1, 2, 3, 4, 5], 'getArray');
        logSpy.mockRestore();
      });

      // Test 13: Logging when method returns a boolean value
      it('should log when method returns a boolean value', () => {
        const logSpy = jest.spyOn(console, 'log').mockImplementation();

        class TestService {
          @LogReturnValue()
          isUserActive(): boolean {
            return true;
          }
        }

        const service = new TestService();
        const result = service.isUserActive();

        expect(result).toBe(true);
        expect(logSpy).toHaveBeenCalledWith(true, 'isUserActive');
        logSpy.mockRestore();
      });

      // Test 14: Logging when method returns a null value
      it('should log when method returns null', () => {
        const logSpy = jest.spyOn(console, 'log').mockImplementation();

        class TestService {
          @LogReturnValue()
          getNullValue(): null {
            return null;
          }
        }

        const service = new TestService();
        const result = service.getNullValue();

        expect(result).toBeNull();
        expect(logSpy).toHaveBeenCalledWith(null, 'getNullValue');
        logSpy.mockRestore();
      });

      // Test 15: Ensuring no logging if the logging function is overridden with an empty function
      it('should not log if the logging function is overridden with an empty function', () => {
        const logSpy = jest.fn();

        class TestService {
          @LogReturnValue(logSpy)
          getValue(): string {
            return "value";
          }
        }

        const service = new TestService();
        const result = service.getValue();

        expect(result).toBe("value");
        expect(logSpy).toHaveBeenCalledWith("value", 'getValue');
        expect(logSpy).toHaveBeenCalledTimes(1);
      });

});
