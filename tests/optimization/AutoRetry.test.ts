// tests/optimization/AutoRetry.test.ts
import { AutoRetry } from "../../src/optimization/AutoRetry";

describe("AutoRetry Decorator", () => {
  it("retries the method until it succeeds", async () => {
    class TestClass {
      private attempts = 0;

      // retries=2 => up to 3 total attempts; delay=0 so no timers needed
      @AutoRetry(2, 0)
      async unreliableMethod() {
        this.attempts++;
        if (this.attempts < 3) {
          throw new Error("Temporary failure");
        }
        return "Success";
      }
    }

    const instance = new TestClass();
    await expect(instance.unreliableMethod()).resolves.toBe("Success");
  });

  it("fails after the maximum number of retries", async () => {
    class TestClass {
      @AutoRetry(2, 0) // retries=2 => total attempts=3
      async permanentlyFailingMethod() {
        throw new Error("Permanent failure");
      }
    }

    const instance = new TestClass();
    await expect(instance.permanentlyFailingMethod()).rejects.toThrow(/Failed after 2 retries: Permanent failure/);
  });
});
