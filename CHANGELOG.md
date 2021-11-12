# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.0.1](https://github.com/tmorin/ceb/compare/v5.0.0...v5.0.1) (2021-11-12)


### Bug Fixes

* **ceb-templating-parser:** inline elements are badly parsed when embedded in inline elements ([3956c1c](https://github.com/tmorin/ceb/commit/3956c1c47c099b9e892d1cad52bdec566ad10f94))





# [5.0.0](https://github.com/tmorin/ceb/compare/v4.0.2...v5.0.0) (2021-11-11)


### Bug Fixes

* **ceb-templating-literal:** attribute name with matching value should not be handled as boolean ([8b37edf](https://github.com/tmorin/ceb/commit/8b37edff5ce62db09295eed2b5d10d8cfa3412f4))
* **ceb-templating-parser:** parser cannot work on repetitive structure ([d9a8b1d](https://github.com/tmorin/ceb/commit/d9a8b1d296bee632ea07ac0c17f0c35cdd58ee58))
* **documentation:** remove a useless snippet in the Typedoc README ([7e80b9a](https://github.com/tmorin/ceb/commit/7e80b9a5173cd919f252e4f4fa18a81537c808f3))


### Features

* **ceb-inversion-builder:** inject entries in Custom Elements ([8e4961d](https://github.com/tmorin/ceb/commit/8e4961dad4b0eb24ff588b6a76f7115078e08d52))
* **ceb-messaging-adapter-electron:** `Bus` can handles `MessageType` and `MessageConstructor` ([fa5b771](https://github.com/tmorin/ceb/commit/fa5b771cb7436344a89317d6359269c517ae28d3))
* **ceb-messaging-adapter-electron:** add `SimpleIpcMessageConverter` ([89f02e8](https://github.com/tmorin/ceb/commit/89f02e889bab84ae0f0074c2d4bc2c25342b9c85))
* **ceb-messaging-adapter-electron:** add a Bus adapter for Electron IPC ([c338100](https://github.com/tmorin/ceb/commit/c3381009f350cf2d3faa2c1f2fa7c845344b44cc))
* **ceb-messaging-adapter-electron:** add an inversion module ([ac5ccea](https://github.com/tmorin/ceb/commit/ac5cceaa74e834dc4500eb9eb50a46a7a234e02e))
* **ceb-messaging-adapter-electron:** add support for internal event like `error` or `dispose` ([777acc7](https://github.com/tmorin/ceb/commit/777acc77e14a27e7809c2aea89d60c4c230ca4d7))
* **ceb-messaging-adapter-electron:** handle the `MESSAGE_TYPE` static field of `Message` ([0e64d24](https://github.com/tmorin/ceb/commit/0e64d2456e7d0b729643b419a29c49231a856e3c))
* **ceb-messaging-adapter-electron:** rename the package ([2517d60](https://github.com/tmorin/ceb/commit/2517d60fea9722fb17b12bfb57f0390b5dba54c3))
* **ceb-messaging-builder-inversion:** add a builder to inject a bus from a container ([64ece4d](https://github.com/tmorin/ceb/commit/64ece4d0defc4dd00ed12a05adad63c26a1531ec))
* **ceb-messaging-core-builder:** extract the base Builder in a dedicated package ([0a137b6](https://github.com/tmorin/ceb/commit/0a137b67413f2735618e56de274f1641a3108d8d))
* **ceb-messaging-core:** `Bus` can handles `MessageType` and `MessageConstructor` ([305ea02](https://github.com/tmorin/ceb/commit/305ea02ffb391852a5e3c7e0561831d904a7b11b))
* **ceb-messaging-core:** add support for internal event like `error` or `dispose` ([d3ba020](https://github.com/tmorin/ceb/commit/d3ba020cddbad9d79f599f4103f511f68b497334))
* **ceb-messaging-core:** refactor the interface `Bus` to embrace messaging guidelines ([fcbb68d](https://github.com/tmorin/ceb/commit/fcbb68d10d71db174129ebdec061cfe55145ba34))
* **ceb-messaging-core:** refactor the interface `Message` to embrace messaging guidelines ([bf6cda3](https://github.com/tmorin/ceb/commit/bf6cda3c875d86c0c7871f040b681d0a719e271a))
* **ceb-messaging-dom:** `Bus` can handles `MessageType` and `MessageConstructor` ([53b40f3](https://github.com/tmorin/ceb/commit/53b40f37bfdee87ce3bdbfd13eeea44de1dbcd36))
* **ceb-messaging-dom:** add options to the inversion module ([dbae0e0](https://github.com/tmorin/ceb/commit/dbae0e07675be5add53beeaf3b69a37c1803e07b))
* **ceb-messaging-dom:** add support for internal event like `error` or `dispose` ([f6c38b9](https://github.com/tmorin/ceb/commit/f6c38b9213541db46ac4ad633c762194b85f8da2))
* **ceb-messaging-dom:** refactor the package to embrace messaging guidelines ([d99c0d7](https://github.com/tmorin/ceb/commit/d99c0d7eeba82fca71e383389658aaad1e77f697))
* **ceb-messaging-simple-builder:** extract the Builder in a dedicated package ([abb6c9d](https://github.com/tmorin/ceb/commit/abb6c9dc024d0dbc5e2d1140b2c5b0ce0cf46207))
* **ceb-messaging-simple:** `Bus` can handles `MessageType` and `MessageConstructor` ([0ed3a29](https://github.com/tmorin/ceb/commit/0ed3a2929c0f3e9a3d62230ec6427d9b91571560))
* **ceb-messaging-simple:** add options to the inversion module ([c72273b](https://github.com/tmorin/ceb/commit/c72273b6c4ffa128fa77b157c6db52429d1907a1))
* **ceb-messaging-simple:** add support for internal event like `error` or `dispose` ([87bca25](https://github.com/tmorin/ceb/commit/87bca25a96d3b5f7184ab97c65c86649f062a18d))
* **ceb-messaging-simple:** refactor the package to embrace messaging guidelines ([83829ab](https://github.com/tmorin/ceb/commit/83829ab70aeeb84f7b34b0bee91772f731e35dc4))


### BREAKING CHANGES

* **ceb-messaging-core-builder:** the class `AbstractBusBuilder` is now located in the package `ceb-messaging-simple-builder-builder`
* **ceb-messaging-simple-builder:** the class `SimpleBusBuilder` is now located in the package `ceb-messaging-simple-builder`
* **ceb-messaging-adapter-electron:** the package `ceb-messaging-bus-adapter-ipc` has been renamed to `ceb-messaging-adapter-electron`
* **ceb-messaging-core:** the following new methods must be implemented `Bus.emit`, `Bus.on`, `Bus.off`, `Bus.dispose`
* **ceb-messaging-simple:** the class `AbstractSimpleMessage` and descendants have been impacted
* **ceb-messaging-dom:** the class `DomMessage` and descendants have been impacted
* **ceb-messaging-core:** the methods `Bus.handle` and `Bus.subscribe` accept only `MessageType` and no more a constructor
* **ceb-messaging-core:** the field `Message.messageId` has been moved to `Message.headers.messageId`





## [4.0.2](https://github.com/tmorin/ceb/compare/v4.0.1...v4.0.2) (2021-08-25)


### Bug Fixes

* **ceb-messaging-dom:** DomBus cannot be used properly from Custom Element ([086d5f6](https://github.com/tmorin/ceb/commit/086d5f6376e4d98364ada5aa9bed6f4e47c41251))





## [4.0.1](https://github.com/tmorin/ceb/compare/v4.0.0...v4.0.1) (2021-08-25)


### Bug Fixes

* **ceb:** the unpkg configuration is wrong ([d7c61a5](https://github.com/tmorin/ceb/commit/d7c61a59262b4030b983a12bcbd330e303ab563d))





# [4.0.0](https://github.com/tmorin/ceb/compare/v3.5.0...v4.0.0) (2021-08-25)


### Features

* npm packages are compliant `CommonJS` and `ES Module` ([fe955fb](https://github.com/tmorin/ceb/commit/fe955fb6257b0750f93c477e76f8593af335da6d))
* refactor the codebase to provide NPM packages by features ([1e65b1f](https://github.com/tmorin/ceb/commit/1e65b1fd968dff22f30338550ba4b705b04ddc59))


### BREAKING CHANGES

* the following features are no more available by default with the package `@tmorin/ceb` -> `messaging`, `inversion`
