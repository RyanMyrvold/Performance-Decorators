# 🚀 Performance Decorators: A TypeScript Library for Efficient Performance Monitoring & Optimization

Elevate your application's performance with **Performance Decorators**! This TypeScript library provides powerful tools for seamless performance monitoring and optimization in both Node.js and browser environments. Simplify identifying bottlenecks and ensure your applications run efficiently with easy-to-use decorators.

[![Unit Tests](https://github.com/RyanMyrvold/Performance-Decorators/actions/workflows/npm-test.yml/badge.svg)](https://github.com/RyanMyrvold/Performance-Decorators/actions/workflows/npm-test.yml)
[![npm](https://img.shields.io/npm/v/performance-decorators)](https://www.npmjs.com/package/performance-decorators)
[![npm](https://img.shields.io/npm/dm/performance-decorators)](https://www.npmjs.com/package/performance-decorators)
[![GitHub Issues](https://img.shields.io/github/issues/RyanMyrvold/Performance-Decorators)](https://github.com/RyanMyrvold/Performance-Decorators/issues)
[![GitHub Repo stars](https://img.shields.io/github/stars/RyanMyrvold/Performance-Decorators?style=social)](https://github.com/RyanMyrvold/Performance-Decorators/stargazers)

## 🌟 Features

### Debugging Decorators

* **`LogExecutionTime`**: Method decorator — Measures and logs execution time (supports sync, async, and thrown errors).
* **`LogMemoryUsage`**: Method decorator — Logs memory delta (bytes) before and after method execution when supported.
* **`LogMethodError`**: Method decorator — Catches, logs errors (including non-Error throws), and optionally rethrows.
* **`WarnMemoryLeak`**: Class decorator — Periodically checks memory usage and warns if it grows past a threshold. Node.js and browsers supported.
* **`WarnPerformanceThreshold`**: Method decorator — Warns (via `console.warn` and optional handler) if execution time exceeds a threshold.
* **`LogNetworkRequests`**: Method decorator — Wraps `fetch()` inside the decorated method scope and logs each request (method, URL, status, timing). Works if `globalThis.fetch` is available.
* **`LogReturnValue`**: Method decorator — Logs the returned value of a method (sync or async) using a supplied logger or `console.log`.

### Optimization Decorators

* **`AutoRetry`**: Method decorator — Retries async operations up to N times with configurable delay until success or final failure.
* **`Debounce`**: Method decorator — Coalesces rapid successive calls into a single execution *after* the specified delay. Returns a Promise.
* **`LazyLoad`**: (Getter or zero-arg method) decorator — Lazily computes and caches the result on first access; subsequent calls retrieve cached value.
* **`Memoize`**: Method decorator — Caches results per-instance and per-method key (default key = JSON.stringify args unless a custom key builder is provided).
* **`Throttle`**: Method decorator — Ensures a method isn’t executed more than once per specified window; fires immediately (leading) and coalesces a trailing call if additional invocations happen within the window.

## 📦 Installation

```bash
npm install performance-decorators
```

## 🛠️ Usage Examples

### Debugging Decorators Usage

#### Log Execution Time

```ts
import { LogExecutionTime } from "performance-decorators/debugging";

class PerformanceExample {
  @LogExecutionTime()
  quickMethod() {
    // ...
  }

  @LogExecutionTime((ms, methodName) =>
    console.debug(`[${methodName}] executed in ${ms.toFixed(2)}ms`)
  )
  detailedMethod() {
    // ...
  }
}
```

#### Log Memory Usage

```ts
import { LogMemoryUsage } from "performance-decorators/debugging";

class PerformanceExample {
  @LogMemoryUsage()
  methodWithMemoryUse() {
    // ...
  }

  @LogMemoryUsage((deltaBytes, methodName) =>
    console.debug(`[${methodName}] Δ${deltaBytes} bytes`)
  )
  detailedMemoryMethod() {
    // ...
  }
}
```

#### Log Method Error

```ts
import { LogMethodError } from "performance-decorators/debugging";

class PerformanceExample {
  @LogMethodError()
  methodWithError() {
    throw new Error("Example error");
  }

  @LogMethodError(false, (error, methodName) =>
    console.error(`[${methodName}] error: ${error.message}`)
  )
  methodWithCustomErrorHandling() {
    throw new Error("Custom error");
  }
}
```

#### Warn Memory Leak

```ts
import { WarnMemoryLeak } from "performance-decorators/debugging";

/**
 * @param checkIntervalMs – interval between memory checks (default 30 000ms)
 * @param thresholdPercent – percent increase that triggers warning (default 20%)
 * @param logger – warning logger (default console.warn)
 */
@WarnMemoryLeak(30000, 20, console.warn)
class MyMonitoredClass {
  // ...
}
```

#### Warn Performance Threshold

```ts
import { WarnPerformanceThreshold } from "performance-decorators/debugging";

class PerformanceExample {
  @WarnPerformanceThreshold() // default threshold ~100ms
  defaultThresholdMethod() {
    // ...
  }

  @WarnPerformanceThreshold(200, (ms, methodName) =>
    console.warn(`[${methodName}] took ${ms.toFixed(2)}ms`)
  )
  customThresholdMethod() {
    // ...
  }
}
```

#### Log Network Requests

```ts
import { LogNetworkRequests } from "performance-decorators/debugging";

class ApiService {
  @LogNetworkRequests()
  async fetchData(url: string) {
    const r = await fetch(url);
    return r.json();
  }

  @LogNetworkRequests((log) => {
    console.debug(
      `[Fetch] ${log.method} ${log.url} → ${log.status} in ${(log.end - log.start).toFixed(2)}ms`
    );
  })
  async fetchWithCustomLogger(url: string) {
    const r = await fetch(url);
    return r.json();
  }
}
```

#### Log Return Value

```ts
import { LogReturnValue } from "performance-decorators/debugging";

class ExampleService {
  @LogReturnValue()
  calculateSum(a: number, b: number): number {
    return a + b;
  }

  @LogReturnValue((value, methodName) =>
    console.debug(`[${methodName}] returned`, value)
  )
  async fetchData(url: string): Promise<any> {
    const r = await fetch(url);
    return r.json();
  }
}
```

### Optimization Decorators Usage

#### AutoRetry

```ts
import { AutoRetry } from "performance-decorators/optimization";

class DataService {
  @AutoRetry(3, 1000) // up to 3 retries, 1 000ms delay
  async fetchData(url: string) {
    const r = await fetch(url);
    if (!r.ok) {
      throw new Error(`HTTP ${r.status}`);
    }
    return r.json();
  }
}
```

#### Debounce

```ts
import { Debounce } from "performance-decorators/optimization";

class SearchComponent {
  @Debounce(300)
  async onSearch(term: string) {
    console.debug(`Searching for ${term}`);
    return fetch(`/api/search?q=${encodeURIComponent(term)}`).then(r => r.json());
  }
}

const search = new SearchComponent();
search.onSearch("hello"); // only one of rapid calls executes
```

#### LazyLoad

```ts
import { LazyLoad } from "performance-decorators/optimization";

class ExpensiveComputation {
  @LazyLoad()
  get data() {
    console.debug("Initializing expensive data");
    return Array.from({ length: 1_000_000 }, (_, i) => Math.sqrt(i));
  }
}

const inst = new ExpensiveComputation();
console.log(inst.data[0]);  // computes once
console.log(inst.data[10]); // cached
```

#### Memoize

```ts
import { Memoize } from "performance-decorators/optimization";

class Calculator {
  @Memoize()
  fibonacci(n: number): number {
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
}
```

#### Throttle

```ts
import { Throttle } from "performance-decorators/optimization";

class ScrollHandler {
  @Throttle(100)
  onScroll(e: Event) {
    console.debug("Scroll event processed");
  }
}
```

## 📘 API Documentation

All decorators include full JSDoc comments with parameter descriptions, return types, and usage examples. Inspect the source (`src/debugging`, `src/optimizations`) for details.

## 🚧 Contributing

Contributions, bug-reports, and ideas are welcome! Please open issues or pull requests, include tests for new features, and follow existing patterns.

## 📄 License

MIT License — see the [LICENSE](LICENSE) file for details.
