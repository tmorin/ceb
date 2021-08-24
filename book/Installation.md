# Installation

## CommonJS

The library is composed of many packages published on [npmjs.com].
All packages are compliant [CommonJs](https://flaviocopes.com/commonjs) and [ES Module](https://flaviocopes.com/es-modules).

Custom Element Authoring:
- [@tmorin/ceb-core](https://www.npmjs.com/package/@tmorin/ceb-core)
- [@tmorin/ceb-builders](https://www.npmjs.com/package/@tmorin/ceb-builders)

Inversion Of Control:
- [@tmorin/ceb-inversion](https://www.npmjs.com/package/@tmorin/ceb-inversion)

Event/Message Architecture:
- [@tmorin/ceb-messaging-core](https://www.npmjs.com/package/@tmorin/ceb-messaging-core)
- [@tmorin/ceb-messaging-dom](https://www.npmjs.com/package/@tmorin/ceb-messaging-dom)
- [@tmorin/ceb-messaging-simple](https://www.npmjs.com/package/@tmorin/ceb-messaging-simple)

Templating:
- [@tmorin/ceb-templating-builder](https://www.npmjs.com/package/@tmorin/ceb-templating-builder)
- [@tmorin/ceb-templating-engine](https://www.npmjs.com/package/@tmorin/ceb-templating-engine)
- [@tmorin/ceb-templating-literal](https://www.npmjs.com/package/@tmorin/ceb-templating-literal)
- [@tmorin/ceb-templating-parser](https://www.npmjs.com/package/@tmorin/ceb-templating-parser)

Bundles:
- [@tmorin/ceb](https://www.npmjs.com/package/@tmorin/ceb)

Support:
- [@tmorin/ceb-testing](https://www.npmjs.com/package/@tmorin/ceb-testing)
- [@tmorin/ceb-utilities](https://www.npmjs.com/package/@tmorin/ceb-utilities)

## Universal Module Definition

The bundle package `@tmorin/ceb` is also available as a `UMD` module from [unpkg.com].

```html
<!-- the optimized Universal Module Definition -->
<script src="https://unpkg.com/@tmorin/ceb/umd/ceb.min.js"></script>
```

```html
<!-- the not optimized Universal Module Definition -->
<script src="https://unpkg.com/@tmorin/ceb/umd/ceb.js"></script>
```

[unpkg.com]: https://unpkg.com
[npmjs.com]: https://www.npmjs.com
