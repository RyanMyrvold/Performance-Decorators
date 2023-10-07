# TyDy

Dynamic, type-safe utilities for TypeScript.

## Introduction

TyDy provides a cohesive set of utilities designed for developers working with dynamic data structures in TypeScript. It ensures runtime type safety, offers reflection capabilities, provides validation tools, and more.

## Features

- Dynamic Type Creation: Generate and work with types on-the-fly.
- Type Validation: Ensure runtime type safety for your dynamic structures.
- Reflection Capabilities: Inspect and manage your dynamic types.
- Code Generation: Generate code based on templates with type constraints.
- Third-party Library Wrapping: Interact with third-party libraries in a type-safe manner.

## Installation

To install TyDy, use the following command:

npm install tydy --save

## Usage

### Dynamic Type Creation

Import the necessary utilities:

```typescript
import { DynamicTypeSafe } from 'tydy';
```

Now, create a dynamic type:

```typescript
const dynamicType = DynamicTypeSafe.createDynamicType({ name: 'string', age: 'number' });
const instance = new dynamicType();
```

### Type Validation

Import the type validator:

```typescript
import { DynamicTypeValidator } from 'tydy';
```

Use it to validate types:

```typescript
const type = { name: 'string', age: 'number' };
const instance = { name: 'Alice', age: 30 };
console.log(DynamicTypeValidator.validateType(instance, type)); // true
```

## Contribution

Interested in contributing to TyDy? See our contribution guidelines.

## License

MIT License. See LICENSE for more details.
