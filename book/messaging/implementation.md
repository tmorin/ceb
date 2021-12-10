# Reference Implementation

> The reference implementation is defined in the NPM package [@tmorin/ceb-messaging-simple](https://www.npmjs.com/package/@tmorin/ceb-messaging-simple).

The reference implementation relies on an in-memory and single process approach.
So that, the implementation is free of network or any other concerns related to distributed systems.

## The SimpleGateway

A SimpleGateway instance can be got from the following three approaches: the global instance, the factory method or the constructor.

### The global instance

A global instance of the SimpleGateway is available from the static field `SimpleGateway.GOBAL`.
It's a lazy property, in fact the instance is only created once at its first get.

```typescript
{{#include ../../packages/ceb-book-samples/src/messaging/implementation-create_global.ts}}
```

### The factory method

A SimpleGateway instance can be easily created using the factory method, i.e. the static method `SimpleGateway.create()`.
The method returns a fresh new SimpleGateway instance at each call.

```typescript
{{#include ../../packages/ceb-book-samples/src/messaging/implementation-create_factory.ts}}
```

### The constructor

The constructor approach provides a fine grain control of the Gateway dependencies: the CommandBus, the QueryBus, the EventBus and the GatewayObserver. 

```typescript
{{#include ../../packages/ceb-book-samples/src/messaging/implementation-create_constructor.ts}}
```

## The Inversion Module

The package provides an Inversion Module which can be used to create (optionally) and publish the SimpleGateway instance on the registry.

Create a container with the default module behavior, i.e. the SimpleGateway will be created from scratch automatically:
```typescript
{{#include ../../packages/ceb-book-samples/src/messaging/implementation-inversion-default.ts}}
```

Create a container with a provided SimpleGateway instance:
```typescript
{{#include ../../packages/ceb-book-samples/src/messaging/implementation-inversion-global.ts}}
```
