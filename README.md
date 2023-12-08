# 🚀 Performance Decorators

Enhance the performance monitoring in your Node.js or browser applications with the **Performance Decorators** library. This TypeScript library offers a suite of decorators for insightful and efficient performance tracking.

## 🌟 Features

- **LogExecutionTime**: ⏱️ Automatically logs execution times, aiding in bottleneck identification.
- **WarnPerformanceThreshold**: ⚠️ Issues warnings for methods exceeding performance thresholds.
- **LogMemoryUsage**: 🧠 Monitors and logs memory usage, offering a clear view of resource consumption.
- **LogMethodError**: 🚨 Gracefully logs and manages method execution errors.

## 📦 Installation

Jumpstart your performance monitoring by installing the package:

```bash
npm install performance-decorators
```

## 🛠️ Usage Examples

### Log Execution Time

Logs the execution time of a method. If a custom handler is provided, it will be used for logging.

```typescript
import { LogExecutionTime } from 'performance-decorators';

class PerformanceExample {
    @LogExecutionTime()
    quickMethod() {
        // Method logic...
    }

    @LogExecutionTime((time, method) => console.log(`${method} took ${time} ms`))
    detailedMethod() {
        // Method logic...
    }
}
```

### Warn Performance Threshold

Issues a warning if a method's execution time exceeds the specified threshold (default 100ms). A custom handler can be provided for personalized handling.

```typescript
import { WarnPerformanceThreshold } from 'performance-decorators';

class PerformanceExample {
    @WarnPerformanceThreshold()
    methodWithDefaultThreshold() {
        // Method logic...
    }

    @WarnPerformanceThreshold(200, (time, method) => console.warn(`${method} exceeded ${time} ms`))
    methodWithCustomThreshold() {
        // Method logic...
    }
}
```

### Log Memory Usage

Logs memory usage before and after method execution. A custom handler can be used for tailored logging.

```typescript
import { LogMemoryUsage } from 'performance-decorators';

class PerformanceExample {
    @LogMemoryUsage()
    standardMemoryMethod() {
        // Method logic...
    }

    @LogMemoryUsage((usedMemory, method) => console.log(`${method} used ${usedMemory} bytes`))
    detailedMemoryMethod() {
        // Method logic...
    }
}
```

### Log Method Error

Logs errors occurring during method execution. If `rethrow` is true, the error is rethrown. A custom handler can be provided for specific error handling.

```typescript
import { LogMethodError } from 'performance-decorators';

class PerformanceExample {
    @LogMethodError()
    methodWithError() {
        throw new Error('Example error');
    }

    @LogMethodError(true, (error, method) => console.error(`${method} error: ${error.message}`))
    methodWithCustomErrorHandling() {
        throw new Error('Custom error');
    }
}
```

## 🤝 Contributing

Contributions are welcome and appreciated! Check out our [Contributing Guide](CONTRIBUTING.md) for details on how to participate.

## 📚 License

This project is licensed under the [MIT License](LICENSE).
