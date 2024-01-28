# 🚀 Performance Decorators

Elevate your application's performance monitoring in Node.js and browsers with **Performance Decorators**, a TypeScript-based toolkit. Our decorators simplify the task of tracking and optimizing performance.

## 🌟 Features

- **LogExecutionTime**: Method Decorator - Logs method execution times, helping pinpoint performance bottlenecks.
- **WarnPerformanceThreshold**: Method Decorator - Alerts when methods surpass predefined execution time thresholds.
- **LogMemoryUsage**: Method Decorator - Tracks and logs memory usage, aiding in efficient resource management.
- **LogMethodError**: Method Decorator - Handles and logs method errors, with an option to rethrow them.
- **MemoryLeakWarning**: Class Decorator - Monitors and warns of potential memory leaks, supporting both Node.js and browsers. Options include setting check intervals, memory usage thresholds, custom logging, and manual garbage collection in Node.js.

## 📦 Installation

Easily integrate into your project:

```bash
npm install performance-decorators
```

## 🛠️ Usage Examples

### Log Execution Time

```typescript
import { LogExecutionTime } from "performance-decorators";

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

### Warn Performance Threshold

```typescript
import { WarnPerformanceThreshold } from "performance-decorators";

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

### Log Memory Usage

```typescript
import { LogMemoryUsage } from "performance-decorators";

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

### Log Method Error

```typescript
import { LogMethodError } from "performance-decorators";

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

### Memory Leak Warning

```typescript
import MemoryLeakWarning from 'performance-decorators';

@MemoryLeakWarning({ checkIntervalMs: 30000, thresholdPercent: 20, logger: console.warn, enableManualGC: false })
class MyMonitoredClass {
    // Your class implementation
}

// Create an instance
const instance = new MyMonitoredClass();
```

In this setup, `MyMonitoredClass` is monitored for memory usage every 30 seconds, with warnings logged for usage increases beyond 20%. Manual garbage collection is disabled by default.
