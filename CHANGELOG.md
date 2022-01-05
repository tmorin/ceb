# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [7.1.0](https://github.com/tmorin/ceb/compare/v7.0.2...v7.1.0) (2022-01-05)


### Features

* **ceb-inversion-core:** add a builder to define inline modules ([bba32d2](https://github.com/tmorin/ceb/commit/bba32d237e33aeaefd0bb9a3259478c2e5abc435))
* **ceb-inversion-core:** improve documentation ([3fb12c2](https://github.com/tmorin/ceb/commit/3fb12c2dea97e83cc995a456a4093f3d1ce7cffd))
* **ceb-messaging-moleculer-inversion:** add support for inversion ([130e912](https://github.com/tmorin/ceb/commit/130e912047470f84734ae851b6b942dd3fb1770c))
* **ceb-messaging-moleculer:** add an implementation which leverage on Moleculer ([48eee90](https://github.com/tmorin/ceb/commit/48eee90e5d7ea1cb0cd16dcffdff475e5c34291e))





## [7.0.2](https://github.com/tmorin/ceb/compare/v7.0.1...v7.0.2) (2021-12-21)


### Features

* **book:** include a FRP implementation of the UI ([5ff7db8](https://github.com/tmorin/ceb/commit/5ff7db8213251ddc78dd7d1ed70deb582877f10c))





## [7.0.1](https://github.com/tmorin/ceb/compare/v7.0.0...v7.0.1) (2021-12-19)


### Bug Fixes

* NPM Workspaces expected by Typedoc doesn't work well with Lerna ([c283414](https://github.com/tmorin/ceb/commit/c283414cf776d997c3422d8a39028c80f33708ab))





# [7.0.0](https://github.com/tmorin/ceb/compare/v6.1.0...v7.0.0) (2021-12-19)


### Bug Fixes

* action results must be always defined ([ac6f335](https://github.com/tmorin/ceb/commit/ac6f3352db2e91b226bdbda6849b5c21dd6759c8))
* enable skipLibCheck to handle conflict between jest and mocha :( ([263a504](https://github.com/tmorin/ceb/commit/263a5043babbd8d8c9b77f223cea1fc33d79cb02))
* fix imports in examples ([429cb82](https://github.com/tmorin/ceb/commit/429cb8261626f443f590853a43b613bcdadce3a5))


### Features

* **book:** improve inversion part ([2ee2caa](https://github.com/tmorin/ceb/commit/2ee2caaef2ffae391073733b791f60000dc1e5f6))
* **book:** review the book ([e3bd1e1](https://github.com/tmorin/ceb/commit/e3bd1e16da1b1f07c3a4a49be603a11bc434d72f))
* **ceb-inversion-testing-jest:** Inversion Test Suite should be managed by Jest too ([da1384a](https://github.com/tmorin/ceb/commit/da1384af3818d4c1453d847fbc7c78401258dda6))
* **ceb-messaging-adapter-dom:** add a new package to deal with messaging in DOM context ([0e60899](https://github.com/tmorin/ceb/commit/0e60899be2ddc5849a7b141b2e9d7bea149ab8c2))
* **ceb-messaging-adapter-dom:** events should be forwarded from the Gateway to the DOM Event bus too ([6aa7d27](https://github.com/tmorin/ceb/commit/6aa7d27353f0d0920eed959e3e1c656758351bf6))
* **ceb-messaging-adapter-purify:** add support to inversion ([6e512af](https://github.com/tmorin/ceb/commit/6e512af0463f0d27b203f1a09f9fddc680d4b60a))
* **ceb-messaging-core:** add an option to customize the registry key used to resolve the `Gateway` instance ([e5b937f](https://github.com/tmorin/ceb/commit/e5b937f249903566778a49cdad7c0ed82ed0c8be))
* **ceb-messaging-core:** received messages should be observable ([f9d4205](https://github.com/tmorin/ceb/commit/f9d42056b281ddaeae59239199a4b7442ed73ffa))
* **ceb-messaging-core:** simplify the bus interface ([6145e07](https://github.com/tmorin/ceb/commit/6145e07fddba77030984ab341944e4cc5e79c5c1))
* **ceb-messaging-dom:** remove the package ([179e34a](https://github.com/tmorin/ceb/commit/179e34a9711895a54fdc7941b089b41965f10f93))
* **ceb-messaging-inversion:** `ceb-messaging-inversion` should not depend on Inversion ([cb52ef3](https://github.com/tmorin/ceb/commit/cb52ef3d3068a97cf83d17728c1d15e8e6924fd0))
* **ceb-messaging-simple-inversion:** `ceb-messaging-simple` should not depend on Inversion ([8d0b70f](https://github.com/tmorin/ceb/commit/8d0b70f72f04d268a16a3ce7105da7e8ca8f4f1b))
* **ceb-messaging:** provide a new implementation with a better integration of functional programming concerns ([f2963ed](https://github.com/tmorin/ceb/commit/f2963edc916eda4a0db1d1bd6e6bb534804a5271))
* improve the ESM integration ([476a297](https://github.com/tmorin/ceb/commit/476a297575e2311ba599ca678784f71d34666afd))


### BREAKING CHANGES

* **ceb-messaging-inversion:** the package `ceb-messaging-inversion` is not more able to discover handlers and listener with Inversion, the feature has been migrated to `ceb-messaging-inversion`
* **ceb-messaging-dom:** the package `ceb-messaging-dom` is removed and replaced by `ceb-messaging-adapter-dom`
* **ceb-messaging:** the concepts still remain the same, but the new implementation break almost everything.





# [6.1.0](https://github.com/tmorin/ceb/compare/v6.0.3...v6.1.0) (2021-11-19)


### Features

* **ceb-messaging-testing:** add a new package which provides resources to improve tests playing with messaging artifacts ([a12da00](https://github.com/tmorin/ceb/commit/a12da00c057efd75d6e43ce6feb3fc425aa17adc))





## [6.0.3](https://github.com/tmorin/ceb/compare/v6.0.2...v6.0.3) (2021-11-18)


### Bug Fixes

* **documentation:** fix import related to `@tmorin/ceb-bundle-web` in the documentation ([109de28](https://github.com/tmorin/ceb/commit/109de28ed5bc5dc377a64659a07e2b2aa367accd))
* **documentation:** some path in the summary of the book are wrong ([4504236](https://github.com/tmorin/ceb/commit/45042360787ad49d87cbe64568ad22c94ec16341))





## [6.0.2](https://github.com/tmorin/ceb/compare/v6.0.1...v6.0.2) (2021-11-18)


### Bug Fixes

* **ceb-bundle-web:** the UMD module was badly generated ([f6a9bd4](https://github.com/tmorin/ceb/commit/f6a9bd441a5176bd3e6aa758650369b9a2c83bbe))





## [6.0.1](https://github.com/tmorin/ceb/compare/v6.0.0...v6.0.1) (2021-11-18)


### Bug Fixes

* **ceb-bundle-web:** the UMD module is not properly configured ([fd9a668](https://github.com/tmorin/ceb/commit/fd9a668f614e08389b0075fc1eb6a049e6905976))





# [6.0.0](https://github.com/tmorin/ceb/compare/v5.0.2...v6.0.0) (2021-11-18)


### Features

* **ceb-bundle-web:** rename the package ([39b8234](https://github.com/tmorin/ceb/commit/39b82341e4af1e3f68ad21785ea3c23b1fef5eb2))
* **ceb-elements-builders:** rename the package ([f406407](https://github.com/tmorin/ceb/commit/f4064077259a110edc137fb02e875b50428e7b34))
* **ceb-elements-core:** rename the package ([bed57e2](https://github.com/tmorin/ceb/commit/bed57e26a2d9904ba98d9d45cfc5bbcef4262eb1))
* **ceb-elements-testing:** rename the package ([7918392](https://github.com/tmorin/ceb/commit/79183922d5e9e58fe92924f07db35ae3fa4629a7))
* **ceb-inversion-core:** rename the package ([0d81ed2](https://github.com/tmorin/ceb/commit/0d81ed27d528890a5fc58e5410122a9480622c1e))
* **ceb-inversion-testing-core:** a model to test containers ([40d54b1](https://github.com/tmorin/ceb/commit/40d54b171889d23accc00a271db69e62bb0eef75))
* **ceb-inversion-testing-mocha:** add an implementation for Mocha ([87b0a4d](https://github.com/tmorin/ceb/commit/87b0a4df2eb84b1a9753ca5734a1b7f9331d40f0))
* **ceb-messaging-core:** improve the API with a map of internal events ([3f5d1b9](https://github.com/tmorin/ceb/commit/3f5d1b9fb14b2c50750703a334ee428b36f03f68))


### BREAKING CHANGES

* **ceb-bundle-web:** the package `ceb` has been renamed to `ceb-bundle-web`
* **ceb-inversion-core:** the package `ceb-inversion` has been renamed to `ceb-inversion-core`
* **ceb-elements-testing:** the package `ceb-testing` has been renamed to `ceb-elements-testing`
* **ceb-elements-builders:** the package `ceb-builders` has been renamed to `ceb-elements-builders`
* **ceb-elements-core:** the package `ceb-core` has been renamed to `ceb-elements-core`





## [5.0.2](https://github.com/tmorin/ceb/compare/v5.0.1...v5.0.2) (2021-11-12)


### Bug Fixes

* **ceb-templating-parser:** the parser fails to parse attributes with a `-` ([34544a3](https://github.com/tmorin/ceb/commit/34544a35ed400bd0bf0d2f0d0f24e0166f2c19dd))





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
