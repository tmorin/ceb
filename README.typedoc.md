# `<ceb/>` ~ custom-element-builder

> `<ceb/>` is a library providing building blocks to develop [Custom Elements (v1)]. Additionally, other building blocks are also provided to cover the implementation of web applications based on the Event/Message Architecture.

## Install

Please refer to the [manual](https://tmorin.github.io/ceb).

## Packages

The library is composed of many packages.

The packages related to the definition of [Custom Elements (v1)]:

- [ceb-elements-core](modules/_tmorin_ceb_elements_core.html)
- [ceb-elements-builders](modules/_tmorin_ceb_elements_builders.html)
- [ceb-elements-testing](modules/_tmorin_ceb_elements_testing.html)

A built-in implementation of a templating system:

- [ceb-templating-builder](modules/_tmorin_ceb_templating_builder.html)
- [ceb-templating-engine](modules/_tmorin_ceb_templating_engine.html)
- [ceb-templating-literal](modules/_tmorin_ceb_templating_literal.html)
- [ceb-templating-parser](modules/_tmorin_ceb_templating_parser.html)

A built-in implementation of the Inversion of Control principle:

- [ceb-inversion-core](modules/_tmorin_ceb_inversion_core.html)
- [ceb-inversion-builder](modules/_tmorin_ceb_inversion_builder.html)
- [ceb-inversion-testing-core](modules/_tmorin_ceb_inversion_testing_core.html)
- [ceb-inversion-testing-mocha](modules/_tmorin_ceb_inversion_testing_mocha.html)

A built-in implementation of the Event/Message architecture:

- [ceb-messaging-core](modules/_tmorin_ceb_messaging_core)
- [ceb-messaging-simple](modules/_tmorin_ceb_messaging_simple)
- [ceb-messaging-simple-builder](modules/_tmorin_ceb_messaging_simple_builder)
- [ceb-messaging-dom](modules/_tmorin_ceb_messaging_dom)
- [ceb-messaging-builder-core](modules/_tmorin_ceb_messaging_builder_core)
- [ceb-messaging-builder-inversion](modules/_tmorin_ceb_messaging_builder_inversion)
- [ceb-messaging-adapter-electron](modules/_tmorin_ceb_messaging_adapter_electron)

The helper packages:

- [ceb-utilities](modules/_tmorin_ceb_utilities.html)
- [ceb](modules/_tmorin_ceb.html) : a bundle of `ceb-elements-core`, `ceb-elements-builders`, `ceb-templating-builder` and `ceb-templating-literal`

## License

Released under the [MIT license].

[Custom Elements (v1)]: https://html.spec.whatwg.org/multipage/custom-elements.html
[MIT license]: http://opensource.org/licenses/MIT
