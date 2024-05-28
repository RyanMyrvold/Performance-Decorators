import { LazyLoad } from "../../src/optimization";

describe("LazyLoad Decorator", () => {
  it("should lazily initialize the property", () => {
    class TestClass {
      @LazyLoad<string>()
      lazyProperty!: string;
    }

    const instance = new TestClass();
    instance.lazyProperty = "test";
    expect(instance.lazyProperty).toBe("test");
  });

  it("should call onInitialization and onSetValue callbacks", () => {
    const onInitialization = jest.fn();
    const onSetValue = jest.fn();

    class CallbackTestClass {
      @LazyLoad<string>({ onInitialization, onSetValue })
      lazyProperty = "initial";
    }

    const instance = new CallbackTestClass();

    // Access the property to trigger onInitialization
    const value = instance.lazyProperty;
    instance.lazyProperty = "test";

    expect(onInitialization).toHaveBeenCalledWith("lazyProperty", "initial");
    expect(onSetValue).toHaveBeenCalledWith("lazyProperty", "test");
  });
});
