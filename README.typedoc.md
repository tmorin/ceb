# `<ceb/>` ~ custom-element-builder

> `<ceb/>` is a library providing building blocks to develop [Custom Elements (v1)]. Additionally, other building blocks are also provided to cover the implementation of web applications based on the Event/Message Architecture.

## Install

Please refer to the [manual](https://tmorin.github.io/ceb).

## Packages

The library is composed of many packages.

The packages related to the definition of [Custom Elements (v1)]:

- [ceb-core](modules/_tmorin_ceb_core.html)
- [ceb-builders](modules/_tmorin_ceb_builders.html)

A built-in implementation of a templating system:

- [ceb-templating-builder](modules/_tmorin_ceb_templating_builder.html)
- [ceb-templating-engine](modules/_tmorin_ceb_templating_engine.html)
- [ceb-templating-literal](modules/_tmorin_ceb_templating_literal.html)
- [ceb-templating-parser](modules/_tmorin_ceb_templating_parser.html)

A built-in implementation of the Inversion of Control principle:

- [ceb-inversion](modules/_tmorin_ceb_inversion.html)
- [ceb-inversion-builder](modules/_tmorin_ceb_inversion_builder.html)

A built-in implementation of the Event/Message architecture:

- [ceb-messaging-core](modules/_tmorin_ceb_messaging_core.html)
- [ceb-messaging-simple](modules/_tmorin_ceb_messaging_simple.html)
- [ceb-messaging-dom](modules/_tmorin_ceb_messaging_dom.html)
- [ceb-messaging-adapter-electron](modules/_tmorin_ceb_messaging_bus_adapter_ipc.html)

The helper packages:

- [ceb-utilities](modules/_tmorin_ceb_utilities.html)
- [ceb-testing](modules/_tmorin_ceb_testing.html)
- [ceb](modules/_tmorin_ceb.html) : a bundle of `ceb-core`, `ceb-builders`, `ceb-templating-builder` and `ceb-templating-literal`

## License

Released under the [MIT license].

[Custom Elements (v1)]: https://html.spec.whatwg.org/multipage/custom-elements.html
[MIT license]: http://opensource.org/licenses/MIT
