# @tmorin/ceb-messaging-adapter-electron

[![npm version](https://badge.fury.io/js/%40tmorin%2Fceb-messaging-adapter-electron.svg)](https://badge.fury.io/js/%40tmorin%2Fceb-messaging-adapter-electron)
[![api](https://img.shields.io/badge/-api-informational.svg)](https://tmorin.github.io/ceb/api/modules/_tmorin_ceb_messaging_bus_adapter_ipc.html)

> The package is part of the `<ceb/>` library.
> It provides an implementation of artifacts of an Event/Message architecture.

## Install

The NPM package is compliant [CommonJs](https://flaviocopes.com/commonjs)
and [ES Module](https://flaviocopes.com/es-modules).

```bash
npm install @tmorin/ceb-messaging-adapter-electron
```

## Usage

Usage from the Main context:
```typescript
import {IpcMainBus} from "@tmorin/ceb-messaging-adapter-electron/bus-main"
```

Usage from the Renderer context:
```typescript
import {IpcRendererBus} from "@tmorin/ceb-messaging-adapter-electron/bus-renderer"
```

## License

Released under the [MIT license].

[MIT license]: http://opensource.org/licenses/MIT
