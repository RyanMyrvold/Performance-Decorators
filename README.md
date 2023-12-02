# 🚀 Performance Decorators

Performance Decorators is a powerful and versatile TypeScript library designed to make performance monitoring in your applications as seamless as possible. 📊 Whether you're working in Node.js or in the browser, this library provides you with a set of decorators to gain insights into method execution times, memory usage, error occurrences, and much more!

## 🌟 Features

- **LogExecutionTime**: ⏱️ Easily logs the execution time of your methods, helping you identify performance bottlenecks.
- **WarnPerformanceThreshold**: ⚠️ Warns you if a method's execution time exceeds a certain threshold, perfect for keeping an eye on critical performance metrics.
- **LogMemoryUsage**: 🧠 Logs memory usage before and after method execution, giving you a clear view of how your methods affect memory consumption.
- **LogMethodError**: 🚨 Elegantly logs errors that occur during method execution, making error tracking and debugging a breeze.
- ...and more exciting features to explore!

## 📦 Installation

Get started by installing the package using npm:

```bash
npm install performance-decorators
```

## 🛠️ Usage

Here's how you can utilize the various decorators from this library in your projects:

### Log Execution Time

```typescript
import { LogExecutionTime } from 'performance-decorators';

class Example {
    @LogExecutionTime()
    myMethod() {
        // Your method logic here...
    }
}
```

### Warn Performance Threshold

```typescript
import { WarnPerformanceThreshold } from 'performance-decorators';

class Example {
    @WarnPerformanceThreshold()
    myMethod() {
        // Your method logic here...
    }
}
```

### Log Memory Usage

```typescript
import { LogMemoryUsage } from 'performance-decorators';

class Example {
    @LogMemoryUsage()
    myMethod() {
        // Your method logic here...
    }
}
```

### Log Method Error

```typescript
import { LogMethodError } from 'performance-decorators';

class Example {
    @LogMethodError()
    myMethod() {
        throw new Error('Example error');
    }
}
```

## 👐 Contributing

We love contributions! 💖 Check out our [Contributing Guide](CONTRIBUTING.md) for details on how to help us make this project even better.

## 📄 License

This project is proudly licensed under the [MIT License](LICENSE).
