# 🚀 Performance Decorators: A TypeScript Library for Efficient Performance Monitoring & Optimization

Elevate your application's performance with Performance Decorators! This TypeScript library provides powerful tools for seamless performance monitoring and optimization in both Node.js and browser environments. Simplify the task of identifying performance bottlenecks and ensure your applications run efficiently with our easy-to-use decorators.

[![Unit Tests](https://github.com/RyanMyrvold/Performance-Decorators/actions/workflows/npm-test.yml/badge.svg)](https://github.com/RyanMyrvold/Performance-Decorators/actions/workflows/npm-test.yml)
[![npm](https://img.shields.io/npm/v/performance-decorators)](https://www.npmjs.com/package/performance-decorators)
[![GitHub Issues](https://img.shields.io/github/issues/RyanMyrvold/Performance-Decorators)](Issues)
[![GitHub Repo stars](https://img.shields.io/github/stars/RyanMyrvold/Performance-Decorators?style=social)](https://github.com/RyanMyrvold/Performance-Decorators/stargazers)

## 🌟 Features

### Debugging Decorators

- **LogExecutionTime**: Method Decorator - Logs method execution times, helping pinpoint performance bottlenecks.
- **LogMemoryUsage**: Method Decorator - Tracks and logs memory usage, aiding in efficient resource management.
- **LogMethodError**: Method Decorator - Handles and logs method errors, with an option to rethrow them.
- **WarnMemoryLeak**: Class Decorator - Monitors and warns of potential memory leaks, supporting both Node.js and browsers. Options include setting check intervals, memory usage thresholds, custom logging, and manual garbage collection in Node.js.
- **WarnPerformanceThreshold**: Method Decorator - Alerts when methods surpass predefined execution time thresholds.
- **LogNetworkRequests**: Method Decorator - Logs network requests made within the decorated method, providing insights into network performance bottlenecks.
- **LogReturnValue**: Method Decorator - Logs the return value of a method, aiding in debugging and ensuring methods return expected results.

### Optimization Decorators

- **AutoRetry**: Method Decorator - Automatically retries a failed asynchronous operation until it succeeds or reaches a maximum number of retries.
- **Debounce**: Method Decorator - Limits the rate at which a function can fire, perfect for handling events like resizing, scrolling, or keypresses.
- **LazyLoad**: Property Decorator - Delays the initialization of properties until they are first accessed, optimizing resource use and computation time.
- **Memoize**: Method Decorator - Caches the results of expensive function calls, optimizing performance by avoiding repeated calculations.
- **Throttle**: Method Decorator - Ensures a function is not called more than once in a specified period, useful for rate-limiting execution of handlers on frequent events.

## 📦 Installation

Easily integrate into your project:

```bash
npm install performance-decorators
```

## 🛠️ Usage Examples

### Debugging Decorators Usage

#### Log Execution Time

```typescript
import { LogExecutionTime } from "performance-decorators/debugging";

class PerformanceExample {
  @LogExecutionTime()
  quickMethod() {
    // Simulated task
  }

  @LogExecutionTime((time, method) => console.log(`${method} took ${time} ms`))
  detailedMethod() {
    // More complex task
  }
}
```

#### Log Memory Usage

```typescript
import { LogMemoryUsage } from "performance-decorators/debugging";

class PerformanceExample {
  @LogMemoryUsage()
  standardMemoryMethod() {
    // Memory consuming task
  }

  @LogMemoryUsage((usedMemory, method) =>
    console.log(`${method} used ${usedMemory} bytes`),
  )
  detailedMemoryMethod() {
    // Task with detailed memory monitoring
  }
}
```

#### Log Method Error

```typescript
import { LogMethodError } from "performance-decorators/debugging";

class PerformanceExample {
  @LogMethodError()
  methodWithError() {
    throw new Error("Example error");
  }

  @LogMethodError(true, (error, method) =>
    console.error(`${method} error: ${error.message}`),
  )
  methodWithCustomErrorHandling() {
    throw new Error("Custom error");
  }
}
```

#### Warn Memory Leak

```typescript
import WarnMemoryLeak from "performance-decorators/debugging";

/**
 * Class decorator to monitor and warn about potential memory leaks.
 * Works in both Node.js and browser environments.
 *
 * @param checkIntervalMs - Interval in milliseconds to check memory usage.
 * @param thresholdPercent - Percentage increase in memory usage to trigger warning.
 * @param logger - Logging function to use for warnings.
 * @param enableManualGC - Enables manual garbage collection in Node.js (requires --expose-gc flag).
 */
function MemoryLeakWarning(
  checkIntervalMs: number = 30000,
  thresholdPercent: number = 20,
  logger: (msg: string) => void = console.warn,
  enableManualGC: boolean = false,
) {
  return WarnMemoryLeak(
    checkIntervalMs,
    thresholdPercent,
    logger,
    enableManualGC,
  );
}

@MemoryLeakWarning(30000, 20, console.warn, false)
class MyMonitoredClass {
  // Your class implementation
}

// Create an instance
const instance = new MyMonitoredClass();
```

#### Warn Performance Threshold

```typescript
import { WarnPerformanceThreshold } from "performance-decorators/debugging";

class PerformanceExample {
  @WarnPerformanceThreshold()
  methodWithDefaultThreshold() {
    // Task to be monitored
  }

  @WarnPerformanceThreshold(200, (time, method) =>
    console.warn(`${method} exceeded ${time} ms`),
  )
  methodWithCustomThreshold() {
    // Another monitored task
  }
}
```

#### Log Network Requests

```typescript
import LogNetworkRequests from "performance-decorators/debugging";

class PerformanceExample {
  @LogNetworkRequests()
  async fetchData(url: string): Promise<void> {
    const response = await fetch(url);
    return response.json();
  }

  @LogNetworkRequests((log) => {
    console.log(
      `Custom Logger - ${log.method} request to ${log.url} took ${log.duration.toFixed(2)}ms`,
    );
  })
  async fetchDataWithCustomLogger(url: string): Promise<void> {
    const response = await fetch(url);
    return response.json();
  }
}
```

#### Log Return Value

```typescript
import LogReturnValue from "performance-decorators/debugging";

class ExampleService {
  @LogReturnValue()
  calculateSum(a: number, b: number): number {
    return a + b;
  }

  @LogReturnValue((value, methodName) =>
    console.log(`[${methodName}] returned:`, value),
  )
  async fetchData(url: string): Promise<any> {
    const response = await fetch(url);
    return response.json();
  }
}

const service = new ExampleService();
console.log(service.calculateSum(3, 4)); // Logs and returns 7
service.fetchData("https://api.example.com/data"); // Logs the returned JSON data
```

### Optimization Decorators Usage

#### AutoRetry

```typescript
import { AutoRetry } from "performance-decorators/optimization";

class DataService {
  @AutoRetry(3, 1000) // Retry up to 3 times with a 1-second delay
  async fetchData(url: string) {
    console.log(`Fetching data from ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    return response.json();
  }
}

const service = new DataService();
service
  .fetchData("https://api.example.com/data")
  .then((data) => console.log("Data fetched successfully:", data))
  .catch((error) => console.error("Failed to fetch data:", error));
```

#### Debounce

```typescript
import { Debounce } from "performance-decorators/optimization";

class SearchComponent {
  @Debounce(300)
  async onSearch(term: string) {
    console.log(`Searching for: ${term}`);
    // Simulate an API call
    return fetch(`/api/search?q=${encodeURIComponent(term)}`).then((res) =>
      res.json(),
    );
  }
}

const searchComponent = new SearchComponent();
searchComponent.onSearch("hello");
```

#### LazyLoad

```typescript
import { LazyLoad } from "performance-decorators/optimization";

class ExpensiveComputation {
  @LazyLoad()
  get expensiveData() {
    console.log("Computing expensive data");
    return Array.from({ length: 1000000 }, (_, i) => Math.sqrt(i));
  }
}

const computation = new ExpensiveComputation();
console.log("ExpensiveComputation instance created");

// The first access triggers the computation
console.log(computation.expensiveData[1000]); // Initializes and accesses the data
console.log(computation.expensiveData[2000]); // Accesses cached data
```

#### Memoize

```typescript
import { Memoize } from "performance-decorators/optimization";

class Calculator {
  @Memoize()
  fibonacci(n: number): number {
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
}

const calculator = new Calculator();
console.log(calculator.fibonacci(10)); // Computed
console.log(calculator.fibonacci(10)); // Cached result
```

#### Throttle

```typescript
import { Throttle } from "performance-decorators/optimization";



class ScrollHandler {
  @Throttle(100)
  onScroll(event: Event) {
    console.log("Scrolling", event);
  }
}

const handler = new ScrollHandler();
window.addEventListener("scroll", handler.onScroll);
```

## 📘 API Documentation

Refer to the TypeScript JSDoc comments in the source code for detailed API information. Each decorator is well-documented, providing insights into its usage and configuration.

## 🚧 Contributing

Contributions are welcome! Please refer to the project's style and contribution guidelines for submitting patches and additions. Ensure to follow best practices and add tests for new features.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
