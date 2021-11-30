# Inversion

Command and Query handlers as well as Event listeners can be discovered and managed by Inversion on the container initialization.
The module `MessagingModule` takes care of the discovery, registration and also disposition of handlers and listeners at the container end of life.

Discoverable Command handlers must match the `DiscoverableCommandHandler` interface.

```typescript
{{#include inversion-discovery-command.ts}}
```

Discoverable Query handlers must match the `DiscoverableQueryHandler` interface.

```typescript
{{#include inversion-discovery-query.ts}}
```

Discoverable Event listeners must match the `DiscoverableEventListener` interface.

```typescript
{{#include inversion-discovery-event.ts}}
```

To be discoverable the handlers and listeners must be registered in the Container's Registry with the right Registry Key.

- `DiscoverableCommandHandlerSymbol` for the Command handlers
- `DiscoverableQueryHandlerSymbol` for the Query handlers
- `DiscoverableEventListenerSymbol` for the Event listeners

```typescript
{{#include inversion-discovery-module.ts}}
```

Finally, the module `MessagingModule` and those registering discoverable handlers and listeners must be registered as other modules.

```typescript
{{#include inversion-discovery-container.ts}}
```
