# Installation

## CommonJS and ES Module

The library is composed of many packages published on [npmjs.com].
All packages are compliant [CommonJs](https://flaviocopes.com/commonjs) and [ES Module](https://flaviocopes.com/es-modules).

Custom Element Authoring:
- [@tmorin/ceb-elements-core](https://www.npmjs.com/package/@tmorin/ceb-elements-core)
- [@tmorin/ceb-elements-builders](https://www.npmjs.com/package/@tmorin/ceb-elements-builders)
- [@tmorin/ceb-elements-testing](https://www.npmjs.com/package/@tmorin/ceb-elements-testing)

Inversion Of Control:
- [@tmorin/ceb-inversion-core](https://www.npmjs.com/package/@tmorin/ceb-inversion-core)
- [@tmorin/ceb-inversion-builder](https://www.npmjs.com/package/@tmorin/ceb-inversion-builder)
- [@tmorin/ceb-inversion-testing-core](https://www.npmjs.com/package/@tmorin/ceb-inversion-testing-core)
- [@tmorin/ceb-inversion-testing-mocha](https://www.npmjs.com/package/@tmorin/ceb-inversion-testing-mocha)

Event/Message Architecture:
- [@tmorin/ceb-messaging-core](https://www.npmjs.com/package/@tmorin/ceb-messaging-core)
- [@tmorin/ceb-messaging-dom](https://www.npmjs.com/package/@tmorin/ceb-messaging-dom)
- [@tmorin/ceb-messaging-simple](https://www.npmjs.com/package/@tmorin/ceb-messaging-simple)
- [@tmorin/ceb-messaging-simple-builder](https://www.npmjs.com/package/@tmorin/ceb-messaging-simple-builder)

Templating:
- [@tmorin/ceb-templating-engine](https://www.npmjs.com/package/@tmorin/ceb-templating-engine)
- [@tmorin/ceb-templating-parser](https://www.npmjs.com/package/@tmorin/ceb-templating-parser)
- [@tmorin/ceb-templating-literal](https://www.npmjs.com/package/@tmorin/ceb-templating-literal)
- [@tmorin/ceb-templating-builder](https://www.npmjs.com/package/@tmorin/ceb-templating-builder)

Support:
- [@tmorin/ceb-utilities](https://www.npmjs.com/package/@tmorin/ceb-utilities)

## Universal Module Definition

The bundle package [@tmorin/ceb-bundle-web](https://www.npmjs.com/package/@tmorin/ceb-bundle-web) is also available as a `UMD` module from [unpkg.com].

```html
<!-- the optimized Universal Module Definition -->
<script src="https://unpkg.com/@tmorin/ceb-bundle-web/dist/umd/ceb.min.js"></script>
```

```html
<!-- the not optimized Universal Module Definition -->
<script src="https://unpkg.com/@tmorin/ceb-bundle-web/dist/umd/ceb-bundle-web.js"></script>
```

[unpkg.com]: https://unpkg.com
[npmjs.com]: https://www.npmjs.com
