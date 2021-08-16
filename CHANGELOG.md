# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.3.1](https://github.com/tmorin/ceb/compare/v3.3.0...v3.3.1) (2021-08-16)


### Bug Fixes

* **documentation:** the link to DomBusBuilder was broken ([2562767](https://github.com/tmorin/ceb/commit/2562767344a7e00a2ba6916ee58edd5698177ef2))

## [3.3.0](https://github.com/tmorin/ceb/compare/v3.2.0...v3.3.0) (2021-08-16)


### Features

* **messaging:** ceb should provide a way to get a loose coupling relationship between model and custom element ([732c6e3](https://github.com/tmorin/ceb/commit/732c6e3b95c536197b12d0dc8a73a8ce6031f7d9))
* **on:** add the support of global events (i.e. `window`) ([73b6e09](https://github.com/tmorin/ceb/commit/73b6e09e5cfc4e28c06969aeafc32a35bcb9a2d3))


### Bug Fixes

* **documentation:** add a reference to the CodeSandbox template ([d292dd2](https://github.com/tmorin/ceb/commit/d292dd2a77671367ca82003484434173b3d7ee96))
* **documentation:** add the reference to the TodoMVC implementation ([437b7a6](https://github.com/tmorin/ceb/commit/437b7a6dfb22363153d1c705b292760a8f689965))

## [3.2.0](https://github.com/tmorin/ceb/compare/v3.1.1...v3.2.0) (2021-08-05)


### Features

* `TemplateBuilder` should provide an option to preserve attribute from external mutations ([7c971ce](https://github.com/tmorin/ceb/commit/7c971ced626758b557c6d727ef83e01da95e4c43))
* `TemplateBuilder` should provide an option to preserve the Custom Element content from external mutations ([b7be2a0](https://github.com/tmorin/ceb/commit/b7be2a06c2dcacdbd9b671eadfb584b971bf21e7))


### Bug Fixes

* in fact, `utilities` should be exported ([9e02ce0](https://github.com/tmorin/ceb/commit/9e02ce0d385f94a3a8d0c04b5611b760048418b2))
* **on:** the decorator couldn't be used many times ([585d0ab](https://github.com/tmorin/ceb/commit/585d0abe68319aa8231ac9e1f3f9d4b217a3b8d8))
* template caching leads to issues ([2bd0b01](https://github.com/tmorin/ceb/commit/2bd0b01cc503864d3de211cdfdb2227c25b95b86))
* **template:** boolean attributes were not properly handled ([b36f08e](https://github.com/tmorin/ceb/commit/b36f08ed6555e81e56d7a3d1ea493292cd2ff73a))
* **template:** referenced elements were badly handled ([55c0a0c](https://github.com/tmorin/ceb/commit/55c0a0c662edd598537b716d9cf75ddd0d8a5f6f))
* **template:** values with an empty string were not handled properly for attributes ([4764967](https://github.com/tmorin/ceb/commit/47649676da73cf1fbbe122f7f69b0b465412849e))

### [3.1.1](https://github.com/tmorin/ceb/compare/v3.1.0...v3.1.1) (2021-08-03)

## [3.1.0](https://github.com/tmorin/ceb/compare/v3.0.0...v3.1.0) (2021-08-01)


### Features

* **template:** the Grey DOM (or scope) switch should be natively handled by the builder ([ec48c22](https://github.com/tmorin/ceb/commit/ec48c22d5f71b847453792e3d865dc166dc69f11))


### Bug Fixes

* **documentation:** fix typo ([8a43a26](https://github.com/tmorin/ceb/commit/8a43a26b374025853736a08deab7503dfa96ab8c))

## [3.0.0](https://github.com/tmorin/ceb/compare/v2.3.4...v3.0.0) (2021-07-31)


### ⚠ BREAKING CHANGES

* review the builder descriptions in the book
* the decorators are now terminal methods of builders

### Features

* **documentation:** improve examples ([e7af32c](https://github.com/tmorin/ceb/commit/e7af32cde63f1de78a762a210367d45aad653033))


* review the builder descriptions in the book ([e9bb2b8](https://github.com/tmorin/ceb/commit/e9bb2b89df48784b8cb30c12180b60834b924593))
* the decorators are now terminal methods of builders ([e3773de](https://github.com/tmorin/ceb/commit/e3773de251aa87f1dd754f1097354803649fde95))

### [2.3.4](https://github.com/tmorin/ceb/compare/v2.3.3...v2.3.4) (2021-07-28)


### Bug Fixes

* **documentation:** external links to the API were broken ([bc03206](https://github.com/tmorin/ceb/commit/bc03206f8a6349cd50e9ea1bcf37e934db636645))

### [2.3.3](https://github.com/tmorin/ceb/compare/v2.3.2...v2.3.3) (2021-07-27)


### Bug Fixes

* **template:** the template parameters were not exposed with the decorator ([6a32a6d](https://github.com/tmorin/ceb/commit/6a32a6d25eb16393c304aca1fe9d444d619943a1))

### [2.3.2](https://github.com/tmorin/ceb/compare/v2.3.1...v2.3.2) (2021-07-27)


### Bug Fixes

* **book:** api was not deployed ([9f1cc64](https://github.com/tmorin/ceb/commit/9f1cc64b139b2858e20d7477f30a65de3d443eb1))
* **book:** api was not deployed ([4229a17](https://github.com/tmorin/ceb/commit/4229a17b90fba5ea3d162fda446b879e8ec2da36))

### [2.3.1](https://github.com/tmorin/ceb/compare/v2.3.0...v2.3.1) (2021-07-27)


### Bug Fixes

* **book:** simplify the welcoming Custom Element ([a670264](https://github.com/tmorin/ceb/commit/a670264044c823d81ebaa988c4e2e545e3b97c70))

## [2.3.0](https://github.com/tmorin/ceb/compare/v2.2.0...v2.3.0) (2021-07-27)


### Features

* **documentation:** add new example, `ex-greeting` ([0ca053d](https://github.com/tmorin/ceb/commit/0ca053d855d674dfc37eb7f1dd3b10f7a06f7f45))
* **template:** integrate a DOM patcher process ([40e9efd](https://github.com/tmorin/ceb/commit/40e9efd5cddfb1eb513273cb243d2f433405d0b5))
* **template:** the slot elements should be handled ([53821fb](https://github.com/tmorin/ceb/commit/53821fb4e1f2d613b3dab95bc959a5a4a3a6be3d))

## [2.2.0](https://github.com/tmorin/ceb/compare/v2.1.0...v2.2.0) (2021-07-18)


### Features

* **documentation:** document the examples ([4d2d98a](https://github.com/tmorin/ceb/commit/4d2d98a0e2928ba59fa25b27edf3ba4d04d089aa))
* improve packaging with webpack 5 ([db09259](https://github.com/tmorin/ceb/commit/db092596d45afbc04204871cea01234517cb6dbe))


### Bug Fixes

* **delegate:** the option argument of the decorator is now optional ([c5a7ad6](https://github.com/tmorin/ceb/commit/c5a7ad63bc8cdc9d8319468692d717f2f5c127fb))
* **documentation:** fix the example description in PropertyDelegateBuilder.md ([81523be](https://github.com/tmorin/ceb/commit/81523be55382e6052b58a0007060af4edea3ecba))

## [2.1.0](https://github.com/tmorin/ceb/compare/v2.0.1...v2.1.0) (2020-09-17)


### Features

* prevent double registrations ([3c9e86f](https://github.com/tmorin/ceb/commit/3c9e86f6d86fbc16918347dafabbef64ef222cc4))

### [2.0.1](https://github.com/tmorin/ceb/compare/v2.0.0...v2.0.1) (2020-03-10)


### Bug Fixes

* add missing badges ([6806c9d](https://github.com/tmorin/ceb/commit/6806c9de7628003412b7616eae90378f7d071592))

## [2.0.0](https://github.com/tmorin/ceb/compare/v1.0.4...v2.0.0) (2020-03-10)


### Features

* add decorators ([51fd000](https://github.com/tmorin/ceb/commit/51fd00037507b05ddd9d59f795095dc5e30227ff))
* delegate attribute mutations to child nodes ([f1134d3](https://github.com/tmorin/ceb/commit/f1134d3dcf7159604daa8ee263738707e27242a4))


### Bug Fixes

* tests failed due to a useless missing modules ([6b089a5](https://github.com/tmorin/ceb/commit/6b089a51ff2f290fba23a0ed908ad265ccc85106))
* **ReferenceBuilder:** by default the selector must `#${propName}` ([f79f982](https://github.com/tmorin/ceb/commit/f79f982f28a06ac8ef90edb34da27f09a2fc5215))
