# `<ceb/>` ~ custom-element-builder

> `<ceb/>` was initially a library dedicated for the authoring of [Custom Elements (v0)] then [Custom Elements (v1)].
> However, the library is now providing building blocks going beyond the topic of composable UI elements.
> It's about fundamental design principles, messaging, functional rendering and obviously composition of UI elements ;).

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
- [ceb-inversion-testing-jest](modules/_tmorin_ceb_inversion_testing_jest.html)
- [ceb-inversion-testing-mocha](modules/_tmorin_ceb_inversion_testing_mocha.html)

A built-in implementation of the Event/Message architecture:

- [ceb-messaging-core](modules/_tmorin_ceb_messaging_core.html)
- [ceb-messaging-inversion](modules/_tmorin_ceb_messaging_inversion.html)
- [ceb-messaging-simple](modules/_tmorin_ceb_messaging_simple.html)
- [ceb-messaging-simple-builder](modules/_tmorin_ceb_messaging_simple_builder.html)
- [ceb-messaging-simple-inversion](modules/_tmorin_ceb_messaging_simple_inversion.html)
- [ceb-messaging-builder-core](modules/_tmorin_ceb_messaging_builder_core.html)
- [ceb-messaging-builder-inversion](modules/_tmorin_ceb_messaging_builder_inversion.html)
- [ceb-messaging-adapter-dom](modules/_tmorin_ceb_messaging_adapter_dom.html)
- [ceb-messaging-adapter-electron](modules/_tmorin_ceb_messaging_adapter_electron.html)
- [ceb-messaging-adapter-purify](modules/_tmorin_ceb_messaging_adapter_purify.html)
- [ceb-messaging-testing](modules/_tmorin_ceb_messaging_testing.html)

The bundle:

- [ceb-bundle-web](modules/_tmorin_ceb_bundle_web.html) : a bundle of `ceb-elements-core`, `ceb-elements-builders`, `ceb-templating-builder` and `ceb-templating-literal`

The helper packages:

- [ceb-utilities](modules/_tmorin_ceb_utilities.html)

## License

Released under the [MIT license].

[Custom Elements (v0)]: https://www.w3.org/TR/2018/WD-custom-elements-20180216/
[Custom Elements (v1)]: https://html.spec.whatwg.org/multipage/custom-elements.html
[MIT license]: http://opensource.org/licenses/MIT
