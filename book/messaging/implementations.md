# Implementations

## The reference implementation

> The reference implementation is defined in the NPM package [@tmorin/ceb-messaging-simple](https://www.npmjs.com/package/@tmorin/ceb-messaging-simple).

The reference implementation relies on an in-memory and single process approach.
So that, the implementation is free of network or any other concerns related to distributed systems.

### The SimpleGateway

A SimpleGateway instance can be got from the following three approaches: the global instance, the factory method or the constructor.

#### The global instance

A global instance of the SimpleGateway is available from the static field `SimpleGateway.GOBAL`.
It's a lazy property, in fact the instance is only created once at its first get.

```typescript
{{#include ../../packages/ceb-book-samples/src/messaging/implementation-create_global.ts}}
```

#### The factory method

A SimpleGateway instance can be easily created using the factory method, i.e. the static method `SimpleGateway.create()`.
The method returns a fresh new SimpleGateway instance at each call.

```typescript
{{#include ../../packages/ceb-book-samples/src/messaging/implementation-create_factory.ts}}
```

#### The constructor

The constructor approach provides a fine grain control of the Gateway dependencies: the CommandBus, the QueryBus, the EventBus and the GatewayObserver. 

```typescript
{{#include ../../packages/ceb-book-samples/src/messaging/implementation-create_constructor.ts}}
```

### The Inversion Module

The package provides an Inversion Module which can be used to create (optionally) and register it on the registry.

Create a container with the default module behavior, i.e. the SimpleGateway will be created from scratch automatically:
```typescript
{{#include ../../packages/ceb-book-samples/src/messaging/implementation-inversion-default.ts}}
```

Create a container with a provided SimpleGateway instance:
```typescript
{{#include ../../packages/ceb-book-samples/src/messaging/implementation-inversion-global.ts}}
```

## The Moleculer implementation

> The Moleculer implementation is defined in the NPM package [@tmorin/ceb-messaging-moleculer](https://www.npmjs.com/package/@tmorin/ceb-messaging-moleculer).

The [Moleculer] implementation leverages on the features provided by the microservices framework.

### Management of Commands and Queries

There is one [Moleculer service] per command or query types.
For instance, the command type `CommandA` will be managed by the service `CommandA`.

About commands, each service provides two [Moleculer actions]: `execute` and `executeAndForget`.
The first one executes the command handler and return the result.
The second one just executes the command handler at the next clock thick.
For instance, the command type `CommandA` can be executed within the Moleculer world with the actions `CommandA.execute` and `CommandA.executeAndForget`.
Each action accepts only one parameter: the command.

About queries, each service provides only one action: `execute`.
The action executes the query handler and return the result.
For instance, the query type `QueryA` can be executed within the Moleculer world with the action `QueryA.execute`.
The action accepts only one parameter: the query.

### Management of Events

The Events are managed by a single [Moleculer service]: `EventBus`.
Each time an Event is published, the type of [Moleculer event] is `Event.MESSAGE_TYPE`.
For instance, when the Event `EventA` is published, the Moleculer event name is `EventBus.EventA`.

By default, the implementation publish messaging using the _balanced_ mode.
Because of the single Moleculer service `EventBus`, it means each Event will only be handled by only one service in the cluster.

### The Inversion Module

The package provides an Inversion Module which can be used to create the MoleculerGateway instance and register it on the registry.

Create a container with the default module behavior, i.e. a ServiceBroker is expected in the registry:
```typescript
{{#include ../../packages/ceb-book-samples/src/messaging/moleculer-inversion-registrykey.ts}}
```

Create a container with a provided ServiceBroker instance.
In that case, the provided ServiceBroker will be registered in the registry.
```typescript
{{#include ../../packages/ceb-book-samples/src/messaging/moleculer-inversion-instance.ts}}
```

[Moleculer]: https://moleculer.services
[Moleculer service]: https://moleculer.services/docs/0.14/actions.html
[Moleculer actions]: https://moleculer.services/docs/0.14/actions.html
[Moleculer event]: https://moleculer.services/docs/0.14/events.html
