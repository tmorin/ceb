# @tmorin/ceb

[![npm version](https://badge.fury.io/js/%40tmorin%2Fceb-bundle-web.svg)](https://badge.fury.io/js/%40tmorin%2Fceb-bundle-web)
[![skypack.dev](https://img.shields.io/badge/-skypack.dev-blueviolet.svg)](https://www.skypack.dev/view/@tmorin/ceb-bundle-web)
[![doc](https://img.shields.io/badge/-doc-informational.svg)](https://tmorin.github.io/ceb)
[![api](https://img.shields.io/badge/-api-informational.svg)](https://tmorin.github.io/ceb/api/modules/_tmorin_ceb_bundle_web.html)

> The package is part of the `<ceb/>` library.
> It bundles the main features of the library related to the [Custom Elements (v1)] specification.

The bundled packages:

- [`@tmorin/ceb-elements-core`](../ceb-elements-core)
- [`@tmorin/ceb-elements-builders`](../ceb-elements-builders)
- [`@tmorin/ceb-templating-builder`](../ceb-templating-builder)
- [`@tmorin/ceb-templating-literal`](../ceb-templating-literal)

## Install

The NPM package is compliant [CommonJs](https://flaviocopes.com/commonjs) and [ES Module](https://flaviocopes.com/es-modules).

```bash
npm install @tmorin/ceb-bundle-web
```

It is also available as a `UMD` module:

```html
<!-- the optimized Universal Module Definition -->
<script src="https://cdn.skypack.dev/@tmorin/ceb-bundle-web/dist/umd/ceb.min.js"></script>
```

```html
<!-- the not optimized Universal Module Definition -->
<script src="https://cdn.skypack.dev/@tmorin/ceb-bundle-web/dist/umd/ceb.js"></script>
```

## License

Released under the [MIT license].

[Custom Elements (v1)]: https://html.spec.whatwg.org/multipage/custom-elements.html
[MIT license]: http://opensource.org/licenses/MIT
