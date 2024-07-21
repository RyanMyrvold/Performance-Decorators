# 🚀 Performance Decorators

Elevate your application's performance monitoring and optimization in Node.js and browsers with **Performance Decorators**, a TypeScript-based toolkit. Our decorators simplify the task of tracking performance bottlenecks and optimizing performance efficiently.

## 🌟 Features

### Debugging Decorators

- **LogExecutionTime**: Method Decorator - Logs method execution times, helping pinpoint performance bottlenecks.
- **WarnPerformanceThreshold**: Method Decorator - Alerts when methods surpass predefined execution time thresholds.
- **LogMemoryUsage**: Method Decorator - Tracks and logs memory usage, aiding in efficient resource management.
- **LogMethodError**: Method Decorator - Handles and logs method errors, with an option to rethrow them.
- **MemoryLeakWarning**: Class Decorator - Monitors and warns of potential memory leaks, supporting both Node.js and browsers. Options include setting check intervals, memory usage thresholds, custom logging, and manual garbage collection in Node.js.

### Optimization Decorators

- **Debounce**: Method Decorator - Limits the rate at which a function can fire, perfect for handling events like resizing, scrolling, or keypresses.
- **Memoize**: Method Decorator - Caches the results of expensive function calls, optimizing performance by avoiding repeated calculations.
- **Throttle**: Method Decorator - Ensures a function is not called more than once in a specified period, useful for rate-limiting execution of handlers on frequent events.
- **AutoRetry**: Method Decorator - Automatically retries a failed asynchronous operation until it succeeds or reaches a maximum number of retries.
- **LazyLoad**: Property Decorator - Delays the initialization of properties until they are first accessed, optimizing resource use and computation time.

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

#### Warn Performance Threshold

```typescript
import { WarnPerformanceThreshold } from "performance-decorators/debugging";

class PerformanceExample {
  @WarnPerformanceThreshold()
  methodWithDefaultThreshold() {
    // Task to be monitored
  }

  @WarnPerformanceThreshold(200, (time, method) =>
    console.warn(`${method} exceeded ${time} ms`)
  )
  methodWithCustomThreshold() {
    // Another monitored task
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
    console.log(`${method} used ${usedMemory} bytes`)
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
    console.error(`${method} error: ${error.message}`)
  )
  methodWithCustomErrorHandling() {
    throw new Error("Custom error");
  }
}
```

#### Memory Leak Warning

```typescript
import { MemoryLeakWarning } from "performance-decorators/debugging";

@MemoryLeakWarning(30000, 20, console.warn, false)
class MyMonitoredClass {
  // Your class implementation
}

// Create an instance
const instance = new MyMonitoredClass();
```

### Optimization Decorators Usage

#### Debounce

```typescript
import { Debounce } from "performance-decorators/optimization";

class SearchComponent {
  @Debounce(300)
  async onSearch(term: string) {
    console.log(`Searching for: ${term}`);
    // Simulate an API call
    return fetch(`/api/search?q=${encodeURIComponent(term)}`).then((res) =>
      res.json()
    );
  }
}

const searchComponent = new SearchComponent();
searchComponent.onSearch("hello");
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

## 📘 API Documentation

Refer to the TypeScript JSDoc comments in the source code for detailed API information. Each decorator is well-documented, providing insights into its usage and configuration.

## 🚧 Contributing

Contributions are welcome! Please refer to the project's style and contribution guidelines for submitting patches and additions. Ensure to follow best practices and add tests for new features.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.